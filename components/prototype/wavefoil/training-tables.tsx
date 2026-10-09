"use client";

/**
 * The two tables of the Wavefoil training, on `obc-table` like the Orkla ones.
 * Here the result reads as a plain percentage, the columns that can be sorted
 * carry the library's sort arrow, and the widths follow the design.
 */

import { useState } from "react";
import { html } from "lit";
import { ObcTable } from "@oicl/openbridge-webcomponents-react/components/table/table";
import "@oicl/openbridge-webcomponents/dist/building-blocks/circular-progress/circular-progress.js";
import "@oicl/openbridge-webcomponents/dist/components/tag/tag.js";
import "@oicl/openbridge-webcomponents/dist/components/button/button.js";
import "@oicl/openbridge-webcomponents/dist/icons/icon-chevron-right-google.js";
import {
  ObcTableCellType,
  type ObcTableColumn,
  type ObcTableRow,
} from "@oicl/openbridge-webcomponents/dist/components/table/table";
import { TagColor } from "@oicl/openbridge-webcomponents/dist/components/tag/tag";
import { CircularProgressMode } from "@oicl/openbridge-webcomponents/dist/building-blocks/circular-progress/circular-progress";
import {
  type Chapter,
  type LogEntry,
  type Status,
  STATUS_LABEL,
} from "../training-data";
import type { TestResult } from "./guided-data";
import styles from "./training.module.css";

const TAG_COLOR: Record<Status, TagColor> = {
  completed: TagColor.green,
  "in-progress": TagColor.yellow,
  "not-started": TagColor.blue,
};

/** Not started reads before in progress, which reads before completed. */
const STATUS_ORDER: Record<Status, number> = {
  "not-started": 0,
  "in-progress": 1,
  completed: 2,
};

/**
 * A ring plus its percentage, as the Result column shows it. The chapter list
 * of Learning draws the ring larger and in the neutral dark grey.
 */
function resultCell(value: number, neutral = false) {
  const size = neutral ? 28 : 24;
  return html`
    <div style="display:flex;align-items:center;gap:8px;">
      <!-- the ring positions itself absolutely, so it needs a box of its own -->
      <span style="position:relative;display:block;flex:0 0 ${size}px;width:${size}px;height:${size}px;">
        <obc-circular-progress
          mode=${CircularProgressMode.determinate}
          value=${value}
          style="width:${size}px;height:${size}px;${neutral ? "--instrument-enhanced-secondary-color:var(--element-neutral-color,#535353);" : ""}"
        ></obc-circular-progress>
      </span>
      <span>${value}%</span>
    </div>
  `;
}

function iconLabelCell(icon: string, label: string) {
  return html`
    <div style="display:flex;align-items:center;gap:8px;">
      <span
        aria-hidden="true"
        style="display:inline-block;width:24px;height:24px;background-color:currentColor;
               -webkit-mask:url(/prototype/icons/${icon}.svg) center / contain no-repeat;
               mask:url(/prototype/icons/${icon}.svg) center / contain no-repeat;"
      ></span>
      <span>${label}</span>
    </div>
  `;
}

/** dd.mm.yy, so 23.11.25 sorts before 18.08.26. */
function dateValue(text: string) {
  const [day, month, year] = text.split(".").map(Number);
  return year * 10_000 + month * 100 + day;
}

/** The small icon each status carries in the design, drawn in the tag's colour. */
const TAG_ICON: Record<Status, string> = {
  completed: "wf-tag-completed",
  "in-progress": "wf-tag-in-progress",
  "not-started": "wf-tag-not-started",
};

function tagIcon(status: Status) {
  const url = `/prototype/icons/${TAG_ICON[status]}.svg`;
  return html`<span
    aria-hidden="true"
    style="display:block;width:16px;height:16px;background-color:currentColor;
           -webkit-mask:url(${url}) center / contain no-repeat;
           mask:url(${url}) center / contain no-repeat;"
  ></span>`;
}

const tagCell = (status: Status) => ({
  type: ObcTableCellType.Tag as const,
  label: STATUS_LABEL[status],
  color: TAG_COLOR[status],
  hasIcon: true,
  icon: tagIcon(status),
});

export function ChapterTable({
  chapters,
  onStart,
  gettingStarted = false,
}: {
  chapters: Chapter[];
  onStart: (chapter: Chapter) => void;
  /** Learning's list: a completed chapter is opened rather than started, and the rings are neutral. */
  gettingStarted?: boolean;
}) {
  const find = (id: string) => chapters.find((item) => item.id === id);
  // No row is picked out until the learner clicks one.
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const columns: ObcTableColumn[] = [
    {
      label: "Chapters",
      key: "chapter",
      dividerRight: true,
      renderCell: (_value, row) => {
        const chapter = find(row.id);
        return chapter ? iconLabelCell(chapter.icon, chapter.title) : html``;
      },
    },
    {
      label: "Result",
      key: "result",
      dividerRight: true,
      renderCell: (_value, row) => {
        const chapter = find(row.id);
        return chapter ? resultCell(chapter.result, gettingStarted) : html``;
      },
    },
    {
      label: "Status",
      key: "status",
      dividerRight: true,
      sortable: true,
      // Completed first, which is the order the chapters are already in.
      sortDirection: "desc",
      compareFunction: (_a, _b, aRow, bRow) =>
        STATUS_ORDER[find(aRow.id)?.status ?? "not-started"] -
        STATUS_ORDER[find(bRow.id)?.status ?? "not-started"],
    },
    {
      label: "Start",
      key: "start",
      renderCell: (_value, row) => {
        const chapter = find(row.id);
        const open = gettingStarted && chapter?.status === "completed";
        return html`
          <obc-button
            variant=${open ? "normal" : "raised"}
            style=${open ? "--ui-components-button-label-spacing:6px;" : ""}
            showTrailingIcon
            @click=${() => chapter && onStart(chapter)}
          >
            ${open ? "Open" : "Start"}
            <obi-chevron-right-google slot="trailing-icon"></obi-chevron-right-google>
          </obc-button>
        `;
      },
    },
  ];

  const data: ObcTableRow[] = chapters.map((chapter) => ({
    id: chapter.id,
    selected: chapter.id === selectedId,
    chapter: { type: ObcTableCellType.Regular, text: chapter.title },
    result: { type: ObcTableCellType.Regular, text: `${chapter.result}%` },
    status: tagCell(chapter.status),
    start: { type: ObcTableCellType.Button, text: "Start" },
  }));

  return (
    <ObcTable
      className={`${styles.table} ${styles.chapterTable}`}
      columns={columns}
      data={data}
      rowDivider
      showHeader
      onRowClick={(event) => setSelectedId(event.detail.row.id)}
    />
  );
}

