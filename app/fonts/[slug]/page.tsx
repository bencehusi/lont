import { ResolvingMetadata } from "next";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

import { PageProps } from "@/.next/types/app/layout";
import { fetchStories } from "@/lib/storyblok";
import { extractImageDimensions } from "@/lib/storyblok/ExtractImageDimensions";
import FontContent from "./components/FontContent";

export async function generateMetadata(
  { params, searchParams }: PageProps,
  parent: ResolvingMetadata,
) {
  const parentMetadata = await parent;
  const { slug } = params;
  const font = await fetchStories({
    slug: [`fonts/${slug}`],
  });
  const coverImage = font.story?.content?.cover;
  const { width, height } = extractImageDimensions(coverImage?.filename);
  const coverImageAlt = coverImage?.alt;
  return {
    title: `${font.story?.content?.seo.title} | ${parentMetadata.title?.absolute}`,
    description: font.story?.content?.seo.description,
    openGraph: {
      title: `${font.story?.content?.seo.title} | ${parentMetadata.title?.absolute}`,
      description: font.story?.content?.seo.description,
      type: "website",
      locale: "en_US",
      siteName: "LoNT - Library of Narrative Types",
      images: [
        {
          url: coverImage?.filename,
          width,
          height,
          alt: coverImageAlt,
        },
      ],
    },
  };
}

export default async function FontPage({ params }: PageProps) {
  const { slug } = params;
  const font = await fetchStories({
    slug: [`fonts/${slug}`],
  });
  const products = await stripe.products.list({
    limit: 100,
  });
  /* Create a looop and check if products.has_more, fetch more products */
  if (products.has_more) {
    while (products.has_more) {
      const moreProducts = await stripe.products.list({
        limit: 100,
        starting_after: products.data[products.data.length - 1].id,
      });
      products.data.push(...moreProducts.data);
      products.has_more = moreProducts.has_more;
    }
  }
  /* Enrich the products with their prices by the default_price field */
  for (let i = 0; i < products.data.length; i++) {
    const prices = await stripe.prices.list({
      product: products.data[i].id,
      limit: 100,
    });
    products.data[i].prices = prices.data;
  }

  return <FontContent font={font as any} products={products.data} />;
}
