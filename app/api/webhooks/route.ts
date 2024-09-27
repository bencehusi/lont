import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

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
  const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    const body = await buffer(req);
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.log(`❌ Error message: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  console.log("✅ Success:", event.id);

  if (event.type === "payment_intent.succeeded") {
    const stripeObject: Stripe.PaymentIntent = event.data
      .object as Stripe.PaymentIntent;
    console.log(`💰 PaymentIntent status: ${stripeObject.status}`, event.data);
  } else if (event.type === "charge.succeeded") {
    const charge = event.data.object as Stripe.Charge;
    console.log(`💵 Charge id: ${charge.id}`, event.data);
  } else if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log(`🛒 Checkout session: ${session.id}`, event.data);
    // Retrieve line items
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    console.log("📦 Line items:", lineItems);
  } else {
    console.warn(`🔔 Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
