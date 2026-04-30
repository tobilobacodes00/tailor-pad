import { validateTemplateInput } from "@/stores/templates";

describe("validateTemplateInput", () => {
  it("rejects an empty name", () => {
    const r = validateTemplateInput({
      name: "  ",
      fields: ["Waist"],
    });
    expect(r.ok).toBe(false);
  });

  it("rejects when no fields have content", () => {
    const r = validateTemplateInput({
      name: "Boys",
      fields: ["", "  "],
    });
    expect(r.ok).toBe(false);
  });

  it("trims and filters fields, accepting valid input", () => {
    const r = validateTemplateInput({
      name: "  Boys  ",
      fields: ["  Waist  ", "", "Sleeves"],
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.name).toBe("Boys");
      expect(r.fields).toEqual(["Waist", "Sleeves"]);
    }
  });
});
