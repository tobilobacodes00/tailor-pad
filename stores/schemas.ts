import { z } from "zod";

export const TemplateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(120),
  fields: z.array(z.string().min(1).max(120)).max(200),
  createdAt: z.number().int().nonnegative(),
  lastUsedAt: z.number().int().nonnegative().nullable(),
});

export const CustomerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(120),
  templateId: z.string().min(1),
  measurements: z.record(z.string(), z.string().max(120)),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export const BackupFileSchema = z.object({
  app: z.literal("tailor"),
  version: z.literal(1),
  exportedAt: z.number().int().nonnegative(),
  templates: z.array(TemplateSchema).max(1000),
  customers: z.array(CustomerSchema).max(50000),
});

export type TemplateInput = z.infer<typeof TemplateSchema>;
export type CustomerInput = z.infer<typeof CustomerSchema>;
export type BackupFile = z.infer<typeof BackupFileSchema>;
