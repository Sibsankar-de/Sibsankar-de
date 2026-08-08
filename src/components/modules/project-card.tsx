import Image from "next/image";
import Link from "next/link";
import type { ProjectListItem } from "@/server/projects/types";

export function ProjectCard({ project }: { project: ProjectListItem }) {
  return (
    <article className="group flex h-full flex-col border-2 border-line bg-surface shadow-[5px_5px_0_var(--line)] transition-transform hover:-translate-y-1">
      <Link
        aria-label={`View ${project.title}`}
        className="relative aspect-[16/9] overflow-hidden border-b-2 border-line bg-highlight text-highlight-foreground"
        href={`/projects/${project.slug}`}
      >
        {project.images[0] ? (
          <Image
            alt={`${project.title} project cover`}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            src={project.images[0].image_url}
          />
        ) : (
          <span className="grid h-full place-items-center font-mono text-xs uppercase">No image supplied</span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex flex-wrap gap-2">
          {project.stack.slice(0, 4).map((item) => (
            <span className="border border-line px-2 py-1 font-mono text-[10px] uppercase" key={item}>
              {item}
            </span>
          ))}
        </div>
        <h3 className="text-2xl font-bold">{project.title}</h3>
        <p className="mt-3 text-sm leading-6 text-muted">{project.summary}</p>
        <Link
          className="mt-6 font-mono text-xs font-medium uppercase underline underline-offset-4"
          href={`/projects/${project.slug}`}
        >
          Read case study
        </Link>
      </div>
    </article>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="flex h-full flex-col border-2 border-line bg-surface shadow-[5px_5px_0_var(--line)]">
      {/* Aspect ratio cover skeleton */}
      <div className="aspect-[16/9] animate-pulse border-b-2 border-line bg-canvas" />

      <div className="flex flex-1 flex-col p-5">
        {/* Stack pills skeleton */}
        <div className="mb-4 flex gap-2">
          <div className="h-5 w-16 animate-pulse border border-line bg-canvas" />
          <div className="h-5 w-20 animate-pulse border border-line bg-canvas" />
          <div className="h-5 w-14 animate-pulse border border-line bg-canvas" />
        </div>

        {/* Title skeleton */}
        <div className="h-7 w-3/4 animate-pulse bg-line/15" />

        {/* Summary skeleton */}
        <div className="mt-3 space-y-2">
          <div className="h-4 w-full animate-pulse bg-line/10" />
          <div className="h-4 w-5/6 animate-pulse bg-line/10" />
          <div className="h-4 w-2/3 animate-pulse bg-line/10" />
        </div>

        {/* CTA skeleton */}
        <div className="mt-6 h-4 w-28 animate-pulse bg-line/15" />
      </div>
    </div>
  );
}

export function ProjectCardSkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, idx) => (
        <ProjectCardSkeleton key={`skeleton-${idx}`} />
      ))}
    </div>
  );
}
