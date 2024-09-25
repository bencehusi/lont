import { IndexLinks } from "@/components/IndexLinks";
import { fetchStories } from "@/lib/storyblok";
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
    </div>
  );
}
