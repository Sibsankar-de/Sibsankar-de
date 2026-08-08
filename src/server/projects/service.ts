import "server-only";
import { unstable_cache } from "next/cache";
import { connectDatabase } from "@/server/database";
import { ProjectModel } from "@/server/projects/model";
import type { ProjectInput } from "@/server/projects/schema";
import type { ProjectListItem, PublicProject } from "@/server/projects/types";

function toListItem(project: Record<string, unknown>): ProjectListItem {
  return {
    id: String(project._id),
    title: String(project.title),
    slug: String(project.slug),
    summary: String(project.summary),
    stack: project.stack as string[],
    images: project.images as ProjectListItem["images"],
  };
}

function toPublicProject(project: Record<string, unknown>): PublicProject {
  return {
    ...toListItem(project),
    body: String(project.body),
    socialPosts: (project.socialPosts ?? []) as PublicProject["socialPosts"],
    sourceUrl: project.sourceUrl as string | undefined,
    demoUrl: project.demoUrl as string | undefined,
  };
}

const getCachedPublishedProjects = unstable_cache(
  async () => {
    await connectDatabase();
    const projects = await ProjectModel.find({ isPublished: true }).sort({ sortOrder: 1, createdAt: -1 }).lean();
    return projects.map((project) => toListItem(project as unknown as Record<string, unknown>));
  },
  ["published-projects"],
  { tags: ["projects"] },
);

export async function getPublishedProjects() {
  try {
    return await getCachedPublishedProjects();
  } catch {
    return [];
  }
}

export async function getPublishedProjectBySlug(slug: string) {
  await connectDatabase();
  const project = await ProjectModel.findOne({ slug, isPublished: true }).lean();
  return project ? toPublicProject(project as unknown as Record<string, unknown>) : null;
}

export async function getAllProjects() {
  await connectDatabase();
  const projects = await ProjectModel.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
  return projects.map((project) => ({
    ...toPublicProject(project as unknown as Record<string, unknown>),
    isPublished: project.isPublished,
    sortOrder: project.sortOrder,
  }));
}

export async function createProject(input: ProjectInput) {
  await connectDatabase();
  const project = await ProjectModel.create(input);
  return project.id;
}

export async function updateProject(id: string, input: ProjectInput) {
  await connectDatabase();
  const project = await ProjectModel.findByIdAndUpdate(id, input, { new: true, runValidators: true });
  if (!project) throw new Error("Project not found.");
}

export async function deleteProject(id: string) {
  await connectDatabase();
  const project = await ProjectModel.findByIdAndDelete(id).lean();
  if (!project) throw new Error("Project not found.");
  return project.images as ProjectListItem["images"];
}

export async function getProjectById(id: string) {
  await connectDatabase();
  const project = await ProjectModel.findById(id).lean();
  return project
    ? {
        ...toPublicProject(project as unknown as Record<string, unknown>),
        isPublished: project.isPublished,
        sortOrder: project.sortOrder,
      }
    : null;
}
