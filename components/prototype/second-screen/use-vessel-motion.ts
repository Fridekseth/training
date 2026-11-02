"use client";

/**
 * The phone as a model of the vessel, seen from above with the bow at the top
 * edge. Tipping the top edge down is bow down, tipping the right edge down is
 * roll to starboard, and lifting the whole phone is heave up. The motion the
 * phone makes is much smaller than a vessel's, so it is scaled up.
 *
 * The three are kept apart. Pitch and roll are read from which way "up" lies in
 * the phone's own frame, one sideways and one along its length, so tipping the
 * phone one way leaves the other reading alone, and heave is only the part of
 * the movement that is along "up". Without motion sensors (a computer, or a
 * page that is not served securely) pitch and roll come from dragging on the
 * screen and heave from the wheel.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { holdOf, tilt, upIn, type Hold, type Vector } from "./tilt";

export type Source = "waiting" | "sensors" | "pointer";

export type Motion = {
  /** Degrees, bow down is positive, as the library's instrument draws it. */
  pitch: number;
  /** Degrees, starboard down is positive. */
  roll: number;
  /** Metres, up is positive. */
  heave: number;
  /** The extent each reading is kept within. */
  band: { pitch: [number, number]; roll: [number, number]; heave: [number, number] };
};

/** How many vessel degrees one degree of tilt on the phone gives. */
const TILT_GAIN = 0.5;
/** A phone moved by hand travels centimetres, a vessel metres. */
const HEAVE_GAIN = 12;
const PITCH_LIMIT = 25;
const ROLL_LIMIT = 35;
const HEAVE_LIMIT = 2;
/** Small unsteadiness of the hand, which should not show as movement on the others. */
const TILT_DEADZONE = 1.5;
const LIFT_DEADZONE = 0.2;
const DRAG_DEADZONE = 10;
/** How long the grey stretch around each needle looks back. */
const TREND_SECONDS = 3;
const GRAVITY = 9.81;

const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));
/** What is left of a reading once the unsteadiness below the dead zone is taken off. */
const settle = (value: number, zone: number) => Math.sign(value) * Math.max(0, Math.abs(value) - zone);

type Permissioned = { requestPermission?: () => Promise<"granted" | "denied"> };

