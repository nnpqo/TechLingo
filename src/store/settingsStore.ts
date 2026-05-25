import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsStore {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  speechRate: number;
  preferredAccent: 'us' | 'uk';
  
  setTheme: (theme: 'light' | 'dark') => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSpeechRate: (rate: number) => void;
  setPreferredAccent: (accent: 'us' | 'uk') => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'dark',
      soundEnabled: true,
      speechRate: 0.85,
      preferredAccent: 'us',
      
      setTheme: (theme) => set({ theme }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setSpeechRate: (rate) => set({ speechRate: Math.max(0.5, Math.min(2, rate)) }),
      setPreferredAccent: (accent) => set({ preferredAccent: accent }),
    }),
    {
      name: 'techlingo-settings-store',
      version: 1,
    }
  )
);
