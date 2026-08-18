export interface Point {
  x: number;
  y: number;
}

export type TrackTheme = 'night_street' | 'beach' | 'mountain' | 'oriental' | 'usa' | 'italy' | 'north_pole' | 'desert' | 'cyberpunk' | 'forest';

export interface TrackData {
  id: string;
  name: string;
  difficulty: number;
  description: string;
  centerline: Point[];
  roadWidth: number;
  startZone: { x: number; y: number; radius: number };
  finishZone: { x: number; y: number; radius: number };
  checkpoints: { x: number; y: number; radius: number }[];
  assignedCarId: string;
  theme: TrackTheme;
}

export const tracks: TrackData[] = [
  {
    id: 'track-1',
    name: 'Rookie Loop',
    difficulty: 1,
    description: 'A wide track to practice smooth racing lines.',
    centerline: [{ x: 400, y: 500 }, { x: 400, y: 750 }, { x: 250, y: 850 }, { x: 100, y: 750 }, { x: 100, y: 250 }, { x: 250, y: 150 }, { x: 400, y: 250 }, { x: 400, y: 450 }],
    roadWidth: 120,
    startZone: { x: 400, y: 500, radius: 60 },
    finishZone: { x: 400, y: 450, radius: 60 },
    checkpoints: [{ x: 250, y: 850, radius: 80 }, { x: 100, y: 500, radius: 80 }, { x: 250, y: 150, radius: 80 }],
    assignedCarId: 'car-1',
    theme: 'beach'
  },
  {
    id: 'track-2',
    name: 'Riverside S',
    difficulty: 2,
    description: 'Requires smooth direction changes and braking.',
    centerline: [{ x: 400, y: 100 }, { x: 400, y: 300 }, { x: 250, y: 500 }, { x: 100, y: 700 }, { x: 100, y: 900 }],
    roadWidth: 90,
    startZone: { x: 400, y: 100, radius: 50 },
    finishZone: { x: 100, y: 900, radius: 50 },
    checkpoints: [{ x: 250, y: 500, radius: 70 }],
    assignedCarId: 'car-2',
    theme: 'forest'
  },
  {
    id: 'track-3',
    name: 'Technical Pass',
    difficulty: 3,
    description: 'A technical track with a hairpin and chicane.',
    centerline: [{ x: 100, y: 100 }, { x: 100, y: 400 }, { x: 200, y: 500 }, { x: 300, y: 400 }, { x: 300, y: 150 }, { x: 450, y: 200 }, { x: 450, y: 800 }],
    roadWidth: 70,
    startZone: { x: 100, y: 100, radius: 45 },
    finishZone: { x: 450, y: 800, radius: 45 },
    checkpoints: [{ x: 150, y: 450, radius: 50 }, { x: 300, y: 200, radius: 50 }, { x: 450, y: 400, radius: 50 }],
    assignedCarId: 'car-3',
    theme: 'usa'
  },
  {
    id: 'track-4',
    name: 'Midnight Drift',
    difficulty: 4,
    description: 'Sharp corners that require drifting.',
    centerline: [{ x: 50, y: 50 }, { x: 400, y: 50 }, { x: 400, y: 400 }, { x: 50, y: 400 }, { x: 50, y: 800 }],
    roadWidth: 65,
    startZone: { x: 50, y: 50, radius: 40 },
    finishZone: { x: 50, y: 800, radius: 40 },
    checkpoints: [{ x: 400, y: 200, radius: 50 }, { x: 200, y: 400, radius: 50 }],
    assignedCarId: 'car-4',
    theme: 'night_street'
  },
  {
    id: 'track-5',
    name: 'Mountain Climb',
    difficulty: 5,
    description: 'Winding roads with narrow passes.',
    centerline: [{ x: 250, y: 900 }, { x: 150, y: 700 }, { x: 350, y: 500 }, { x: 100, y: 300 }, { x: 250, y: 50 }],
    roadWidth: 60,
    startZone: { x: 250, y: 900, radius: 40 },
    finishZone: { x: 250, y: 50, radius: 40 },
    checkpoints: [{ x: 250, y: 600, radius: 45 }, { x: 200, y: 400, radius: 45 }],
    assignedCarId: 'car-5',
    theme: 'mountain'
  },
  {
    id: 'track-6',
    name: 'Desert Run',
    difficulty: 6,
    description: 'Long straights mixed with sudden turns.',
    centerline: [{ x: 50, y: 900 }, { x: 50, y: 200 }, { x: 400, y: 200 }, { x: 400, y: 900 }],
    roadWidth: 55,
    startZone: { x: 50, y: 900, radius: 35 },
    finishZone: { x: 400, y: 900, radius: 35 },
    checkpoints: [{ x: 50, y: 500, radius: 45 }, { x: 250, y: 200, radius: 45 }, { x: 400, y: 500, radius: 45 }],
    assignedCarId: 'car-6',
    theme: 'desert'
  },
  {
    id: 'track-7',
    name: 'Tokyo Nights',
    difficulty: 7,
    description: 'Complex urban layout.',
    centerline: [{ x: 400, y: 50 }, { x: 100, y: 150 }, { x: 350, y: 300 }, { x: 100, y: 450 }, { x: 350, y: 600 }, { x: 100, y: 750 }],
    roadWidth: 50,
    startZone: { x: 400, y: 50, radius: 35 },
    finishZone: { x: 100, y: 750, radius: 35 },
    checkpoints: [{ x: 250, y: 225, radius: 40 }, { x: 250, y: 525, radius: 40 }],
    assignedCarId: 'car-7',
    theme: 'oriental'
  },
  {
    id: 'track-8',
    name: 'Rome Streets',
    difficulty: 8,
    description: 'Very tight corners and unforgiving walls.',
    centerline: [{ x: 250, y: 50 }, { x: 450, y: 150 }, { x: 450, y: 350 }, { x: 50, y: 350 }, { x: 50, y: 700 }, { x: 450, y: 800 }],
    roadWidth: 45,
    startZone: { x: 250, y: 50, radius: 30 },
    finishZone: { x: 450, y: 800, radius: 30 },
    checkpoints: [{ x: 450, y: 250, radius: 35 }, { x: 250, y: 350, radius: 35 }, { x: 50, y: 500, radius: 35 }],
    assignedCarId: 'car-8',
    theme: 'italy'
  },
  {
    id: 'track-9',
    name: 'Ice Cap',
    difficulty: 9,
    description: 'Slippery and extremely difficult to handle.',
    centerline: [{ x: 100, y: 900 }, { x: 200, y: 700 }, { x: 100, y: 500 }, { x: 400, y: 300 }, { x: 300, y: 100 }],
    roadWidth: 40,
    startZone: { x: 100, y: 900, radius: 30 },
    finishZone: { x: 300, y: 100, radius: 30 },
    checkpoints: [{ x: 150, y: 800, radius: 35 }, { x: 150, y: 600, radius: 35 }, { x: 250, y: 400, radius: 35 }],
    assignedCarId: 'car-9',
    theme: 'north_pole'
  },
  {
    id: 'track-10',
    name: 'Neon Grid',
    difficulty: 10,
    description: 'The ultimate test of precision and speed.',
    centerline: [{ x: 250, y: 900 }, { x: 400, y: 700 }, { x: 100, y: 700 }, { x: 400, y: 400 }, { x: 100, y: 400 }, { x: 250, y: 100 }],
    roadWidth: 35,
    startZone: { x: 250, y: 900, radius: 25 },
    finishZone: { x: 250, y: 100, radius: 25 },
    checkpoints: [{ x: 250, y: 700, radius: 30 }, { x: 250, y: 400, radius: 30 }],
    assignedCarId: 'car-10',
    theme: 'cyberpunk'
  }
];
