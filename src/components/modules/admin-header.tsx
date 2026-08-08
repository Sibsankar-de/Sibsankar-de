import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

export function AdminHeader({ email }: { email: string }) {
  return (
    <header className="sticky top-0 z-10 border-b-2 border-line bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <div className="flex items-center gap-6">
          <Link
            className="border-2 border-line bg-secondary px-2.5 py-1 font-mono text-xs font-bold uppercase text-secondary-foreground"
            href="/admin"
          >
            SD
          </Link>
          <nav aria-label="Admin navigation" className="flex items-center gap-5 font-mono text-xs uppercase">
            <Link className="text-muted underline-offset-4 hover:text-ink hover:underline" href="/admin">
              Dashboard
            </Link>
            <Link
              className="text-muted underline-offset-4 hover:text-ink hover:underline"
              href="/admin/projects/new"
            >
              + New project
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden font-mono text-xs text-muted sm:block">{email}</span>
          <form action={logoutAction}>
            <Button type="submit" variant="secondary">
              Logout
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
