import { ResolvingMetadata } from "next";
import { PageProps } from "@/.next/types/app/layout";

import { Project } from "@/components/contentTypes/Project";
import { fetchStories } from "@/lib/storyblok";
import { extractImageDimensions } from "@/lib/storyblok/ExtractImageDimensions";

interface Heading {
  text: string;
  level: number;
  link: string;
}

interface Node {
  type: string;
  attrs?: { level: number };
  content?: Node[];
  text?: string;
}

interface Item {
  content: { content: Node[] };
}

export async function generateMetadata(
  { params, searchParams }: PageProps,
  parent: ResolvingMetadata,
) {
  const parentMetadata = await parent;
  const { slug } = params;
  const colophon = await fetchStories({
    slug: [`colophon`],
  });
  const coverImage = colophon.story?.content?.cover;
  const { width, height } = extractImageDimensions(coverImage?.filename);
  const coverImageAlt = coverImage?.alt;
  return {
    title: `${colophon.story?.content?.seo.title} | ${parentMetadata.title?.absolute}`,
    description: colophon.story?.content?.seo.description,
    openGraph: {
      title: `${colophon.story?.content?.seo.title} | ${parentMetadata.title?.absolute}`,
      description: colophon.story?.content?.seo.description,
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

export default async function ColophonPage({ params }: PageProps) {
  const { slug } = params;
  const colohpon = await fetchStories({
    slug: [`colophon`],
  });

  function extractHeadings(jsonArray: Item[]): Heading[] {
    const headings: Heading[] = [];

    jsonArray.forEach((item: Item) => {
      const content = item.content.content;

      // Traverse the content recursively to find headings
      function traverseContent(content: Node[]) {
        content.forEach((node: Node) => {
          if (node.type === "heading" && node.attrs && node.content) {
            const headingText = node.content.map((item) => item.text).join("");
            const headingLevel = node.attrs.level;
            const headingLink = headingText
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^\w-]+/g, "");

            headings.push({
              text: headingText,
              level: headingLevel,
              link: headingLink,
            });
          }

          // Recursively check child content if it exists
          if (node.content) {
            traverseContent(node.content);
          }
        });
      }

      traverseContent(content);
    });

    return headings;
  }

  const headings = extractHeadings(colohpon.story?.content?.content);

  return (
    <div className="flex h-full grow flex-col items-stretch md:flex-row">
      <aside className="order-last flex flex-col md:order-first lg:w-[266px]">
        <div className="hidden rounded-xl border-2 border-black px-5 py-2 font-bold md:block">
          Index
        </div>
        <input
          type="checkbox"
          className="peer hidden"
          id="colophon-index-toggle"
        />
        <label
          htmlFor="colophon-index-toggle"
          className="order-last -mt-0.5 block space-y-2.5 rounded-xl border-2 border-black px-5 py-4 font-bold md:hidden"
        >
          <div className="mx-auto w-8 border-t border-black" />
          <div className="mx-auto w-8 border-t border-black" />
          <div className="mx-auto w-8 border-t border-black" />
        </label>
        <ul className="-mt-0.5 hidden grow space-y-2 overflow-y-auto rounded-xl border-2 border-black px-5 py-2 peer-checked:block md:block">
          {headings?.map(
            (heading: { text: string; level: number; link: string }) => (
              <li
                key={heading.text}
                className="flex items-center space-x-2 font-bold"
                style={{ paddingLeft: `${(heading.level - 1) * 0.5}rem` }}
              >
                <a href={`#${heading.link}`}>{heading.text}</a>
              </li>
            ),
          )}
        </ul>
      </aside>
      <div className="order-first h-full grow overflow-y-auto rounded-xl border-2 border-black md:order-last md:-ml-0.5 lg:flex">
        <Project blok={colohpon.story?.content} />
      </div>
    </div>
  );
}
