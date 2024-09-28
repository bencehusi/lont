const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { PageProps } from "@/@types/common";
import Link from "next/link";
import { MdDownload } from "react-icons/md";

export default async function OrderId({ params }: PageProps) {
  /* This is the Stripe session ID */
  const { id } = params;
  let session;
  let lineItems;
  /* Get the Stripe session by this id */
  try {
    session = await stripe.checkout.sessions.retrieve(id);
    lineItems = await stripe.checkout.sessions.listLineItems(id);
    /* Get the products by product id from lineItems[n].price.product */
    for (let i = 0; i < lineItems.data.length; i++) {
      const product = await stripe.products.retrieve(
        lineItems.data[i].price.product as string,
      );
      /* Add the product to the lineItem */
      lineItems.data[i].product = product;
    }
  } catch (error) {
    console.error(error);
    return (
      <div className="h-full grow overflow-y-auto rounded-xl border-2 border-black px-4 py-10 sm:px-6 md:py-16">
        <div className="mx-auto max-w-lg">
          <h1 className="mb-2 text-xl font-bold md:text-3xl">
            Order not found
          </h1>
          <p className="mb-10">
            Please, contact us at{" "}
            <a href="mailto:libraryofnarrativetypes@gmail.com">
              libraryofnarrativetypes@gmail.com
            </a>{" "}
            for further assistance.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="h-full grow overflow-y-auto rounded-xl border-2 border-black px-4 py-10 sm:px-6 md:py-16">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-2 text-xl font-bold md:text-3xl">
          Download your fonts
        </h1>
        <p className="mb-10">
          Order reference:
          <span className="inline-block bg-[#F59797] px-2">
            {session.payment_intent || session.id}
          </span>
        </p>
        <h2 className="mb-6 text-xl font-bold">Products</h2>
        <ul className="mb-10">
          {lineItems.data.map((item: any) => (
            <li key={item.id} className="rounded-xl border-2 border-black">
              <div className="mb-4 px-4 pt-4">
                <div className="flex justify-between gap-3">
                  <h3 className="font-bold">{item.description}</h3>
                  <span className="shrink-0 font-bold">
                    €{item.price.unit_amount / 100}
                  </span>
                </div>
                <p className="text-sm">{item.product.description}</p>
              </div>
              <div className="flex justify-end">
                <Link
                  href={item.product.metadata.downloadUrl}
                  target="_blank"
                  className="-mb-0.5 -mr-0.5 inline-flex items-center gap-2 rounded-xl border-2 border-black bg-[#F59797] px-4 py-2"
                >
                  <MdDownload size={18} className="-mb-0.5" />
                  Download package
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
