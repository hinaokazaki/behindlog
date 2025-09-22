import { z } from "zod";

// 共通のTodoモデル
export const goalSchema = z.object({
  id: z.number(),
  title: z.string(),
  deadline: z.string(),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// リクエスト用
export const createGoalRequestSchema = z.object({
  title: z.string().min(1),
  deadline: z.string(),
});

export const updateGoalRequestSchema = z.object({
  title: z.string(),
  deadline: z.string(),
});

// レスポンス用
export const goalResponseSchema = goalSchema;

export const goalsResponseSchema = z.array(goalSchema);

// 型を生成
export type Goal = z.infer<typeof goalSchema>;
export type CreateGoalRequest = z.infer<typeof createGoalRequestSchema>;
export type updateGoalRequest = z.infer<typeof updateGoalRequestSchema>;
export type GoalResponse = z.infer<typeof goalResponseSchema>;
export type GoalsResponse = z.infer<typeof goalsResponseSchema>;
