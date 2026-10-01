"use client";

import { useEffect, useState } from "react";
import { ObcTopBar } from "@oicl/openbridge-webcomponents-react/components/top-bar/top-bar";
import { ObcAlertButton } from "@oicl/openbridge-webcomponents-react/components/alert-button/alert-button";
import { ObcClock } from "@oicl/openbridge-webcomponents-react/components/clock/clock";
import { ObcNotificationButton } from "@oicl/openbridge-webcomponents-react/components/notification-button/notification-button";
import { ObcAlertButtonType } from "@oicl/openbridge-webcomponents/dist/components/alert-button/alert-button";

/** The time, ticking each second. The clock component shows the date it is given. */
function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);
  return now;
}

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
  const now = useNow();

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
        date={now.toISOString()}
        showSeconds
        // The clock shows UTC plus an offset, so the offset is the viewer's own.
        timeZoneOffsetHours={-now.getTimezoneOffset() / 60}
      />
    </ObcTopBar>
  );
}
