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
  image?: any;
}

export const cars: Car[] = [
  {
    id: 'car-1',
    name: 'Beach Buggy',
    description: 'Perfect for beginners on the sand.',
    stats: { speed: 2, power: 2, grip: 5, braking: 4, stability: 5 },
    color: '#FFB347',
    image: require('../assets/cars/buggy.jpg')
  },
  {
    id: 'car-2',
    name: 'Timber Tracker',
    description: 'Good grip for forest paths.',
    stats: { speed: 3, power: 3, grip: 4, braking: 3, stability: 4 },
    color: '#228B22',
    image: require('../assets/cars/buggy.jpg')
  },
  {
    id: 'car-3',
    name: 'Muscle V8',
    description: 'American muscle. High power, low grip.',
    stats: { speed: 4, power: 5, grip: 2, braking: 2, stability: 3 },
    color: '#B22222',
    image: require('../assets/cars/muscle.jpg')
  },
  {
    id: 'car-4',
    name: 'Neon Drifter',
    description: 'Built for street drifting.',
    stats: { speed: 4, power: 3, grip: 2, braking: 4, stability: 2 },
    color: '#FF1493',
    image: require('../assets/cars/muscle.jpg')
  },
  {
    id: 'car-5',
    name: 'Hill Climber',
    description: 'High torque for mountain passes.',
    stats: { speed: 3, power: 5, grip: 4, braking: 5, stability: 3 },
    color: '#8B4513',
    image: require('../assets/cars/buggy.jpg')
  },
  {
    id: 'car-6',
    name: 'Dune Dasher',
    description: 'Fast and stable on long straights.',
    stats: { speed: 5, power: 4, grip: 3, braking: 3, stability: 4 },
    color: '#DAA520',
    image: require('../assets/cars/buggy.jpg')
  },
  {
    id: 'car-7',
    name: 'Yakuza Tuner',
    description: 'Incredibly agile, very hard to master.',
    stats: { speed: 4, power: 4, grip: 3, braking: 5, stability: 2 },
    color: '#00FFFF',
    image: require('../assets/cars/cyber.jpg')
  },
  {
    id: 'car-8',
    name: 'Roman Gladiator',
    description: 'Heavy, stable, built like a tank for tight streets.',
    stats: { speed: 3, power: 4, grip: 5, braking: 5, stability: 5 },
    color: '#800000',
    image: require('../assets/cars/muscle.jpg')
  },
  {
    id: 'car-9',
    name: 'Ice Breaker',
    description: 'Specially studded tires for maximum grip on ice.',
    stats: { speed: 5, power: 3, grip: 5, braking: 2, stability: 3 },
    color: '#ADD8E6',
    image: require('../assets/cars/cyber.jpg')
  },
  {
    id: 'car-10',
    name: 'Cyber Phantom',
    description: 'The ultimate racing machine.',
    stats: { speed: 5, power: 5, grip: 5, braking: 5, stability: 5 },
    color: '#8A2BE2',
    image: require('../assets/cars/cyber.jpg')
  }
];
