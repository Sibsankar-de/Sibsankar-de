import { z } from "zod";

export const contactQuerySchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(254),
  subject: z.string().trim().min(3).max(140),
  message: z.string().trim().min(20).max(3000),
  website: z.string().max(0).optional(),
});

export type ContactQueryInput = z.infer<typeof contactQuerySchema>;
