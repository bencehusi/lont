// app/api/import-products/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

type Row = {
  Name?: string;
  weight?: string;
  style?: string;
  family?: string;
  displayName?: string;
  downloadUrl?: string;
  license?: string;
  unit?: string;
  tier?: string;
  price?: string; // e.g. "€60.00"
  "Random number"?: string; // ignored
};

function cleanText(s?: string) {
  return (s ?? "").replace(/\s+/g, " ").trim();
}

function cleanDownloadUrl(url: string) {
  return url.replace(/\s+\(/g, "(").trim();
}

function parseAmountToCents(raw: string): { amount: number; currency: string } {
  if (!raw) throw new Error("Missing price");

  // Detect currency (extend as needed)
  const currency = /€/.test(raw) ? "eur" : "eur";

  // Keep digits, comma, dot; drop everything else (including spaces and currency symbols)
  let s = raw.replace(/[^\d.,]/g, "");

  // If we have both separators, assume the LAST separator is the decimal mark,
  // and all earlier separators are thousands.
  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");
  if (lastComma !== -1 && lastDot !== -1) {
    const lastSepIndex = Math.max(lastComma, lastDot);
    const decSep = s[lastSepIndex];
    const thouSep = decSep === "," ? "." : ",";
    s = s.replace(new RegExp("\\" + thouSep, "g"), ""); // remove thousands sep
    if (decSep === ",") s = s.replace(",", "."); // normalize decimal to dot
  } else if (lastComma !== -1) {
    // Only comma present
    // If comma is exactly 3 from the end AND there are >3 digits before it,
    // treat it as thousands; otherwise decimal.
    if (s.length - lastComma === 4 && lastComma > 0) {
      s = s.replace(/,/g, "");
    } else {
      s = s.replace(",", ".");
    }
  } else {
    // Only dot present → assume dot is decimal OR thousands (parseFloat handles "1200" correctly anyway)
    // No change needed
  }

  const amountFloat = Number.parseFloat(s);
  if (!Number.isFinite(amountFloat)) {
    throw new Error(`Could not parse price: "${raw}"`);
  }
  return { amount: Math.round(amountFloat * 100), currency };
}

export async function POST(req: NextRequest) {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Product import is disabled in production." },
        { status: 403 },
      );
    }
    const body = await req.json().catch(() => ({}));
    // If your file name is different, pass it in the JSON body: { "filename": "myfile.csv" }
    const filename: string =
      body.filename ?? "LoNT Pricing Sheet - Pricing Sheet.csv";
    const dryRun: boolean = Boolean(body.dryRun);

    const batchId = `import_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}`;

    const filePath = path.join(process.cwd(), "public", filename);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: `CSV not found at /public/${filename}` },
        { status: 400 },
      );
    }

    const csvBuffer = fs.readFileSync(filePath);
    const records = parse(csvBuffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Row[];

    const results: any[] = [];

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const rawName = (row.Name ?? "").toString();
      const name = cleanText(rawName);
      if (!name) {
        results.push({ index: i, skipped: true, reason: "Missing Name" });
        continue;
      }

      if (!row.price) {
        results.push({
          index: i,
          name,
          skipped: true,
          reason: "Missing price",
        });
        continue;
      }

      const { amount, currency } = parseAmountToCents(row.price);

      // Human-friendly description from row fields
      const description = cleanText(
        [
          row.displayName || name.replace(/,?\s*Desktop License.*$/i, ""), // optional: fallback
          row.license,
          row.unit && row.tier ? `${row.unit} ${row.tier}` : undefined,
        ]
          .filter(Boolean)
          .join(" • "),
      );

      // We ignore "Random number" on purpose
      const metadata = Object.fromEntries(
        Object.entries({
          ...(row.weight ? { weight: row.weight } : {}),
          ...(row.style ? { style: row.style } : {}),
          ...(row.family ? { family: row.family } : {}),
          ...(row.downloadUrl
            ? { downloadUrl: cleanDownloadUrl(row.downloadUrl) }
            : {}),
          ...(row.license ? { license: row.license } : {}),
          ...(row.unit ? { unit: row.unit } : {}),
          ...(row.tier ? { tier: row.tier } : {}),
          ...(batchId ? { batchId } : {}),
          ...(row.displayName ? { displayName: row.displayName } : {}),
        }).map(([k, v]) => [k, cleanText(String(v))]),
      );

      // Idempotency to prevent accidental duplicates if you re-run
      const idemKey = crypto
        .createHash("sha256")
        .update(`${name}|${description}|${amount}|${currency}`)
        .digest("hex");

      if (dryRun) {
        results.push({
          index: i,
          preview: { name, description, amount, currency, metadata },
        });
        continue;
      }

      // Create a Price and inline-create the Product via product_data.
      // Stripe will automatically set this Price as the Product's default_price.
      const price = await stripe.prices.create(
        {
          currency,
          unit_amount: amount,
          product_data: {
            name,
            metadata,
          },
        },
        { idempotencyKey: idemKey },
      );

      results.push({
        index: i,
        productId:
          typeof price.product === "string" ? price.product : price.product.id,
        priceId: price.id,
        name,
        amount,
        currency,
      });
    }

    return NextResponse.json({ count: results.length, results });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 },
    );
  }
}
