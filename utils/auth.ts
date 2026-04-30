import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";

const KEY_LOCK = "tailor.lockHash";
const KEY_SALT = "tailor.lockSalt";
const SECURE_OPTS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

async function getOrCreateSalt(): Promise<string> {
  const existing = await SecureStore.getItemAsync(KEY_SALT, SECURE_OPTS);
  if (existing) return existing;
  const bytes = await Crypto.getRandomBytesAsync(16);
  const salt = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  await SecureStore.setItemAsync(KEY_SALT, salt, SECURE_OPTS);
  return salt;
}

async function digest(password: string, salt: string): Promise<string> {
  return Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${salt}:${password}`,
    { encoding: Crypto.CryptoEncoding.HEX }
  );
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function hasLock(): Promise<boolean> {
  const stored = await SecureStore.getItemAsync(KEY_LOCK, SECURE_OPTS);
  return stored !== null && stored.length > 0;
}

export async function setLock(password: string): Promise<void> {
  const salt = await getOrCreateSalt();
  const hash = await digest(password, salt);
  await SecureStore.setItemAsync(KEY_LOCK, hash, SECURE_OPTS);
}

export async function verifyLock(input: string): Promise<boolean> {
  const stored = await SecureStore.getItemAsync(KEY_LOCK, SECURE_OPTS);
  if (!stored) return false;
  const salt = await getOrCreateSalt();
  const candidate = await digest(input, salt);
  return constantTimeEqual(candidate, stored);
}

export async function clearLock(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY_LOCK, SECURE_OPTS);
  await SecureStore.deleteItemAsync(KEY_SALT, SECURE_OPTS);
}

export async function migratePlaintextLockIfPresent(
  plaintext: string | null
): Promise<void> {
  if (!plaintext) return;
  const already = await hasLock();
  if (already) return;
  await setLock(plaintext);
}
