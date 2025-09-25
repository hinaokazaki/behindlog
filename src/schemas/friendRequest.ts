import { z } from "zod";

// GET: /friends/requests/:id ユーザー_友達招待,申請取得（受けた側）
// user(id, name)
export const inviterUserSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
});

// レスポンス用
export const friendRequestResponseSchema = z.object({
  id: z.number(),
  status: z.enum(["PENDING", "ACCEPTED", "DECLINED"]),
  message: z.string(),
  inviter: inviterUserSchema,
});

export const friendRequestsSchema = z.object({
  friendshipId: z.number(),
  inviter: inviterUserSchema,
});

export const friendRequestsResponseSchema = z.array(friendRequestsSchema);

//型を作成
export type FriendRequestResponse = z.infer<typeof friendRequestResponseSchema>;
export type FriendRequestsResponse = z.infer<
  typeof friendRequestsResponseSchema
>;
