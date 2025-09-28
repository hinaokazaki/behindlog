import { z } from "zod";

// 共通のfriendモデル
export const friendSchema = z.object({
  message: z.string(),
  status: z.enum(["PENDING", "ACCEPTED", "DECLINED"]),
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId1: z.string(),
  userId2: z.string().nullable(),
  inviterUserId: z.string(),
  inviteeEmail: z.string(),
  token: z.string().nullable(),
  respondedAt: z.string().nullable(),
});

// GET: /friends ユーザー_友達一覧取得
export const friendInfoSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
});

export const friendsListSchema = z.object({
  id: z.number(),
  status: z.enum(["PENDING", "ACCEPTED", "DECLINED"]),
  friend: friendInfoSchema,
});

// GET: /friends/invite?token=xxxx ユーザー_招待お知らせ情報取得用
export const friendInviteSchema = z.object({
  inviterName: z.string().nullable(),
  message: z.string(),
  status: z.enum(["PENDING", "ACCEPTED", "DECLINED"]),
  alreadyRegistered: z.boolean(),
});

//// リクエスト用
// invite
export const createFriendRequestSchema = z.object({
  inviteeEmail: z.string(),
  message: z.string(),
});

// accept
export const updateFriendRequestSchema = z.object({
  status: z.enum(["PENDING", "ACCEPTED", "DECLINED"]),
  respondedAt: z.string().nullable(),
});

// link
export const receiveFriendRequestSchema = z.object({
  inviteToken: z.string().nullable(),
});

//// レスポンス用
export const friendResponseSchema = friendSchema;
export const friendInviteResponseSchema = friendInviteSchema;
export const createFriendRequestResponseSchema = createFriendRequestSchema;
export const receiveFriendRequestResponseSchema = receiveFriendRequestSchema;

//// 型を作成
export type Friend = z.infer<typeof friendSchema>;
export type FriendList = z.infer<typeof friendsListSchema>;
export type FriendResponse = z.infer<typeof friendResponseSchema>;
export type FriendInvite = z.infer<typeof friendInviteSchema>;
export type CreateFriendRequest = z.infer<typeof createFriendRequestSchema>;
export type UpdateFriendRequest = z.infer<typeof updateFriendRequestSchema>;
export type ReceiveFriendRequest = z.infer<typeof receiveFriendRequestSchema>;
