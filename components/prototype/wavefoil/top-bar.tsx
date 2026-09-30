"use client";

import { ObcTopBar } from "@oicl/openbridge-webcomponents-react/components/top-bar/top-bar";
import { ObcAlertButton } from "@oicl/openbridge-webcomponents-react/components/alert-button/alert-button";
import { ObcClock } from "@oicl/openbridge-webcomponents-react/components/clock/clock";
import { ObcNotificationButton } from "@oicl/openbridge-webcomponents-react/components/notification-button/notification-button";
import { ObcAlertButtonType } from "@oicl/openbridge-webcomponents/dist/components/alert-button/alert-button";

/**
 * The top bar of the Wavefoil screens. The overview carries the alert and the
 * notification buttons; the training section keeps one alert button, drawn as
 * a normal button in the design.
 */
export function WavefoilTopBar({
  pageName,
  training = false,
  palette,
  onDim,
  menuOpen,
  onMenu,
}: {
  pageName: string;
  training?: boolean;
  palette: string;
  onDim: () => void;
  menuOpen: boolean;
  onMenu: () => void;
}) {
  return (
    <ObcTopBar
      appTitle="Wavefoil"
      pageName={pageName}
      showClock
      showDimmingButton
      dimmingButtonActivated={palette !== "day"}
      onDimmingButtonClicked={onDim}
      menuButtonActivated={menuOpen}
      onMenuButtonClicked={onMenu}
    >
      {training ? (
        <span slot="alerts" style={{ display: "flex", alignItems: "center" }}>
          <ObcAlertButton type={ObcAlertButtonType.Normal} />
        </span>
      ) : (
        <span slot="alerts" style={{ display: "flex", alignItems: "center" }}>
          <ObcAlertButton type={ObcAlertButtonType.Flat} />
          <ObcNotificationButton />
        </span>
      )}
      <ObcClock
        slot="clock"
        date="2026-09-29T14:30:12Z"
        showSeconds
        timeZoneOffsetHours={0}
      />
    </ObcTopBar>
  );
}
