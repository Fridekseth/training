"use client";

/**
 * The ship screen as a small picture, for the test's questions: what the
 * scenario will start from, drawn live at a fraction of its size.
 */

import { useContext } from "react";
import { ScreenScale } from "../screen-scale";
import { AlarmPage } from "./alarm-page";
import type { Conditions } from "./conditions";
import { DebriefingPage } from "./debriefing-page";
import { DecisionSupportPage } from "./decision-support-page";
import type { AppPage } from "./explore-data";
import { OverviewPage } from "./overview-page";
import { SCREEN } from "./corner-tools";
import { WavefoilTopBar } from "./top-bar";
import styles from "./wavefoil.module.css";

const noop = () => {};

export function ScreenPreview({
  page,
  palette,
  deployment,
  conditions,
  scale,
}: {
  page: AppPage;
  palette: string;
  deployment: number;
  conditions: Conditions;
  /** How much smaller than the screen it is drawn. */
  scale: number;
}) {
  const outer = useContext(ScreenScale);

  const names: Record<AppPage, string> = {
    overview: "Overview",
    decision: "Decision support",
    alarms: "Alarm system",
    debriefing: "Debriefing",
  };

  return (
    <div
      aria-hidden="true"
      inert
      style={{
        width: SCREEN.width,
        height: SCREEN.height,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        // A picture only: nothing in it takes a press.
        pointerEvents: "none",
      }}
    >
      <ScreenScale.Provider value={outer * scale}>
        <div className={styles.screen}>
          <WavefoilTopBar pageName={names[page]} palette={palette} onDim={noop} menuOpen={false} onMenu={noop} />
          {page === "overview" ? (
            <OverviewPage
              deployment={deployment}
              moving={null}
              dusk={palette !== "day"}
              onDeploy={noop}
              onRetract={noop}
              onStop={noop}
            />
          ) : null}
          {page === "decision" ? (
            <DecisionSupportPage
              palette={palette}
              conditions={conditions}
              deployment={deployment}
              moving={null}
              onDeploy={noop}
              onRetract={noop}
              onStop={noop}
            />
          ) : null}
          {page === "alarms" ? <AlarmPage /> : null}
          {page === "debriefing" ? <DebriefingPage palette={palette} /> : null}
        </div>
      </ScreenScale.Provider>
    </div>
  );
}
