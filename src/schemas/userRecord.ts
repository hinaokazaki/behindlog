import { z } from "zod";

// 共通のdailyRecordモデル
export const userRecordSchema = z.object({
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string(),
  recordedDate: z.string(),
  totalStudyTime: z.number(),
  memo: z.string(),
  todoSnapshot: z.unknown(),
  commitTargetTime: z.number().nullable(),
  commitStartDate: z.string().nullable(),
  commitEndDate: z.string().nullable(),
  commitTimeId: z.number().nullable(),
});

// レスポンス用
export const userRecordResponseSchema = userRecordSchema;

// 型を生成
export type UserRecord = z.infer<typeof userRecordSchema>;
export type UserRecordResponse = z.infer<typeof userRecordResponseSchema>;
