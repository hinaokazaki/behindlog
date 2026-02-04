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

export const todosSchema = z.array(todoSchema);

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
export const todoResponseSchema = z.object({
  todo: todoSchema,
});

export const todosResponseSchema = z.object({
  todos: todosSchema,
});

// 型を生成
export type Todo = z.infer<typeof todoSchema>;
export type Todos = z.infer<typeof todosSchema>;
export type CreateTodoRequest = z.infer<typeof createTodoRequestSchema>;
export type UpdateTodoRequest = z.infer<typeof updateTodoRequestSchema>;
export type TodoResponse = z.infer<typeof todoResponseSchema>;
export type TodosResponse = z.infer<typeof todosResponseSchema>;
