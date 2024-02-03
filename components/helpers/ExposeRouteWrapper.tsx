"use client";
import cn from "classnames";
import { usePathname } from "next/navigation";

export default function ExposeRouteWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  return (
    <main
      className={cn(
        "grow overflow-y-auto",
        pathName === "/" || (pathName.startsWith("/projects") && "order-2"),
        pathName.startsWith("/fonts") && "order-4",
        pathName.startsWith("/shop") && "order-6",
        pathName.startsWith("/colophon") && "order-8",
      )}
    >
      {children}
    </main>
  );
}
