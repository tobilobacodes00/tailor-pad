// Stub native modules that pure-Node tests don't have access to.

jest.mock("expo-secure-store", () => {
  const store = new Map();
  return {
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 0,
    getItemAsync: jest.fn(async (key) => store.get(key) ?? null),
    setItemAsync: jest.fn(async (key, value) => {
      store.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key) => {
      store.delete(key);
    }),
  };
});

jest.mock("expo-crypto", () => {
  let counter = 0;
  return {
    CryptoDigestAlgorithm: { SHA256: "SHA-256" },
    CryptoEncoding: { HEX: "hex" },
    digestStringAsync: jest.fn(async (_alg, value) =>
      Buffer.from(value).toString("hex")
    ),
    getRandomBytesAsync: jest.fn(async (n) => new Uint8Array(n).fill(7)),
    randomUUID: jest.fn(() => `00000000-0000-4000-8000-${String(++counter).padStart(12, "0")}`),
  };
});

jest.mock("@react-native-async-storage/async-storage", () => {
  const store = new Map();
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async (key) => store.get(key) ?? null),
      setItem: jest.fn(async (key, value) => {
        store.set(key, value);
      }),
      removeItem: jest.fn(async (key) => {
        store.delete(key);
      }),
      clear: jest.fn(async () => {
        store.clear();
      }),
    },
  };
});
