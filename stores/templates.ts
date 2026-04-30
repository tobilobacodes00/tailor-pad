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

const STARTER_TIMESTAMP = Date.now();

const STARTER_TEMPLATES: Template[] = [
  {
    id: "starter-top",
    name: "Top",
    fields: [
      "Shoulder",
      "Sleeve Length",
      "Round Sleeve",
      "Chest",
      "Waist",
      "Hip",
      "Top Length",
    ],
    createdAt: STARTER_TIMESTAMP,
    lastUsedAt: null,
  },
  {
    id: "starter-trousers",
    name: "Trousers",
    fields: [
      "Waist",
      "Hip",
      "Thigh",
      "Knee",
      "Trouser Length",
      "Bottom",
    ],
    createdAt: STARTER_TIMESTAMP,
    lastUsedAt: null,
  },
  {
    id: "starter-native",
    name: "Native",
    fields: [
      "Shoulder",
      "Sleeve Length",
      "Round Sleeve",
      "Chest",
      "Top Length",
      "Neck",
    ],
    createdAt: STARTER_TIMESTAMP,
    lastUsedAt: null,
  },
];

export const useTemplates = create<TemplatesState>()(
  persist(
    (set, get) => ({
      templates: STARTER_TEMPLATES,
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
