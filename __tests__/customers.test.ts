import { useCustomers } from "@/stores/customers";

describe("useCustomers store", () => {
  beforeEach(() => {
    useCustomers.setState({ customers: [] });
  });

  it("add() returns a stable id and prepends the new customer", () => {
    const id = useCustomers.getState().add({
      name: "Qudus",
      templateId: "boys",
      measurements: { Waist: "32" },
    });
    expect(typeof id).toBe("string");
    expect(useCustomers.getState().customers[0].id).toBe(id);
    expect(useCustomers.getState().customers[0].name).toBe("Qudus");
  });

  it("update() patches and bumps updatedAt", async () => {
    const id = useCustomers.getState().add({
      name: "Qudus",
      templateId: "boys",
      measurements: { Waist: "32" },
    });
    const original = useCustomers.getState().getById(id);
    await new Promise((r) => setTimeout(r, 5));
    useCustomers
      .getState()
      .update(id, { measurements: { Waist: "33" } });
    const updated = useCustomers.getState().getById(id);
    expect(updated?.measurements.Waist).toBe("33");
    expect(updated?.updatedAt).toBeGreaterThanOrEqual(original?.updatedAt ?? 0);
  });

  it("remove() removes by id", () => {
    const id = useCustomers.getState().add({
      name: "Qudus",
      templateId: "boys",
      measurements: {},
    });
    useCustomers.getState().remove(id);
    expect(useCustomers.getState().getById(id)).toBeUndefined();
  });
});
