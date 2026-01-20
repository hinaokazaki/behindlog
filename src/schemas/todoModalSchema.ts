import { z } from "zod";

export const todoModalSchema = z.object({
  title: z.string().min(1, "ToDoを入力してください"),
  dueDate: z.string().min(1, "期限を選択してください"),
});

export type TodoModalFormValues = z.infer<typeof todoModalSchema>;