import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.url()]).transform((value) => value || undefined);

export const projectInputSchema = z.object({
  title: z.string().trim().min(2).max(100),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().trim().min(20).max(280),
  body: z.string().trim().min(40).max(10000),
  stack: z.array(z.string().trim().min(1).max(40)).min(1).max(20),
  socialPosts: z
    .array(
      z.object({
        platform: z.string().trim().min(1).max(50),
        url: z.url(),
      }),
    )
    .max(10),
  sourceUrl: optionalUrl,
  demoUrl: optionalUrl,
  images: z
    .array(
      z.object({
        image_url: z.url(),
        public_id: z.string().trim().min(1).max(300),
        priority: z.number().int().min(0).optional(),
      }),
    )
    .max(12),
  isPublished: z.boolean(),
  sortOrder: z.number().int().min(0).max(1000),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;
