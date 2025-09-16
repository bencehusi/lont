import { ResolvingMetadata } from "next";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

import { fetchStories } from "@/lib/storyblok";
import { extractImageDimensions } from "@/lib/storyblok/ExtractImageDimensions";
import FontContent from "./components/FontContent";
import { PageProps } from "@/@types/common";

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
    cv: Date.now(),
  });
  // Fetch all products in parallel (up to 1000, adjust as needed)
  // and fetch all prices in a single call, then join them in-memory for speed.

  // 1. Fetch all products (up to 1000, adjust as needed for your catalog size)
  let allProducts: any[] = [];
  let hasMore = true;
  let starting_after: string | undefined = undefined;
  let fetchCount = 0;
  const MAX_PRODUCTS = 1000; // hard limit to avoid timeouts

  while (hasMore && allProducts.length < MAX_PRODUCTS) {
    const res: Awaited<ReturnType<typeof stripe.products.list>> =
      await stripe.products.list({
        limit: 100,
        starting_after,
        active: true, // Only fetch active (non-archived) products
      });
    allProducts.push(...res.data);
    hasMore = res.has_more;
    if (res.data.length > 0) {
      starting_after = res.data[res.data.length - 1].id;
    } else {
      break;
    }
    fetchCount++;
    if (fetchCount > 10) break; // safety: don't loop forever
  }

  // 2. Fetch all prices in a single call (up to 1000, adjust as needed)
  let allPrices: any[] = [];
  hasMore = true;
  starting_after = undefined;
  fetchCount = 0;
  const MAX_PRICES = 1000;

  while (hasMore && allPrices.length < MAX_PRICES) {
    const res: Awaited<ReturnType<typeof stripe.prices.list>> =
      await stripe.prices.list({
        limit: 100,
        starting_after,
      });
    allPrices.push(...res.data);
    hasMore = res.has_more;
    if (res.data.length > 0) {
      starting_after = res.data[res.data.length - 1].id;
    } else {
      break;
    }
    fetchCount++;
    if (fetchCount > 10) break;
  }

  // 3. Attach prices to products in-memory
  const pricesByProductId: Record<string, any[]> = {};
  for (const price of allPrices) {
    if (!pricesByProductId[price.product]) {
      pricesByProductId[price.product] = [];
    }
    pricesByProductId[price.product].push(price);
  }
  for (const product of allProducts) {
    product.prices = pricesByProductId[product.id] || [];
  }

  const products = { data: allProducts };

  return <FontContent font={font as any} products={products.data} />;
}
