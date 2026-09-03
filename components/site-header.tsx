"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/blog", label: "Process" },
  { href: "/research", label: "Research" },
  { href: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-2 px-4 sm:gap-6 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span
            aria-hidden
            className="size-2 rounded-full bg-accent transition-transform group-hover:scale-125"
          />
          <span className="text-[0.8125rem] font-semibold tracking-tight whitespace-nowrap text-foreground sm:text-sm">
            Training in OpenBridge
          </span>
        </Link>

        <nav className="flex shrink-0 items-center gap-4 sm:gap-5">
          {NAV.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`py-1.5 text-[0.8125rem] transition-colors sm:text-sm ${
                  active
                    ? "font-medium text-accent"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
