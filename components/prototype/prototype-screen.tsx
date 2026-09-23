"use client";

/**
 * The prototype itself: OpenBridge web components rendered through their React
 * wrappers. Loaded only in the browser (see prototype-stage.tsx), because the
 * underlying Lit elements register custom elements against `window` on import.
 *
 * The palette lives in the library's own stylesheet. Importing it here keeps
 * those 600 kB of design tokens on this route instead of the whole site.
 */
import "@oicl/openbridge-webcomponents/dist/openbridge.css";
import { TrainingApp, type Layer, type Variant } from "./training-app";
import type { PageId } from "./training-data";

export default function PrototypeScreen({
  variant,
  initialPage,
  initialLayer,
  syncHash,
}: {
  variant?: Variant;
  initialPage?: PageId;
  initialLayer?: Layer;
  syncHash?: boolean;
}) {
  return (
    <TrainingApp
      variant={variant}
      initialPage={initialPage}
      initialLayer={initialLayer}
      syncHash={syncHash}
    />
  );
}
