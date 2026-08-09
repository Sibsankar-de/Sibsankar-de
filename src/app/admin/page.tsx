import Link from "next/link";
import { deleteProjectAction, setResumeUrlAction } from "@/app/admin/actions";
import { AdminHeader } from "@/components/modules/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requireAdmin } from "@/server/auth/service";
import { getContactQueries } from "@/server/contact/service";
import { getAllProjects } from "@/server/projects/service";
import { getResumeUrl } from "@/server/settings/service";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [admin, projects, contactQueries, resumeUrl] = await Promise.all([
    requireAdmin(),
    getAllProjects(),
    getContactQueries(),
    getResumeUrl(),
  ]);

  const publishedCount = projects.filter((p) => p.isPublished).length;
  const draftCount = projects.length - publishedCount;

  return (
    <div className="min-h-screen bg-canvas">
      <AdminHeader email={admin.email} />

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        {/* Page title */}
        <div className="mb-8">
          <p className="font-mono text-xs uppercase text-muted">Overview</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>

        {/* Stat cards */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="border-2 border-line bg-surface p-5 shadow-[4px_4px_0_var(--line)]">
            <p className="font-mono text-[10px] uppercase text-muted">Total</p>
            <p className="mt-1 text-4xl font-bold">{projects.length}</p>
            <p className="mt-1 font-mono text-xs text-muted">Projects</p>
          </div>
          <div className="border-2 border-line bg-primary p-5 shadow-[4px_4px_0_var(--line)]">
            <p className="font-mono text-[10px] uppercase text-primary-foreground/70">Live</p>
            <p className="mt-1 text-4xl font-bold text-primary-foreground">{publishedCount}</p>
            <p className="mt-1 font-mono text-xs text-primary-foreground/70">Published</p>
          </div>
          <div className="border-2 border-line bg-surface p-5 shadow-[4px_4px_0_var(--line)]">
            <p className="font-mono text-[10px] uppercase text-muted">Hidden</p>
            <p className="mt-1 text-4xl font-bold">{draftCount}</p>
            <p className="mt-1 font-mono text-xs text-muted">Drafts</p>
          </div>
          <div className="border-2 border-line bg-surface p-5 shadow-[4px_4px_0_var(--line)]">
            <p className="font-mono text-[10px] uppercase text-muted">Inbox</p>
            <p className="mt-1 text-4xl font-bold">{contactQueries.length}</p>
            <p className="mt-1 font-mono text-xs text-muted">Queries</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left - projects table + resume */}
          <div className="space-y-8">
            {/* Projects */}
            <section className="border-2 border-line bg-surface shadow-[4px_4px_0_var(--line)]">
              <div className="flex items-center justify-between border-b-2 border-line px-5 py-4">
                <div>
                  <p className="font-mono text-[10px] uppercase text-muted">Manage</p>
                  <h2 className="mt-0.5 text-lg font-bold">Projects</h2>
                </div>
                <Link
                  className="border-2 border-line bg-primary px-4 py-2 font-mono text-xs font-medium uppercase text-primary-foreground shadow-[3px_3px_0_var(--line)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none"
                  href="/admin/projects/new"
                >
                  + New project
                </Link>
              </div>

              {projects.length === 0 ? (
                <p className="p-5 font-mono text-sm text-muted">No projects yet.</p>
              ) : (
                <div className="divide-y-2 divide-line">
                  {projects.map((project) => (
                    <div className="flex items-center gap-4 px-5 py-4" key={project.id}>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={
                              project.isPublished
                                ? "border border-success px-1.5 py-0.5 font-mono text-[10px] uppercase text-success"
                                : "border border-muted px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted"
                            }
                          >
                            {project.isPublished ? "Live" : "Draft"}
                          </span>
                          <h3 className="truncate font-medium">{project.title}</h3>
                        </div>
                        <p className="mt-1 truncate font-mono text-xs text-muted">
                          /{project.slug} · order {project.sortOrder}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Link
                          className="border-2 border-line bg-canvas px-3 py-1.5 font-mono text-[10px] uppercase shadow-[2px_2px_0_var(--line)] transition-all hover:translate-x-px hover:translate-y-px hover:shadow-none"
                          href={`/admin/projects/${project.id}/edit`}
                        >
                          Edit
                        </Link>
                        <form action={deleteProjectAction}>
                          <input name="id" type="hidden" value={project.id} />
                          <Button type="submit" variant="danger">
                            Delete
                          </Button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Resume link */}
            <section className="border-2 border-line bg-surface shadow-[4px_4px_0_var(--line)]">
              <div className="border-b-2 border-line px-5 py-4">
                <p className="font-mono text-[10px] uppercase text-muted">Settings</p>
                <h2 className="mt-0.5 text-lg font-bold">Resume link</h2>
              </div>
              <div className="p-5">
                <form action={setResumeUrlAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <label className="mb-2 block font-mono text-xs uppercase text-muted" htmlFor="resumeUrl">
                      Public URL
                    </label>
                    <Input
                      defaultValue={resumeUrl ?? ""}
                      id="resumeUrl"
                      name="resumeUrl"
                      placeholder="https://drive.google.com/..."
                      required
                      type="url"
                    />
                  </div>
                  <Button type="submit">Save</Button>
                </form>
                {resumeUrl && (
                  <p className="mt-3 truncate font-mono text-[11px] text-muted">
                    Active:{" "}
                    <a className="underline underline-offset-2" href={resumeUrl} rel="noopener noreferrer" target="_blank">
                      {resumeUrl}
                    </a>
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Right - contact inbox */}
          <div>
            <section className="border-2 border-line bg-surface shadow-[4px_4px_0_var(--line)]">
              <div className="border-b-2 border-line px-5 py-4">
                <p className="font-mono text-[10px] uppercase text-muted">Inbox</p>
                <h2 className="mt-0.5 text-lg font-bold">Contact queries</h2>
              </div>
              <div className="divide-y-2 divide-line">
                {contactQueries.map((query) => (
                  <article className="p-5" key={query.id}>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold leading-tight">{query.subject}</h3>
                      <span
                        className={
                          query.deliveryStatus === "sent"
                            ? "shrink-0 border border-success px-1.5 py-0.5 font-mono text-[10px] uppercase text-success"
                            : "shrink-0 border border-danger px-1.5 py-0.5 font-mono text-[10px] uppercase text-danger"
                        }
                      >
                        {query.deliveryStatus}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-xs text-muted">
                      {query.name} ·{" "}
                      <a className="underline underline-offset-2" href={`mailto:${query.email}`}>
                        {query.email}
                      </a>
                    </p>
                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted">{query.message}</p>
                    <time className="mt-3 block font-mono text-[10px] uppercase text-muted" dateTime={query.createdAt}>
                      {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(
                        new Date(query.createdAt),
                      )}
                    </time>
                  </article>
                ))}
                {contactQueries.length === 0 && (
                  <p className="p-5 font-mono text-sm text-muted">No queries yet.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
