"use client";

/**
 * The two tables in the design, built on `obc-table`. Cells that hold more than
 * text (the progress ring, the status tag, the start button) are rendered with
 * Lit templates, which is what the component's `renderCell` expects.
 */

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
} from "./training-data";

const TAG_COLOR: Record<Status, TagColor> = {
  completed: TagColor.green,
  "in-progress": TagColor.yellow,
  "not-started": TagColor.blue,
};

/** A ring plus its percentage, as the Result column shows it. */
function resultCell(value: number) {
  return html`
    <div style="display:flex;align-items:center;gap:8px;">
      <!-- the ring positions itself absolutely, so it needs a box of its own -->
      <span style="position:relative;display:block;flex:0 0 24px;width:24px;height:24px;">
        <obc-circular-progress
          mode=${CircularProgressMode.determinate}
          value=${value}
          style="width:24px;height:24px;"
        ></obc-circular-progress>
      </span>
      <span>${value}% correct</span>
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

export function ChapterTable({
  chapters,
  onStart,
}: {
  chapters: Chapter[];
  onStart: (chapter: Chapter) => void;
}) {
  const columns: ObcTableColumn[] = [
    {
      label: "Chapters",
      key: "chapter",
      renderCell: (_value, row) => {
        const chapter = chapters.find((item) => item.id === row.id);
        return chapter ? iconLabelCell(chapter.icon, chapter.title) : html``;
      },
    },
    {
      label: "Result",
      key: "result",
      renderCell: (_value, row) => {
        const chapter = chapters.find((item) => item.id === row.id);
        return chapter ? resultCell(chapter.result) : html``;
      },
    },
    { label: "Status", key: "status", headerType: undefined },
    {
      label: "Start",
      key: "start",
      renderCell: (_value, row) => {
        const chapter = chapters.find((item) => item.id === row.id);
        return html`
          <obc-button
            variant="raised"
            showTrailingIcon
            @click=${() => chapter && onStart(chapter)}
          >
            Start
            <obi-chevron-right-google slot="trailing-icon"></obi-chevron-right-google>
          </obc-button>
        `;
      },
    },
  ];

  const data: ObcTableRow[] = chapters.map((chapter) => ({
    id: chapter.id,
    selected: Boolean(chapter.highlighted),
    chapter: { type: ObcTableCellType.Regular, text: chapter.title },
    result: { type: ObcTableCellType.Regular, text: `${chapter.result}% correct` },
    status: {
      type: ObcTableCellType.Tag,
      label: STATUS_LABEL[chapter.status],
      color: TAG_COLOR[chapter.status],
      hasIcon: true,
    },
    start: { type: ObcTableCellType.Button, text: "Start" },
  }));

  return <ObcTable columns={columns} data={data} rowDivider showHeader />;
}

export function TrainingLogTable({ entries }: { entries: LogEntry[] }) {
  const columns: ObcTableColumn[] = [
    { label: "Date", key: "date" },
    {
      label: "Title",
      key: "title",
      renderCell: (_value, row) => {
        const entry = entries.find((item) => item.id === row.id);
        return entry
          ? html`<span><strong>${entry.kind}</strong> ${entry.title}</span>`
          : html``;
      },
    },
    {
      label: "Result",
      key: "result",
      renderCell: (_value, row) => {
        const entry = entries.find((item) => item.id === row.id);
        return entry ? resultCell(entry.result) : html``;
      },
    },
    { label: "Progress", key: "progress" },
  ];

  const data: ObcTableRow[] = entries.map((entry) => ({
    id: entry.id,
    date: { type: ObcTableCellType.Regular, text: entry.date },
    title: { type: ObcTableCellType.Regular, text: `${entry.kind} ${entry.title}` },
    result: { type: ObcTableCellType.Regular, text: `${entry.result}% correct` },
    progress: {
      type: ObcTableCellType.Tag,
      label: STATUS_LABEL[entry.status],
      color: TAG_COLOR[entry.status],
      hasIcon: true,
    },
  }));

  return <ObcTable columns={columns} data={data} rowDivider showHeader />;
}
