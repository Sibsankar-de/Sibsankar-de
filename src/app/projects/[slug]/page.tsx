import type { Metadata } from "next";
import { Code2, ExternalLink, Share2 } from "lucide-react";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { ImageCarousel } from "@/components/ui/carousel";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { SectionHeading } from "@/components/modules/section-heading";
import { SiteHeader } from "@/components/modules/site-header";
import { getPublishedProjectBySlug } from "@/server/projects/service";
import { profile, socials } from "@/data/portfolio";

type ProjectPageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) return { title: "Project not found" };

  const ogImage = project.images[0]?.image_url ?? "/og_image.png";
  const title = `${project.title} - Case Study`;
  const description = project.summary;
  const url = `/projects/${project.slug}`;

  return {
    title,
    description,
    keywords: [
      project.title,
      "Case Study",
      "Sibsankar De",
      "Software Developer",
      ...project.stack,
    ],
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      locale: "en_IN",
      siteName: "Sibsankar De",
      title,
      description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${project.title} project cover` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "@sibsankar_de",
    },
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
      <footer className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-5 py-6 font-mono text-xs text-muted sm:flex-row sm:items-center sm:px-8">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <div className="flex items-center gap-5">
          <a
            aria-label="GitHub profile"
            className="flex items-center gap-1.5 underline-offset-4 transition-colors hover:text-ink hover:underline focus-visible:rounded-sm"
            href={socials.github}
            id="project-footer-github-link"
            rel="noopener noreferrer"
            target="_blank"
          >
            <svg aria-hidden="true" fill="currentColor" height="14" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
          <a
            aria-label="LinkedIn profile"
            className="flex items-center gap-1.5 underline-offset-4 transition-colors hover:text-ink hover:underline focus-visible:rounded-sm"
            href={socials.linkedin}
            id="project-footer-linkedin-link"
            rel="noopener noreferrer"
            target="_blank"
          >
            <svg aria-hidden="true" fill="currentColor" height="14" viewBox="0 0 24 24" width="14" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
          <span className="hidden sm:inline">{profile.location}</span>
        </div>
      </footer>
    </>
  );
}
