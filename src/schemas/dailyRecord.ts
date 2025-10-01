import { z } from "zod/v4";

// 共通のdailyRecordモデル
export const dailyRecordSchema = z.object({
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

//// リクエスト用
// PUT: /records:date ユーザー_記録新規作成,取得,更新
export const todoItemSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  isCompleted: z.boolean(),
  dueDate: z.iso.datetime().nullable().optional(),
});

export const todoSnapshotSchema = z.object({
  date: z.iso.date(),
  items: z.array(todoItemSchema),
});

export const createDailyRecordSchema = z.object({
  totalStudyTime: z.number().int().nonnegative(),
  memo: z.string(),
  todoSnapshot: todoSnapshotSchema.optional().nullable(),
  applyTodoUpdates: z.boolean().optional(), //  フロント側でtodoに変更があったかを判断するためのフラグ
});

// レスポンス用
export const dailyRecordResponseSchema = z.object({
  dailyRecord: dailyRecordSchema,
});
export const safeDailyRecordSchema = dailyRecordSchema;

// 型を作成
export type DailyRecord = z.infer<typeof dailyRecordSchema>;
export type TodoSnapshot = z.infer<typeof todoSnapshotSchema>;
export type CreateDailyRecord = z.infer<typeof createDailyRecordSchema>;
export type DailyRecordResponse = z.infer<typeof dailyRecordResponseSchema>;
