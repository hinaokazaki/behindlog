import { z } from "zod";

export const dateRangeSchema = z.object({
  from: z.date().nullable(),
  to: z.date().nullable(),
});

export const commitTimeFormSchema = z.object({
  targetTime: z.coerce
    .number({ required_error: "目標時間は必須です" })
    .int("整数で入力してください"),
  deadline: dateRangeSchema.superRefine((v, ctx) => {
    if (!v.from) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["from"],
        message: "開始日を選択してください",
      });
    }
    if (!v.to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["to"],
        message: "終了日を選択してください",
      });
    }
    if (v.from && v.to && v.to < v.from) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["to"],
        message: "終了日は開始日以降にしてください",
      });
    }
  }),
});

export type CommitTimeFormSchema = z.infer<typeof commitTimeFormSchema>;
