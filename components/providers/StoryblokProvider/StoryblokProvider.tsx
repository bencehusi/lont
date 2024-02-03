/** 1. Tag it as client component */
"use client";
import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";

/** 2. Import your components */
import { Project } from "@/components/contentTypes/Project";
import { RichText } from "@/components/bloks/RichText";
import { BlokImage } from "@/components/bloks/BlokImage";

/** 3. Initialize it as usual */
storyblokInit({
  accessToken: process.env.SB_TOKEN,
  use: [apiPlugin],
  components: {
    Project,
    RichText,
    BlokImage,
  },
});

export function StoryblokProvider({ children }: { children: React.ReactNode }) {
  return children;
}
