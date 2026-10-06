"use client";

/**
 * The application menu, opened from the hamburger in the top bar. It slides
 * over the screen under the bar and is where the operator reaches Training.
 * The three pages and Training lead somewhere; Settings is drawn as in the
 * design but has no screen behind it.
 */

import { ObcNavigationItem } from "@oicl/openbridge-webcomponents-react/components/navigation-item/navigation-item";
import { MaskIcon } from "../pieces";
import type { AppPage } from "./explore-data";
import styles from "./training.module.css";

const ACTIVE = "var(--on-amplified-active-color, #1d3c67)";
const NEUTRAL = "var(--on-flat-neutral-color, #535353)";

function Item({
  label,
  icon,
  checked = false,
  onClick,
}: {
  label: string;
  icon: string;
  checked?: boolean;
  onClick?: () => void;
}) {
  return (
    <ObcNavigationItem
      label={label}
      checked={checked}
      hasIcon
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
  onPage,
  onTraining,
  onClose,
}: {
  page: AppPage;
  inTraining: boolean;
  onPage: (page: AppPage) => void;
  onTraining: () => void;
  onClose: () => void;
}) {
  return (
    <div className={styles.menuLayer}>
      {/* Anywhere else on the screen closes the menu again. */}
      <div className={styles.scrim} onClick={onClose} aria-hidden="true" />
      {/*
        The library's full menu is 320px wide and the design's is 195, so the
        panel is built from its navigation items instead.
      */}
      <nav className={styles.menu}>
        <div className={styles.menuGroup}>
          <Item
            label="Overview"
            icon="nav-home"
            checked={!inTraining && page === "overview"}
            onClick={() => onPage("overview")}
          />
          <Item
            label="Decision support"
            icon="wf-menu-help"
            checked={!inTraining && page === "decision"}
            onClick={() => onPage("decision")}
          />
          <Item
            label="Debriefing"
            icon="wf-menu-debriefing"
            checked={!inTraining && page === "debriefing"}
            onClick={() => onPage("debriefing")}
          />
        </div>
        <div className={`${styles.menuGroup} ${styles.menuFooter}`}>
          <Item
            label="Alerts"
            icon="wf-menu-alerts"
            checked={!inTraining && page === "alarms"}
            onClick={() => onPage("alarms")}
          />
          <Item label="Training" icon="wf-menu-training" checked={inTraining} onClick={onTraining} />
          <Item label="Settings" icon="wf-menu-settings" />
        </div>
      </nav>
    </div>
  );
}
