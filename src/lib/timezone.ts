import { formatUserDate, parseUserDate } from "./date";

// レスポンス用（UTC → ユーザーのタイムゾーン）
// 単一レコード用
export function withUserTimezone<T extends Record<string, any>>(
  record: T,
  fields: (keyof T)[],
  timezone: string,
): T {
  const formatted = { ...record };
  for (const field of fields) {
    if (record[field]) {
      (formatted as any)[field] = formatUserDate(record[field], timezone);
    }
  }
  return formatted;
}

// 複数レコード用
export function withUserTimezoneMany<T extends Record<string, any>>(
  records: T[],
  fields: (keyof T)[],
  timezone: string,
): T[] {
  return records.map((r) => withUserTimezone(r, fields, timezone));
}

// 保存用（"YYYY-MM-DD" → UTC に直して DB に保存）
// 単一レコード用
export function withUserDateParse<T extends Record<string, any>>(
  record: T,
  fields: (keyof T)[],
  timezone: string,
): T {
  const parsed = { ...record };
  for (const field of fields) {
    if (record[field]) {
      (parsed as any)[field] = parseUserDate(record[field], timezone);
    }
  }
  return parsed;
}

// 配列用
export function withUserDateParseMany<T extends Record<string, any>>(
  records: T[],
  fields: (keyof T)[],
  timezone: string,
): T[] {
  return records.map((r) => withUserDateParse(r, fields, timezone));
}
