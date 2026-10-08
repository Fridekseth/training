"use client";

/**
 * The application menu, opened from the hamburger in the top bar. It slides
 * over the screen under the bar and is where the operator reaches Training.
 * The three pages and Training lead somewhere; Settings is drawn as in the
 * design but has no screen behind it.
 */

import { ObcNavigationItem } from "@oicl/openbridge-webcomponents-react/components/navigation-item/navigation-item";
import { ObcNavigationMenuVariant } from "@oicl/openbridge-webcomponents/dist/components/navigation-menu/navigation-menu";
import { MaskIcon } from "../pieces";
import type { AppPage } from "./explore-data";
import styles from "./training.module.css";

const ACTIVE = "var(--on-amplified-active-color, #1d3c67)";
const NEUTRAL = "var(--on-flat-neutral-color, #535353)";

function Item({
  label,
  icon,
  checked = false,
  iconOnly = false,
  onClick,
}: {
  label: string;
  icon: string;
  checked?: boolean;
  iconOnly?: boolean;
  onClick?: () => void;
}) {
  return (
    <ObcNavigationItem
      label={label}
      checked={checked}
      hasIcon
      variant={iconOnly ? ObcNavigationMenuVariant.IconOnly : ObcNavigationMenuVariant.Full}
      onClick={onClick}
    >
      <MaskIcon
        slot="icon"
        name={icon}
        style={{ color: checked ? ACTIVE : NEUTRAL }}
      />
    </ObcNavigationItem>
  );
}

export function WavefoilMenu({
  page,
  inTraining,
  rail = false,
  onPage,
  onTraining,
  onClose,
}: {
  page: AppPage;
  inTraining: boolean;
  /** Folded down to its icons and left in place, as it is while a guided sequence runs. */
  rail?: boolean;
  onPage: (page: AppPage) => void;
  onTraining: () => void;
  onClose: () => void;
}) {
  return (
    <div className={`${styles.menuLayer} ${rail ? styles.menuLayerRail : ""}`}>
      {/* Anywhere else on the screen closes the menu again. */}
      {rail ? null : <div className={styles.scrim} onClick={onClose} aria-hidden="true" />}
      {/*
        The library's full menu is 320px wide and the design's is 195, so the
        panel is built from its navigation items instead.
      */}
      <nav className={`${styles.menu} ${rail ? styles.menuIcons : ""}`}>
        <div className={styles.menuGroup}>
          <Item
            iconOnly={rail}
            label="Overview"
            icon="nav-home"
            checked={!inTraining && page === "overview"}
            onClick={() => onPage("overview")}
          />
          <Item
            iconOnly={rail}
            label="Decision support"
            icon="wf-menu-help"
            checked={!inTraining && page === "decision"}
            onClick={() => onPage("decision")}
          />
          <Item
            iconOnly={rail}
            label="Debriefing"
            icon="wf-menu-debriefing"
            checked={!inTraining && page === "debriefing"}
            onClick={() => onPage("debriefing")}
          />
        </div>
        <div className={`${styles.menuGroup} ${styles.menuFooter}`}>
          <Item
            iconOnly={rail}
            label="Alerts"
            icon="wf-menu-alerts"
            checked={!inTraining && page === "alarms"}
            onClick={() => onPage("alarms")}
          />
          <Item iconOnly={rail} label="Training" icon="wf-menu-training" checked={inTraining} onClick={onTraining} />
          <Item iconOnly={rail} label="Settings" icon="wf-menu-settings" />
        </div>
      </nav>
    </div>
  );
}
