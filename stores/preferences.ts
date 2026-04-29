import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type PreferencesState = {
  hasOnboarded: boolean;
  notifications: boolean;
  darkMode: boolean;
  lockPassword: string | null;
  setOnboarded: (value: boolean) => void;
  setNotifications: (value: boolean) => void;
  setDarkMode: (value: boolean) => void;
  setLockPassword: (value: string | null) => void;
};

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      notifications: true,
      darkMode: false,
      lockPassword: null,
      setOnboarded: (value) => set({ hasOnboarded: value }),
      setNotifications: (value) => set({ notifications: value }),
      setDarkMode: (value) => set({ darkMode: value }),
      setLockPassword: (value) => set({ lockPassword: value }),
    }),
    {
      name: "tailor-preferences",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
