"use client";

/**
 * The application menu, opened from the hamburger in the top bar. It slides
 * over the screen under the bar and is where the operator reaches Training.
 * Only Overview and Training lead anywhere; the other items are drawn as in the
 * design but have no screen behind them.
 */

import { ObcNavigationItem } from "@oicl/openbridge-webcomponents-react/components/navigation-item/navigation-item";
import { MaskIcon } from "../pieces";
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
  inTraining,
  onOverview,
  onTraining,
  onClose,
}: {
  inTraining: boolean;
  onOverview: () => void;
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
          <Item label="Overview" icon="nav-home" checked={!inTraining} onClick={onOverview} />
          <Item label="Decision support" icon="wf-menu-decision-support" />
        </div>
        <div className={`${styles.menuGroup} ${styles.menuFooter}`}>
          <Item label="Alerts" icon="wf-menu-alerts" />
          <Item label="Help" icon="wf-menu-help" />
          <Item label="Training" icon="wf-menu-training" checked={inTraining} onClick={onTraining} />
          <Item label="Settings" icon="wf-menu-settings" />
        </div>
      </nav>
    </div>
  );
}
