import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Customer = {
  id: string;
  name: string;
  templateId: string;
  measurements: Record<string, string>;
  createdAt: number;
  updatedAt: number;
};

type CustomersState = {
  customers: Customer[];
  add: (input: {
    name: string;
    templateId: string;
    measurements: Record<string, string>;
  }) => string;
  update: (
    id: string,
    patch: Partial<Pick<Customer, "name" | "measurements">>
  ) => void;
  remove: (id: string) => void;
  getById: (id: string) => Customer | undefined;
};

const now = Date.now();
const oneHour = 3600000;
const oneDay = 86400000;

const seed: Customer[] = [
  {
    id: "qudus",
    name: "Qudus",
    templateId: "boys",
    measurements: {
      "Shoulder Width": "32",
      Sleeves: "17",
      "Full chest": "33",
      "Waist Length": "37",
      Hips: "32",
      Neck: "10",
    },
    createdAt: now - 14 * oneHour,
    updatedAt: now - 14 * oneHour,
  },
  {
    id: "biba",
    name: "Biba",
    templateId: "girls",
    measurements: {
      "Shoulder Width": "30",
      Sleeves: "16",
      "Full chest": "34",
      "Waist Length": "28",
      Hips: "36",
      Neck: "12",
    },
    createdAt: now - 21 * oneHour,
    updatedAt: now - 21 * oneHour,
  },
  {
    id: "paul",
    name: "Paul",
    templateId: "boys",
    measurements: {
      "Shoulder Width": "34",
      Sleeves: "18",
      "Full chest": "36",
      "Waist Length": "38",
      Hips: "34",
      Neck: "14",
    },
    createdAt: now - oneDay - 16 * oneHour,
    updatedAt: now - oneDay - 16 * oneHour,
  },
  {
    id: "crownz",
    name: "Crownz",
    templateId: "girls",
    measurements: {
      "Shoulder Width": "31",
      Sleeves: "17",
      "Full chest": "32",
      "Waist Length": "29",
      Hips: "37",
      Neck: "12",
    },
    createdAt: now - oneDay - 15 * oneHour,
    updatedAt: now - oneDay - 15 * oneHour,
  },
];

export const useCustomers = create<CustomersState>()(
  persist(
    (set, get) => ({
      customers: seed,
      add: ({ name, templateId, measurements }) => {
        const id = String(Date.now());
        const ts = Date.now();
        const c: Customer = {
          id,
          name,
          templateId,
          measurements,
          createdAt: ts,
          updatedAt: ts,
        };
        set((state) => ({ customers: [c, ...state.customers] }));
        return id;
      },
      update: (id, patch) => {
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id ? { ...c, ...patch, updatedAt: Date.now() } : c
          ),
        }));
      },
      remove: (id) => {
        set((state) => ({
          customers: state.customers.filter((c) => c.id !== id),
        }));
      },
      getById: (id) => get().customers.find((c) => c.id === id),
    }),
    {
      name: "tailor-customers",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
