import { z } from "zod";

const optionalUrl = z.preprocess((val) => {
  if (val === null || val === undefined || typeof val !== "string" || val.trim() === "") {
    return undefined;
  }
  return val.trim();
}, z.string().url("Please enter a valid URL").optional());

export const projectInputSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters").max(150, "Title must be at most 150 characters"),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must only contain lowercase letters, numbers, and hyphens (e.g. my-project)"),
  summary: z.string().trim().min(5, "Summary must be at least 5 characters").max(1000, "Summary must be at most 1000 characters"),
  body: z.string().trim().min(1, "Case study content cannot be empty").max(50000, "Case study content is too long"),
  stack: z.array(z.string().trim().min(1).max(50)).min(1, "Please add at least one tech stack item").max(30),
  socialPosts: z
    .array(
      z.object({
        platform: z.string().trim().min(1, "Platform name is required").max(50),
        url: z.string().url("Please provide a valid URL for social post"),
      }),
    )
    .max(20)
    .default([]),
  sourceUrl: optionalUrl,
  demoUrl: optionalUrl,
  images: z
    .array(
      z.object({
        image_url: z.string().url("Image URL must be valid"),
        public_id: z.string().trim().min(1).max(300),
        priority: z.number().int().min(0).optional(),
      }),
    )
    .max(20)
    .default([]),
  isPublished: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(1000).default(0),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;
