import Link from "next/link";
import cn from "classnames";

import { IndexLinks } from "@/components/IndexLinks";
import { fetchStories } from "@/lib/storyblok";
import { BlokImage } from "@/components/bloks/BlokImage";
import { MasonryGrid } from "@/components/masonryGrid";

export default async function Home() {
  const aspectRatio = (396 / 266) * 100;

  const { stories } = await fetchStories({
    starts_with: "home",
    resolve_links: "story",
  });

  const homePage = stories?.[0];
  const homePageContent = homePage?.content?.grid;

  return (
    <div className="-mt-0.5 flex h-full md:mt-0 md:-space-x-0.5">
      <div className="hidden w-full max-w-64 -space-y-0.5 md:flex md:flex-col">
        <div className="rounded-xl border-2 border-black px-5 py-2 font-bold">
          Index
        </div>
        <IndexLinks className="grow overflow-y-auto" />
      </div>
      <div className="h-full grow overflow-y-auto overflow-x-hidden rounded-xl border-2 border-black">
        <MasonryGrid homePageContent={homePageContent} />
      </div>
      {/* <div className="h-full grow overflow-y-auto overflow-x-hidden rounded-xl border-2 border-black">
        <div className="group -mb-0.5 -mt-0.5 grid w-[calc(100%+4px)] auto-rows-auto grid-cols-1 gap-0.5 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {homePageContent?.map((blok: any) =>
            blok.project.story ? (
              <li
                key={blok.project.story.uuid}
                className={cn(
                  "relative row-span-2 overflow-hidden rounded-xl outline outline-2",
                )}
                style={{ paddingBottom: `${aspectRatio}%` }}
              >
                <Link
                  href={`/${blok.project.story.full_slug}`}
                  className="absolute inset-0 z-10"
                  hrefLang="en"
                />
                <BlokImage
                  blok={{ image: blok.project.story.content.cover }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </li>
            ) : (
              <div
                key={blok.uuid}
                className={cn(
                  "rounded-xl bg-red-500 outline outline-2",
                  blok.height === "small" ? "row-span-1" : "row-span-2",
                )}
              ></div>
            ),
          )}
        </div>
      </div> */}
    </div>
  );
}
