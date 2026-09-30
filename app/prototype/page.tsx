import type { Metadata } from "next";
import { PrototypeStage } from "@/components/prototype/prototype-stage";
import { ScaledFrame } from "@/components/prototype/scaled-frame";
import { WavefoilStage } from "@/components/prototype/wavefoil/wavefoil-stage";
import { PAGE_CONTAINER } from "@/lib/layout";

export const metadata: Metadata = {
  title: "Prototype",
  description:
    "Working prototypes of training inside interfaces built on the OpenBridge design system.",
};

export default function PrototypePage() {
  return (
    <div className={`${PAGE_CONTAINER} py-16`}>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Prototypes
      </h1>
      <p className="mt-3 max-w-2xl text-[0.975rem] leading-7 text-muted">
        Concepts tried out in running interfaces, built with the OpenBridge web
        components so a prototype behaves like the real system rather than a
        picture of it.
      </p>

      <section className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Training in a factory monitoring interface
        </h2>
        <p className="mt-2 max-w-2xl text-[0.95rem] leading-7 text-muted">
          Move the pointer to the edge of the screen for the menu, then open
          Training to reach the run-through.
        </p>

        {/* Drawn at the size it was designed at, then scaled to fit the column. */}
        <ScaledFrame
          width={1080}
          height={608}
          className="mt-5 rounded-lg border border-border shadow-sm"
        >
          <PrototypeStage syncHash />
        </ScaledFrame>
      </section>

      <section className="mt-16">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Wavefoil control
        </h2>
        <p className="mt-2 max-w-2xl text-[0.95rem] leading-7 text-muted">
          The screen that deploys and retracts the bow foils on a ship. Use the
          foil controls to move between the two states.
        </p>

        {/* Drawn at its own size, so the frame closes around it instead of
            stretching to the column; box-content keeps the border out of the
            786px, so the scale stays at 1. */}
        <ScaledFrame
          width={786}
          height={590}
          className="mx-auto mt-5 box-content max-w-[786px] rounded-lg border border-border shadow-sm"
        >
          <WavefoilStage />
        </ScaledFrame>
      </section>
    </div>
  );
}
