import type { Metadata } from "next";
import { FactoryDemo } from "@/components/prototype/factory-demo";
import { SecondScreenDemo } from "@/components/prototype/second-screen/app/second-screen-demo";
import { WavefoilDemo } from "@/components/prototype/wavefoil/wavefoil-demo";
import { PAGE_CONTAINER } from "@/lib/layout";

export const metadata: Metadata = {
  title: "Prototype demos",
  description:
    "The running demos of the learning concepts built throughout the process, built with the OpenBridge component library.",
};

export default function PrototypePage() {
  return (
    <div className={`${PAGE_CONTAINER} py-16`}>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Prototype demos
      </h1>
      <p className="mt-3 max-w-2xl text-[0.975rem] leading-7 text-muted">
        On this page I have collected all the running demos of the learning
        concepts I&apos;ve built throughout the process. They are all built in
        code using Claude Code, in order to get quicker and more complex
        prototypes than what I can in Figma. The designs are drawn in Figma, and
        fed to Claude using the Figma plugin. The OpenBridge component library
        is installed in the file, and used whenever possible, so a prototype
        behaves like the real system rather than a picture of it.
      </p>

      <section className="mt-20">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Wavefoil interface
        </h2>
        <p className="mt-2 max-w-2xl text-[0.95rem] leading-7 text-muted">
          This is the newest fully functioning prototype, showing how the
          learning patterns could be applied in the Wavefoil interface. To reach
          the learning patterns, open the hamburger menu and click
          &ldquo;training&rdquo;, or use the shortcuts next to the frame.
          Different sea states can be simulated under the prototype, showing how
          the interface&apos;s decision support system would respond to
          different environments.
        </p>

        <WavefoilDemo />
      </section>

      <section className="mt-28">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Second screen
        </h2>
        <p className="mt-2 max-w-2xl text-[0.95rem] leading-7 text-muted">
          The second screen prototype is a concept for a supporting app for a
          phone or tablet, that users can use to take learning out of the bridge
          (or other work environments). It can be used both for learning and
          accessing manuals and documentation when moving away from the fixed
          screens.
        </p>
        <p className="mt-3 max-w-2xl text-[0.95rem] leading-7 text-muted">
          In this example the app is a companion to the Wavefoil prototype. The
          homepage gives you the agenda for the day and shortcuts to your most
          used and most recent activity. In this scenario, it also includes a
          link to a sync function, because there is going to be a change of
          crew. In the learn page, you get documentation and manuals for all
          systems, while notifications contains all new updates from coworkers
          and the app. Not all functions have content, so use the links to find
          the working flows.
        </p>

        <SecondScreenDemo />
      </section>

      <section className="mt-28">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Factory monitoring interface
        </h2>
        <p className="mt-2 max-w-2xl text-[0.95rem] leading-7 text-muted">
          The first prototype for the project was a test on a factory monitoring
          interface. This is a relatively fixed interface, without interactions
          with the systems, which made a natural small scope for the first test.
          Move the pointer to the edge of the screen for the menu, then open
          Training to reach the run-through.
        </p>

        {/* Drawn at the size it was designed at, then scaled to fit the column. */}
        <FactoryDemo />
      </section>
    </div>
  );
}
