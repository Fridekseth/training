export const THEME_STORAGE_KEY = "theme";

export type Theme = "light" | "dark";

/**
 * Runs in `<head>` before the browser paints, so the stored theme is applied
 * without a flash of the wrong palette. Kept as ES5-ish source with no
 * dependencies because it is inlined verbatim into the document.
 *
 * With nothing stored we resolve the system preference and write it out, so
 * the attribute is always present and CSS never has to guess.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");var t=s==="light"||s==="dark"?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

/** The theme the document is currently showing. */
export function currentTheme(): Theme {
  if (document.documentElement.dataset.theme === "dark") return "dark";
  if (document.documentElement.dataset.theme === "light") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
}
