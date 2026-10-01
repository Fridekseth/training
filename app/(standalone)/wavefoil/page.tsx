import type { Metadata } from "next";
import { WavefoilStage } from "@/components/prototype/wavefoil/wavefoil-stage";

export const metadata: Metadata = {
  title: "Wavefoil",
  // A link for user tests, not for the search results.
  robots: { index: false, follow: false },
};

/**
 * The prototype alone, at the size it was designed at, in the middle of the
 * window. It is not scaled to fit: the wave chart measures its container and
 * draws wrongly inside a scaled one. The browser's own zoom does enlarge it
 * correctly, because there the layout itself is bigger.
 */
export default function WavefoilPage() {
  return (
    <div className="flex min-h-full items-center justify-center">
      <div style={{ width: 786, height: 590, flexShrink: 0 }}>
        <WavefoilStage />
      </div>
    </div>
  );
}
