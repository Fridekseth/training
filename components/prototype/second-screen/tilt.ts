/**
 * Pitch and roll of a phone read as two separate angles, from which way "up"
 * lies in the phone's own frame.
 *
 * The phone's frame has x across the screen, y up along it and z out of it.
 * Tipping the top edge forward or back turns the phone about x, and that leaves
 * the sideways part of "up" untouched, so it cannot move the roll. Roll turns the
 * phone about its other axis, and what is kept the same by that turn is what the
 * pitch is measured from, so it cannot move the pitch either. Which axis the roll
 * turns about depends on how the phone is held: leaning a phone that is tipped
 * back towards you is a turn about y, and tilting an upright phone from side to
 * side is a turn about z, like a steering wheel. The hold is taken from how it is
 * when set as level.
 */

export type Vector = [number, number, number];

export type Hold = {
  up: Vector;
  /** Rolling turns about y when the phone is tipped back, and about z when it is upright. */
  about: "y" | "z";
};

const rad = Math.PI / 180;

/** The difference between two angles, taken the short way round. */
export const turn = (to: number, from: number) => ((((to - from) % 360) + 540) % 360) - 180;

/**
 * Which way "up" lies in the phone's frame, from the angles the phone reports.
 * It does not depend on which way the phone is facing, so turning round does
 * not move anything.
 */
export const upIn = (beta: number, gamma: number): Vector => [
  -Math.cos(beta * rad) * Math.sin(gamma * rad),
  Math.sin(beta * rad),
  Math.cos(beta * rad) * Math.cos(gamma * rad),
];

/** How a phone held as `up` rolls, which is decided once and kept until it is set as level again. */
export const holdOf = (up: Vector): Hold => ({ up, about: Math.abs(up[2]) >= 0.35 ? "y" : "z" });

/**
 * The two angles of a phone standing with `up` as "up", read the way it was
 * held. `along` grows as the top edge tips back, and `across` as the right edge
 * comes up, so both are the reverse of what the vessel does for the other way.
 */
export const angles = (up: Vector, hold: Hold) => {
  const [x, y, z] = up;
  const [x0, y0, z0] = hold.up;
  if (hold.about === "y") {
    // Turning about y moves x and z round each other and leaves y alone, so pitch uses y and what x and z share.
    const sz = Math.sign(z0) || 1;
    const share = Math.hypot(x, z);
    const side = Math.sign(x * x0 + z * z0) || 1;
    return {
      across: Math.atan2(x, sz * z) / rad,
      along: Math.atan2(y, side * share) / rad,
    };
  }
  // Turning about z moves x and y round each other and leaves z alone, so pitch uses z and what x and y share.
  const sy = Math.sign(y0) || 1;
  const share = Math.hypot(x, y);
  return {
    across: Math.atan2(x, sy * y) / rad,
    along: -Math.atan2(z, sy * share) / rad,
  };
};

/** Pitch (bow down positive) and roll (starboard down positive) of the phone now, against how it was held. */
export const tilt = (up: Vector, hold: Hold) => {
  const now = angles(up, hold);
  const then = angles(hold.up, hold);
  return {
    pitch: -turn(now.along, then.along),
    roll: -turn(now.across, then.across),
  };
};
