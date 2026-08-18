import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CarStats } from '../data/cars';

interface GameState {
  tutorialCompleted: boolean;
  unlockedTracks: string[];
  bestTimes: Record<string, number>;
  selectedCarId: string; // Keep for legacy, but we'll use track assigned cars now
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  language: 'en' | 'it';
  
  // New State
  failedAttempts: Record<string, number>;
  availableUpgradePoints: number;
  carUpgrades: Record<string, Partial<CarStats>>; // Store customized stats relative to base
  audioVolumes: { general: number; car: number };
  
  // Actions
  completeTutorial: () => void;
  unlockTrack: (trackId: string) => void;
  saveBestTime: (trackId: string, time: number) => void;
  setSelectedCarId: (carId: string) => void;
  toggleSound: () => void;
  toggleVibration: () => void;
  setLanguage: (lang: 'en' | 'it') => void;
  resetProgress: () => void;
  
  // New Actions
  recordFailedAttempt: (trackId: string) => void;
  spendUpgradePoint: (carId: string, stat: keyof CarStats, amount: number) => void;
  setAudioVolume: (type: 'general' | 'car', value: number) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      tutorialCompleted: false,
      unlockedTracks: ['track-1', 'track-2', 'track-3'], // First 3 unlocked by default
      bestTimes: {},
      selectedCarId: 'car-1',
      soundEnabled: true,
      vibrationEnabled: true,
      language: 'en',
      
      failedAttempts: {},
      availableUpgradePoints: 0,
      carUpgrades: {},
      audioVolumes: { general: 1.0, car: 1.0 },

      completeTutorial: () => set({ tutorialCompleted: true }),
      unlockTrack: (trackId) =>
        set((state) => ({
          unlockedTracks: state.unlockedTracks.includes(trackId)
            ? state.unlockedTracks
            : [...state.unlockedTracks, trackId],
        })),
      saveBestTime: (trackId, time) =>
        set((state) => {
          const currentBest = state.bestTimes[trackId];
          if (!currentBest || time < currentBest) {
            return { bestTimes: { ...state.bestTimes, [trackId]: time } };
          }
          return {};
        }),
      setSelectedCarId: (carId) => set({ selectedCarId: carId }),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      toggleVibration: () =>
        set((state) => ({ vibrationEnabled: !state.vibrationEnabled })),
      setLanguage: (lang) => set({ language: lang }),
      resetProgress: () =>
        set({
          tutorialCompleted: false,
          unlockedTracks: ['track-1', 'track-2', 'track-3'],
          bestTimes: {},
          selectedCarId: 'car-1',
          failedAttempts: {},
          availableUpgradePoints: 0,
          carUpgrades: {},
          audioVolumes: { general: 1.0, car: 1.0 },
        }),
        
      recordFailedAttempt: (trackId) => 
        set((state) => {
          const attempts = state.failedAttempts[trackId] || 0;
          if (attempts === 0) {
            // First time failing this track, give 3 points
            return {
              failedAttempts: { ...state.failedAttempts, [trackId]: 1 },
              availableUpgradePoints: state.availableUpgradePoints + 3,
            };
          }
          return {
            failedAttempts: { ...state.failedAttempts, [trackId]: attempts + 1 }
          };
        }),
        
      spendUpgradePoint: (carId, stat, amount) =>
        set((state) => {
          // amount can be +1 or -1
          // if amount > 0, we need available points. if amount < 0, we need to have upgraded this stat before.
          const currentCarUpgrades = state.carUpgrades[carId] || {};
          const currentStatUpgrade = currentCarUpgrades[stat] || 0;
          
          if (amount > 0 && state.availableUpgradePoints < amount) return {}; // Not enough points
          if (amount < 0 && currentStatUpgrade <= 0) return {}; // Can't go below base stat
          
          const newCarUpgrades = {
            ...state.carUpgrades,
            [carId]: {
              ...currentCarUpgrades,
              [stat]: currentStatUpgrade + amount
            }
          };
          
          return {
            carUpgrades: newCarUpgrades,
            availableUpgradePoints: state.availableUpgradePoints - amount
          };
        }),
        
      setAudioVolume: (type, value) => 
        set((state) => ({
          audioVolumes: { ...state.audioVolumes, [type]: value }
        })),
    }),
    {
      name: 'draw-the-line-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
