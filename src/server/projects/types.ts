export type ProjectImage = { image_url: string; public_id: string; priority?: number };

export type ProjectSocialPost = { platform: string; url: string };

export type ProjectListItem = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  stack: string[];
  images: ProjectImage[];
};

export type PublicProject = ProjectListItem & {
  body: string;
  socialPosts: ProjectSocialPost[];
  sourceUrl?: string;
  demoUrl?: string;
};
