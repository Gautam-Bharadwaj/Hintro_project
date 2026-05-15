export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0sec";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0 || parts.length === 0) parts.push(`${s}sec`);
  return parts.join(" ");
}

export function formatRelativeTime(iso: string | undefined | null): string {
  if (!iso) return "-";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "-";
  const now = Date.now();
  const diffSec = Math.max(0, Math.floor((now - then) / 1000));
  if (diffSec < 60) return "just now";
  const min = Math.floor(diffSec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} ${hr === 1 ? "hour" : "hours"} ago`;
  const day = Math.floor(hr / 24);
  if (day === 1) return "1 day ago";
  if (day < 30) return `${day} days ago`;
  const mo = Math.floor(day / 30);
  if (mo === 1) return "1 month ago";
  if (mo < 12) return `${mo} months ago`;
  const yr = Math.floor(mo / 12);
  return yr === 1 ? "1 year ago" : `${yr} years ago`;
}

const ORDINAL_SUFFIX = ["th", "st", "nd", "rd"];
function ordinal(n: number) {
  const v = n % 100;
  return n + (ORDINAL_SUFFIX[(v - 20) % 10] || ORDINAL_SUFFIX[v] || ORDINAL_SUFFIX[0]);
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatDayHeader(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getMonth()]} ${ordinal(d.getDate())}`;
}

export function dayKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function formatClockTime(iso: string): string {
  const d = new Date(iso);
  let h = d.getHours();
  const m = d.getMinutes();
  const period = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, "0")} ${period}`;
}
