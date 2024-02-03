import { storyblokEditable, StoryblokComponent } from "@storyblok/react/rsc";

export function Project({ blok }: any) {
  return (
    <main {...storyblokEditable(blok)} className="text-center mt-4">
      {blok?.body?.map((nestedBlok: any) => (
        <StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </main>
  )
};