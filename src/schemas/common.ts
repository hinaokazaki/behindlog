import { z } from "zod";

// 共通レスポンススキーマ
export const statusResponseSchema = z.object({
  status: z.string(),
});

export type StatusResponse = z.infer<typeof statusResponseSchema>;

// エラー用スキーマ
export const errorResponseSchema = z.object({
  error: z.string(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
