import { dayBucket, formatTimeLabel, formatUsedLabel } from "@/utils/time";

describe("dayBucket", () => {
  const now = new Date();
  const todayMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();

  it("classifies right-now as Today", () => {
    expect(dayBucket(now.getTime())).toBe("Today");
  });

  it("classifies just-before-midnight-yesterday as Yesterday", () => {
    expect(dayBucket(todayMidnight - 60_000)).toBe("Yesterday");
  });

  it("classifies a week ago as Earlier", () => {
    expect(dayBucket(todayMidnight - 7 * 86_400_000)).toBe("Earlier");
  });
});

describe("formatTimeLabel", () => {
  it("returns 'Just now' for the current moment", () => {
    expect(formatTimeLabel(Date.now())).toBe("Just now");
  });
});

describe("formatUsedLabel", () => {
  it("returns 'Not used yet' when timestamp is null", () => {
    expect(formatUsedLabel(null)).toBe("Not used yet");
  });
});
