import { cookies } from "next/headers";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

import type { CartItem, StripePrice, StripeProduct } from "@/@types/store";
import Link from "next/link";

export default async function Cart() {
  /* Read cart data from the cookies */
  const cookieStore = cookies();
  const cartCookie = cookieStore.get("cart");
  const cart: CartItem[] = cartCookie ? JSON.parse(cartCookie.value) : [];

  /* 
  - In the cart I have the products, like [{"id":"prod_QvF0gsLrrCzPd7","quantity":1}]
  - Retrieve the products and use the default_price to get the price for each product
  */
  const products = await stripe.products.list({
    limit: 100,
  });
  const prices = await stripe.prices.list({
    limit: 100,
  });

  const cartWithPrices = cart.map((item) => {
    const product = products.data.find((p: StripeProduct) => p.id === item.id);
    const price = prices.data.find(
      (p: StripePrice) => p.id === product.default_price,
    );
    return {
      ...item,
      price: price.unit_amount,
      name: product.name,
      price_id: price.id,
    };
  });

  return (
    <div className="h-full grow rounded-xl border-2 border-black">
      <div className="mx-auto my-10 max-w-[680px] px-5">
        {cartWithPrices.length === 0 ? (
          <h1 className="mb-8 font-bold">Your cart is empty.</h1>
        ) : (
          <h1 className="mb-8 font-bold">Finalize your order</h1>
        )}
        <ul>
          {cartWithPrices.map((item: any) => (
            <li key={item.price_id} className="flex justify-between px-5 py-2">
              <div>{item.name}</div>
              <div>{(item.price / 100).toFixed(2)} €</div>
            </li>
          ))}
        </ul>
        <hr className="my-4 border-b-2 border-t-0 border-black" />
        <div className="mb-8 flex justify-between px-5 py-2">
          <div className="font-bold">Total</div>
          <div>
            {(
              cartWithPrices.reduce((acc, item) => acc + item.price, 0) / 100
            ).toFixed(2)}{" "}
            €
          </div>
        </div>
        <div className="flex justify-between">
          <Link href="/fonts">Continue shopping</Link>
          <form action="/api/checkout-sessions" method="POST">
            {cartWithPrices.map((item) => (
              <input
                key={item.price_id}
                type="hidden"
                name="lineItems"
                value={JSON.stringify({
                  price_data: {
                    currency: "eur",
                    unit_amount: item.price,
                    product_data: {
                      name: `${item.name}`,
                      description: `Egyedi description`, // EZ fog látszani
                      metadata: {
                        family: "Egyedi family",
                        weight: "Egyedi weight",
                        style: "Egyedi style",
                        license: "Egyedi license",
                        tier: "Egyedi tier",
                        downloadUrl: "https://lont.vercel.app/",
                      },
                    },
                  },
                  quantity: item.quantity,
                })}
              />
            ))}
            {cartWithPrices.length === 0 ? (
              <div
                className="cursor-not-allowed select-none rounded-xl border-2 border-black bg-gray-200 px-4 py-1 text-center font-bold"
                aria-disabled="true"
                tabIndex={-1}
              >
                Proceed to checkout
              </div>
            ) : (
              <button
                type="submit"
                role="link"
                className="rounded-xl border-2 border-black bg-[#F59797] px-4 py-1 font-bold"
              >
                Proceed to checkout
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
