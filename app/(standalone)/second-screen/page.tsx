import type { Metadata, Viewport } from "next";
import { SecondScreenStage } from "@/components/prototype/second-screen/second-screen-stage";

export const metadata: Metadata = {
  title: "Second screen",
  // A link for trying on a phone, not for the search results.
  robots: { index: false, follow: false },
};

// Fills the phone's screen, and does not zoom when the screen is dragged on.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#e2f2f3",
};

/**
 * The second-screen prototype alone, at the size of a phone. The pitch, roll
 * and heave instrument follows the motion of the phone, or a drag on the screen
 * where the phone has no sensors.
 */
export default function SecondScreenPage() {
  return <SecondScreenStage />;
}
