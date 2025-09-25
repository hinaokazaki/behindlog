import { z } from "zod";

// user(id, name)
export const userSummarySchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
});

// １日の記録保持者
export const usersDailyRecordSchema = z.object({
  date: z.string(),
  users: z.array(userSummarySchema),
});

// レスポンス全体
export const monthlyRecordsResponseSchema = z.object({
  month: z.string(),
  record: z.array(usersDailyRecordSchema),
});

// 型を生成
export type UserSummary = z.infer<typeof userSummarySchema>;
export type UsersDailyRecord = z.infer<typeof usersDailyRecordSchema>;
export type MonthlyRecordsResponse = z.infer<
  typeof monthlyRecordsResponseSchema
>;
