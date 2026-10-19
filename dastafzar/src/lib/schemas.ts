import { z } from "zod";

/** Client mirror of the API contracts (api/src/schemas.ts) — validate before sending,
    and validate what the server sends back before trusting it. */
export const loginSchema = z.object({
  email: z.email("ایمیل معتبر نیست"),
  password: z.string().min(6, "رمز دست‌کم ۶ نویسه است").max(72),
});
export const jalaliDateSchema = z.object({
  jy: z.int().min(1000, "سال شمسی معتبر نیست").max(1600),
  jm: z.int().min(1).max(12),
  jd: z.int().min(1).max(31),
});
export type JalaliInput = z.infer<typeof jalaliDateSchema>;

export const statsSchema = z.object({
  totalEvents: z.number(), last30: z.number(), feedbackOpen: z.number(),
  byTool: z.array(z.object({ tool: z.string(), count: z.number() })),
  daily: z.record(z.string(), z.number()),
  occasions: z.array(z.object({ id: z.string(), title: z.string(), month: z.number(), day: z.number(), enabled: z.boolean() })),
  tools: z.array(z.object({ slug: z.string(), title: z.string(), enabled: z.boolean() })),
  recent: z.array(z.object({ id: z.string(), tool: z.string(), action: z.string(), createdAt: z.string() })),
});
export type Stats = z.infer<typeof statsSchema>;

export const firstError = (r: z.ZodSafeParseResult<unknown>): string =>
  r.success ? "" : (r.error.issues[0]?.message ?? "داده معتبر نیست");
