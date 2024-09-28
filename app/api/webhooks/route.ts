import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

import { SendOrderConfirmation } from "@/lib/sendgrid";

/* Define a custom type that extends LineItem */
type LineItemWithProduct = Stripe.LineItem & { product?: Stripe.Product };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

const buffer = async (req: NextRequest): Promise<Buffer> => {
  const chunks: Uint8Array[] = [];
  const reader = req.body?.getReader();

  if (!reader) {
    throw new Error("Request body is not readable");
  }

  let done = false;
  while (!done) {
    const { value, done: readerDone } = await reader.read();
    if (value) {
      chunks.push(value);
    }
    done = readerDone;
  }

  return Buffer.concat(chunks);
};

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET environment variable");
  }
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    const body = await buffer(req);
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    if (err instanceof Error) {
      console.log(`❌ Error message: ${err.message}`);
    } else {
      console.log(`❌ Unknown error: ${err}`);
    }
    return NextResponse.json(
      {
        error: `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`,
      },
      { status: 400 },
    );
  }

  console.log("✅ Success:", event.id);

  if (event.type === "payment_intent.succeeded") {
    const stripeObject: Stripe.PaymentIntent = event.data
      .object as Stripe.PaymentIntent;
    console.log(`💰 PaymentIntent status: ${stripeObject.status}`);
  } else if (event.type === "charge.succeeded") {
    const charge = event.data.object as Stripe.Charge;
    console.log(`💵 Charge id: ${charge.id}`);
  } else if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(`🛒 Checkout session: ${session.id}`);
    // Retrieve line items
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    /* Get the products by product id from lineItems[n].price.product */
    for (let i = 0; i < lineItems.data.length; i++) {
      const product = await stripe.products.retrieve(
        lineItems?.data[i]?.price?.product as string,
      );
      /* Add the product to the lineItem */
      (lineItems.data[i] as LineItemWithProduct).product = product;
    }
    const session_id = session.id;
    const email = session.customer_details?.email;
    const customer_name = session.customer_details?.name;
    const order_number = session.payment_intent;
    const purchase_date = new Date(session.created * 1000).toLocaleDateString();
    const purchased_products = lineItems.data.map((item) => item.description);
    /* Download link are in metadata metadata: { downloadUrl: 'https://lont.vercel.app/' }, */
    const download_links = lineItems.data.map((item: LineItemWithProduct) => ({
      font_name: item.description,
      link: item.product?.metadata?.downloadUrl,
    }));
    try {
      await SendOrderConfirmation({
        session_id: session_id as string,
        email: email as string,
        customer_name: customer_name as string,
        order_number: order_number as string,
        purchase_date: purchase_date as string,
        purchased_products: purchased_products as string[],
        download_links: download_links as { font_name: string; link: string }[],
      });

      console.log(`📧 Order confirmation sent to ${email}`);
    } catch (error) {
      console.error(error);
      console.error(
        `[SEND ERROR] Email not sent for order ${order_number} to ${email}.`,
      );
    }
  } else {
    console.warn(`🔔 Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
