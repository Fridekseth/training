"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/**
 * The previews use the prototype's components, and some of those are the library's elements, which
 * need the browser to define them. So every preview is loaded in the browser only.
 */
const browserOnly = (load: () => Promise<ComponentType>) =>
  dynamic(load, {
    ssr: false,
    loading: () => (
      <div className="grid h-40 place-items-center rounded-xl border border-dashed border-border text-sm text-faint">
        Loading the preview...
      </div>
    ),
  });

/** The live previews, under the slug of the page they belong to. A page that is not here has none yet. */
const PREVIEWS: Record<string, ComponentType> = {
  "mode-tab": browserOnly(() => import("./mode-tab-preview").then((mod) => mod.ModeTabPreview)),
  "mode-intro": browserOnly(() => import("./mode-intro-preview").then((mod) => mod.ModeIntroPreview)),
  "training-frame": browserOnly(() =>
    import("./training-frame-preview").then((mod) => mod.TrainingFramePreview),
  ),
  "guided-step": browserOnly(() => import("./guided-step-preview").then((mod) => mod.GuidedStepPreview)),
  "step-menu": browserOnly(() => import("./step-menu-preview").then((mod) => mod.StepMenuPreview)),
  "comment-pin": browserOnly(() => import("./comment-pin-preview").then((mod) => mod.CommentPinPreview)),
  thread: browserOnly(() => import("./thread-preview").then((mod) => mod.ThreadPreview)),
  toast: browserOnly(() => import("./toast-preview").then((mod) => mod.ToastPreview)),
  "rich-button": browserOnly(() => import("./rich-button-preview").then((mod) => mod.RichButtonPreview)),
  cursors: browserOnly(() => import("./cursors-preview").then((mod) => mod.CursorsPreview)),
  "test-toolbar": browserOnly(() =>
    import("./test-toolbar-preview").then((mod) => mod.TestToolbarPreview),
  ),
};

export function ComponentPreview({ slug }: { slug: string }) {
  const Preview = PREVIEWS[slug];
  if (!Preview) {
    return (
      <div className="grid h-40 place-items-center rounded-xl border border-dashed border-border text-sm text-faint">
        No preview yet
      </div>
    );
  }
  return <Preview />;
}
