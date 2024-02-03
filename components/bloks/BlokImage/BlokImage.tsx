import { GeneralBlokProps } from "@/@types/storyblok";
import Image from "next/image";

export function BlokImage({
  blok,
  className,
}: {
  blok: GeneralBlokProps;
  className?: string;
}) {
  const { filename, alt, title } = blok;
  const { width, height } = filename.match(/\/(\d+)x(\d+)\//)?.groups || {};
  return (
    <Image
      src={`${filename}`}
      fill={true}
      alt={alt || undefined}
      title={title || undefined}
      width={width}
      height={height}
      loading="lazy"
      className={className}
    />
  );
}
