import { z } from "zod";
import { goalsSchema } from "./goal";
import { todosSchema } from "./todo";
import { totalStudyTimeSchema } from "./committime";

// 共通のFriendDashboardモデル
export const friendDashboardSchema = z.object({
  timezone: z.string(),
  todos: todosSchema,
  goals: goalsSchema,
  committime: totalStudyTimeSchema.nullable(),
});

// レスポンス用
export const friendDashboardResponseSchema = z.object({
  friendDashboard: friendDashboardSchema,
});

// 型を生成
export type FriendDashboard = z.infer<typeof friendDashboardSchema>;
export type FriendDashboardResponse = z.infer<
  typeof friendDashboardResponseSchema
>;
