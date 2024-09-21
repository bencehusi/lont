import type { Metadata } from "next";
import Link from "next/link";
import localFont from "next/font/local";

import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";

import "./globals.css";
import { StoryblokProvider } from "@/components/providers/StoryblokProvider";
import ExposeRouteWrapper from "@/components/helpers/ExposeRouteWrapper";
import { Project } from "@/components/contentTypes/Project";
import { RichText } from "@/components/bloks/RichText";
import { BlokImage } from "@/components/bloks/BlokImage";
import classNames from "classnames";

const nataliaMono = localFont({
  variable: "--brand-font",
  display: "swap",
  src: [
    {
      path: "../fonts/NataliaMono-Bold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/NataliaMono-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/NataliaMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

storyblokInit({
  accessToken: process.env.SB_TOKEN,
  use: [apiPlugin],
  components: {
    Project,
    RichText,
    BlokImage,
  },
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
        <body
          className={classNames(
            nataliaMono.variable,
            "flex h-screen w-screen flex-col -space-x-0.5 bg-spring-wood p-2.5 font-brand text-black lg:flex-row",
          )}
        >
          <Link
            href="/"
            className="order-1 -mb-0.5 flex shrink-0 items-center justify-center rounded-xl border-2 border-black py-4 lg:mb-0 lg:h-full lg:w-10 lg:-rotate-180 lg:justify-start lg:[writing-mode:vertical-rl]"
          >
            Library of Narrative Types
          </Link>
          <Link
            href="/fonts"
            className="order-3 hidden h-full w-10 shrink-0 -rotate-180 items-center rounded-xl border-2 border-black py-4 [writing-mode:vertical-rl] lg:flex"
          >
            Fonts
          </Link>
          <Link
            href="/shop"
            className="order-5 hidden h-full w-10 shrink-0 -rotate-180 items-center rounded-xl border-2 border-black py-4 [writing-mode:vertical-rl] lg:flex"
          >
            Shop
          </Link>
          <Link
            href="/colophon"
            className="order-7 hidden h-full w-10 shrink-0 -rotate-180 items-center rounded-xl border-2 border-black py-4 [writing-mode:vertical-rl] lg:flex"
          >
            Colophon
          </Link>
          <ExposeRouteWrapper>{children}</ExposeRouteWrapper>
        </body>
      </html>
    </StoryblokProvider>
  );
}
