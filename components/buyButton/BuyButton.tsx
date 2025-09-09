"use client";

import cn from "classnames";
import React, {
  useEffect,
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { MdCheck, MdClose } from "react-icons/md";

import type { StripeProductWithPrice } from "@/@types/store";

export interface BuyButtonRef {
  openModal: () => void;
}

type LicenseTier = {
  id: string;
  label: string;
  value: string;
};

type FontStyle = {
  displayName: string;
  price: number;
  products: StripeProductWithPrice[];
};

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
  const [selectedDesktopTier, setSelectedDesktopTier] = useState<string>("");
  const [selectedWebTier, setSelectedWebTier] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [addedToCart, setAddedToCart] = useState(false);

  // Filter products based on trials
  const filteredProducts = useMemo(() => {
    if (trials) {
      return products.filter((product) => product.metadata?.trial);
    } else {
      return products.filter((product) => !product.metadata?.trial);
    }
  }, [products, trials]);

  // Define license tiers
  const desktopTiers: LicenseTier[] = useMemo(() => {
    // Collect unique desktop tiers from filteredProducts
    const tierSet = new Set<string>();
    filteredProducts.forEach((product) => {
      if (product.metadata?.license === "desktop" && product.metadata?.tier) {
        tierSet.add(product.metadata.tier);
      }
    });
    // Sort tiers in a human-friendly order if possible
    const sortedTiers = Array.from(tierSet).sort((a, b) => {
      // Try to sort by the first number in the tier string, fallback to string compare
      const numA = parseInt(a);
      const numB = parseInt(b);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b);
    });
    return sortedTiers.map((tier) => ({
      id: tier,
      label: `${tier} users`,
      value: tier,
    }));
  }, [filteredProducts]);

  const webTiers: LicenseTier[] = useMemo(() => {
    // Collect unique web tiers from filteredProducts
    const tierSet = new Set<string>();
    filteredProducts.forEach((product) => {
      if (product.metadata?.license === "web" && product.metadata?.tier) {
        tierSet.add(product.metadata.tier);
      }
    });
    // Sort tiers in a human-friendly order if possible
    const sortedTiers = Array.from(tierSet).sort((a, b) => {
      // Try to sort by the first number in the tier string, fallback to string compare
      const numA = parseInt(a);
      const numB = parseInt(b);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b);
    });
    return sortedTiers.map((tier) => ({
      id: tier,
      label: tier + " views/month",
      value: tier,
    }));
  }, [filteredProducts]);

  // Group products by displayName to create font styles
  const fontStyles: FontStyle[] = useMemo(() => {
    const styleMap = new Map<string, FontStyle>();

    filteredProducts.forEach((product) => {
      const displayName = product.metadata?.displayName;
      if (!displayName) return;

      if (!styleMap.has(displayName)) {
        styleMap.set(displayName, {
          displayName,
          price: product.prices[0]?.unit_amount || 0,
          products: [],
        });
      }

      styleMap.get(displayName)!.products.push(product);
    });

    // Helper to determine if a style is a family pack
    function isFamilyPack(displayName: string) {
      return /family/i.test(displayName);
    }

    // Helper to extract weight from displayName, fallback to Infinity for non-weighted (e.g. family packs)
    function getWeightValue(displayName: string) {
      // Try to extract a numeric weight (e.g. "Light 300", "Bold 700", etc)
      const weightMatch = displayName.match(/(\d{3,4})/);
      if (weightMatch) {
        return parseInt(weightMatch[1], 10);
      }
      // Try to map common weight names to numbers
      const name = displayName.toLowerCase();
      if (name.includes("thin")) return 100;
      if (name.includes("extralight") || name.includes("extra light"))
        return 200;
      if (name.includes("light")) return 300;
      if (name.includes("regular")) return 400;
      if (name.includes("medium")) return 500;
      if (name.includes("semibold") || name.includes("semi bold")) return 600;
      if (name.includes("bold")) return 700;
      if (name.includes("extrabold") || name.includes("extra bold")) return 800;
      if (name.includes("black")) return 900;
      // If it's a family pack, put it at the end
      if (isFamilyPack(displayName)) return Infinity;
      // Otherwise, fallback to 1000 to sort after weights but before family packs
      return 1000;
    }

    // Sort: first by weight (lightest to boldest), then family packs at the end
    return Array.from(styleMap.values()).sort((a, b) => {
      const aIsFamily = isFamilyPack(a.displayName);
      const bIsFamily = isFamilyPack(b.displayName);

      if (aIsFamily && !bIsFamily) return 1;
      if (!aIsFamily && bIsFamily) return -1;
      if (aIsFamily && bIsFamily)
        return a.displayName.localeCompare(b.displayName);

      // Both are not family packs, sort by weight value, then by name
      const aWeight = getWeightValue(a.displayName);
      const bWeight = getWeightValue(b.displayName);
      if (aWeight !== bWeight) return aWeight - bWeight;
      return a.displayName.localeCompare(b.displayName);
    });
  }, [filteredProducts]);

  // Calculate selected products based on current selections
  const selectedProducts = useMemo(() => {
    if (!selectedStyle) return [];

    const style = fontStyles.find((s) => s.displayName === selectedStyle);
    if (!style) return [];

    const products: StripeProductWithPrice[] = [];

    // Add desktop product if selected
    if (selectedDesktopTier) {
      const desktopProduct = style.products.find(
        (p) =>
          p.metadata?.license === "desktop" &&
          p.metadata?.tier === selectedDesktopTier,
      );
      if (desktopProduct) products.push(desktopProduct);
    }

    // Add web product if selected
    if (selectedWebTier) {
      const webProduct = style.products.find(
        (p) =>
          p.metadata?.license === "web" && p.metadata?.tier === selectedWebTier,
      );
      if (webProduct) products.push(webProduct);
    }

    return products;
  }, [selectedDesktopTier, selectedWebTier, selectedStyle, fontStyles]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    return selectedProducts.reduce((acc, product) => {
      return acc + (product.prices[0]?.unit_amount || 0);
    }, 0);
  }, [selectedProducts]);

  useImperativeHandle(ref, () => ({
    openModal() {
      setModalOpen(true);
    },
  }));

  function handleDesktopTierSelect(tier: string) {
    // Only allow one desktop tier selection at a time
    if (selectedDesktopTier === tier) {
      setSelectedDesktopTier(""); // Deselect if clicking the same tier
    } else {
      setSelectedDesktopTier(tier); // Select new tier
    }
  }

  function handleWebTierSelect(tier: string) {
    // Only allow one web tier selection at a time
    if (selectedWebTier === tier) {
      setSelectedWebTier(""); // Deselect if clicking the same tier
    } else {
      setSelectedWebTier(tier); // Select new tier
    }
  }

  function handleStyleSelect(style: string) {
    // Only allow one style selection at a time
    if (selectedStyle === style) {
      setSelectedStyle(""); // Deselect if clicking the same style
    } else {
      setSelectedStyle(style); // Select new style
    }
  }

  /**
   * Returns the calculated price for a given style based on the selected desktop and web tiers.
   * If neither tier is selected, returns null.
   */
  function getStylePrice(styleName: string): number | null {
    if (!selectedDesktopTier && !selectedWebTier) return null;

    const style = fontStyles.find((s) => s.displayName === styleName);
    if (!style) return null;

    let price = 0;

    if (selectedDesktopTier) {
      const desktopProduct = style.products.find(
        (p) =>
          p.metadata?.license === "desktop" &&
          p.metadata?.tier === selectedDesktopTier,
      );
      if (desktopProduct) {
        price += desktopProduct.prices[0]?.unit_amount || 0;
      }
    }

    if (selectedWebTier) {
      const webProduct = style.products.find(
        (p) =>
          p.metadata?.license === "web" && p.metadata?.tier === selectedWebTier,
      );
      if (webProduct) {
        price += webProduct.prices[0]?.unit_amount || 0;
      }
    }

    return price;
  }

  function handleAddToCart() {
    if (selectedProducts.length === 0) return;

    const cart = selectedProducts.map((p) => ({
      id: p.id,
      quantity: 1,
    }));
    document.cookie = `cart=${JSON.stringify(cart)}; path=/; max-age=${60 * 60 * 24 * 2}`;

    // Dispatch custom event to update floating cart button
    window.dispatchEvent(new CustomEvent("cartUpdated"));

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
        (cartItem: any) =>
          !selectedProducts.some(
            (selectedItem) => selectedItem.id === cartItem.id,
          ),
      );
      document.cookie = `cart=${JSON.stringify(updatedCart)}; max-age=${60 * 60 * 24 * 2}`;
      setAddedToCart(false);
    }
    setSelectedDesktopTier("");
    setSelectedWebTier("");
    setSelectedStyle("");
  }

  /* Reset addedToCart if selections change */
  useEffect(() => {
    setAddedToCart(false);
  }, [selectedDesktopTier, selectedWebTier, selectedStyle]);

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
          <div className="relative flex max-h-[calc(100vh-48px)] w-full max-w-4xl flex-col rounded-xl border-2 border-black bg-white p-6">
            <button
              onClick={dismissModal}
              className="absolute right-2 top-2 p-2"
            >
              <MdClose size={32} />
            </button>
            <h2 className="mb-8 shrink-0 text-2xl font-bold">
              Choose your licenses
            </h2>

            <div className="flex grow flex-col gap-6 md:flex-row">
              {/* Left Column - License Tiers */}
              <div className="flex grow flex-col gap-6 md:w-1/2 md:border-r-2 md:border-black md:pr-6">
                {/* Desktop Licenses */}
                <div>
                  <h3 className="mb-3 pb-2 pl-7 text-base font-bold">
                    Desktop
                  </h3>
                  <div className="space-y-2">
                    {desktopTiers.map((tier) => (
                      <label
                        key={tier.id}
                        className="flex cursor-pointer items-center gap-3 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedDesktopTier === tier.value}
                          onChange={() => handleDesktopTierSelect(tier.value)}
                          className="h-4 w-4 appearance-none rounded-full border-2 border-black checked:border-black checked:bg-black focus:outline-none"
                        />
                        <span>{tier.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Web Licenses */}
                <div>
                  <h3 className="mb-3 pb-2 pl-7 text-base font-bold">Web</h3>
                  <div className="space-y-2">
                    {webTiers.map((tier) => (
                      <label
                        key={tier.id}
                        className="flex cursor-pointer items-center gap-3 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedWebTier === tier.value}
                          onChange={() => handleWebTierSelect(tier.value)}
                          className="h-4 w-4 appearance-none rounded-full border-2 border-black checked:border-black checked:bg-black focus:outline-none"
                        />
                        <span>{tier.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="text-sm">
                  <p>Do you need a larger license?</p>
                  <p>
                    Do you need a different type of license, for example for an
                    app or a game? Please get in touch via e-mail.
                  </p>
                </div>
              </div>

              {/* Right Column - Styles */}
              <div className="flex grow flex-col md:w-1/2">
                <h3 className="mb-3 pb-2 pl-7 text-base font-bold">Styles</h3>
                <div className="mb-4 grow space-y-2">
                  {fontStyles.map((style) => (
                    <label
                      key={style.displayName}
                      className="flex cursor-pointer items-center justify-between gap-3 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedStyle === style.displayName}
                          onChange={() => handleStyleSelect(style.displayName)}
                          className="h-4 w-4 appearance-none rounded-full border-2 border-black checked:border-black checked:bg-black focus:outline-none"
                        />
                        <span>{style.displayName}</span>
                      </div>
                      {getStylePrice(style.displayName) !== null &&
                        getStylePrice(style.displayName) !== undefined && (
                          <span className="font-bold">
                            €
                            {(getStylePrice(style.displayName)! / 100).toFixed(
                              2,
                            )}
                          </span>
                        )}
                    </label>
                  ))}
                </div>

                {/* Total and Add to Cart */}
                <div className="shrink-0">
                  <div className="mb-4 text-right">
                    <span className="font-bold">Total: </span>
                    <span className="font-bold">
                      €{(totalPrice / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={dismissModal}
                      className="rounded-xl border-2 border-black px-4 py-1 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddToCart}
                      disabled={selectedProducts.length === 0}
                      className={cn(
                        "rounded-xl border-2 border-black px-4 py-1 font-bold",
                        {
                          "bg-[#F59797]": selectedProducts.length > 0,
                          "cursor-not-allowed bg-gray-300":
                            selectedProducts.length === 0,
                        },
                      )}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

BuyButton.displayName = "BuyButton";
