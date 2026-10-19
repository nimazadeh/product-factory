import { z } from "zod";

/** Shared validation contracts (mirror of the client's src/lib/schemas.ts).
    One style end-to-end: Zod schemas -> z.infer types -> runtime validation. */
export const loginSchema = z.object({
  email: z.email("ایمیل معتبر نیست"),
  password: z.string().min(6, "رمز دست‌کم ۶ نویسه").max(72),
});
export const eventSchema = z.object({
  tool: z.string().min(1).max(40),
  action: z.string().min(1).max(20),
});
export const feedbackSchema = z.object({
  name: z.string().max(80).optional(),
  contact: z.string().max(120).optional(),
  message: z.string().min(2, "پیام کوتاه است").max(2000),
});
export const occasionSchema = z.object({
  title: z.string().min(2).max(60),
  month: z.int().min(1).max(12),
  day: z.int().min(1).max(31),
});
export const toolToggleSchema = z.object({ enabled: z.boolean() });

export type LoginInput = z.infer<typeof loginSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;
export type OccasionInput = z.infer<typeof occasionSchema>;
export type ToolToggleInput = z.infer<typeof toolToggleSchema>;
