"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { PAGE_CONTAINER } from "@/lib/layout";

const NAV = [
  { href: "/prototype", label: "Demo" },
  { href: "/blog", label: "Process" },
  { href: "/research", label: "Research" },
  { href: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 pt-3 pb-1 sm:pt-4">
      {/* The same container as the page content, so the pill lines up with it. */}
      <div className={PAGE_CONTAINER}>
        {/* A single pill, so the navigation reads as one object on the page. */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-full border border-accent/30 bg-accent-soft/80 px-4 py-2 backdrop-blur-sm sm:gap-x-6 sm:px-5">
          <Link
            href="/"
            className="group flex shrink-0 items-center"
            aria-label="Home"
          >
            <span
              aria-hidden
              className="size-6 bg-accent transition-transform group-hover:scale-110"
              style={{
                maskImage: "url(/prototype/icons/training.svg)",
                WebkitMaskImage: "url(/prototype/icons/training.svg)",
                maskSize: "contain",
                WebkitMaskSize: "contain",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
              }}
            />
          </Link>

          <nav className="flex flex-1 items-center justify-center gap-4 sm:gap-7">
            {NAV.map(({ href, label }) => {
              const active =
                pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`py-1 text-[0.8125rem] transition-colors sm:text-[0.95rem] ${
                    active
                      ? "font-medium text-accent"
                      : "text-foreground/80 hover:text-accent"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center text-accent">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
