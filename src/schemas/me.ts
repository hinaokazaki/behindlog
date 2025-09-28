import { z } from "zod";

// 共通のprofileモデル
export const profileSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().email(),
  colorTheme: z
    .enum(["ORIGINAL", "COOL", "WARM", "NATURE", "SUNSHINE"])
    .nullable(),
  timezone: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// リクエスト用
export const createProfileRequestSchema = z.object({
  timezone: z.string(),
});

export const updateProfileRequestSchema = z.object({
  name: z.string().nullable(),
  colorTheme: z
    .enum(["ORIGINAL", "COOL", "WARM", "NATURE", "SUNSHINE"])
    .nullable(),
  timezone: z.string(),
});

// レスポンス用
export const profileResponseSchema = profileSchema;

// 型を生成
export type Profile = z.infer<typeof profileSchema>;
export type CreateProfileRequest = z.infer<typeof createProfileRequestSchema>;
export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>;
export type ProfileResponse = z.infer<typeof profileResponseSchema>;
