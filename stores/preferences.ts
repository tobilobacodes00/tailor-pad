import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemeMode = "system" | "light" | "dark";

type PreferencesState = {
  hasOnboarded: boolean;
  themeMode: ThemeMode;
  setOnboarded: (value: boolean) => void;
  setThemeMode: (value: ThemeMode) => void;
};

type PersistedV1 = {
  hasOnboarded?: boolean;
  notifications?: boolean;
  darkMode?: boolean;
  lockPassword?: string | null;
};

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      themeMode: "system",
      setOnboarded: (value) => set({ hasOnboarded: value }),
      setThemeMode: (value) => set({ themeMode: value }),
    }),
    {
      name: "tailor-preferences",
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persistedState, fromVersion) => {
        if (fromVersion < 2) {
          const old = persistedState as PersistedV1;
          return {
            hasOnboarded: old.hasOnboarded ?? false,
            themeMode: old.darkMode ? "dark" : "system",
          } as PreferencesState;
        }
        return persistedState as PreferencesState;
      },
    }
  )
);
