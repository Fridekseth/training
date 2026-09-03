"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { href: "/blog", label: "Process" },
  { href: "/research", label: "Research" },
  { href: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-4 gap-y-1.5 px-4 py-3 sm:h-14 sm:flex-nowrap sm:gap-x-6 sm:px-6 sm:py-0">
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

          <span aria-hidden className="h-4 w-px bg-border" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
