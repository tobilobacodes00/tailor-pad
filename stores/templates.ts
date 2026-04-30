import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type TemplateValidation =
  | { ok: true; name: string; fields: string[] }
  | { ok: false; error: string };

export function validateTemplateInput(input: {
  name: string;
  fields: string[];
}): TemplateValidation {
  const name = input.name.trim();
  if (!name) {
    return { ok: false, error: "Give the template a name first." };
  }
  const fields = input.fields.map((f) => f.trim()).filter(Boolean);
  if (fields.length === 0) {
    return {
      ok: false,
      error: "Templates need at least one measurement field.",
    };
  }
  return { ok: true, name, fields };
}

export type Template = {
  id: string;
  name: string;
  fields: string[];
  createdAt: number;
  lastUsedAt: number | null;
};

type TemplatesState = {
  templates: Template[];
  add: (input: { name: string; fields: string[] }) => string;
  update: (
    id: string,
    patch: Partial<Pick<Template, "name" | "fields" | "lastUsedAt">>
  ) => void;
  remove: (id: string) => void;
  getById: (id: string) => Template | undefined;
};

const now = Date.now();
const oneDay = 86400000;

const seed: Template[] = [
  {
    id: "boys",
    name: "Boys Measurement",
    fields: [
      "Shoulder Width",
      "Sleeves",
      "Full chest",
      "Waist Length",
      "Hips",
      "Neck",
    ],
    createdAt: now - 2 * oneDay,
    lastUsedAt: now - 14 * 60 * 60 * 1000,
  },
  {
    id: "girls",
    name: "Girls Measurement",
    fields: [
      "Shoulder Width",
      "Sleeves",
      "Full chest",
      "Waist Length",
      "Hips",
      "Neck",
    ],
    createdAt: now - 7 * oneDay,
    lastUsedAt: now - 10 * oneDay,
  },
];

export const useTemplates = create<TemplatesState>()(
  persist(
    (set, get) => ({
      templates: seed,
      add: ({ name, fields }) => {
        const id = Crypto.randomUUID();
        const t: Template = {
          id,
          name,
          fields,
          createdAt: Date.now(),
          lastUsedAt: null,
        };
        set((state) => ({ templates: [t, ...state.templates] }));
        return id;
      },
      update: (id, patch) => {
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, ...patch } : t
          ),
        }));
      },
      remove: (id) => {
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        }));
      },
      getById: (id) => get().templates.find((t) => t.id === id),
    }),
    {
      name: "tailor-templates",
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persistedState) => persistedState as TemplatesState,
    }
  )
);
