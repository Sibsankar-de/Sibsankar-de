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

function projectFromFormData(formData: FormData) {
  const rawImages = String(formData.get("images") ?? "[]");
  const rawSocialPosts = String(formData.get("socialPosts") ?? "[]");
  let images: unknown = [];
  let socialPosts: unknown = [];
  try {
    images = JSON.parse(rawImages);
  } catch {
    throw new Error("Images must be a valid JSON array.");
  }
  try {
    socialPosts = JSON.parse(rawSocialPosts);
  } catch {
    throw new Error("Social posts must be a valid JSON array.");
  }
  return projectInputSchema.parse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    body: formData.get("body"),
    stack: String(formData.get("stack") ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    socialPosts,
    sourceUrl: formData.get("sourceUrl"),
    demoUrl: formData.get("demoUrl"),
    images,
    isPublished: formData.get("isPublished") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  });
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

export async function createProjectAction(formData: FormData) {
  await requireAdmin();
  await createProject(projectFromFormData(formData));
  revalidateTag("projects", "max");
  redirect("/admin");
}

export async function updateProjectAction(formData: FormData) {
  await requireAdmin();
  await updateProject(String(formData.get("id")), projectFromFormData(formData));
  revalidateTag("projects", "max");
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
  await requireAdmin();
  const file = formData.get("file") as File | null;
  if (!file || typeof file === "string" || !file.name) {
    throw new Error("No file provided.");
  }
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = `data:${file.type || "image/jpeg"};base64,${buffer.toString("base64")}`;
  return await uploadProjectImage(base64);
}
