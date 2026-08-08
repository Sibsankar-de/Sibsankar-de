import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-canvas p-6 text-center">
      <div>
        <p className="font-mono text-xs uppercase text-secondary">404</p>
        <h1 className="mt-3 text-5xl font-bold">Project not found.</h1>
        <Link
          className="mt-7 inline-block border-2 border-line bg-primary px-4 py-3 font-mono text-xs uppercase shadow-[4px_4px_0_var(--line)]"
          href="/"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
