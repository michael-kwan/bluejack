import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Settings } from '../types/settings.types';

interface SettingsStore extends Settings {
  updateGameSettings: (settings: Partial<Settings['game']>) => void;
  updateDisplaySettings: (settings: Partial<Settings['display']>) => void;
  resetSettings: () => void;
}

const defaultSettings: Settings = {
  game: {
    deckCount: 6,
    payoutRatio: '3:2',
    dealerHitsSoft17: true,
    maxHands: 3,
    minBet: 10,
    maxBet: 500,
  },
  display: {
    showBasicStrategy: false,
    showCount: true,
    showTrueCount: true,
    soundEnabled: false,
    animationSpeed: 'normal',
  },
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,

      updateGameSettings: (newSettings) =>
        set((state) => ({
          game: { ...state.game, ...newSettings },
        })),

      updateDisplaySettings: (newSettings) =>
        set((state) => ({
          display: { ...state.display, ...newSettings },
        })),

      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'bluejack-settings',
    }
  )
);
