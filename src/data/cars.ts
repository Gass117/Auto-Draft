export interface CarStats {
  speed: number;
  power: number;
  grip: number;
  braking: number;
  stability: number;
}

export interface Car {
  id: string;
  name: string;
  description: string;
  stats: CarStats;
  color: string;
}

export const cars: Car[] = [
  {
    id: 'vortex',
    name: 'Vortex',
    description: 'Fast on straights but difficult in tight or abrupt corners.',
    stats: { speed: 5, power: 4, grip: 2, braking: 3, stability: 3 },
    color: '#FF3B30'
  },
  {
    id: 'atlas',
    name: 'Atlas',
    description: 'Strong acceleration and stability. Requires early and smooth corner preparation.',
    stats: { speed: 3, power: 5, grip: 3, braking: 2, stability: 4 },
    color: '#007AFF'
  },
  {
    id: 'lynx',
    name: 'Lynx',
    description: 'Excellent on technical tracks and tight curves.',
    stats: { speed: 2, power: 2, grip: 5, braking: 4, stability: 4 },
    color: '#34C759'
  }
];
