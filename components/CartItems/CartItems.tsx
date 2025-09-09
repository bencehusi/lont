"use client";

import React, { useState } from "react";
import type { CartItem } from "@/@types/store";

interface CartItemWithPrice extends CartItem {
  price: number;
  name: string;
  price_id: string;
}

interface CartItemsProps {
  initialCartItems: CartItemWithPrice[];
}

export function CartItems({ initialCartItems }: CartItemsProps) {
  const [cartItems, setCartItems] =
    useState<CartItemWithPrice[]>(initialCartItems);

  function handleRemoveFromCart(price_id: string) {
    const updatedCart = cartItems.filter((item) => item.price_id !== price_id);
    setCartItems(updatedCart);

    // Update cookie
    const cartData = updatedCart.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));
    document.cookie = `cart=${JSON.stringify(cartData)}; path=/; max-age=${60 * 60 * 24 * 2}`;

    // Dispatch event to update floating cart button
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  }

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <>
      <ul>
        {cartItems.map((item) => (
          <li key={item.price_id} className="flex justify-between px-5 py-2">
            <div>
              <p>{item.name}</p>
              <button
                onClick={() => handleRemoveFromCart(item.price_id)}
                className="text-sm underline"
              >
                Remove
              </button>
            </div>
            <div className="shrink-0">{(item.price / 100).toFixed(2)} €</div>
          </li>
        ))}
      </ul>
      <hr className="my-4 border-b-2 border-t-0 border-black" />
      <div className="mb-8 flex justify-between px-5 py-2">
        <div className="font-bold">Total</div>
        <div>{(totalPrice / 100).toFixed(2)} €</div>
      </div>
      <div className="flex justify-between">
        <a href="/fonts">Continue shopping</a>
        <form action="/api/checkout-sessions" method="POST">
          {cartItems.map((item) => (
            <input
              key={item.price_id}
              type="hidden"
              name="lineItems"
              value={JSON.stringify({
                price: item.price_id,
                quantity: item.quantity,
              })}
            />
          ))}
          {cartItems.length === 0 ? (
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
    </>
  );
}
