import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppSettings } from '@/src/shared/types';
import { logger } from '@/src/shared/services/logger';

export const DEFAULT_SETTINGS: AppSettings = {
  persistentMemory: true,
  sessionMemory: true,
  autoSummarize: true,
  hapticFeedback: true,
  streamingEnabled: true,
  onboardingComplete: false,
};

interface SettingsStore {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
  completeOnboarding: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
        logger.info('Settings updated', updates);
      },

      resetSettings: () => {
        set({ settings: DEFAULT_SETTINGS });
        logger.info('Settings reset to defaults');
      },

      completeOnboarding: () => {
        set((state) => ({
          settings: { ...state.settings, onboardingComplete: true },
        }));
        logger.info('Onboarding completed');
      },
    }),
    {
      name: '@byokos:settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
