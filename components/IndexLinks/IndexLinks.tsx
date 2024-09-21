import { fetchLinks } from "@/lib/storyblok";
import Link from "next/link";
import cn from "classnames";

export async function IndexLinks({ className }: { className?: string }) {
  const response = await fetchLinks({
    version: process.env.SB_VERSION as "draft" | "published",
    starts_with: "projects/",
  });

  if (!response) return <div></div>;

  return (
    <ul
      className={cn(
        "space-y-2 rounded-xl border-2 border-black px-5 py-2",
        className,
      )}
    >
      {Object.keys(response?.links).map((key) => (
        <li key={key} className="flex items-center space-x-2 font-bold">
          <Link href={response.links[key].real_path}>
            {response.links[key].name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
