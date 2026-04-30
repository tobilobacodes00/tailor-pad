import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
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

export const useCustomers = create<CustomersState>()(
  persist(
    (set, get) => ({
      customers: [],
      add: ({ name, templateId, measurements }) => {
        const id = Crypto.randomUUID();
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
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persistedState) => persistedState as CustomersState,
    }
  )
);
