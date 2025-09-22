import { z } from "zod";

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
export type CreateContactRequest = z.infer<typeof createContactRequestSchema>;
export type ContactResponse = z.infer<typeof contactResponseSchema>;
