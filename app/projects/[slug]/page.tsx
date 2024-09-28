import { ResolvingMetadata } from "next";
import { Project } from "@/components/contentTypes/Project";
import { fetchStories } from "@/lib/storyblok";
import { extractImageDimensions } from "@/lib/storyblok/ExtractImageDimensions";
import { PageProps } from "@/@types/common";

export async function generateMetadata(
  { params, searchParams }: PageProps,
  parent: ResolvingMetadata,
) {
  const parentMetadata = await parent;
  const { slug } = params;
  const project = await fetchStories({
    slug: [`projects/${slug}`],
  });
  const coverImage = project.story?.content?.cover;
  const { width, height } = extractImageDimensions(coverImage?.filename);
  const coverImageAlt = coverImage?.alt;
  return {
    title: `${project.story?.content?.seo.title} | ${parentMetadata.title?.absolute}`,
    description: project.story?.content?.seo.description,
    openGraph: {
      title: `${project.story?.content?.seo.title} | ${parentMetadata.title?.absolute}`,
      description: project.story?.content?.seo.description,
      type: "website",
      locale: "en_US",
      siteName: "LoNT - Library of Narrative Types",
      images: [
        {
          url: coverImage?.filename,
          width,
          height,
          alt: coverImageAlt,
        },
      ],
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = params;
  const project = await fetchStories({
    slug: [`projects/${slug}`],
  });
  return (
    <div className="-mt-0.5 h-full grow overflow-y-auto rounded-xl border-2 border-black lg:mt-0">
      <Project blok={project.story?.content} />
    </div>
  );
}
