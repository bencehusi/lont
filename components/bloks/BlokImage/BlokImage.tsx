import cn from "classnames";
import { extractImageDimensions } from "@/lib/storyblok/ExtractImageDimensions";
import Image from "next/image";
import { Fragment } from "react";

export function BlokImage({
  blok,
  className,
  fill,
}: {
  blok: any;
  className?: string;
  fill?: boolean;
}) {
  const { image, caption, orientation } = blok;
  const { filename, alt, title } = image;
  const { width, height } = extractImageDimensions(filename);
  const Wrapper = caption ? "figure" : Fragment;
  return (
    <Wrapper className="relative flex flex-col items-end">
      <Image
        src={`${filename}`}
        fill={fill}
        alt={alt || undefined}
        title={title || undefined}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        loading="lazy"
        className={cn(
          className,
          orientation === "landscape" && "w-full",
          orientation === "portrait" && "max-w-[70%]",
        )}
      />
      {caption && (
        <figcaption className="mt-3 max-w-80 text-right text-sm">
          {caption}
        </figcaption>
      )}
    </Wrapper>
  );
}
