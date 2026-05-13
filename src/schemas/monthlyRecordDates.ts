import z from "zod";

// 1日分の日付
export const RecordedDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

// 月別記録日一覧
export const MonthlyRecordDates = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
  userId: z.string(),
  recordedDates: z.array(RecordedDate),
});

// APIレスポンス全体
export const MonthlyRecordDatesResponse = z.object({
  monthlyRecordDates: MonthlyRecordDates,
});

// 型
export type RecordedDate = z.infer<typeof RecordedDate>;

export type MonthlyRecordDates = z.infer<typeof MonthlyRecordDates>;

export type MonthlyRecordDatesResponse = z.infer<
  typeof MonthlyRecordDatesResponse
>;
