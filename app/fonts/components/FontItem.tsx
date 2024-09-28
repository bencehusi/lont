import Link from "next/link";
import { Story } from "@/@types/storyblok";
import Image from "next/image";

export function FontItem({ font }: { font: Story }) {
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
        layout="responsive"
        className="mb-10 hidden rounded-xl sm:block"
      />
      <Image
        src={font.content?.mobile_preview_image?.filename}
        alt={font.content?.preview_image?.alt}
        width={266}
        height={396}
        layout="responsive"
        className="mb-10 rounded-xl sm:hidden"
      />
      <div className="flex text-sm md:text-base">
        <div className="grow">
          <h2>{font.content?.name}</h2>
          <p className="capitalize">{font.content?.style}</p>
        </div>
        <div className="grow">
          <p>{font.content?.weights.length} weights</p>
          <p>{font.content.features}</p>
        </div>
      </div>
    </Link>
  );
}
