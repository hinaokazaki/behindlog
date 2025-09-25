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

// GET: /friends/invite?token=xxxx ユーザー_招待お知らせ情報取得用
export const friendInvite = z.object({
  inviterName: z.string(),
  message: z.string(),
  status: z.enum(["PENDING", "ACCEPTED", "DECLINED"]),
  alreadyRegistered: z.string().nullable(),
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

//
