"use client";

/**
 * The alarm system: the library's alert list page, filled with the faults a
 * foil drive can raise.
 */

import { useState } from "react";
import { ObcAlertListPageSmall } from "@oicl/openbridge-webcomponents-react/pages/alert-list-page-small/alert-list-page-small";
import { AlertType, type Alert } from "@oicl/openbridge-webcomponents/dist/types";
import { AlertListMode } from "@oicl/openbridge-webcomponents/dist/pages/alert-list-page-small/alert-list-page-small";
import styles from "./pages.module.css";

const AT = new Date("2026-10-05T09:43:15");

function alert(
  id: string,
  text: string,
  note: string,
  type: AlertType,
  options: { rectified?: boolean; acknowledged?: boolean } = {},
): Alert {
  return {
    id,
    tagId: `#${"0".repeat(6)}`,
    // The list sets the source in bold and the text after it, as the design
    // sets the fault in bold and its code after it.
    source: text,
    text: note,
    type,
    time: AT,
    acknowledged: options.acknowledged
      ? { acknowledgedBy: "Operator", acknowledgedAt: AT }
      : false,
    active: options.rectified ? { rectifiedTime: AT } : true,
  };
}

const ALERTS: Alert[] = [
  alert("1", "Emergency stop activated", "", AlertType.Alarm),
  alert("2", "Communication", "Error 1", AlertType.Alarm),
  alert("3", "Communication", "Error 1", AlertType.Alarm),
  alert("4", "Encoder failure", "No movement", AlertType.Alarm, { rectified: true }),
  alert("5", "Emergency stop activated", "", AlertType.Alarm, { rectified: true }),
  alert("6", "Main drive fault", "29968", AlertType.Alarm, { rectified: true }),
  alert("7", "Main drive fault", "0", AlertType.Warning),
  alert("8", "Communication", "Error 1", AlertType.Caution, { acknowledged: true }),
  alert("9", "Main drive fault", "29968", AlertType.Caution, { acknowledged: true }),
  alert("10", "Main drive fault", "0", AlertType.Caution, { acknowledged: true }),
];

export function AlarmPage() {
  const [alerts, setAlerts] = useState(ALERTS);
  const acknowledge = (ids: string[]) =>
    setAlerts((all) =>
      all.map((item) =>
        ids.includes(item.id)
          ? { ...item, acknowledged: { acknowledgedBy: "Operator", acknowledgedAt: new Date() } }
          : item,
      ),
    );

  return (
    <div className={styles.alarms} data-comment="Alarm list">
      <ObcAlertListPageSmall
        alerts={alerts}
        selectedMode={AlertListMode.UNACKED}
        showTime
        onAckClick={(event) => acknowledge([event.detail.alert.id])}
        onAckAllVisibleClick={(event) =>
          acknowledge(event.detail.alerts.map((item) => item.id))
        }
      />
    </div>
  );
}
