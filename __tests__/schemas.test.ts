import { BackupFileSchema } from "@/stores/schemas";

describe("BackupFileSchema", () => {
  const valid = {
    app: "tailor",
    version: 1,
    exportedAt: 1700000000000,
    templates: [
      {
        id: "t1",
        name: "Boys",
        fields: ["Waist", "Sleeves"],
        createdAt: 1,
        lastUsedAt: null,
      },
    ],
    customers: [
      {
        id: "c1",
        name: "Qudus",
        templateId: "t1",
        measurements: { Waist: "32" },
        createdAt: 1,
        updatedAt: 2,
      },
    ],
  };

  it("accepts a well-formed backup", () => {
    expect(BackupFileSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a missing app marker", () => {
    const bad = { ...valid, app: "other" };
    expect(BackupFileSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects when measurements isn't a string-to-string map", () => {
    const bad = {
      ...valid,
      customers: [{ ...valid.customers[0], measurements: "broken" }],
    };
    expect(BackupFileSchema.safeParse(bad).success).toBe(false);
  });

  it("rejects when fields contains a non-string", () => {
    const bad = {
      ...valid,
      templates: [{ ...valid.templates[0], fields: [42] }],
    };
    expect(BackupFileSchema.safeParse(bad).success).toBe(false);
  });
});
