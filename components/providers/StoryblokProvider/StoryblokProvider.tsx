/** 1. Tag it as client component */
'use client';
import { storyblokInit, apiPlugin } from '@storyblok/react/rsc';

/** 2. Import your components */
import { Project } from '@/components/contentTypes/Project';

/** 3. Initialize it as usual */
storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
    components: {
      Project
    }
});

export function StoryblokProvider({ children }: { children: React.ReactNode }) {
    return children;
}