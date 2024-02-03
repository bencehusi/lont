import { PageProps } from "@/.next/types/app/layout";
import { Project } from "@/components/contentTypes/Project";
import { fetchStories } from "@/lib/storyblok";

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = params;
  const project = await fetchStories({
    slug: [`projects/${slug}`],
  });
  return (
    <div className="h-full grow overflow-y-auto rounded-xl border-2 border-black">
      <Project blok={project.story?.content} />
    </div>
  );
}
