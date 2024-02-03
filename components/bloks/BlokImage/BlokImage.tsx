import { GeneralBlokProps } from "@/@types/storyblok";
import Image from "next/image";

export function BlokImage({
  blok,
  className,
  fill,
}: {
  blok: GeneralBlokProps;
  className?: string;
  fill?: boolean;
}) {
  const { filename, alt, title } = blok.image;
  const { width, height } = {
    width: filename.split("/")[5].split("x")[0],
    height: filename.split("/")[5].split("x")[1],
  };
  return (
    <Image
      src={`${filename}`}
      fill={fill}
      alt={alt || undefined}
      title={title || undefined}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading="lazy"
      className={className}
    />
  );
}
