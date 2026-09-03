"use client";

import { useLayoutEffect } from "react";
import {
  applyTheme,
  currentTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/theme";

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      className="size-[18px]"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-[18px]"
      aria-hidden="true"
    >
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

export function ThemeToggle() {
  // React's Strict Mode remount in development resets the attributes on
  // <html> to the ones it manages from JSX, dropping the one the inline
  // script set. Re-applying before paint restores it; a no-op in production.
  useLayoutEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") applyTheme(stored);
    else applyTheme(currentTheme());
  }, []);

  function toggle() {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private browsing or blocked storage: still switch for this page view.
    }
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="-m-1.5 cursor-pointer rounded-md p-1.5 text-muted transition-colors hover:text-foreground"
    >
      <span className="theme-toggle-to-dark">
        <MoonIcon />
        <span className="sr-only">Switch to dark mode</span>
      </span>
      <span className="theme-toggle-to-light">
        <SunIcon />
        <span className="sr-only">Switch to light mode</span>
      </span>
    </button>
  );
}
