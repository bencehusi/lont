"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import cn from "classnames";

import type { CartItem } from "@/@types/store";

export function FloatingCartButton() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Get cart items from cookies
  useEffect(() => {
    setIsClient(true);
    const getCartItems = () => {
      try {
        const cartCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("cart="));

        if (cartCookie) {
          const cartData = JSON.parse(cartCookie.split("=")[1]);
          setCartItems(Array.isArray(cartData) ? cartData : []);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error("Error parsing cart data:", error);
        setCartItems([]);
      }
    };

    getCartItems();

    // Listen for storage changes (when cart is updated in other tabs)
    const handleStorageChange = () => {
      getCartItems();
    };

    // Listen for custom cart update events
    const handleCartUpdate = () => {
      getCartItems();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCartUpdate);

    // Poll for cart changes (fallback for same-tab updates)
    const interval = setInterval(getCartItems, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCartUpdate);
      clearInterval(interval);
    };
  }, []);

  // Calculate total items in cart
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Don't render on server side to avoid hydration mismatch
  if (!isClient) {
    return null;
  }

  // Don't render if cart is empty
  if (totalItems === 0) {
    return null;
  }

  return (
    <Link
      href="/cart"
      className={cn(
        "fixed z-50 flex h-14 w-14 items-center justify-center rounded-full border-2 border-black bg-[#F59797] transition-all duration-200 hover:scale-105",
        "md:right-4 md:top-4", // Medium screens and up: top right
        "bottom-4 right-4", // Small screens: bottom right
      )}
    >
      {/* Cart Icon */}
      <div className="relative">
        <Image
          src="/cart-icon.svg"
          alt="Cart"
          width={31}
          height={33}
          className="h-auto w-auto"
        />

        {/* Item Count Badge */}
        {totalItems > 0 && (
          <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
            {totalItems > 99 ? "99+" : totalItems}
          </div>
        )}
      </div>
    </Link>
  );
}