export function useVesselMotion() {
  const [source, setSource] = useState<Source>("waiting");
  const [needsPermission, setNeedsPermission] = useState(false);
  const [secure, setSecure] = useState(true);
  const [motion, setMotion] = useState<Motion>({
    pitch: 0,
    roll: 0,
    heave: 0,
    band: { pitch: [-2, 2], roll: [-2, 2], heave: [-0.1, 0.1] },
  });

  /** What the sensors or the pointer ask for, and what the instrument has reached. */
  const target = useRef({ pitch: 0, roll: 0, heave: 0 });
  const shown = useRef({ pitch: 0, roll: 0, heave: 0 });
  const sensorsOn = useRef(false);
  /** The way up lies in the phone's frame now, and when it was set as level. */
  const up = useRef<Vector | null>(null);
  const hold = useRef<Hold | null>(null);
  /** Whether this platform reports the pull of gravity as up or as down. */
  const platformSign = useRef(0);
  const lift = useRef({ speed: 0, height: 0, at: 0 });
  const history = useRef<{ at: number; pitch: number; roll: number; heave: number }[]>([]);

  const listen = useCallback(() => {
    const onOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return;
      sensorsOn.current = true;
      setSource("sensors");
      const now = upIn(event.beta, event.gamma);
      up.current = now;
      hold.current ??= holdOf(now);
      const here = tilt(now, hold.current);
      target.current.pitch = clamp(settle(here.pitch * TILT_GAIN, TILT_DEADZONE), PITCH_LIMIT);
      target.current.roll = clamp(settle(here.roll * TILT_GAIN, TILT_DEADZONE), ROLL_LIMIT);
    };

    const onMotion = (event: DeviceMotionEvent) => {
      const felt = event.accelerationIncludingGravity;
      const direction = up.current;
      if (!felt || felt.x === null || felt.y === null || felt.z === null || !direction) return;
      const now = performance.now();
      const state = lift.current;
      const dt = state.at ? Math.min((now - state.at) / 1000, 0.1) : 0;
      state.at = now;

      // The pull along "up" is about 9.8 at rest. Whether it reads as plus or minus differs between platforms, so it is learned from the first readings.
      const along = felt.x * direction[0] + felt.y * direction[1] + felt.z * direction[2];
      if (!platformSign.current && Math.abs(along) > GRAVITY * 0.5) platformSign.current = Math.sign(along);
      if (!platformSign.current) return;
      // What is left once gravity is taken off is the acceleration of the lift alone, whichever way the phone is tilted.
      const acceleration = platformSign.current * along - GRAVITY;

      // Integrated twice, and let go of a little each step, so that it settles back to level.
      state.speed = state.speed * 0.9 + settle(acceleration, LIFT_DEADZONE) * dt;
      state.height = state.height * 0.97 + state.speed * dt;
      target.current.heave = clamp(state.height * HEAVE_GAIN, HEAVE_LIMIT);
    };

    window.addEventListener("deviceorientation", onOrientation);
    window.addEventListener("devicemotion", onMotion);
    // A computer fires nothing, so after a moment the drag takes over.
    const quiet = window.setTimeout(() => {
      if (!sensorsOn.current) setSource("pointer");
    }, 1200);
    return () => {
      window.removeEventListener("deviceorientation", onOrientation);
      window.removeEventListener("devicemotion", onMotion);
      window.clearTimeout(quiet);
    };
  }, []);

  useEffect(() => {
    const secureContext = window.isSecureContext;
    // Read once the page is on a device, since the server cannot know whether it is secure.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSecure(secureContext);
    const ask = (window.DeviceOrientationEvent as unknown as Permissioned | undefined)?.requestPermission;
    if (typeof ask === "function") {
      // iPhones want a tap before they hand over the sensors.
      setNeedsPermission(true);
      return;
    }
    if (!secureContext) {
      setSource("pointer");
      return;
    }
    return listen();
  }, [listen]);

  /** Called from a tap, which is when iPhones let the sensors be asked for. */
  const enable = useCallback(async () => {
    const orientation = window.DeviceOrientationEvent as unknown as Permissioned;
    const motionEvent = window.DeviceMotionEvent as unknown as Permissioned;
    try {
      const answers = await Promise.all([orientation.requestPermission?.(), motionEvent.requestPermission?.()]);
      setNeedsPermission(false);
      if (answers.every((answer) => answer === "granted")) listen();
      else setSource("pointer");
    } catch {
      setNeedsPermission(false);
      setSource("pointer");
    }
  }, [listen]);

  /** Takes the way the phone is held now as level. */
  const level = useCallback(() => {
    hold.current = up.current ? holdOf(up.current) : null;
    lift.current = { speed: 0, height: 0, at: 0 };
    target.current = { pitch: 0, roll: 0, heave: 0 };
  }, []);

  // One loop eases what is shown toward what is asked for, and keeps the recent extent for the grey stretches.
  useEffect(() => {
    let frame = 0;
    const tick = (now: number) => {
      const from = shown.current;
      const to = target.current;
      from.pitch += (to.pitch - from.pitch) * 0.2;
      from.roll += (to.roll - from.roll) * 0.2;
      from.heave += (to.heave - from.heave) * 0.2;

      const trail = history.current;
      trail.push({ at: now, ...from });
      while (trail.length && now - trail[0].at > TREND_SECONDS * 1000) trail.shift();
      const span = (pick: "pitch" | "roll" | "heave", least: number): [number, number] => {
        const values = trail.map((point) => point[pick]);
        return [Math.min(...values, -least), Math.max(...values, least)];
      };

      setMotion({
        ...from,
        band: { pitch: span("pitch", 2), roll: span("roll", 2), heave: span("heave", 0.1) },
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  /** Dragging stands in for tilting: down is bow down, right is starboard down. Each way has to be dragged on its own to count. */
  const drag = useCallback((dx: number, dy: number) => {
    target.current.pitch = clamp(settle(dy, DRAG_DEADZONE) / 6, PITCH_LIMIT);
    target.current.roll = clamp(settle(dx, DRAG_DEADZONE) / 6, ROLL_LIMIT);
  }, []);
  const release = useCallback(() => {
    if (!sensorsOn.current) {
      target.current.pitch = 0;
      target.current.roll = 0;
    }
  }, []);
  const lifted = useCallback((delta: number) => {
    if (sensorsOn.current) return;
    target.current.heave = clamp(target.current.heave - delta / 150, HEAVE_LIMIT);
  }, []);

  // With nothing holding it, the heave settles back to level.
  useEffect(() => {
    if (source !== "pointer") return;
    const id = window.setInterval(() => {
      target.current.heave *= 0.96;
    }, 40);
    return () => window.clearInterval(id);
  }, [source]);

  return { motion, source, needsPermission, secure, enable, level, drag, release, lifted };
}
