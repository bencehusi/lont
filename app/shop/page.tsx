import Link from "next/link";

/* Metadata */
export const metadata = {
  title: "Shop | Library of Narrative Types",
  description: "Coming soon. Be sure to check back later.",
};

export default function Fonts() {
  return (
    <div className="-mt-0.5 h-full grow overflow-y-auto rounded-xl border-2 border-black px-4 py-10 sm:px-6 md:py-16 lg:mt-0">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-xl font-bold md:text-3xl">Shop</h1>
        <p className="mb-8">Coming soon. Be sure to check back later.</p>
        <p className="mb-3">We have other pages you can visit:</p>
        <ul>
          <li>
            <Link className="underline" href="/fonts">
              Fonts
            </Link>
          </li>
          <li>
            <Link className="underline" href="/">
              Projects
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
