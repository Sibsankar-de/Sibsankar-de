import { ArrowDownRight, FileText, Mail } from "lucide-react";
import { ContactForm } from "@/components/modules/contact-form";
import { ButtonLink } from "@/components/ui/button-link";
import { MyImage } from "@/components/ui/my-image";
import { ProjectCard } from "@/components/modules/project-card";
import { SectionHeading } from "@/components/modules/section-heading";
import { SiteHeader } from "@/components/modules/site-header";
import { achievements, education, experience, profile, skills, socials } from "@/data/portfolio";
import type { ProjectListItem } from "@/server/projects/types";

export function HomePage({ projects, resumeUrl }: { projects: ProjectListItem[]; resumeUrl: string | null }) {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="overflow-hidden border-b-2 border-line">
          <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.1fr_0.9fr]">
            <div className="px-5 py-14 sm:px-8 sm:py-20 lg:py-28">
              <p className="font-mono text-xs font-medium uppercase tracking-widest text-secondary">
                Full-stack development · Backend systems
              </p>
              <h1 className="mt-5 max-w-3xl text-5xl font-bold leading-[0.95] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
                Building systems that hold up.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-muted">{profile.intro}</p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <ButtonLink href="#work">
                  <ArrowDownRight size={17} />
                  View work
                </ButtonLink>
                <ButtonLink href={resumeUrl ?? "/MY_RESUME.pdf"} rel="noopener noreferrer" target="_blank" variant="secondary">
                  <FileText size={17} />
                  Resume
                </ButtonLink>
                <div className="flex items-center gap-3 border-l-2 border-line pl-4">
                  <a
                    aria-label="GitHub profile"
                    className="text-muted transition-colors hover:text-ink focus-visible:rounded-sm"
                    href={socials.github}
                    id="hero-github-link"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <svg aria-hidden="true" fill="currentColor" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                  <a
                    aria-label="LinkedIn profile"
                    className="text-muted transition-colors hover:text-ink focus-visible:rounded-sm"
                    href={socials.linkedin}
                    id="hero-linkedin-link"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <svg aria-hidden="true" fill="currentColor" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="relative min-h-[640px] overflow-hidden border-t-2 border-line bg-highlight text-highlight-foreground lg:min-h-105 lg:overflow-visible lg:border-t-0 lg:border-l-2">
              <div className="absolute inset-x-0 top-0 h-11 border-b-2 border-line bg-secondary" />
              <MyImage
                className="absolute bottom-0 left-1/2 max-h-[620px] w-auto max-w-[95%] -translate-x-1/2"
                priority
              />
              <span className="absolute bottom-5 left-5 border-2 border-line bg-surface px-3 py-2 font-mono text-xs font-medium uppercase text-ink shadow-[3px_3px_0_var(--line)]">
                Sibsankar De
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl border-x-0 border-line px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-3 lg:border-x-2">
          <p className="font-mono text-xs font-medium uppercase text-secondary">Profile / 01</p>
          <p className="col-span-2 mt-4 max-w-3xl text-2xl font-medium leading-tight sm:text-4xl lg:mt-0">
            {profile.summary}
          </p>
        </section>

        <section className="mx-auto max-w-7xl border-t-2 border-line px-5 py-14 sm:px-8 sm:py-20" id="work">
          <SectionHeading index="02" title="Selected work" />
          {projects.length ? (
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-line p-8 font-mono text-sm text-muted">
              Projects will appear here when they are published.
            </div>
          )}
        </section>

        <section className="border-y-2 border-line bg-surface" id="experience">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
            <SectionHeading index="03" title="Experience" />
            {experience.map((item) => (
              <article
                className="grid gap-6 border-2 border-line bg-canvas p-6 shadow-[5px_5px_0_var(--line)] lg:grid-cols-[0.9fr_2fr]"
                key={item.company}
              >
                <div>
                  <p className="font-mono text-xs uppercase text-secondary">{item.period}</p>
                  <h3 className="mt-3 text-2xl font-bold">{item.company}</h3>
                  <p className="mt-1 text-muted">
                    {item.role} · {item.location}
                  </p>
                </div>
                <ul className="space-y-3 text-sm leading-6 text-muted">
                  {item.bullets.map((bullet) => (
                    <li className="flex gap-3" key={bullet}>
                      <span className="mt-2 size-2 shrink-0 bg-primary" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Section 04: Toolbox */}
        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20" id="toolbox">
          <SectionHeading index="04" title="Toolbox" />
          <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(skills).map(([group, items]) => (
              <div
                className="border-2 border-line bg-surface p-6 shadow-[5px_5px_0_var(--line)] transition-all hover:-translate-y-1 hover:shadow-[7px_7px_0_var(--line)]"
                key={group}
              >
                <div className="flex items-center justify-between border-b-2 border-line pb-3">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-secondary">{group}</h3>
                  <span className="border border-line bg-canvas px-2 py-0.5 font-mono text-[10px] uppercase text-muted">
                    {items.length} items
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      className="border-2 border-line bg-canvas px-3 py-1.5 font-mono text-xs font-semibold text-ink shadow-[2px_2px_0_var(--line)] transition-all hover:bg-highlight hover:translate-x-0.5"
                      key={skill}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 05: Education & Wins */}
        <section className="border-t-2 border-line bg-surface" id="education">
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
            <SectionHeading index="05" title="Education + wins" />
            <div className="grid gap-8 lg:grid-cols-[1.1fr_1.9fr]">
              {/* Education Card */}
              <div className="border-2 border-line bg-highlight p-6 text-highlight-foreground shadow-[6px_6px_0_var(--line)]">
                <div className="flex items-center justify-between">
                  <span className="border-2 border-line bg-surface px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-ink shadow-[2px_2px_0_var(--line)]">
                    Education
                  </span>
                  <span className="font-mono text-xs font-bold">{education.period}</span>
                </div>
                <h3 className="mt-5 text-2xl font-bold leading-tight">{education.school}</h3>
                <p className="mt-2 text-base font-medium">{education.degree}</p>
                <div className="mt-6 inline-block border-2 border-line bg-surface px-3 py-1.5 font-mono text-xs font-bold text-ink shadow-[3px_3px_0_var(--line)]">
                  {education.score}
                </div>
              </div>

              {/* Achievements & Wins List */}
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div
                    className="flex items-center gap-4 border-2 border-line bg-canvas p-5 shadow-[4px_4px_0_var(--line)] transition-all hover:bg-surface hover:translate-x-1"
                    key={achievement}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center border-2 border-line bg-primary font-mono text-xs font-bold text-primary-foreground shadow-[2px_2px_0_var(--line)]">
                      0{index + 1}
                    </span>
                    <span className="text-base font-medium text-ink">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t-2 border-line bg-highlight text-highlight-foreground" id="contact">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <span className="border-2 border-line bg-surface px-3 py-1 font-mono text-xs font-bold uppercase text-ink shadow-[2px_2px_0_var(--line)]">
                Let&apos;s build something useful
              </span>
              <h2 className="mt-5 max-w-xl text-4xl font-bold tracking-tight text-highlight-foreground sm:text-6xl">
                Have a system worth solving?
              </h2>
              <p className="mt-6 max-w-md text-base leading-7 text-highlight-foreground/85">
                Tell me about the problem, the team, or the opportunity. I read every message.
              </p>
              <ButtonLink className="mt-8 shadow-[4px_4px_0_var(--line)]" href={`mailto:${profile.email}`} variant="secondary">
                <Mail size={17} />
                Email directly
              </ButtonLink>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-5 py-6 font-mono text-xs text-muted sm:flex-row sm:items-center sm:px-8">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <div className="flex items-center gap-5">
          <a
            aria-label="GitHub profile"
            className="flex items-center gap-1.5 underline-offset-4 transition-colors hover:text-ink hover:underline focus-visible:rounded-sm"
            href={socials.github}
            id="footer-github-link"
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
            id="footer-linkedin-link"
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
