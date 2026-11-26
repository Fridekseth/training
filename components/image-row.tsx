import type { ReactNode } from "react";

/**
 * Pictures side by side, two to a row, so a run of them takes less scrolling.
 * Written around plain markdown images in a post; on a narrow screen they stack.
 * Each picture is cut to the same shape (3:2, as the camera takes them), so the ones in a row line up.
 */
export function ImageRow({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 grid gap-3 sm:grid-cols-2 [&_img]:aspect-[3/2] [&_img]:w-full [&_img]:object-cover [&>p]:my-0">
      {children}
    </div>
  );
}
