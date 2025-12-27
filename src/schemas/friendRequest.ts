import { z } from "zod";

// GET: /friends/requests/:id ユーザー_友達招待,申請取得（受けた側）
// user(id, name)
export const inviterUserSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// レスポンス用
export const friendRequestSchema = z.object({
  id: z.number(),
  status: z.enum(["PENDING", "ACCEPTED", "DECLINED"]),
  message: z.string(),
  inviter: inviterUserSchema,
});

export const friendRequestResponseSchema = z.object({
  invitation: friendRequestSchema,
});

export const friendRequestRecordSchema = z.object({
  friendshipId: z.number(),
  message: z.string(),
  inviter: inviterUserSchema,
});

export const friendRequestRecordsSchema = z.array(friendRequestRecordSchema);

export const friendRequestRecordsResponseSchema = z.object({
  invitations: friendRequestRecordsSchema,
});

//型を作成
export type FriendRequest = z.infer<typeof friendRequestSchema>;
export type FriendRequestResponse = z.infer<typeof friendRequestResponseSchema>;
export type FriendRequestrecords = z.infer<typeof friendRequestRecordsSchema>;
export type FriendRequestRecordsResponse = z.infer<
  typeof friendRequestRecordsResponseSchema
>;
