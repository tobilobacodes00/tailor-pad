import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import {
  clearLock as clearLockSecure,
  hasLock as hasLockSecure,
  migratePlaintextLockIfPresent,
  setLock as setLockSecure,
  verifyLock as verifyLockSecure,
} from "@/utils/auth";

const MAX_ATTEMPTS = 5;
const COOLDOWN_MS = 30_000;

type LockState = {
  isUnlocked: boolean;
  isLockSet: boolean;
  hydrated: boolean;
  failedAttempts: number;
  cooldownUntil: number;
  init: () => Promise<void>;
  unlockWith: (password: string) => Promise<boolean>;
  setLock: (password: string) => Promise<void>;
  clearLockAndUnlock: () => Promise<void>;
  reLock: () => void;
};

export const useLock = create<LockState>((set, get) => ({
  isUnlocked: false,
  isLockSet: false,
  hydrated: false,
  failedAttempts: 0,
  cooldownUntil: 0,

  init: async () => {
    try {
      const raw = await AsyncStorage.getItem("tailor-preferences");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const legacy: string | null | undefined =
            parsed?.state?.lockPassword;
          if (typeof legacy === "string" && legacy.length > 0) {
            await migratePlaintextLockIfPresent(legacy);
            const next = {
              ...parsed,
              state: { ...parsed.state, lockPassword: null },
            };
            await AsyncStorage.setItem(
              "tailor-preferences",
              JSON.stringify(next)
            );
          }
        } catch {
          // legacy parse failed; continue
        }
      }
    } catch {
      // AsyncStorage unavailable; continue
    }
    const isLockSet = await hasLockSecure();
    set({ isLockSet, hydrated: true });
  },

  unlockWith: async (password) => {
    const now = Date.now();
    const { cooldownUntil } = get();
    if (now < cooldownUntil) return false;
    const ok = await verifyLockSecure(password);
    if (ok) {
      set({ isUnlocked: true, failedAttempts: 0, cooldownUntil: 0 });
      return true;
    }
    const attempts = get().failedAttempts + 1;
    const cooldown =
      attempts >= MAX_ATTEMPTS ? Date.now() + COOLDOWN_MS : 0;
    set({
      failedAttempts: attempts >= MAX_ATTEMPTS ? 0 : attempts,
      cooldownUntil: cooldown,
    });
    return false;
  },

  setLock: async (password) => {
    await setLockSecure(password);
    set({ isLockSet: true, isUnlocked: true });
  },

  clearLockAndUnlock: async () => {
    await clearLockSecure();
    set({
      isLockSet: false,
      isUnlocked: true,
      failedAttempts: 0,
      cooldownUntil: 0,
    });
  },

  reLock: () => set({ isUnlocked: false }),
}));
