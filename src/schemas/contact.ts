import { z } from "zod";

// 共通のcontactモデル
export const contactSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// リクエスト用
export const createContactRequestSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});

// レスポンス用
export const contactResponseSchema = z.object({
  status: z.literal("OK"),
});

// 型を生成
export type Contact = z.infer<typeof contactSchema>;
export type CreateContactRequest = z.infer<typeof createContactRequestSchema>;
export type ContactResponse = z.infer<typeof contactResponseSchema>;
