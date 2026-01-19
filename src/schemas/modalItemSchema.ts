import { z } from "zod";

export const modalItemSchema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  deadline: z.string().min(1)
});

export type modalItemForm = z.infer<typeof modalItemSchema>;
