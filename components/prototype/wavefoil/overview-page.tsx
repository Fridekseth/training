"use client";

/**
 * The overview: how far out each foil is, the vessel from above, and the three
 * controls for moving the foils along the bottom.
 */

import { ObcBarVertical } from "@oicl/openbridge-webcomponents-react/building-blocks/bar-vertical/bar-vertical";
import { ExternalScaleSide, FillMode } from "@oicl/openbridge-webcomponents/dist/building-blocks/external-scale/external-scale";
import { Priority } from "@oicl/openbridge-webcomponents/dist/navigation-instruments/types";
import { FoilControls, type Moving } from "./foil-controls";
import { VesselTop } from "./vessel-top";
import styles from "./pages.module.css";

export type { Moving };

/** What the foils are doing, in the words of the heading over the vessel. */
function status(deployment: number, moving: Moving) {
  if (moving === "deploy") return "Wavefoil Deploying";
  if (moving === "retract") return "Wavefoil Retracting";
  if (deployment <= 0) return "Wavefoil retracted";
  if (deployment >= 100) return "Wavefoil Deployed";
  return "Wavefoil stopped";
}

/** One foil's position, 100 at the top with the foil fully deployed and 0 at the bottom with it retracted. */
function FoilBar({
  side,
  deployment,
  left,
}: {
  side: "port" | "stbd";
  deployment: number;
  left: number;
}) {
  return (
    <ObcBarVertical
      className={styles.at}
      style={{ left, top: 127 }}
      height={210}
      paddingTop={8}
      paddingBottom={8}
      barThickness={20}
      fillMode={FillMode.tint}
      minValue={0}
      maxValue={100}
      value={deployment}
      side={side === "port" ? ExternalScaleSide.left : ExternalScaleSide.right}
      hasBar
      hasScale
      showLabels
      scaleBackground={false}
      primaryTickmarkInterval={50}
      secondaryTickmarkInterval={10}
      // The accent colour is for foils that are out.
      priority={deployment > 0 ? Priority.enhanced : Priority.regular}
    />
  );
}

/** The two ends of a bar, and the side it belongs to, centred on the bar's column. */
function Column({ side, centre, labelCentre }: { side: string; centre: number; labelCentre: number }) {
  return (
    <>
      <p className={styles.sideName} style={{ left: labelCentre - 52, top: 63 }}>{side}</p>
      <p className={styles.endLabel} style={{ left: centre - 52, top: 111 }}>Deployed</p>
      <p className={styles.endLabel} style={{ left: centre - 52, top: 345 }}>Retracted</p>
    </>
  );
}

export function OverviewPage({
  deployment,
  moving,
  dusk,
  onDeploy,
  onRetract,
  onStop,
}: {
  deployment: number;
  moving: Moving;
  dusk: boolean;
  onDeploy: () => void;
  onRetract: () => void;
  onStop: () => void;
}) {
  return (
    <div className={`${styles.page} ${styles.pageFlat}`} data-comment="Overview">
      <p className={styles.state}>{status(deployment, moving)}</p>

      <Column side="PORT" centre={148} labelCentre={154} />
      <FoilBar side="port" deployment={deployment} left={88} />

      <div className={styles.at} style={{ left: 207, top: 63 }}>
        <VesselTop deployment={deployment} dusk={dusk} />
      </div>

      <Column side="STBD" centre={637} labelCentre={637} />
      <FoilBar side="stbd" deployment={deployment} left={611} />

      <FoilControls
        deployment={deployment}
        moving={moving}
        onDeploy={onDeploy}
        onRetract={onRetract}
        onStop={onStop}
      />
    </div>
  );
}
