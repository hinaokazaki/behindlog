import { formatUserDate, parseUserDate } from "./date";

// レスポンス用（UTC → ユーザーのタイムゾーン）
// 単一レコード用
type ReplaceFields<T, K extends keyof T, V> = Omit<T, K> & { [key in K]: V };

export function withUserTimezone<
  T extends Record<string, any>,
  K extends keyof T,
>(record: T, fields: K[], timezone: string): ReplaceFields<T, K, string> {
  const formatted = { ...record } as ReplaceFields<T, K, string>;
  for (const field of fields) {
    if (record[field]) {
      (formatted as any)[field] = formatUserDate(record[field], timezone);
    }
  }
  return formatted;
}

// 複数レコード用
export function withUserTimezoneMany<
  T extends Record<string, any>,
  K extends keyof T,
>(records: T[], fields: K[], timezone: string): ReplaceFields<T, K, string>[] {
  return records.map((r) => withUserTimezone(r, fields, timezone));
}

// 保存用（"YYYY-MM-DD" → UTC に直して DB に保存）
// 単一レコード用
export function withUserDateParse<
  T extends Record<string, any>,
  K extends keyof T,
>(record: T, fields: K[], timezone: string): ReplaceFields<T, K, Date> {
  const parsed = { ...record } as ReplaceFields<T, K, Date>;
  for (const field of fields) {
    if (record[field]) {
      (parsed as any)[field] = parseUserDate(record[field], timezone);
    }
  }
  return parsed;
}

// 配列用
export function withUserDateParseMany<
  T extends Record<string, any>,
  K extends keyof T,
>(records: T[], fields: K[], timezone: string): ReplaceFields<T, K, Date>[] {
  return records.map((r) => withUserDateParse(r, fields, timezone));
}
