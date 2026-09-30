"use client";

/**
 * The deploying sequence. Putting the foils out is a slow mechanical job, so
 * the screen hands the operator a modal that shows the foils moving, how far
 * along it is, and a way out of it. When it finishes, a short confirmation
 * takes its place before the overview comes back with the foils down.
 */

import { ObcModalWindow } from "@oicl/openbridge-webcomponents-react/components/modal-window/modal-window";
import { ObcBarHorizontal } from "@oicl/openbridge-webcomponents-react/building-blocks/bar-horizontal/bar-horizontal";
import { ObcReadoutListItem } from "@oicl/openbridge-webcomponents-react/navigation-instruments/readout-list-item/readout-list-item";
import {
  ObcModalWindowSize,
  type ObcModalWindow as ObcModalWindowElement,
} from "@oicl/openbridge-webcomponents/dist/components/modal-window/modal-window";
import {
  ExternalScaleSide,
  FillMode,
} from "@oicl/openbridge-webcomponents/dist/building-blocks/external-scale/external-scale";
import { Priority } from "@oicl/openbridge-webcomponents/dist/navigation-instruments/types";
import { ReadoutValueType } from "@oicl/openbridge-webcomponents/dist/navigation-instruments/readout/readout";
import { DeployIllustration, DeployedIllustration } from "./deploy-illustration";
import styles from "./wavefoil.module.css";

/**
 * What the screen tells the operator the job will take. The prototype runs it
 * in a fraction of that, so the count comes off the progress rather than off
 * the clock.
 */
const STATED_SECONDS = 120;

/** The foil icon from the design's own title bar. */
function FoilIcon() {
  const url = "url(/prototype/wavefoil/icon-deploy.svg)";
  return (
    <span
      aria-hidden="true"
      style={{
        display: "block",
        width: 24,
        height: 24,
        backgroundColor: "currentColor",
        maskImage: url,
        WebkitMaskImage: url,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

/**
 * The finished dialogue in the sketch has no footer, and the library draws one
 * whatever the props say. It is left out with a rule added to the component's
 * own shadow root, since it exposes no part to style; the header's close button
 * and the timeout still dismiss it.
 */
let footerRule: CSSStyleSheet | undefined;
function withoutFooter(modal: ObcModalWindowElement | null) {
  if (!modal) return;
  void modal.updateComplete.then(() => {
    const root = modal.shadowRoot;
    if (!root) return;
    if (!footerRule) {
      footerRule = new CSSStyleSheet();
      footerRule.replaceSync(".action-container { display: none; }");
    }
    if (!root.adoptedStyleSheets.includes(footerRule)) {
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, footerRule];
    }
  });
}

/** The bar reads the travel between the two end stops, not a percentage. */
function TravelBar({ progress }: { progress: number }) {
  return (
    <div className={styles.travel}>
      <div className={styles.travelEnds}>
        <span>Retracted</span>
        <span>Deployed</span>
      </div>
      <ObcBarHorizontal
        className={styles.travelBar}
        minValue={0}
        maxValue={100}
        value={progress * 100}
        width={411}
        barThickness={26}
        hasBar
        hasScale
        scaleBackground={false}
        showLabels
        tickThickness={12}
        labelThickness={20}
        primaryTickmarkInterval={25}
        secondaryTickmarkInterval={5}
        priority={Priority.enhanced}
        fillMode={FillMode.tint}
        side={ExternalScaleSide.bottom}
      />
    </div>
  );
}

export function DeployingDialog({
  progress,
  onCancel,
}: {
  progress: number;
  onCancel: () => void;
}) {
  const remaining = Math.max(1, Math.ceil(STATED_SECONDS * (1 - progress)));

  return (
    <div className={styles.modalLayer}>
      <ObcModalWindow
        size={ObcModalWindowSize.Medium}
        hasLeadingIcon
        hasCancelAction={false}
        hasCloseAction
        onCloseClick={onCancel}
        onDoneClick={onCancel}
      >
        <span slot="leading-icon">
          <FoilIcon />
        </span>
        <span slot="title">Wavefoil deploying</span>

        <div slot="content" className={styles.modalContent}>
          <DeployIllustration className={styles.illustration} extent={progress} />
          <TravelBar progress={progress} />
          <ObcReadoutListItem
            className={styles.remaining}
            label="Estimated remaining time"
            value={String(remaining)}
            valueType={ReadoutValueType.text}
            unit={remaining === 1 ? "second" : "seconds"}
          />
        </div>

        <span slot="done-label">Cancel operation</span>
      </ObcModalWindow>
    </div>
  );
}

export function DeployedDialog({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.modalLayer}>
      <ObcModalWindow
        size={ObcModalWindowSize.Medium}
        hasLeadingIcon
        hasCancelAction={false}
        hasCloseAction
        onCloseClick={onClose}
        onDoneClick={onClose}
        ref={withoutFooter}
      >
        <span slot="leading-icon">
          <FoilIcon />
        </span>
        <span slot="title">Wavefoil deployed</span>

        <div slot="content" className={`${styles.modalContent} ${styles.modalRest}`}>
          <DeployedIllustration className={styles.illustration} />
          <p className={styles.modalMessage}>
            Wavefoil was successfully deployed
          </p>
        </div>
      </ObcModalWindow>
    </div>
  );
}
