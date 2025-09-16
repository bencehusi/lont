const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const lineItemsData = body.getAll("lineItems");
    let line_items;

    try {
      if (Array.isArray(lineItemsData)) {
        line_items = lineItemsData.map((item) => JSON.parse(item as string));
      } else {
        line_items = [JSON.parse(lineItemsData as string)];
      }
    } catch (error) {
      throw new Error("Invalid line items format");
    }

    console.log("line_items", line_items);
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${req.nextUrl.origin}/order?success=true`,
      cancel_url: `${req.nextUrl.origin}/order?canceled=true`,
      automatic_tax: { enabled: true },
      billing_address_collection: "required",
      payment_method_types: ["card", "ideal"],
      customer_creation: "always",
      invoice_creation: { enabled: true },
      tax_id_collection: { enabled: true },
    });
    return NextResponse.redirect(session.url, 303);
  } catch (err: any) {
    console.error(err);
    return new NextResponse(JSON.stringify({ error: err.message }), {
      status: err.statusCode || 500,
    });
  }
}
