import Link from "next/link";
import { notFound } from "next/navigation";
import { updateProjectAction } from "@/app/admin/actions";
import { AdminHeader } from "@/components/modules/admin-header";
import { AdminProjectForm } from "@/components/modules/admin-project-form";
import { requireAdmin } from "@/server/auth/service";
import { getProjectById } from "@/server/projects/service";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [admin, project] = await Promise.all([requireAdmin(), getProjectById(id)]);

  if (!project) notFound();

  return (
    <div className="min-h-screen bg-canvas">
      <AdminHeader email={admin.email} />
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="mb-8 flex items-center gap-3">
          <Link
            className="font-mono text-xs text-muted underline-offset-4 hover:text-ink hover:underline"
            href="/admin"
          >
            ← Dashboard
          </Link>
          <span className="text-muted">/</span>
          <span className="font-mono text-xs text-muted">Edit</span>
        </div>
        <div className="mb-6">
          <p className="font-mono text-[10px] uppercase text-muted">Projects</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Edit: {project.title}</h1>
        </div>
        <AdminProjectForm action={updateProjectAction} project={project} />
      </main>
    </div>
  );
}
