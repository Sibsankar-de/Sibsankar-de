import Link from "next/link";
import { createProjectAction } from "@/app/admin/actions";
import { AdminHeader } from "@/components/modules/admin-header";
import { AdminProjectForm } from "@/components/modules/admin-project-form";
import { requireAdmin } from "@/server/auth/service";

export default async function NewProjectPage() {
  const admin = await requireAdmin();
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
          <span className="font-mono text-xs text-muted">New project</span>
        </div>
        <div className="mb-6">
          <p className="font-mono text-[10px] uppercase text-muted">Projects</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Create project</h1>
        </div>
        <AdminProjectForm action={createProjectAction} />
      </main>
    </div>
  );
}
