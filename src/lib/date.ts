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
