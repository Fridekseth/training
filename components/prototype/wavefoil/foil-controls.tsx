"use client";

/**
 * The three controls for moving the foils, along the bottom of the overview and
 * of decision support. They are the same on both; decision support only adds a
 * tag under the control it recommends.
 */

import type { ReactNode } from "react";
import { ObcRichButton } from "@oicl/openbridge-webcomponents-react/components/rich-button/rich-button";
import { ObiCloseGoogle } from "@oicl/openbridge-webcomponents-react/icons/icon-close-google";
import { ObiMediaPause } from "@oicl/openbridge-webcomponents-react/icons/icon-media-pause";
import { RichButtonDirection } from "@oicl/openbridge-webcomponents/dist/components/rich-button/rich-button";
import { MaskIcon } from "../pieces";
import styles from "./pages.module.css";

export type Moving = "deploy" | "retract" | null;

/** One control, boxed with a tag under it when it is the one that is recommended. */
function Control({
  left,
  label,
  icon,
  disabled,
  onClick,
  recommended,
  warn = false,
}: {
  left: number;
  label: string;
  icon: ReactNode;
  disabled: boolean;
  onClick: () => void;
  recommended: boolean;
  warn?: boolean;
}) {
  // Only an action that can still be taken is recommended.
  const boxed = recommended && !disabled;
  const button = (
    <ObcRichButton
      className={styles.rich}
      style={boxed ? undefined : { left }}
      label={label}
      direction={RichButtonDirection.Horizontal}
      hasLeadingIcon
      fullWidth
      fullHeight
      disabled={disabled}
      onRichButtonClick={onClick}
    >
      {icon}
    </ObcRichButton>
  );
  if (!boxed) return button;
  return (
    <div
      className={`${styles.recommended} ${warn ? styles.recommendedWarn : ""}`}
      style={{ left: left - 2 }}
    >
      <div className={styles.recommendedTag}>
        {warn ? <span className={styles.recommendedMark} /> : <span aria-hidden="true">★</span>}
        Recommended
      </div>
      {button}
    </div>
  );
}

export function FoilControls({
  deployment,
  moving,
  onDeploy,
  onRetract,
  onStop,
  recommends,
}: {
  /** 0 with the foils in, 100 with them out. */
  deployment: number;
  moving: Moving;
  onDeploy: () => void;
  onRetract: () => void;
  onStop: () => void;
  /** The control to mark as recommended, where the page advises one. */
  recommends?: "deploy" | "retract";
}) {
  return (
    <div className={styles.toolbar} data-comment="Foil controls">
      <Control
        left={61}
        label="Deploy foils"
        icon={<MaskIcon slot="leading-icon" name="wf-wavefoil" size={24} />}
        disabled={deployment >= 100 || moving === "deploy"}
        onClick={onDeploy}
        recommended={recommends === "deploy"}
      />
      <Control
        left={293}
        label="Retract foils"
        icon={<ObiCloseGoogle slot="leading-icon" />}
        disabled={deployment <= 0 || moving === "retract"}
        onClick={onRetract}
        recommended={recommends === "retract"}
        warn
      />
      <Control
        left={525}
        label="Stop"
        icon={<ObiMediaPause slot="leading-icon" />}
        disabled={moving === null}
        onClick={onStop}
        recommended={false}
      />
    </div>
  );
}
