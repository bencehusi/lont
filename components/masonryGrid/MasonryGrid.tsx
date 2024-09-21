"use client";
import Masonry from "react-masonry-css";
import Link from "next/link";
import cn from "classnames";

import { BlokImage } from "@/components/bloks/BlokImage";

const breakpointColumnsObj = {
  default: 4,
  1024: 3,
  768: 2,
};

export function MasonryGrid({ homePageContent }: { homePageContent: any }) {
  const aspectRatio = (396 / 266) * 100;
  return (
    <Masonry
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
      breakpointCols={breakpointColumnsObj}
    >
      {homePageContent?.map((blok: any) =>
        blok.project.story ? (
          <li
            key={blok._uid}
            className={cn(
              "relative overflow-hidden rounded-[10px] outline outline-2",
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
            key={blok._uid}
            className={cn(
              "rounded-[10px] outline outline-2",
              blok.hideBelow === "sm" && "hidden sm:block",
              blok.hideBelow === "md" && "hidden md:block",
              blok.hideBelow === "lg" && "hidden lg:block",
            )}
            style={{
              paddingBottom: `${blok.height === "small" ? aspectRatio / 2 : aspectRatio}%`,
            }}
          ></div>
        ),
      )}
    </Masonry>
  );
}
