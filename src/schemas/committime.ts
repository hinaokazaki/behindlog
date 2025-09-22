import { z } from "zod";

// 共通のcommittimeモデル
export const committimeSchema = z.object({
  id: z.number(),
  targetTime: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const committimeTotalStudyTimeSchema = z.object({
  committimeId: z.number(),
  totalStudyTime: z.number(),
  startDate: z.string(),
  endDate: z.string(),
});

// リクエスト用
export const createCommittimeRequestSchema = z.object({
  targetTime: z.number(),
  startDate: z.string(),
  endDate: z.string(),
});

export const updateCommittimeRequestSchema = z.object({
  targetTime: z.number(),
  startDate: z.string(),
  endDate: z.string(),
});

// レスポンス用
export const committimeResponseSchema = committimeSchema;

export const committimeTotalStudyTimeResponseSchema =
  committimeTotalStudyTimeSchema;

// 型を生成
export type Committime = z.infer<typeof committimeSchema>;
export type CommittimeTotalStudyTime = z.infer<
  typeof committimeTotalStudyTimeSchema
>;
export type CreateCommittimeRequest = z.infer<
  typeof createCommittimeRequestSchema
>;
export type UpdateCommittimeRequest = z.infer<
  typeof updateCommittimeRequestSchema
>;
export type CommittimeResponse = z.infer<typeof committimeResponseSchema>;
export type CommittimeTotalStudyTimeResponse = z.infer<
  typeof committimeTotalStudyTimeResponseSchema
>;
