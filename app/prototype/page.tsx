import type { Metadata } from "next";
import { PrototypeStage } from "@/components/prototype/prototype-stage";

export const metadata: Metadata = {
  title: "Prototype",
  description:
    "A working prototype of training inside an interface built on the OpenBridge design system.",
};

export default function PrototypePage() {
  return (
    <div className="mx-auto max-w-[1176px] px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Prototype
      </h1>
      <p className="mt-3 max-w-2xl text-[0.975rem] leading-7 text-muted">
        Training concepts tried out in a running interface, built with the
        OpenBridge web components so the prototype behaves like the real system
        rather than a picture of it.
      </p>

      <div className="mt-8 aspect-[1080/608] w-full max-w-[1080px] overflow-hidden rounded-lg border border-border shadow-sm">
        <PrototypeStage syncHash />
      </div>
    </div>
  );
}
