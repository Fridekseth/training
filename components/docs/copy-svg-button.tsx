"use client";

import { useEffect, useRef, useState } from "react";

/** Copies through a hidden text field. It works in the click itself, in every browser. */
function copyWithTextarea(text: string) {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.top = "0";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  area.remove();
  return ok;
}

/**
 * Copies an SVG file's code to the clipboard, so it can be pasted straight into Figma or code.
 * The code is fetched when the button appears, so the copy happens right in the click: browsers
 * like Safari refuse a copy that waits for the network first.
 */
export function CopySvgButton({ src, name }: { src: string; name: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const code = useRef<string | null>(null);

  useEffect(() => {
    let live = true;
    fetch(src)
      .then((r) => r.text())
      .then((text) => {
        if (live) code.current = text;
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [src]);

  function show(ok: boolean) {
    setState(ok ? "copied" : "failed");
    setTimeout(() => setState("idle"), 1600);
  }

  function copy() {
    const text = code.current;
    if (text) {
      if (copyWithTextarea(text)) return show(true);
      navigator.clipboard?.writeText(text).then(() => show(true), () => show(false));
      return;
    }
    // Not fetched yet: hand the clipboard a promise of the code, which it accepts in the click.
    try {
      const blob = fetch(src)
        .then((r) => r.text())
        .then((t) => new Blob([t], { type: "text/plain" }));
      navigator.clipboard
        .write([new ClipboardItem({ "text/plain": blob })])
        .then(() => show(true), () => show(false));
    } catch {
      show(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 rounded-md border border-border bg-surface px-2 py-0.5 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent"
      aria-label={`Copy ${name} as SVG`}
    >
      {state === "copied" ? "Copied" : state === "failed" ? "Failed" : "Copy SVG"}
    </button>
  );
}