/** A question as a sentence: it gets its full stop unless it is one that already ends in a question mark. */
const sentence = (text: string) => (text.endsWith("?") ? text : `${text}.`);

/** The questions of a test, what was answered, and whether it was right. */
export function ResultsTable({ results }: { results: TestResult[] }) {
  const total = results.length ? Math.round((results.filter((item) => item.correct).length / results.length) * 100) : 0;
  const scoreTag = (correct: boolean) => {
    const icon = correct ? "wf-tag-completed" : "wf-tag-incorrect";
    const url = `/prototype/icons/${icon}.svg`;
    return {
      type: ObcTableCellType.Tag as const,
      label: correct ? "Correct" : "Incorrect",
      color: correct ? TagColor.green : TagColor.red,
      hasIcon: true,
      icon: html`<span
        aria-hidden="true"
        style="display:block;width:16px;height:16px;background-color:currentColor;
               -webkit-mask:url(${url}) center / contain no-repeat;
               mask:url(${url}) center / contain no-repeat;"
      ></span>`,
    };
  };

  const columns: ObcTableColumn[] = [
    {
      label: "Question",
      key: "question",
      dividerRight: true,
      renderCell: (_value, row) => {
        if (row.id === "total") return html`<strong>Total score</strong>`;
        const at = Number(row.id);
        const result = results[at];
        return result
          ? html`<span
              style="display:block;min-width:0;overflow:hidden;text-align:left;text-overflow:ellipsis;white-space:nowrap;"
              ><strong>${at + 1}.</strong> ${sentence(result.question)}</span
            >`
          : html``;
      },
    },
    { label: "Your answer", key: "answer", dividerRight: true },
    { label: "Score", key: "score" },
  ];

  const data: ObcTableRow[] = [
    ...results.map((result, at) => ({
      id: String(at),
      question: { type: ObcTableCellType.Regular, text: `${at + 1}. ${sentence(result.question)}` },
      answer: { type: ObcTableCellType.Regular, text: result.answer },
      score: scoreTag(result.correct),
    })),
    // The last row sums the test up as one score.
    {
      id: "total",
      question: { type: ObcTableCellType.Regular, text: "Total score" },
      answer: { type: ObcTableCellType.Regular, text: "" },
      score: { type: ObcTableCellType.Regular, text: `${total}%` },
    },
  ];

  return (
    <ObcTable
      className={`${styles.table} ${styles.resultsTable}`}
      columns={columns}
      data={data}
      rowDivider
      showHeader
    />
  );
}

export function TrainingLogTable({ entries }: { entries: LogEntry[] }) {
  const find = (id: string) => entries.find((item) => item.id === id);

  const columns: ObcTableColumn[] = [
    {
      label: "Date",
      key: "date",
      dividerRight: true,
      sortable: true,
      // Newest first, which is the order the log is already in.
      sortDirection: "desc",
      compareFunction: (_a, _b, aRow, bRow) =>
        dateValue(find(aRow.id)?.date ?? "") - dateValue(find(bRow.id)?.date ?? ""),
    },
    {
      label: "Title",
      key: "title",
      dividerRight: true,
      renderCell: (_value, row) => {
        const entry = find(row.id);
        return entry
          ? html`<span
              style="display:block;min-width:0;overflow:hidden;text-align:left;text-overflow:ellipsis;white-space:nowrap;"
              ><strong>${entry.kind}</strong> ${entry.title}</span
            >`
          : html``;
      },
    },
    {
      label: "Result",
      key: "result",
      dividerRight: true,
      renderCell: (_value, row) => {
        const entry = find(row.id);
        return entry ? resultCell(entry.result) : html``;
      },
    },
    {
      label: "Progress",
      key: "progress",
      sortable: true,
      compareFunction: (_a, _b, aRow, bRow) =>
        STATUS_ORDER[find(aRow.id)?.status ?? "not-started"] -
        STATUS_ORDER[find(bRow.id)?.status ?? "not-started"],
    },
  ];

  const data: ObcTableRow[] = entries.map((entry) => ({
    id: entry.id,
    date: { type: ObcTableCellType.Regular, text: entry.date },
    title: { type: ObcTableCellType.Regular, text: `${entry.kind} ${entry.title}` },
    result: { type: ObcTableCellType.Regular, text: `${entry.result}%` },
    progress: tagCell(entry.status),
  }));

  return (
    <ObcTable
      className={`${styles.table} ${styles.logTable}`}
      columns={columns}
      data={data}
      rowDivider
      showHeader
    />
  );
}
