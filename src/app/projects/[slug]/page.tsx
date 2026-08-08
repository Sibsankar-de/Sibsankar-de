import type { Metadata } from "next";
import { Code2, ExternalLink, Share2 } from "lucide-react";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { ImageCarousel } from "@/components/ui/carousel";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { SectionHeading } from "@/components/modules/section-heading";
import { SiteHeader } from "@/components/modules/site-header";
import { getPublishedProjectBySlug } from "@/server/projects/service";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { images: project.images[0] ? [project.images[0].image_url] : [] },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) notFound();

  return (
    <>
      <SiteHeader compact />
      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-18">
        {/* Title and Top Section */}
        <p className="font-mono text-xs uppercase text-secondary">Case study / {project.slug}</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-bold tracking-[-0.05em] sm:text-7xl">{project.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">{project.summary}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          {project.demoUrl && (
            <ButtonLink href={project.demoUrl} target="_blank">
              <ExternalLink size={16} />
              Live preview
            </ButtonLink>
          )}
          {project.sourceUrl && (
            <ButtonLink href={project.sourceUrl} target="_blank" variant="secondary">
              <Code2 size={16} />
              Source code
            </ButtonLink>
          )}
        </div>

        {/* Project Images Carousel */}
        {project.images.length > 0 && (
          <div className="mt-12">
            <ImageCarousel images={project.images} title={project.title} />
          </div>
        )}

        {/* Case Study Content, Stack & Social Posts */}
        <div className="mt-16 grid gap-12 lg:grid-cols-[1.5fr_0.8fr]">
          <article>
            <SectionHeading index="Build" title="What I made" />
            <MarkdownRenderer content={project.body} />
          </article>
          <aside className="space-y-8">
            <div>
              <SectionHeading index="Stack" title="Tools & Tech" />
              <div className="flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span
                    className="border-2 border-line bg-surface px-3 py-2 font-mono text-xs font-semibold uppercase shadow-[2px_2px_0_var(--line)]"
                    key={item}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {project.socialPosts && project.socialPosts.length > 0 && (
              <div>
                <SectionHeading index="Social" title="Posts & Links" />
                <div className="space-y-3">
                  {project.socialPosts.map((post, idx) => (
                    <a
                      className="flex items-center justify-between border-2 border-line bg-surface p-3 font-mono text-xs font-semibold shadow-[3px_3px_0_var(--line)] transition-all hover:bg-highlight hover:translate-x-0.5"
                      href={post.url}
                      key={`${post.platform}-${idx}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span className="flex items-center gap-2">
                        <Share2 className="text-secondary" size={14} />
                        <span>{post.platform}</span>
                      </span>
                      <ExternalLink className="text-muted" size={14} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}
