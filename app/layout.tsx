import type { Metadata } from "next";
import Link from "next/link";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";

import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";

import "./globals.css";
import { StoryblokProvider } from "@/components/providers/StoryblokProvider";
import ExposeRouteWrapper from "@/components/helpers/ExposeRouteWrapper";
import { FloatingCartButton } from "@/components/FloatingCartButton";
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
        {/* favicon favicon-frame-1.svg */}
        <head>
          <GoogleAnalytics gaId="G-43RR0TW1RJ" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link
            id="favicon"
            rel="icon"
            type="image/svg+xml"
            href="/favicon-frame-1.svg"
            sizes="any"
          />
          <link rel="mask-icon" href="/favicon-frame-1.svg" color="#000000" />
          <link rel="apple-touch-icon" href="/favicon-frame-1.svg" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.onload = function() {
            let faviconIndex = 0;
            var favicon = document.getElementById('favicon');
            setInterval(function() {
                    favicon.href = '/favicon-frame-' + (faviconIndex + 1) + ".svg";
                    faviconIndex++;
                    faviconIndex %= 4;
              }, 1000);
            };`,
            }}
          />
          <title>LoNT - Library of Narrative Types</title>
        </head>
        <body
          className={classNames(
            nataliaMono.variable,
            "flex h-screen w-screen flex-col -space-x-0.5 bg-spring-wood p-2.5 font-brand text-black lg:flex-row",
          )}
        >
          <div className="order-1 flex shrink-0 items-center justify-center gap-8 rounded-xl border-2 border-black px-4 py-4 font-bold md:px-0 lg:mb-0 lg:h-full lg:w-10 lg:-rotate-180 lg:justify-start lg:[writing-mode:vertical-rl]">
            <Link className="grow" href="/">
              Library of Narrative Types
            </Link>
            <label
              htmlFor="colophon-index-toggle"
              className="space-y-1.5 px-2 md:hidden"
            >
              <span className="mx-auto block w-8 border-t border-black" />
              <span className="mx-auto block w-8 border-t border-black" />
              <span className="mx-auto block w-8 border-t border-black" />
            </label>
          </div>
          <Link
            href="/fonts"
            className="order-3 hidden h-full w-10 shrink-0 -rotate-180 items-center rounded-xl border-2 border-black py-4 font-bold [writing-mode:vertical-rl] lg:flex"
          >
            Fonts
          </Link>
          <Link
            href="/shop"
            className="order-5 hidden h-full w-10 shrink-0 -rotate-180 items-center rounded-xl border-2 border-black py-4 font-bold [writing-mode:vertical-rl] lg:flex"
          >
            Shop
          </Link>
          <Link
            href="/colophon"
            className="order-7 hidden h-full w-10 shrink-0 -rotate-180 items-center rounded-xl border-2 border-black py-4 font-bold [writing-mode:vertical-rl] lg:flex"
          >
            Colophon
          </Link>
          <ExposeRouteWrapper>{children}</ExposeRouteWrapper>
          <input
            type="checkbox"
            className="peer hidden"
            id="colophon-index-toggle"
          />
          <ul className="absolute left-2.5 right-2.5 top-[72px] z-10 -mt-1 hidden grow space-y-2 overflow-y-auto rounded-xl border-2 border-black bg-spring-wood-50 px-5 py-2 peer-checked:block">
            <li className="flex items-center space-x-2 font-bold">
              <a href="/">Projects</a>
            </li>
            <li className="flex items-center space-x-2 font-bold">
              <a href="/fonts">Fonts</a>
            </li>
            <li className="flex items-center space-x-2 font-bold">
              <a href="/shop">Shop</a>
            </li>
            <li className="flex items-center space-x-2 font-bold">
              <a href="/colophon">Colophon</a>
            </li>
          </ul>
          <FloatingCartButton />
        </body>
      </html>
    </StoryblokProvider>
  );
}
