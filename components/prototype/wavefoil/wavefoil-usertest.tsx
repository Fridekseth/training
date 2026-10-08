"use client";

import { useEffect, useRef, useState } from "react";
import { CONDITIONS, type Conditions } from "./conditions";
import { WavefoilStage } from "./wavefoil-stage";

/** The size the screen was designed at. */
const SCREEN = { width: 786, height: 590 };
const DIAGONAL = Math.hypot(SCREEN.width, SCREEN.height);

/** Training mode draws a 6px frame outside the screen, and it needs room that is not cut off. */
const RING = 6;
/** Space kept clear around the screen and its frame, in the display's own pixels. */
const MARGIN = 24;

/** The bridge display the prototype stands in for is about 10 inches across the diagonal. */
const DEFAULT_INCHES = 10;

/**
 * How many of the page's pixels make an inch on this device. An iPad counts 132
 * points to the inch (163 on a mini), whatever its resolution; elsewhere the
 * CSS inch of 96 is as close as the browser can say.
 */
function pixelsPerInch() {
  const tablet = /iPad/.test(navigator.userAgent) || (/Mac/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
  if (!tablet) return 96;
  return Math.min(window.screen.width, window.screen.height) < 800 ? 163 : 132;
}

/**
 * The prototype for a user test on a tablet. It is shown at the size of a 10
 * inch bridge display, centred on black with nothing else in view, or as large
 * as the display allows if that is smaller. The browser's own gestures (pinching,
 * pulling to refresh, selecting text, the press-and-hold menu) are switched
 * off, and the display is kept awake.
 *
 * The facilitator's controls are hidden: tapping three times in the bottom left
 * corner opens them, with the sea state the decision support page reads and a
 * way to start over between participants.
 */
export function WavefoilUsertest() {
  const [scale, setScale] = useState(1);
  const [portrait, setPortrait] = useState(false);
  const [conditions, setConditions] = useState<Conditions>("ideal");
  const [panel, setPanel] = useState(false);
  const [run, setRun] = useState(0);
  const taps = useRef<number[]>([]);
  /** The area the screen stands in: the display less the parts the system keeps for itself, such as the status bar. */
  const area = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = area.current;
    if (!element) return;
    const fit = () => {
      // The screen, its frame and a margin all have to fit in what the display leaves.
      const width = element.clientWidth;
      const height = element.clientHeight;
      const query = new URLSearchParams(window.location.search);
      const room = Math.min(
        (width - 2 * MARGIN) / (SCREEN.width + 2 * RING),
        (height - 2 * MARGIN) / (SCREEN.height + 2 * RING),
      );
      // The screen is shown at the size of a real one, as large as the display allows when that is smaller.
      // ?inches=12 sets another size, ?scale=1 draws it at one pixel to the design's pixel, ?ppi= corrects the density.
      const inches = Number(query.get("inches")) || DEFAULT_INCHES;
      const ppi = Number(query.get("ppi")) || pixelsPerInch();
      const real = (inches * ppi) / DIAGONAL;
      setScale(Number(query.get("scale")) || Math.min(room, real));
      setPortrait(window.innerHeight > window.innerWidth);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(element);
    window.addEventListener("orientationchange", fit);
    return () => {
      observer.disconnect();
      window.removeEventListener("orientationchange", fit);
    };
  }, []);

  // Nothing on the page may scroll, zoom or be selected, as it would not on the system.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previous = [html.style.overscrollBehavior, body.style.overscrollBehavior, body.style.background];
    html.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";
    body.style.background = "#000";
    const stop = (event: Event) => event.preventDefault();
    // Safari's pinch gestures, and the menu pressing and holding would bring up.
    document.addEventListener("gesturestart", stop);
    document.addEventListener("gesturechange", stop);
    document.addEventListener("contextmenu", stop);
    return () => {
      html.style.overscrollBehavior = previous[0];
      body.style.overscrollBehavior = previous[1];
      body.style.background = previous[2];
      document.removeEventListener("gesturestart", stop);
      document.removeEventListener("gesturechange", stop);
      document.removeEventListener("contextmenu", stop);
    };
  }, []);

  // The display stays on for as long as the test runs. It needs a touch to ask, and not every browser has it.
  useEffect(() => {
    let lock: { release: () => Promise<void> } | undefined;
    const ask = async () => {
      try {
        const wake = (navigator as Navigator & { wakeLock?: { request: (type: "screen") => Promise<typeof lock> } })
          .wakeLock;
        lock = await wake?.request("screen");
      } catch {
        // Refused, for example by a low battery; the test goes on without it.
      }
    };
    window.addEventListener("pointerdown", ask, { once: true });
    return () => {
      window.removeEventListener("pointerdown", ask);
      void lock?.release();
    };
  }, []);

  /** Three taps in the corner within a second open the facilitator's panel. */
  const corner = () => {
    const now = Date.now();
    taps.current = [...taps.current.filter((at) => now - at < 1000), now];
    if (taps.current.length >= 3) {
      taps.current = [];
      setPanel(true);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        background: "#000",
        // The status bar and the home indicator take their share, and the screen is centred in what is left.
        boxSizing: "border-box",
        paddingTop: "env(safe-area-inset-top)",
        paddingRight: "env(safe-area-inset-right)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        // Taps are taps: no highlight, no double-tap zoom, no selection, no callout.
        touchAction: "manipulation",
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <div ref={area} style={{ position: "relative", width: "100%", height: "100%" }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: SCREEN.width,
            height: SCREEN.height,
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}
        >
          <WavefoilStage key={run} conditions={conditions} />
        </div>
      </div>

      {portrait ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
            color: "#e8e8e8",
            fontFamily: "system-ui, sans-serif",
            fontSize: 20,
            textAlign: "center",
            padding: 32,
          }}
        >
          Turn the screen to landscape.
        </div>
      ) : null}

      <div
        onPointerDown={corner}
        aria-hidden="true"
        style={{ position: "absolute", left: 0, bottom: 0, width: 56, height: 56 }}
      />

      {panel ? (
        <div
          role="dialog"
          aria-label="Facilitator"
          style={{
            position: "absolute",
            left: 12,
            bottom: 12,
            width: 260,
            padding: 16,
            borderRadius: 8,
            background: "#1f1f1f",
            color: "#e8e8e8",
            fontFamily: "system-ui, sans-serif",
            fontSize: 15,
            boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
          }}
        >
          <p style={{ margin: "0 0 8px", opacity: 0.7 }}>Sea state</p>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {CONDITIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setConditions(item.id)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 6,
                  border: "1px solid #555",
                  background: conditions === item.id ? "#e8e8e8" : "transparent",
                  color: conditions === item.id ? "#1f1f1f" : "#e8e8e8",
                  font: "inherit",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              type="button"
              onClick={() => {
                setRun((now) => now + 1);
                setConditions("ideal");
                setPanel(false);
              }}
              style={{ flex: 1, padding: "10px 0", borderRadius: 6, border: "1px solid #555", background: "transparent", color: "#e8e8e8", font: "inherit" }}
            >
              Start over
            </button>
            <button
              type="button"
              onClick={() => setPanel(false)}
              style={{ flex: 1, padding: "10px 0", borderRadius: 6, border: "1px solid #555", background: "transparent", color: "#e8e8e8", font: "inherit" }}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
