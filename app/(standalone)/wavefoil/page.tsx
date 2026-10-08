import type { Metadata } from "next";
import { WavefoilStandalone } from "@/components/prototype/wavefoil/wavefoil-standalone";

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
  return <WavefoilStandalone />;
}
