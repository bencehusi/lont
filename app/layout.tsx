import type { Metadata } from "next";
import Link from "next/link";
import { storyblokInit, apiPlugin } from '@storyblok/react/rsc';

import "./globals.css";
import { StoryblokProvider } from '@/components/providers/StoryblokProvider';
import ExposeRouteWrapper from "@/components/helpers/ExposeRouteWrapper";

storyblokInit({
  accessToken: process.env.SB_TOKEN,
  use: [apiPlugin]
});

export const metadata: Metadata = {
  title: "LoNT - Library of Narrative Types",
  description: "A library of narrative types",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoryblokProvider>
      <html lang="en">
        <body className="flex h-screen w-screen flex-col -space-x-0.5 bg-spring-wood p-2.5 text-black md:flex-row">
          <Link
            href="/"
            className="order-1 flex shrink-0 justify-center md:justify-start items-center rounded-xl border-2 border-black py-4 md:h-full md:w-10 md:-rotate-180 md:[writing-mode:vertical-rl]"
          >
            Library of Narrative Types
          </Link>
          <Link
            href="/fonts"
            className="order-3 hidden h-full w-10 shrink-0 -rotate-180 items-center rounded-xl border-2 border-black py-4 [writing-mode:vertical-rl] md:flex"
          >
            Fonts
          </Link>
          <Link
            href="/shop"
            className="order-5 hidden h-full w-10 shrink-0 -rotate-180 items-center rounded-xl border-2 border-black py-4 [writing-mode:vertical-rl] md:flex"
          >
            Shop
          </Link>
          <Link
            href="/colophon"
            className="order-7 hidden h-full w-10 shrink-0 -rotate-180 items-center rounded-xl border-2 border-black py-4 [writing-mode:vertical-rl] md:flex"
          >
            Colophon
          </Link>
          <ExposeRouteWrapper>{children}</ExposeRouteWrapper>
        </body>
      </html>
    </StoryblokProvider>
  );
}
