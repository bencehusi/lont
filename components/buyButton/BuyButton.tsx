"use client";

import cn from "classnames";
import { useState } from "react";
import { MdCheck } from "react-icons/md";

export interface StripeCartItem {
  price_id: string;
  quantity: number;
  name?: string;
  price?: number;
}

export function BuyButton({
  products,
  className,
  children,
}: {
  products: StripeCartItem[];
  className?: string;
  children?: React.ReactNode;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<StripeCartItem[]>(
    [],
  );
  const [addedToCart, setAddedToCart] = useState(false);

  function handleAddToCart() {
    /* Save to cookies and keep it for two days */
    const cart = selectedProducts.map((p) => ({
      price_id: p.price_id,
      quantity: p.quantity,
    }));
    document.cookie = `cart=${JSON.stringify(cart)}; max-age=${60 * 60 * 24 * 2}`;
    setAddedToCart(true);
  }
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-96 rounded-xl border-2 border-black bg-white p-4">
            <h2 className="mb-8 text-2xl font-bold">Choose your weights</h2>
            <ul className="mb-4">
              {products.map((product) => (
                <li
                  key={product.price_id}
                  className="border-b-2 border-black py-4"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3 className="pt-1">{product.name}</h3>
                    <p className="pt-1 font-bold">{product.price}€</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedProducts((prev) => {
                        const index = prev.findIndex(
                          (p) => p.price_id === product.price_id,
                        );
                        if (index === -1) {
                          return [...prev, product];
                        }
                        return prev.filter(
                          (p) => p.price_id !== product.price_id,
                        );
                      });
                    }}
                    className={cn(
                      "ml-auto flex items-center gap-2 rounded-xl border-2 border-black px-4 py-1",
                      selectedProducts.some(
                        (p) => p.price_id === product.price_id,
                      )
                        ? "bg-[#F59797]"
                        : "bg-white",
                    )}
                  >
                    {selectedProducts.some(
                      (p) => p.price_id === product.price_id,
                    ) ? (
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
            <p className="mb-4 text-right font-bold">
              Total:{" "}
              {selectedProducts.reduce((acc, p) => acc + (p.price ?? 0), 0)}€
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setModalOpen(false);
                  if (addedToCart) {
                    const cart = JSON.parse(
                      document.cookie.replace(
                        /(?:(?:^|.*;\s*)cart\s*\=\s*([^;]*).*$)|^.*$/,
                        "$1",
                      ) || "[]",
                    );
                    const updatedCart = cart.filter(
                      (cartItem: StripeCartItem) =>
                        !selectedProducts.some(
                          (selectedItem) =>
                            selectedItem.price_id === cartItem.price_id,
                        ),
                    );
                    document.cookie = `cart=${JSON.stringify(updatedCart)}; max-age=${60 * 60 * 24 * 2}`;
                    setAddedToCart(false);
                  }
                  setSelectedProducts([]);
                }}
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
                {addedToCart ? "Check out" : "Add to cart"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
