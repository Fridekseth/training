"use client";

import { useState } from "react";
import { DemoShortcuts } from "../../demo-shortcuts";

/** Where the shortcuts take the frame: pages of the app. */
const SHORTCUTS = [
  ["/second-screen?device", "Homepage"],
  ["/second-screen?device&page=sync", "Sync"],
  ["/second-screen?device&page=window", "Wavefoil window component"],
  ["/second-screen?device&page=gyro", "Wavefoil pitch-roll-heave component"],
] as const;

/**
 * The second screen app in a phone shaped frame on the demo page, with shortcuts
 * beside it. It is the app itself on its own page, so it runs as it does on a
 * phone: its own viewport, and the palette of the library set only inside it.
 *
 * The size of the frame is set here in styles of its own, and not by classes, so
 * the iframe never falls back to the browser's small default size.
 */
export function SecondScreenDemo() {
  const [src, setSrc] = useState<(typeof SHORTCUTS)[number][0]>(SHORTCUTS[0][0]);

  return (
    <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "20px 32px" }}>
      <div
        style={{
          width: 392,
          maxWidth: "100%",
          height: 760,
          overflow: "hidden",
          border: "6px solid #1f1f1f",
          borderRadius: 40,
          background: "#000",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.18)",
        }}
      >
        <iframe
          key={src}
          src={src}
          title="The second screen app"
          loading="lazy"
          style={{ display: "block", width: "100%", height: "100%", border: 0 }}
        />
      </div>
      <DemoShortcuts items={SHORTCUTS} active={src} onPick={setSrc} />
    </div>
  );
}
