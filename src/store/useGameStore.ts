import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

interface GameState {
  tutorialCompleted: boolean;
  unlockedTracks: string[];
  bestTimes: Record<string, number>;
  selectedCarId: string;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  language: 'en' | 'it';
  
  // Actions
  completeTutorial: () => void;
  unlockTrack: (trackId: string) => void;
  saveBestTime: (trackId: string, time: number) => void;
  setSelectedCarId: (carId: string) => void;
  toggleSound: () => void;
  toggleVibration: () => void;
  setLanguage: (lang: 'en' | 'it') => void;
  resetProgress: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      tutorialCompleted: false,
      unlockedTracks: ['rookie-loop'], // First track unlocked by default
      bestTimes: {},
      selectedCarId: 'vortex',
      soundEnabled: true,
      vibrationEnabled: true,
      language: 'en',

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
          unlockedTracks: ['rookie-loop'],
          bestTimes: {},
          selectedCarId: 'vortex',
        }),
    }),
    {
      name: 'draw-the-line-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
