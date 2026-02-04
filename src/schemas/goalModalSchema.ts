import { z } from "zod";

export const goalModalSchema = z.object({
  title: z.string().min(1, "目標を入力してください"),
  deadline: z.string().min(1, "期限を選択してください"),
});

export type GoalModalFormValues = z.infer<typeof goalModalSchema>;