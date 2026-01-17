import { z } from "zod";

export const modalItemSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  deadline: z.string().min(1)
  // dataRange: z
  //   .object({
  //     from: z.date().nullable(),
  //     to: z.date().nullable(),
  //   })
  //   .refine((v) => !v.from || !v.to || v.from <= v.to, {
  //     message: "開始日は終了日より前にしてください",
  //   }),
});

export type modalItemForm = z.infer<typeof modalItemSchema>;
