import { formatUserDate, parseUserDate } from "./date";
type ReplaceFields<T, K extends keyof T, V> = Omit<T, K> & {
  [key in K]: V;
};

// レスポンス用（UTC → ユーザーTZ）
export function withUserTimezone<
  T extends Record<string, unknown>,
  K extends keyof T,
>(record: T, fields: K[], timezone: string): ReplaceFields<T, K, string> {
  const formatted = { ...record } as ReplaceFields<T, K, string>;

  for (const field of fields) {
    const value = record[field];

    if (value instanceof Date) {
      (formatted as Record<K, string>)[field] = formatUserDate(value, timezone);
    }
  }

  return formatted;
}

// 複数レコード用
export function withUserTimezoneMany<
  T extends Record<string, unknown>,
  K extends keyof T,
>(records: T[], fields: K[], timezone: string): ReplaceFields<T, K, string>[] {
  return records.map((r) => withUserTimezone(r, fields, timezone));
}

// 保存用（YYYY-MM-DD → UTC Date）
export function withUserDateParse<
  T extends Record<string, unknown>,
  K extends keyof T,
>(record: T, fields: K[], timezone: string): ReplaceFields<T, K, Date> {
  const parsed = { ...record } as ReplaceFields<T, K, Date>;

  for (const field of fields) {
    const value = record[field];

    if (typeof value === "string") {
      (parsed as Record<K, Date>)[field] = parseUserDate(value, timezone);
    }
  }

  return parsed;
}

// 配列用
export function withUserDateParseMany<
  T extends Record<string, unknown>,
  K extends keyof T,
>(records: T[], fields: K[], timezone: string): ReplaceFields<T, K, Date>[] {
  return records.map((r) => withUserDateParse(r, fields, timezone));
}
