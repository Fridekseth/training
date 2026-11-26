import type { Metadata, Viewport } from "next";
import { SecondScreenAppStage } from "@/components/prototype/second-screen/app/second-screen-app-stage";

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
  themeColor: "#004346",
};

/**
 * The second screen as an app for a phone: the home page, the systems to learn,
 * the notifications and the profile. The vessel motion instrument is at
 * /second-screen/gyro, and is to be connected to the app.
 */
export default function SecondScreenPage() {
  return <SecondScreenAppStage />;
}
