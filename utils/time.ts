export type DayBucket = "Today" | "Yesterday" | "Earlier";

export function dayBucket(timestamp: number): DayBucket {
  const now = new Date();
  const ts = new Date(timestamp);
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  const yesterdayStart = todayStart - 86400000;

  if (ts.getTime() >= todayStart) return "Today";
  if (ts.getTime() >= yesterdayStart) return "Yesterday";
  return "Earlier";
}

export function formatTimeLabel(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const bucket = dayBucket(timestamp);

  if (bucket === "Today") {
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (minutes < 1) return "Just now";
    if (minutes < 60)
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  if (bucket === "Yesterday") {
    return new Date(timestamp).toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  const days = Math.floor(diff / 86400000);
  if (days < 30) return `${days} days ago`;
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function formatUsedLabel(timestamp: number | null): string {
  if (timestamp === null) return "Not used yet";
  const now = Date.now();
  const diff = now - timestamp;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);

  if (hours < 1) return "Used recently";
  if (hours < 24) return "Used recently";
  if (days < 2) return "Used yesterday";
  return `Used ${days}d ago`;
}
