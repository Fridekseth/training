"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import "@oicl/openbridge-webcomponents/dist/openbridge.css";
import { SCREEN } from "@/components/prototype/wavefoil/corner-tools";
import tealStyles from "@/components/prototype/wavefoil/teal-scope.module.css";

/**
 * A screen of the Wavefoil prototype, at its own size and scaled down to fit the
 * page, for a component to be tried on. The scale is applied to the layer itself,
 * which is what the components measure to follow a pointer as it drags.
 */
export function PreviewStage({
  layer,
  maxWidth = 560,
  ring = false,
  children,
}: {
  layer: RefObject<HTMLDivElement | null>;
  /** The widest the screen is shown, in pixels. */
  maxWidth?: number;
  /** Leaves room around the screen for something drawn just outside it, such as the training frame. */
  ring?: boolean;
  children: ReactNode;
}) {
  // The library draws its colours from a palette set on the document, so the day palette is set
  // while a screen is on the page, and taken off again when it goes.
  useEffect(() => {
    const html = document.documentElement;
    html.dataset.obcTheme = "day";
    document.body.classList.add("obc-component-size-regular");
    return () => {
      delete html.dataset.obcTheme;
      document.body.classList.remove("obc-component-size-regular");
    };
  }, []);

  const frame = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const measure = () => setScale(Math.min(1, element.clientWidth / SCREEN.width));
    measure();
    const watch = new ResizeObserver(measure);
    watch.observe(element);
    return () => watch.disconnect();
  }, []);

  return (
    <div
      ref={frame}
      className={`relative mx-auto rounded-lg border border-border ${
        ring ? "my-2 w-[calc(100%-1.5rem)]" : "w-full overflow-hidden"
      }`}
      style={{
        maxWidth: ring ? maxWidth - 24 : maxWidth,
        height: SCREEN.height * (scale ?? 1),
        // Until the width is known the screen is left out, so it does not show at the wrong size.
        visibility: scale === null ? "hidden" : "visible",
        background: "#f1f1f1",
      }}
    >
      <div
        ref={layer}
        className={tealStyles.teal}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: SCREEN.width,
          height: SCREEN.height,
          transform: `scale(${scale ?? 1})`,
          transformOrigin: "0 0",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * A grey box with one component in the middle of it, at its own size. The components of the
 * prototype place themselves by the corner of a screen, so here that is taken off them, and the
 * box they stand in is as big as they are.
 */
export function ComponentStage({
  layer,
  className = "",
  children,
}: {
  layer?: RefObject<HTMLDivElement | null>;
  /** For a part of the component that should not be shown. */
  className?: string;
  children: ReactNode;
}) {
  // The library draws its colours from a palette set on the document, so the day palette is set
  // while a component is on the page, and taken off again when it goes.
  useEffect(() => {
    const html = document.documentElement;
    html.dataset.obcTheme = "day";
    document.body.classList.add("obc-component-size-regular");
    return () => {
      delete html.dataset.obcTheme;
      document.body.classList.remove("obc-component-size-regular");
    };
  }, []);

  return (
    <div
      className="flex min-h-56 overflow-x-auto rounded-lg border border-border p-8 sm:p-12"
      style={{ background: "#f1f1f1" }}
    >
      <div
        ref={layer}
        className={`${tealStyles.teal} relative m-auto [&>*]:!relative [&>*]:!top-0 [&>*]:!left-0 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

/* ---- the controls under the screen ---- */

const INPUT =
  "w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-sm text-foreground";

/** One row of the controls: the name of the input, what it does, and a control to change it. */
export function ControlRow({
  name,
  text,
  children,
}: {
  name: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <div className="grid items-center gap-x-6 gap-y-2 border-b border-border px-4 py-3 last:border-b-0 sm:grid-cols-[8rem_1fr_13rem]">
      <code className="font-mono text-[0.8125rem] text-foreground">{name}</code>
      <p className="m-0 text-sm leading-6 text-muted">{text}</p>
      <div>{children}</div>
    </div>
  );
}

export function TextControl({
  name,
  value,
  onChange,
  placeholder,
}: {
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      aria-label={name}
      className={INPUT}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export function SelectControl<T extends string>({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: T;
  options: readonly (readonly [T, string])[];
  onChange: (value: T) => void;
}) {
  return (
    <select
      aria-label={name}
      className={INPUT}
      value={value}
      onChange={(event) => onChange(event.target.value as T)}
    >
      {options.map(([option, label]) => (
        <option key={option} value={option}>
          {label}
        </option>
      ))}
    </select>
  );
}

export function SwitchControl({
  name,
  value,
  onChange,
}: {
  name: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted">
      <input
        type="checkbox"
        aria-label={name}
        className="size-4 accent-[var(--accent)]"
        checked={value}
        onChange={(event) => onChange(event.target.checked)}
      />
      {value ? "True" : "False"}
    </label>
  );
}

/** The controls as one bordered table, headed the way the ones in Storybook are. */
export function Controls({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-border">
      <div className="hidden gap-x-6 border-b border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground sm:grid sm:grid-cols-[8rem_1fr_13rem]">
        <span>Input</span>
        <span>What it does</span>
        <span>Try it</span>
      </div>
      {children}
    </div>
  );
}
