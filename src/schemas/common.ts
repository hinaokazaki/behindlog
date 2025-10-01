import { z, ZodError, ZodIssue } from "zod";

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

// バリデーションエラー用スキーマ
export const validationErrorResponseSchema = z.object({
  status: z.literal("VALIDATION_ERROR"),
  issues: z.array(z.any()), // 厳密にするなら z.custom<ZodIssue>() も可
});

export type ValidationErrorResponse = {
  status: "VALIDATION_ERROR";
  issues: { path: string; message: string }[];
};
