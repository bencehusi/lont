import { cookies } from "next/headers";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

import type { CartItem, StripePrice, StripeProduct } from "@/@types/store";
import { CartItems } from "@/components/CartItems";

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
        <CartItems initialCartItems={cartWithPrices} />
      </div>
    </div>
  );
}
