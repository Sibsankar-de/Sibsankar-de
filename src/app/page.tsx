import { HomePage } from "@/components/modules/home-page";
import { getPublishedProjects } from "@/server/projects/service";
import { getResumeUrl } from "@/server/settings/service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, resumeUrl] = await Promise.all([getPublishedProjects(), getResumeUrl()]);
  return <HomePage projects={projects} resumeUrl={resumeUrl} />;
}
