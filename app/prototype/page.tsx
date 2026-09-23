import type { Metadata } from "next";
import { PrototypeStage } from "@/components/prototype/prototype-stage";
import { ScaledFrame } from "@/components/prototype/scaled-frame";
import { PAGE_CONTAINER } from "@/lib/layout";

export const metadata: Metadata = {
  title: "Prototype",
  description:
    "A working prototype of training inside an interface built on the OpenBridge design system.",
};

export default function PrototypePage() {
  return (
    <div className={`${PAGE_CONTAINER} py-16`}>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Prototype
      </h1>
      <p className="mt-3 max-w-2xl text-[0.975rem] leading-7 text-muted">
        Training concepts tried out in a running interface, built with the
        OpenBridge web components so the prototype behaves like the real system
        rather than a picture of it.
      </p>

      {/* Drawn at the size it was designed at, then scaled to fit the column. */}
      <ScaledFrame
        width={1080}
        height={608}
        className="mt-8 rounded-lg border border-border shadow-sm"
      >
        <PrototypeStage syncHash />
      </ScaledFrame>
    </div>
  );
}
