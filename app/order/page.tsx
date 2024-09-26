import { PageProps } from "@/@types/common";
import { NextPage } from "next";
import { redirect } from "next/navigation";

export default function Order({ searchParams }: PageProps) {
  /* If canceled, redirect back to the cart */
  if (searchParams?.canceled) {
    redirect("/cart");
  }

  return (
    <div className="h-full grow rounded-xl border-2 border-black">
      <h1>Order</h1>
      <p>{JSON.stringify(searchParams)}</p>
    </div>
  );
}
