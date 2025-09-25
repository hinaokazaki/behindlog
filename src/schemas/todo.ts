import { z } from "zod";

// 共通のTodoモデル
export const todoSchema = z.object({
  id: z.number(),
  title: z.string(),
  dueDate: z.string(),
  isCompleted: z.boolean(),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// リクエスト用
export const createTodoRequestSchema = z.object({
  title: z.string().min(1),
  dueDate: z.string(),
});

export const updateTodoRequestSchema = z.object({
  title: z.string(),
  dueDate: z.string(),
  isCompleted: z.boolean(),
});

// レスポンス用
export const todoResponseSchema = todoSchema;

export const todosResponseSchema = z.array(todoSchema);

// 型を生成
export type Todo = z.infer<typeof todoSchema>;
export type CreateTodoRequest = z.infer<typeof createTodoRequestSchema>;
export type UpdateTodoRequest = z.infer<typeof updateTodoRequestSchema>;
export type todoResponse = z.infer<typeof todoResponseSchema>;
export type todosResponse = z.infer<typeof todosResponseSchema>;
