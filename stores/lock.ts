import { create } from "zustand";

type LockState = {
  isUnlocked: boolean;
  unlock: () => void;
  reLock: () => void;
};

export const useLock = create<LockState>((set) => ({
  isUnlocked: false,
  unlock: () => set({ isUnlocked: true }),
  reLock: () => set({ isUnlocked: false }),
}));
