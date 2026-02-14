import { zonedTimeToUtc, utcToZonedTime, format } from "date-fns-tz";

// "YYYY-MM-DD" → Date(UTC)
export function parseUserDate(dateStr: string, timezone: string): Date {
  return zonedTimeToUtc(`${dateStr}T00:00:00`, timezone);
}

// Date(UTC) → "YYYY-MM-DD" (ユーザーのtimezoneに変換)
export function formatUserDate(date: Date, timezone: string): string {
  const zoned = utcToZonedTime(date, timezone);
  return format(zoned, "yyyy-MM-dd", { timeZone: timezone });
}

// 変換関数（ローカル基準でYYYY-MM-DD）
export const toYmdLocal = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const toYmLocal = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

export const fromYmdLocal = (ymd: string): Date => {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d); // ← local time の 00:00
};
