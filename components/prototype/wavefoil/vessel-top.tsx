"use client";

import type { CSSProperties } from "react";
import styles from "./pages.module.css";

/**
 * The foil, drawn from the design's own paths so the wing can slide out of its
 * strut. The wing is scaled and its outline is drawn non-scaling, so it keeps
 * one weight whether the wing is out or in.
 */
const STRUT =
  "M85.525 6.51947L85.5252 60.5997C85.5252 64.1638 82.0079 66.6621 78.6426 65.4884L62.6932 59.9257C60.6138 59.2004 59.2208 57.2392 59.2208 55.037V10.2279C59.2208 7.82016 60.8805 5.73019 63.2257 5.1849L79.1749 1.47649C82.4214 0.721626 85.525 3.18636 85.525 6.51947Z";
const WING =
  "M3.54656 35.6079L1.10495 50.0417C0.534161 53.416 3.20078 56.4657 6.62105 56.3502L59.2215 54.5741L59.2215 10.5325L12.8643 24.9502C7.99849 26.4636 4.39647 30.5836 3.54656 35.6079Z";
/** Where the wing meets the strut, and so what it grows out of. */
const HINGE = 59.22;
/** How much of the wing still shows with the foil fully retracted. */
const WING_RETRACTED = 0.2;

const deployed: CSSProperties = {
  fill: "var(--base-blue-050, #e4eefd)",
  stroke: "var(--base-blue-400, #4271b3)",
  strokeWidth: 2,
};

const stowed: CSSProperties = {
  fill: "var(--base-categorical-050, #f0f0f0)",
  stroke: "var(--base-categorical-400, #6e6e6e)",
  strokeWidth: 2,
};

function Foil({ side, deployment }: { side: "port" | "stbd"; deployment: number }) {
  const scale = WING_RETRACTED + (1 - WING_RETRACTED) * (deployment / 100);
  // The accent colour is for foils that are out; stowed, they are grey.
  const paint = deployment > 0 ? deployed : stowed;
  return (
    <svg
      className={styles.foil}
      viewBox="0 0 86.5252 67.8889"
      style={{
        left: side === "port" ? 73 : 212.3,
        transform: side === "stbd" ? "scaleX(-1)" : undefined,
      }}
      aria-hidden="true"
    >
      <path
        d={WING}
        style={paint}
        vectorEffect="non-scaling-stroke"
        transform={`translate(${HINGE} 0) scale(${scale} 1) translate(${-HINGE} 0)`}
      />
      <path d={STRUT} style={paint} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/**
 * The vessel from above with a foil on each side. `deployment` is 0 with the
 * foils fully in and 100 with them fully out.
 */
export function VesselTop({
  deployment,
  dusk,
}: {
  deployment: number;
  dusk: boolean;
}) {
  return (
    <div className={styles.vesselWindow}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        src={`/prototype/wavefoil/vessel-top${dusk ? "-dusk" : ""}.svg`}
        width={372}
        height={329}
      />
      <Foil side="port" deployment={deployment} />
      <Foil side="stbd" deployment={deployment} />
    </div>
  );
}
