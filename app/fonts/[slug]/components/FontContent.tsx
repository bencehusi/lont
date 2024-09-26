"use client";

import { useRef, MutableRefObject } from "react";
import { StripeProductWithPrice } from "@/@types/store";
import { Story } from "@/@types/storyblok";

import { BlokImage } from "@/components/bloks/BlokImage";
import { RichText } from "@/components/bloks/RichText";
import { BuyButton } from "@/components/buyButton/BuyButton";

export default function FontContent({
  font,
  products,
}: {
  font: { story: Story };
  products: StripeProductWithPrice[];
}) {
  const buyButtonRef = useRef() as MutableRefObject<{
    openModal: () => void;
  } | null>;

  const handleOpenModal = () => {
    if (buyButtonRef.current) {
      buyButtonRef.current.openModal();
    }
  };

  return (
    <div className="h-full grow overflow-y-auto rounded-xl border-2 border-black">
      <div className="relative z-10 -mx-0.5 -mt-0.5 min-h-20 rounded-xl border-2 border-black bg-spring-wood pl-4 md:min-h-36">
        <div className="flex items-center justify-between">
          <h1 className="font-bold">
            {font.story?.content?.name}&nbsp;
            <span className="capitalize">{font.story?.content?.style}</span>
          </h1>
          <BuyButton
            products={products}
            className="-m-0.5 rounded-xl border-2 border-black bg-[#F59797] px-4 py-1 font-bold md:text-lg"
            ref={buyButtonRef}
          >
            Buy
          </BuyButton>
        </div>
      </div>
      {/* Header */}
      <div className="-mx-0.5 -mt-4">
        <BlokImage
          blok={{ image: font.story?.content?.cover_image }}
          className="max-h-[420px] rounded-xl border-2 border-black object-cover object-center"
        />
      </div>
      {font.story?.content?.weights.map((weight: any) => (
        <div
          key={weight.weight_text}
          className="-m-0.5 rounded-xl border-2 border-black px-4 py-2 pb-8 md:px-6"
        >
          <h2 className="mb-2">
            {font.story?.content?.name} {weight.weight_text}
          </h2>
          {weight.preview_image && (
            <BlokImage
              blok={{ image: weight.preview_image }}
              className="w-full"
            />
          )}
        </div>
      ))}
      <div className="max-w-[624px] space-y-8 px-4 py-3 md:px-6">
        {font.story?.content?.description && (
          <div>
            <p className="indent-5">About the typeface:</p>
            <RichText blok={font.story?.content?.description} />
          </div>
        )}
        <div>
          <h2 className="indent-5">Weights:</h2>
          <ul className="list-disc pl-4">
            {font.story?.content?.weights.map((weight: any) => (
              <li key={weight.weight_text}>{weight.weight_text}</li>
            ))}
          </ul>
        </div>
        {/* Weight */}
        <div>
          <h2 className="indent-5">Number of glyphs:</h2>
          <p>{font.story?.content?.number_of_glyphs}</p>
        </div>
        {/* Number of glyphs: */}
        <div>
          <h2 className="indent-5">File formats:</h2>
          <p>{font.story?.content?.file_formats}</p>
        </div>
        {/* File formats: */}
        <div>
          <h2 className="indent-5">Language support:</h2>
          <div className="relative">
            <input
              type="checkbox"
              id="toggle-language-support"
              className="peer hidden"
            />
            <p className="max-h-[150px] overflow-hidden peer-checked:max-h-none">
              {font.story?.content?.language_support}
            </p>
            <label
              htmlFor="toggle-language-support"
              className="absolute bottom-0 left-0 right-0 block cursor-pointer bg-gradient-to-t from-spring-wood to-transparent pt-20 text-center peer-checked:hidden"
            >
              See more
            </label>
            <label
              htmlFor="toggle-language-support"
              className="hidden cursor-pointer text-center peer-checked:block"
            >
              See less
            </label>
          </div>
        </div>
        {/* Language support: */}
        <div>
          <h2 className="indent-5">Design:</h2>
          <p>{font.story?.content?.design}</p>
        </div>
        {/* Design */}
        <div>
          <h2 className="indent-5">Year:</h2>
          <p>{font.story?.content?.year}</p>
        </div>
        {/* Year */}
        <div>
          <h2 className="indent-5">Mentoring:</h2>
          <p>{font.story?.content?.mentoring}</p>
        </div>
        {/* Mentoring */}
        <div>
          <h2 className="indent-5">Type specimen layout:</h2>
          <p>{font.story?.content?.type_specimen_layout}</p>
        </div>
        {/* Type specimen layout */}
        <div>
          <h2 className="indent-5">Cover image:</h2>
          <p>{font.story?.content?.cover_image_credits}</p>
        </div>
        {/* Cover image */}
        <div>
          <h2 className="indent-5">Thanks to:</h2>
          <div className="whitespace-pre-line">
            {font.story?.content?.thanks_to}
          </div>
        </div>
        {/* Thanks to */}
      </div>
      <div className="flex justify-center gap-4 pb-8 md:gap-12">
        <button
          onClick={handleOpenModal}
          className="rounded-xl border-2 border-black bg-[#F59797] px-4 py-1 font-bold md:text-lg"
        >
          Buy
        </button>
        <button className="rounded-xl border-2 border-black bg-[#F59797] px-4 py-1 font-bold md:text-lg">
          Trials
        </button>
        <a
          href="/specimen/LNT-Natalia-Mono-specimen.pdf"
          target="_blank"
          className="rounded-xl border-2 border-black bg-[#F59797] px-4 py-1 font-bold md:text-lg"
        >
          PDF Specimen
        </a>
      </div>
    </div>
  );
}
