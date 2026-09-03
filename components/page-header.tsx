import type { ReactNode } from "react";

export function PageHeader({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-border pb-8">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      {lead ? (
        <p className="mt-3 max-w-xl text-[0.975rem] leading-7 text-muted">
          {lead}
        </p>
      ) : null}
      {children}
    </div>
  );
}
