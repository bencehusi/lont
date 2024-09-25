import { fetchStories } from "@/lib/storyblok";
import { FontItem } from "./components/FontItem";
import { Story } from "@/@types/storyblok";

export default async function Fonts() {
  const { stories: fonts } = await fetchStories({
    starts_with: "fonts",
  });
  return (
    <div className="h-full grow rounded-xl border-2 border-black">
      {fonts?.map((font: Story) => <FontItem key={font.id} font={font} />)}
    </div>
  );
}
