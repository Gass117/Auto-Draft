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
  let movementAngle = rotation; // New: true direction of movement
  let speed = 0;
  let time = 0;
  
  let targetIndex = 1;
  let offRoadTime = 0;
  let maxDeviation = 0;
  let checkpointsPassed = 0;

  for (let step = 0; step < 3600; step++) { // Max 60 seconds
    const lookAheadDist = 20 + speed * 0.4;
    
    let currentTarget = plannedPath[targetIndex];
    let distToTarget = distance({x, y}, currentTarget);
    
    while (distToTarget < lookAheadDist && targetIndex < plannedPath.length - 1) {
      targetIndex++;
      currentTarget = plannedPath[targetIndex];
      distToTarget = distance({x, y}, currentTarget);
    }

    let brakingLookAhead = 50 + speed * (1.5 - physics.braking/1000);
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
    
    let corneringSpeedModifier = Math.max(0.2, 1 - (angleDiff / Math.PI) * (4 / physics.grip));
    let targetSpeed = physics.maxSpeed * corneringSpeedModifier;

    const isOffRoad = !isPointOnTrack({x, y}, track.centerline, track.roadWidth);
    
    let currentAccel = physics.acceleration;
    let currentGrip = physics.grip;
    let currentMaxSpeed = physics.maxSpeed;
    
    if (isOffRoad) {
      currentAccel *= 0.3;
      currentGrip *= 0.3;
      currentMaxSpeed *= 0.4;
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

    const desiredAngle = angleBetweenPoints({x, y}, currentTarget);
    let headingDiff = desiredAngle - rotation;
    
    while (headingDiff > Math.PI) headingDiff -= 2 * Math.PI;
    while (headingDiff < -Math.PI) headingDiff += 2 * Math.PI;

    const maxTurnRate = speed > 10 ? (currentGrip * 45) / speed : Math.PI;
    
    let gripLoss = false;
    let turnApplied = headingDiff;
    
    if (Math.abs(headingDiff) > maxTurnRate * dt) {
        turnApplied = Math.sign(headingDiff) * maxTurnRate * dt;
        gripLoss = true;
    }
    
    rotation += turnApplied;
    while (rotation > Math.PI) rotation -= 2 * Math.PI;
    while (rotation < -Math.PI) rotation += 2 * Math.PI;

    // Drifting Mechanics: Movement angle vs Rotation
    let driftDiff = rotation - movementAngle;
    while (driftDiff > Math.PI) driftDiff -= 2 * Math.PI;
    while (driftDiff < -Math.PI) driftDiff += 2 * Math.PI;

    if (gripLoss) {
        const recoveryRate = physics.stability; // 1 to 5
        movementAngle += driftDiff * dt * recoveryRate; 
    } else {
        movementAngle += driftDiff * dt * 15; // Snaps back fast if gripping
    }

    while (movementAngle > Math.PI) movementAngle -= 2 * Math.PI;
    while (movementAngle < -Math.PI) movementAngle += 2 * Math.PI;

    x += Math.cos(movementAngle) * speed * dt;
    y += Math.sin(movementAngle) * speed * dt;
    time += dt;

    frames.push({ x, y, rotation, speed, time, offRoad: isOffRoad, gripLoss });

    const currentPointDeviation = distance({x,y}, currentTarget);
    if (currentPointDeviation > maxDeviation) maxDeviation = currentPointDeviation;

    if (checkpointsPassed < track.checkpoints.length) {
        if (isPointInCircle({x, y}, track.checkpoints[checkpointsPassed])) {
            checkpointsPassed++;
        }
    }

    if (isPointInCircle({x, y}, track.finishZone) && checkpointsPassed === track.checkpoints.length) {
        return { success: true, frames, totalTime: time, maxDeviation, offRoadDuration: offRoadTime };
    }

    if (speed < 1 && time > 2) {
        return { success: false, frames, totalTime: time, maxDeviation, offRoadDuration: offRoadTime, reason: "Got stuck" };
    }
    
    // Stricter off-road penalty on drifting
    if (!isPointOnTrack({x, y}, track.centerline, track.roadWidth * 1.5)) {
         return { success: false, frames, totalTime: time, maxDeviation, offRoadDuration: offRoadTime, reason: "Drifted completely off track!" };
    }
  }

  return { success: false, frames, totalTime: time, maxDeviation, offRoadDuration: offRoadTime, reason: "Time limit exceeded" };
};
