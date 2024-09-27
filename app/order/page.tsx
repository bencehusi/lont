"use client";

import { PageProps } from "@/@types/common";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { MdCheck } from "react-icons/md";

export default function Order({ searchParams }: PageProps) {
  /* If canceled, redirect back to the cart */
  if (searchParams?.canceled) {
    redirect("/cart");
  }

  useEffect(() => {
    /* Clear the cart */
    document.cookie = "cart=; path=/; max-age=0";
  }, []);

  return (
    <div className="flex h-full grow flex-col justify-center rounded-xl border-2 border-black p-4 text-center sm:p-6">
      <div className="mb-10">
        <div className="inline-flex rounded-full border-2 border-black bg-[#F59797] p-3">
          <MdCheck className="mx-auto text-6xl" />
        </div>
      </div>
      <h1 className="mb-4 text-3xl font-bold">
        Your fonts are on their way to your inbox!
      </h1>
      <p className="mb-6">Keep an eye out for an email from us.</p>
      <p className="mb-8">
        <Link className="underline" href="/">
          Take a look at our projects!
        </Link>
      </p>
      <h2 className="mb-3 text-xl font-bold">
        Didn&apos;t receive your fonts?
      </h2>
      <p>
        Contact us at libraryofnarrativetypes[at]gmail.com and we&apos;ll help
        you out.
      </p>
    </div>
  );
}
