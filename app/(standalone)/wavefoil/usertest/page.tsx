import type { Metadata, Viewport } from "next";
import { WavefoilUsertest } from "@/components/prototype/wavefoil/wavefoil-usertest";

export const metadata: Metadata = {
  title: "Wavefoil",
  // A link for user tests, not for the search results.
  robots: { index: false, follow: false },
  // Added to the home screen of an iPad it opens like an app, with no browser around it.
  manifest: "/wavefoil-usertest.webmanifest",
  appleWebApp: { capable: true, title: "Wavefoil", statusBarStyle: "black-translucent" },
  icons: { apple: "/wavefoil-icon-180.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Pinching or double-tapping would zoom the screen of a system that has no zoom.
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

/**
 * The prototype alone, for a user test on a tablet: shown at the size of a 10
 * inch bridge display, with nothing around it, and with the sea state kept out
 * of the participant's sight.
 */
export default function WavefoilUsertestPage() {
  return <WavefoilUsertest />;
}
