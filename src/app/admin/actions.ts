"use server";

import bcrypt from "bcryptjs";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { AdminModel } from "@/server/auth/model";
import { createSession, deleteSession } from "@/server/auth/session";
import { requireAdmin } from "@/server/auth/service";
import { removeCloudinaryImage, uploadProjectImage } from "@/server/cloudinary";
import { connectDatabase } from "@/server/database";
import { createProject, deleteProject, updateProject } from "@/server/projects/service";
import { projectInputSchema } from "@/server/projects/schema";
import { setResumeUrl } from "@/server/settings/service";

const loginSchema = z.object({ email: z.email(), password: z.string().min(8) });

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

function projectFromFormData(formData: FormData) {
  const rawImages = String(formData.get("images") ?? "[]");
  const rawSocialPosts = String(formData.get("socialPosts") ?? "[]");
  let images: unknown = [];
  let socialPosts: unknown = [];
  try {
    images = JSON.parse(rawImages);
  } catch {
    return { success: false, error: "Images must be a valid JSON array." } as const;
  }
  try {
    socialPosts = JSON.parse(rawSocialPosts);
  } catch {
    return { success: false, error: "Social posts must be a valid JSON array." } as const;
  }

  const stack = String(formData.get("stack") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const pendingTag = String(formData.get("pendingTag") ?? "").trim();
  if (pendingTag && !stack.some((t) => t.toLowerCase() === pendingTag.toLowerCase())) {
    stack.push(pendingTag);
  }

  const result = projectInputSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    body: formData.get("body"),
    stack,
    socialPosts,
    sourceUrl: formData.get("sourceUrl"),
    demoUrl: formData.get("demoUrl"),
    images,
    isPublished: formData.get("isPublished") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  });

  if (!result.success) {
    const errorMessages = result.error.issues.map((issue) => {
      const field = issue.path.join(".") || "Form";
      return `${field}: ${issue.message}`;
    });
    return {
      success: false,
      error: errorMessages.join(" • "),
      fieldErrors: result.error.flatten().fieldErrors,
    } as const;
  }

  return { success: true, data: result.data } as const;
}

export async function loginAction(formData: FormData) {
  const input = loginSchema.parse({ email: formData.get("email"), password: formData.get("password") });
  await connectDatabase();
  let admin = await AdminModel.findOne({ email: input.email.toLowerCase() });
  if (
    !admin &&
    input.email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase() &&
    input.password === process.env.ADMIN_PASSWORD
  ) {
    admin = await AdminModel.create({
      email: input.email.toLowerCase(),
      passwordHash: await bcrypt.hash(input.password, 12),
    });
  }
  if (!admin || !(await bcrypt.compare(input.password, admin.passwordHash)))
    throw new Error("Invalid email or password.");
  await createSession(admin.id);
  redirect("/admin");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/admin/login");
}

export async function createProjectAction(
  arg1: FormData | ActionState | void | undefined,
  arg2?: FormData,
): Promise<ActionState | void> {
  await requireAdmin();
  const formData = arg2 instanceof FormData ? arg2 : (arg1 as FormData);
  const parsed = projectFromFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error, fieldErrors: parsed.fieldErrors };
  }
  try {
    await createProject(parsed.data);
    revalidateTag("projects", "max");
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { error: err.message };
    }
    return { error: "Failed to create project." };
  }
  redirect("/admin");
}

export async function updateProjectAction(
  arg1: FormData | ActionState | void | undefined,
  arg2?: FormData,
): Promise<ActionState | void> {
  await requireAdmin();
  const formData = arg2 instanceof FormData ? arg2 : (arg1 as FormData);
  const id = String(formData?.get("id") ?? "");
  if (!id) {
    return { error: "Project ID is required." };
  }
  const parsed = projectFromFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error, fieldErrors: parsed.fieldErrors };
  }
  try {
    await updateProject(id, parsed.data);
    revalidateTag("projects", "max");
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { error: err.message };
    }
    return { error: "Failed to update project." };
  }
  redirect("/admin");
}

export async function deleteProjectAction(formData: FormData) {
  await requireAdmin();
  const images = await deleteProject(String(formData.get("id")));
  await Promise.all(images.map((image) => removeCloudinaryImage(image.public_id).catch(() => undefined)));
  revalidateTag("projects", "max");
  redirect("/admin");
}

export async function setResumeUrlAction(formData: FormData) {
  await requireAdmin();
  const url = z.url().parse(String(formData.get("resumeUrl")));
  await setResumeUrl(url);
  revalidateTag("settings", "max");
  redirect("/admin");
}

export async function uploadImageAction(formData: FormData) {
  const results = await uploadImagesAction(formData);
  if (!results.length) throw new Error("No image was uploaded.");
  return results[0];
}

export async function uploadImagesAction(formData: FormData) {
  await requireAdmin();
  let files = formData.getAll("files") as File[];
  if (!files || files.length === 0) {
    const single = formData.get("file") as File | null;
    if (single && typeof single !== "string" && single.name) {
      files = [single];
    }
  }

  const validFiles = files.filter((f) => f && typeof f !== "string" && f.size > 0);
  if (!validFiles.length) {
    throw new Error("No files provided.");
  }

  const results = await Promise.all(
    validFiles.map(async (file) => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${file.type || "image/jpeg"};base64,${buffer.toString("base64")}`;
      return await uploadProjectImage(base64);
    }),
  );

  return results;
}
