import Link from "next/link";
import { Story } from "@/@types/storyblok";
import Image from "next/image";

export function FontItem({
  font,
  priority,
}: {
  font: Story;
  priority: boolean;
}) {
  return (
    <Link
      href={`/fonts/${font.slug}`}
      className="-m-0.5 block rounded-xl border-2 border-black px-6 py-4"
    >
      <Image
        src={font.content?.preview_image?.filename}
        alt={font.content?.preview_image?.alt}
        width={266}
        height={396}
        fill={false}
        className="mb-10 hidden w-full rounded-xl object-contain sm:block"
        priority={priority}
      />
      <Image
        src={font.content?.mobile_preview_image?.filename}
        alt={font.content?.preview_image?.alt}
        width={266}
        height={396}
        fill={false}
        className="mb-10 w-full rounded-xl object-contain sm:hidden"
        priority={priority}
      />
      <div
        className="
          grid grid-cols-2 grid-rows-2
          items-center
          gap-y-1
          text-sm
          md:grid-cols-3
          md:grid-rows-1 md:text-base
        "
      >
        <div className="col-start-1 row-start-1 md:col-start-1 md:row-start-1">
          <h2>{font.content?.name}</h2>
        </div>
        <div className="col-start-2 row-start-1 md:col-start-2 md:row-start-1">
          <p>{font.content?.styles.length} styles</p>
        </div>
        {font.content.features && (
          <div
            className="
              col-start-2 row-start-2
              md:col-start-3 md:row-start-1
            "
          >
            <p>{font.content.features}</p>
          </div>
        )}
      </div>
    </Link>
  );
}
