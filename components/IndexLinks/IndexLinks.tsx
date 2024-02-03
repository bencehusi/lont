import { fetchLinks } from "@/lib/storyblok";
import Link from "next/link";

export async function IndexLinks() {
  const response = await fetchLinks({
    version: process.env.SB_VERSION as "draft" | "published",
    starts_with: "projects/",
  });

  if (!response) return <></>;

  return (
    <>
      {Object.keys(response?.links).map((key) => (
        <li key={key} className="flex items-center space-x-2">
          <Link href={response.links[key].real_path}>
            {response.links[key].name}
          </Link>
        </li>
      ))}
    </>
  );
}
