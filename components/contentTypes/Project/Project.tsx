import { GeneralBlokProps } from "@/@types/storyblok";
import { storyblokEditable, StoryblokComponent } from "@storyblok/react/rsc";

export function Project({ blok }: any) {
  return (
    <div
      {...storyblokEditable(blok)}
      className="mx-auto my-10 max-w-[680px] px-5"
    >
      <h1 className="mb-6 text-lg font-bold">{blok?.title}</h1>
      <div className="space-y-11 pb-6">
        {blok?.content?.map((nestedBlok: any) => (
          <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
        ))}
      </div>
    </div>
  );
}
