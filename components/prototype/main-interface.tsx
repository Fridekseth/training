"use client";

/**
 * The monitoring screen the training sits on top of: a data panel for the line
 * and the line itself. Parts the run-through points at carry `data-step`, which
 * is how the training layer finds what to highlight.
 */

import type { ReactNode } from "react";
import styles from "./main-interface.module.css";

function Asset({
  name,
  size,
  width,
  height,
  className,
}: {
  name: string;
  size?: number;
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt=""
      src={`/prototype/interface/${name}.svg`}
      width={width ?? size}
      height={height ?? size}
      className={className}
      style={{ width: width ?? size, height: height ?? size, display: "block" }}
    />
  );
}

/** The OEE dial, stacked from the layers the design draws it with. */
function Gauge() {
  const layers: [string, string][] = [
    ["oee-gauge", "0"],
    ["gauge-arc2", "-15.59%"],
    ["gauge-limit-low", "0"],
    ["gauge-limit-high", "0"],
    ["gauge-arrow", "-11.24%"],
  ];
  return (
    <span className={styles.gauge}>
      {layers.map(([name, inset]) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={name}
          alt=""
          src={`/prototype/interface/${name}.svg`}
          style={{ position: "absolute", inset, width: "auto", height: "auto" }}
        />
      ))}
    </span>
  );
}

function Chip({ tone, children }: { tone: "alarm" | "warning" | "caution"; children: ReactNode }) {
  return <span className={`${styles.chip} ${styles[tone]}`}>{children}</span>;
}

export function MainInterface() {
  return (
    <div className={styles.screen}>
      <aside className={styles.panel} data-step="data-panel">
        <div className={styles.lineHeader}>
          <p className={styles.lineName}>Linje 1</p>
          <p className={styles.clock}>10:44</p>
        </div>

        <div className={styles.card} data-step="alerts">
          <div className={styles.cardHeader}>
            <Asset name="alerts-bell" size={16} />
            <span className={styles.cardTitle}>Varsler</span>
            <span className={styles.chips}>
              <Chip tone="alarm">1</Chip>
              <Chip tone="warning">1</Chip>
              <Chip tone="caution">1</Chip>
            </span>
          </div>
          <div className={styles.row}>
            <Asset name="alert-icon" size={20} />
            <span className={styles.rowLabelStrong}>Topping</span>
            <span className={styles.rowLabel}>Ishida</span>
            <span className={styles.rowTime}>09:12</span>
          </div>
        </div>

        <div className={styles.card} data-step="tasks">
          <div className={styles.cardHeader}>
            <Asset name="tasks-icon" size={16} />
            <span className={styles.cardTitle}>Oppgaver</span>
            <span className={styles.chips}>
              <Chip tone="caution">1</Chip>
            </span>
          </div>
          <div className={styles.row}>
            <Asset name="task-knife" size={20} />
            <span className={styles.rowLabel}>Knivsjekk</span>
            <span className={styles.rowTime}>09:12</span>
          </div>
        </div>

        <div className={styles.instruments}>
          <div className={styles.performance} data-step="performance">
            <Gauge />
            <div className={styles.readout}>
              <p className={styles.value}>
                <span className={styles.trend}>^</span> 79,84
              </p>
              <p className={styles.unit}>OEE time %</p>
            </div>
            <div className={styles.readout}>
              <p className={styles.value}>84,56</p>
              <p className={styles.unit}>OEE dag %</p>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.production} data-step="production">
            <Asset name="production-dial" size={40} />
            <div className={styles.readout}>
              <p className={styles.target}>20 500</p>
              <p className={styles.value}>
                20 392 <span className={styles.unit}>/ 30 000</span>
              </p>
              <p className={styles.unit}>Product Name Placeholder</p>
              <p className={styles.unit}>#01160</p>
            </div>
          </div>
        </div>

        <div className={styles.stops} data-step="stops">
          <div className={styles.stopsHeader}>
            <span className={styles.stopsHeaderCell}>
              <Asset name="sort-icon" size={16} />
              Stop (siste t.)
            </span>
            <span className={styles.stopsHeaderCell}>Tid</span>
            <span className={styles.stopsHeaderCell}>Ant.</span>
          </div>
          {[
            ["1", "Ishida", "10m", "4"],
            ["2", "Osterobot", "5m", "2"],
            ["3", "Foliemaskin", ">1m", "1"],
            ["4", "Maskin navn", ">1m", "1"],
            ["5", "Maskin navn", ">1m", "1"],
          ].map(([index, name, time, count]) => (
            <div className={styles.stopsRow} key={index + name}>
              <span className={styles.stopsIndex}>{index}</span>
              <span className={styles.stopsName}>{name}</span>
              <span className={styles.stopsTime}>{time}</span>
              <span className={styles.stopsCount}>{count}</span>
            </div>
          ))}
        </div>
      </aside>

      <section className={styles.graphic}>
        <div className={styles.topStrip}>
          <div className={styles.strip}>
            <span className={styles.product}>
              <Asset name="kaak-icon" size={24} />
              <strong>Kaak</strong>
            </span>
            <span className={styles.stripValue}>
              <strong>19:30</strong>
              <span className={styles.unit}>Tid min</span>
            </span>
            <span className={styles.stripValue}>
              <strong>-33°</strong>
              <span className={styles.unit}>Temp C</span>
            </span>
            <span className={styles.stripValue}>
              <strong>5 600</strong>
              <span className={styles.unit}>Antall stk</span>
            </span>
            <span className={styles.stripSpacer} />
            <span className={styles.stripValue}>
              <strong>05:30</strong>
              <span className={styles.unit}>Varig. min</span>
            </span>
            <span className={styles.stripValue}>
              <strong className={styles.stripStrong}>-07:30</strong>
              <span className={styles.unit}>Stopp min</span>
            </span>
          </div>

          <div className={styles.timeline}>
            <div className={styles.timelineTrack}>
              <span className={styles.timelineFill} style={{ left: 0, width: "40%" }} />
              <span className={styles.timelineFill} style={{ left: "62%", width: "4%" }} />
              <span className={styles.timelineFill} style={{ left: "67%", width: "2%" }} />
              <span className={styles.timelineFill} style={{ left: "70%", width: "14%" }} />
            </div>
            <div className={styles.timelineLabels}>
              <span>20min</span>
              <span>15min</span>
              <span>10min</span>
              <span>5min</span>
            </div>
          </div>
        </div>

        <div className={styles.line}>
          <Asset name="line-upper" width={664.813} height={76.796} className={styles.lineUpper} />
          <Asset name="line-main" width={794.014} height={188.403} className={styles.lineMain} />

          <div className={styles.inCallout}>
            <div className={styles.calloutHeader}>
              <span className={styles.calloutArrow}>&#8594;</span> Kaak
            </div>
            <div className={styles.calloutRow}>
              <span>Ant. inn</span>
              <strong>12 352 stk</strong>
            </div>
          </div>

          <div className={styles.outCallout} data-step="freezer">
            <div className={styles.calloutHeader}>
              <span className={styles.calloutArrow}>&#8594;</span> Fryser
            </div>
            <div className={styles.calloutRow}>
              <span>Ant. ut</span>
              <strong>12 352 stk</strong>
            </div>
            <div className={styles.calloutRow}>
              <span>Frysetid</span>
              <strong>12 352</strong>
            </div>
            <div className={styles.calloutRow}>
              <span>Temp.</span>
              <strong>-33° C</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
