import { Point, TrackData } from '../data/tracks';
import { CarStats } from '../data/cars';
import { distance, angleBetweenPoints, isPointInCircle, isPointOnTrack } from './geometry';

export interface Frame {
  x: number;
  y: number;
  rotation: number; // in radians
  speed: number;
  time: number;
  offRoad: boolean;
  gripLoss: boolean;
}

export interface SimulationResult {
  success: boolean;
  frames: Frame[];
  totalTime: number;
  maxDeviation: number;
  offRoadDuration: number;
  reason?: string;
}

// Convert 1-5 stats into physical values
const mapStats = (stats: CarStats) => ({
  maxSpeed: 100 + stats.speed * 40, // 140 to 300 pixels/sec
  acceleration: 50 + stats.power * 30, // 80 to 200 pixels/sec^2
  braking: 100 + stats.braking * 50, // 150 to 350 pixels/sec^2
  grip: 1.0 + stats.grip * 0.4, // Max lateral Gs
  stability: stats.stability // 1-5, affects responsiveness and slide recovery
});

export const simulateRace = (
  plannedPath: Point[],
  carStats: CarStats,
  track: TrackData
): SimulationResult => {
  const dt = 1 / 60; // 60 FPS fixed time step
  const frames: Frame[] = [];
  const physics = mapStats(carStats);
  
  if (plannedPath.length < 2) {
      return { success: false, frames: [], totalTime: 0, maxDeviation: 0, offRoadDuration: 0, reason: "Path too short" };
  }

  // Initial state
  let x = plannedPath[0].x;
  let y = plannedPath[0].y;
  let rotation = angleBetweenPoints(plannedPath[0], plannedPath[1]);
  let speed = 0;
  let time = 0;
  
  let targetIndex = 1;
  let offRoadTime = 0;
  let maxDeviation = 0;
  let checkpointsPassed = 0;

  for (let step = 0; step < 3600; step++) { // Max 60 seconds (60 * 60)
    // 1. Find Look-ahead point
    // Look ahead distance scales with speed, but has a minimum
    const lookAheadDist = 20 + speed * 0.4;
    
    // Find a point on the path roughly lookAheadDist away from current target
    let currentTarget = plannedPath[targetIndex];
    let distToTarget = distance({x, y}, currentTarget);
    
    while (distToTarget < lookAheadDist && targetIndex < plannedPath.length - 1) {
      targetIndex++;
      currentTarget = plannedPath[targetIndex];
      distToTarget = distance({x, y}, currentTarget);
    }

    // 2. Assess path curvature ahead to determine target speed
    // Look further ahead to see if we need to brake
    let brakingLookAhead = 50 + speed * (1.5 - physics.braking/1000); // Higher braking stat means we can look ahead less
    let upcomingTargetIndex = targetIndex;
    let upcomingTarget = plannedPath[upcomingTargetIndex];
    let distUpcoming = distance({x, y}, upcomingTarget);
    
    while(distUpcoming < brakingLookAhead && upcomingTargetIndex < plannedPath.length - 1) {
        upcomingTargetIndex++;
        upcomingTarget = plannedPath[upcomingTargetIndex];
        distUpcoming = distance({x, y}, upcomingTarget);
    }
    
    const upcomingAngle = angleBetweenPoints({x, y}, upcomingTarget);
    let angleDiff = Math.abs(upcomingAngle - rotation);
    if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;
    
    // The sharper the turn, the lower the target speed
    // If angleDiff is 0, targetSpeed = maxSpeed
    // If angleDiff is 90 deg (PI/2), targetSpeed should be much lower, dependent on grip
    let corneringSpeedModifier = Math.max(0.2, 1 - (angleDiff / Math.PI) * (3 / physics.grip));
    let targetSpeed = physics.maxSpeed * corneringSpeedModifier;

    // 3. Update speed (Acceleration / Braking)
    const isOffRoad = !isPointOnTrack({x, y}, track.centerline, track.roadWidth);
    
    let currentAccel = physics.acceleration;
    let currentGrip = physics.grip;
    let currentMaxSpeed = physics.maxSpeed;
    
    if (isOffRoad) {
      currentAccel *= 0.5;
      currentGrip *= 0.5;
      currentMaxSpeed *= 0.6;
      offRoadTime += dt;
      targetSpeed = Math.min(targetSpeed, currentMaxSpeed);
    }
    
    if (speed < targetSpeed) {
      speed += currentAccel * dt;
      if (speed > currentMaxSpeed) speed = currentMaxSpeed;
    } else if (speed > targetSpeed) {
      speed -= physics.braking * dt;
      if (speed < 0) speed = 0;
    }

    // 4. Update heading
    const desiredAngle = angleBetweenPoints({x, y}, currentTarget);
    let headingDiff = desiredAngle - rotation;
    
    // Normalize headingDiff to [-PI, PI]
    while (headingDiff > Math.PI) headingDiff -= 2 * Math.PI;
    while (headingDiff < -Math.PI) headingDiff += 2 * Math.PI;

    // Max rotation rate is limited by grip and speed
    // At higher speeds, you can't turn as sharply without losing grip
    // radius = v^2 / (grip * g).  turn rate w = v / radius = (grip * g) / v
    const maxTurnRate = speed > 10 ? (currentGrip * 50) / speed : Math.PI; // 50 is an arbitrary scaling factor for 'g'
    
    let gripLoss = false;
    let turnApplied = headingDiff;
    
    if (Math.abs(headingDiff) > maxTurnRate * dt) {
        // Understeer! Cannot turn fast enough
        turnApplied = Math.sign(headingDiff) * maxTurnRate * dt;
        gripLoss = true;
    }
    
    rotation += turnApplied;

    // Normalize rotation
    while (rotation > Math.PI) rotation -= 2 * Math.PI;
    while (rotation < -Math.PI) rotation += 2 * Math.PI;

    // 5. Update position
    x += Math.cos(rotation) * speed * dt;
    y += Math.sin(rotation) * speed * dt;
    time += dt;

    frames.push({ x, y, rotation, speed, time, offRoad: isOffRoad, gripLoss });

    // Track deviations
    const currentPointDeviation = distance({x,y}, currentTarget); // Simplification: distance to target point
    if (currentPointDeviation > maxDeviation) maxDeviation = currentPointDeviation;

    // Checkpoints
    if (checkpointsPassed < track.checkpoints.length) {
        if (isPointInCircle({x, y}, track.checkpoints[checkpointsPassed])) {
            checkpointsPassed++;
        }
    }

    // Check Win Condition
    if (isPointInCircle({x, y}, track.finishZone) && checkpointsPassed === track.checkpoints.length) {
        return { success: true, frames, totalTime: time, maxDeviation, offRoadDuration: offRoadTime };
    }

    // Check Lose Conditions
    // If completely stopped and not at start (stuck)
    if (speed < 1 && time > 2) {
        return { success: false, frames, totalTime: time, maxDeviation, offRoadDuration: offRoadTime, reason: "Got stuck" };
    }
    
    // If too far off road (e.g. 3x road width)
    if (currentPointDeviation > track.roadWidth * 3) {
         return { success: false, frames, totalTime: time, maxDeviation, offRoadDuration: offRoadTime, reason: "Went too far off track" };
    }
  }

  return { success: false, frames, totalTime: time, maxDeviation, offRoadDuration: offRoadTime, reason: "Time limit exceeded" };
};
