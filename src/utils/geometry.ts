import { Point } from '../data/tracks';

export const distance = (p1: Point, p2: Point): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

export const normalizeVector = (v: Point): Point => {
  const len = Math.sqrt(v.x * v.x + v.y * v.y);
  if (len === 0) return { x: 0, y: 0 };
  return { x: v.x / len, y: v.y / len };
};

export const angleBetweenPoints = (p1: Point, p2: Point): number => {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
};

/**
 * Resamples a path to have equidistant points. Useful for physics look-ahead.
 */
export const resamplePath = (path: Point[], spacing: number): Point[] => {
  if (path.length < 2) return [...path];

  const resampled: Point[] = [path[0]];
  let d = 0;

  for (let i = 1; i < path.length; i++) {
    const p1 = path[i - 1];
    const p2 = path[i];
    const dist = distance(p1, p2);
    
    if (d + dist >= spacing) {
      const q: Point = {
        x: p1.x + ((spacing - d) / dist) * (p2.x - p1.x),
        y: p1.y + ((spacing - d) / dist) * (p2.y - p1.y),
      };
      resampled.push(q);
      path.splice(i, 0, q);
      d = 0;
    } else {
      d += dist;
    }
  }

  // Always include the last point
  if (distance(resampled[resampled.length - 1], path[path.length - 1]) > spacing * 0.1) {
      resampled.push(path[path.length - 1]);
  }

  return resampled;
};

/**
 * Very basic smoothing using simple moving average to remove jitter from touch points.
 */
export const smoothPath = (path: Point[], windowSize: number = 3): Point[] => {
  if (path.length < windowSize) return path;
  
  const smoothed: Point[] = [];
  
  for (let i = 0; i < path.length; i++) {
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    
    for (let j = Math.max(0, i - windowSize); j <= Math.min(path.length - 1, i + windowSize); j++) {
      sumX += path[j].x;
      sumY += path[j].y;
      count++;
    }
    
    smoothed.push({ x: sumX / count, y: sumY / count });
  }
  
  // Keep exact start and end points
  smoothed[0] = path[0];
  smoothed[smoothed.length - 1] = path[path.length - 1];
  
  return smoothed;
};

/**
 * Check if a point is within a circle.
 */
export const isPointInCircle = (point: Point, circle: {x: number, y: number, radius: number}): boolean => {
  return distance(point, circle) <= circle.radius;
};

/**
 * Get shortest distance from point to a line segment
 */
export const distanceToSegment = (p: Point, v: Point, w: Point): number => {
  const l2 = Math.pow(distance(v, w), 2);
  if (l2 === 0) return distance(p, v);
  
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  
  return distance(p, {
    x: v.x + t * (w.x - v.x),
    y: v.y + t * (w.y - v.y)
  });
};

/**
 * Check if a point is on the road (within distance to centerline).
 */
export const isPointOnTrack = (point: Point, centerline: Point[], roadWidth: number): boolean => {
    // Road width is total width, so distance to center should be <= roadWidth / 2
    const maxDist = roadWidth / 2;
    for (let i = 0; i < centerline.length - 1; i++) {
        if (distanceToSegment(point, centerline[i], centerline[i+1]) <= maxDist) {
            return true;
        }
    }
    return false;
}
