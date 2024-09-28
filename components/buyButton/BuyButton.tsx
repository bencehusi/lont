"use client";

import cn from "classnames";
import { useEffect, useState } from "react";
import { MdCheck, MdClose } from "react-icons/md";

import type { StripeProductWithPrice } from "@/@types/store";

import React, { forwardRef, useImperativeHandle } from "react";

export interface BuyButtonRef {
  openModal: () => void;
}

export const BuyButton = forwardRef<
  BuyButtonRef,
  {
    products: StripeProductWithPrice[];
    className?: string;
    children?: React.ReactNode;
    trials?: boolean;
  }
>(({ products, className, children, trials }, ref) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<
    StripeProductWithPrice[]
  >([]);
  const [addedToCart, setAddedToCart] = useState(false);

  if (trials) {
    products = products.filter((product) => product.metadata?.trial);
  } else {
    products = products.filter((product) => !product.metadata?.trial);
  }

  useImperativeHandle(ref, () => ({
    openModal() {
      setModalOpen(true);
    },
  }));

  function handleSelectFont(product: StripeProductWithPrice) {
    setSelectedProducts((prev) => {
      const index = prev.findIndex((p) => p.id === product.id);
      if (index === -1) {
        return [...prev, product];
      }
      return prev.filter((p) => p.id !== product.id);
    });
  }

  function handleAddToCart() {
    const cart = selectedProducts.map((p) => ({
      id: p.id,
      quantity: 1,
    }));
    document.cookie = `cart=${JSON.stringify(cart)}; path=/; max-age=${60 * 60 * 24 * 2}`;
    setAddedToCart(true);
    window.location.href = "/cart";
  }

  function dismissModal() {
    setModalOpen(false);
    if (addedToCart) {
      const cart = JSON.parse(
        document.cookie.replace(
          /(?:(?:^|.*;\s*)cart\s*\=\s*([^;]*).*$)|^.*$/,
          "$1",
        ) || "[]",
      );
      const updatedCart = cart.filter(
        (cartItem: StripeProductWithPrice) =>
          !selectedProducts.some(
            (selectedItem) => selectedItem.id === cartItem.id,
          ),
      );
      document.cookie = `cart=${JSON.stringify(updatedCart)}; max-age=${60 * 60 * 24 * 2}`;
      setAddedToCart(false);
    }
    setSelectedProducts([]);
  }

  /* Reset addedToCart if another font has been selected, so the selectedProducts has changed */
  useEffect(() => {
    setAddedToCart(false);
  }, [selectedProducts]);

  return (
    <>
      <button
        className={cn(
          "rounded-xl border-2 border-black bg-[#F59797] px-4 py-1 font-bold md:text-lg",
          className,
        )}
        onClick={() => setModalOpen(true)}
      >
        {children || "Buy"}
      </button>
      {modalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              dismissModal();
            }
          }}
        >
          <div className="relative flex max-h-[calc(100vh-48px)] w-full max-w-3xl flex-col rounded-xl border-2 border-black bg-white p-4">
            <button
              onClick={dismissModal}
              className="absolute right-0 top-0 p-2"
            >
              <MdClose size={32} />
            </button>
            <h2 className="mb-8 shrink-0 text-2xl font-bold">
              Choose your licences
            </h2>
            <ul className="mb-4 grow overflow-y-scroll">
              {products.map((product) => (
                <li key={product.id} className="border-b-2 border-black py-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="pt-1">{product.name}</h3>
                    <p className="pt-1 font-bold">
                      {(product.prices[0].unit_amount / 100).toFixed(2)}€
                    </p>
                  </div>
                  <button
                    onClick={() => handleSelectFont(product)}
                    className={cn(
                      "ml-auto flex items-center gap-2 rounded-xl border-2 border-black px-4 py-1",
                      selectedProducts.some((p) => p.id === product.id)
                        ? "bg-[#F59797]"
                        : "bg-white",
                    )}
                  >
                    {selectedProducts.some((p) => p.id === product.id) ? (
                      <>
                        <MdCheck className="shrink-0" /> Selected
                      </>
                    ) : (
                      "Select"
                    )}
                  </button>
                </li>
              ))}
            </ul>
            <div className="shrink-0">
              <p className="mb-4 text-right font-bold">
                Total:{" "}
                {(
                  selectedProducts.reduce(
                    (acc, p) => acc + (p.prices[0].unit_amount ?? 0),
                    0,
                  ) / 100
                ).toFixed(2)}
                €
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={dismissModal}
                  className="mt-8 rounded-xl border-2 border-black px-4 py-1 font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={selectedProducts.length === 0}
                  className={cn(
                    "mt-8 rounded-xl border-2 border-black px-4 py-1 font-bold",
                    {
                      "bg-[#F59797]": selectedProducts.length > 0,
                      "cursor-not-allowed bg-gray-300":
                        selectedProducts.length === 0,
                    },
                  )}
                >
                  Check out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

BuyButton.displayName = "BuyButton";
