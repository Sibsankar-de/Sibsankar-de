import { ProjectCardSkeletonGrid } from "@/components/modules/project-card";
import { SiteHeader } from "@/components/modules/site-header";

export default function Loading() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="space-y-4">
          <div className="h-6 w-32 animate-pulse border border-line bg-canvas" />
          <div className="h-12 w-2/3 animate-pulse border border-line bg-canvas" />
        </div>
        <div className="mt-12">
          <ProjectCardSkeletonGrid count={3} />
        </div>
      </main>
    </>
  );
}
