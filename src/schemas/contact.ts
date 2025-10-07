import { z } from "zod";

// 共通のcontactモデル
export const contactSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
  createdAt: z.string(),
});

// リクエスト用
export const createContactRequestSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().email(),
  message: z.string().trim().min(1),
});

// レスポンス用
export const contactResponseSchema = z.object({
  status: z.literal("OK"),
});

// フロント用
export const contactFormValueSchema = z.object({
  name: z.string().min(1, "お名前は必須です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  message: z.string().min(1, "メッセージは必須です"),
});

// 型を生成
export type Contact = z.infer<typeof contactSchema>;
export type CreateContactRequest = z.infer<typeof createContactRequestSchema>;
export type ContactResponse = z.infer<typeof contactResponseSchema>;
export type ContactFormValue = z.infer<typeof contactFormValueSchema>;
