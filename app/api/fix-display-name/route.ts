import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

type Row = {
  Name?: string; // must match what you created earlier
  displayName?: string; // the field we want to add
  // other columns ignored here
};

function cleanText(s?: string) {
  return (s ?? "").toString().replace(/\s+/g, " ").trim();
}

async function fetchViaSearch(
  batchId: string,
  matchedProducts: Stripe.Product[],
) {
  let page: Stripe.ApiSearchResult<Stripe.Product> | null = null;
  do {
    page = await stripe.products.search({
      query: `metadata['batchId']:'${batchId}'`,
      limit: 100,
      page: page?.next_page ?? undefined,
    });
    matchedProducts.push(...page.data);
  } while (page.next_page);
}

async function fetchViaListFallback(
  batchId: string,
  matchedProducts: Stripe.Product[],
) {
  let starting_after: string | undefined;
  while (true) {
    const page = await stripe.products.list({ limit: 100, starting_after });
    const filtered = page.data.filter(
      (p) => (p.metadata as any)?.batchId === batchId,
    );
    matchedProducts.push(...filtered);
    if (!page.has_more) break;
    starting_after = page.data[page.data.length - 1].id;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const filename: string =
      body.filename ?? "LoNT Pricing Sheet - Pricing Sheet.csv";
    const batchId: string = body.batchId; // REQUIRED to target the correct import
    const updatePrice: boolean = Boolean(body.updatePrice); // also push displayName into default price metadata
    if (!batchId) {
      return NextResponse.json(
        { error: "Please provide { batchId } in the request body." },
        { status: 400 },
      );
    }

    // 1) Load CSV
    const filePath = path.join(process.cwd(), "public", filename);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: `CSV not found at /public/${filename}` },
        { status: 400 },
      );
    }
    const csvBuffer = fs.readFileSync(filePath);
    const rows = parse(csvBuffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Row[];

    // Build a map: name -> displayName (from CSV)
    const csvMap = new Map<string, string>();
    for (const r of rows) {
      const name = cleanText(r.Name);
      const displayName = cleanText(r.displayName);
      if (!name || !displayName) continue;
      csvMap.set(name, displayName);
    }

    // 2) Fetch products by batchId using Search API (faster), with fallback to list
    const matchedProducts: Stripe.Product[] = [];

    // Try search, fall back gracefully if not enabled
    try {
      await fetchViaSearch(batchId, matchedProducts);
    } catch {
      await fetchViaListFallback(batchId, matchedProducts);
    }

    // 3) Update products (and optionally their default price) with displayName
    const results: Array<{
      productId: string;
      name: string;
      updatedProduct: boolean;
      updatedPrice?: boolean;
      reason?: string;
    }> = [];

    for (const product of matchedProducts) {
      const name = cleanText(product.name);
      const displayName = csvMap.get(name);

      if (!displayName) {
        results.push({
          productId: product.id,
          name,
          updatedProduct: false,
          reason: "No matching displayName in CSV for this product name",
        });
        continue;
      }

      // Update product metadata (merge; Stripe overwrites provided keys)
      await stripe.products.update(product.id, {
        metadata: { ...(product.metadata ?? {}), displayName },
      });

      let updatedPrice = false;

      if (updatePrice) {
        // Optionally also add displayName to default price metadata
        const defaultPriceId =
          typeof product.default_price === "string"
            ? product.default_price
            : product.default_price?.id;

        if (defaultPriceId) {
          const price = await stripe.prices.retrieve(defaultPriceId);
          await stripe.prices.update(defaultPriceId, {
            metadata: { ...(price.metadata ?? {}), displayName },
          });
          updatedPrice = true;
        }
      }

      results.push({
        productId: product.id,
        name,
        updatedProduct: true,
        updatedPrice,
      });
    }

    return NextResponse.json({
      batchId,
      totalProductsFound: matchedProducts.length,
      updated: results.filter((r) => r.updatedProduct).length,
      results,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 },
    );
  }
}
