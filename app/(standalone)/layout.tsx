import type { ReactNode } from "react";
import "../globals.css";

/**
 * A second root layout with nothing in it: no header, no footer. It is for
 * pages that show a prototype alone, such as one handed to a test participant.
 */
export default function StandaloneLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body
        className="h-full"
        // Inline, because the global stylesheet sets the page colour on body.
        style={{ background: "#1f1f1f" }}
      >
        {children}
      </body>
    </html>
  );
}
