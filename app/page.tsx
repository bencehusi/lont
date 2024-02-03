import Image from "next/image";

import { IndexLinks } from "@/components/IndexLinks";
import { fetchStories } from "@/lib/storyblok";
import { BlokImage } from "@/components/bloks/BlokImage";
import Link from "next/link";

export default async function Home() {
  const aspectRatio = (396 / 266) * 100;

  const { stories } = await fetchStories({
    starts_with: "projects/",
  });

  return (
    <div className="-mt-0.5 flex h-full md:mt-0 md:-space-x-0.5">
      <div className="hidden w-full max-w-64 -space-y-0.5 md:flex md:flex-col">
        <div className="rounded-xl border-2 border-black px-5 py-2">Index</div>
        <IndexLinks className="grow" />
      </div>
      <div className="h-full grow overflow-y-auto overflow-x-hidden rounded-xl border-2 border-black">
        <div className="group -mb-0.5 -mt-0.5 grid w-[calc(100%+4px)] grid-cols-3">
          {stories?.map((story) => (
            <li
              key={story.uuid}
              className="relative overflow-hidden rounded-xl border-2 border-black [&:nth-child(3n)]:-ml-0.5 [&:nth-child(3n+2)]:-ml-0.5 [&:nth-child(n+3)]:-mt-0.5"
              style={{ paddingBottom: `${aspectRatio}%` }}
            >
              <Link
                href={`/${story.full_slug}`}
                className="absolute inset-0 z-10"
                hrefLang="en"
              />
              <BlokImage
                blok={{ image: story.content.cover }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </li>
          ))}
        </div>
      </div>
    </div>
  );
}
