export interface Point {
  x: number;
  y: number;
}

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
}

export const tracks: TrackData[] = [
  {
    id: 'rookie-loop',
    name: 'Rookie Loop',
    difficulty: 1,
    description: 'A wide track to practice smooth racing lines.',
    centerline: [
      { x: 400, y: 500 },
      { x: 400, y: 750 },
      { x: 250, y: 850 },
      { x: 100, y: 750 },
      { x: 100, y: 250 },
      { x: 250, y: 150 },
      { x: 400, y: 250 },
      { x: 400, y: 450 }
    ],
    roadWidth: 120,
    startZone: { x: 400, y: 500, radius: 60 },
    finishZone: { x: 400, y: 450, radius: 60 },
    checkpoints: [
      { x: 250, y: 850, radius: 80 },
      { x: 100, y: 500, radius: 80 },
      { x: 250, y: 150, radius: 80 }
    ]
  },
  {
    id: 'riverside-s',
    name: 'Riverside S',
    difficulty: 2,
    description: 'Requires smooth direction changes and braking.',
    centerline: [
      { x: 400, y: 100 },
      { x: 400, y: 300 },
      { x: 250, y: 500 },
      { x: 100, y: 700 },
      { x: 100, y: 900 }
    ],
    roadWidth: 90,
    startZone: { x: 400, y: 100, radius: 50 },
    finishZone: { x: 100, y: 900, radius: 50 },
    checkpoints: [
      { x: 250, y: 500, radius: 70 }
    ]
  },
  {
    id: 'technical-pass',
    name: 'Technical Pass',
    difficulty: 3,
    description: 'A technical track with a hairpin and chicane.',
    centerline: [
      { x: 100, y: 100 },
      { x: 100, y: 400 },
      { x: 200, y: 500 },
      { x: 300, y: 400 }, // hairpin
      { x: 300, y: 150 },
      { x: 450, y: 200 }, // chicane
      { x: 450, y: 800 }
    ],
    roadWidth: 70,
    startZone: { x: 100, y: 100, radius: 45 },
    finishZone: { x: 450, y: 800, radius: 45 },
    checkpoints: [
      { x: 150, y: 450, radius: 50 },
      { x: 300, y: 200, radius: 50 },
      { x: 450, y: 400, radius: 50 }
    ]
  }
];
