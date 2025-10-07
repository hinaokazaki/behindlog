import { z } from "zod";
import { themeOptions } from "@/constants/themeOptions";
import moment from "moment-timezone";

export const profileFormSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  colorTheme: z.enum(
    themeOptions.map((opt) => opt.value) as [string, ...string[]],
  ),
  timezone: z.string().refine((tz) => moment.tz.names().includes(tz), {
    message: "無効なタイムゾーンです",
  }),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
