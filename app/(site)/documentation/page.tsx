import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { DOCUMENTATION_SECTIONS } from "@/lib/documentation";
import { PAGE_CONTAINER } from "@/lib/layout";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "All building blocks for creating learning patterns in OpenBridge interfaces: visual language, components and patterns.",
};

export default function DocumentationPage() {
  return (
    <div className={`${PAGE_CONTAINER} py-16`}>
      <PageHeader
        title="Documentation"
        lead="This documentation documents all building blocks for creating learning patterns in OpenBridge interfaces. The documentation is divided into three sections, visual language, components and patterns."
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {DOCUMENTATION_SECTIONS.map((section) => (
          <Link
            key={section.slug}
            href={`/documentation/${section.slug}`}
            className="group overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-accent"
          >
            <div
              className={`aspect-[16/9] overflow-hidden border-b border-border ${
                "imageBg" in section ? section.imageBg : "bg-accent-soft"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={section.image}
                alt={section.imageAlt}
                className={`size-full object-cover ${section.imagePosition} transition-transform duration-300 group-hover:scale-[1.03]`}
              />
            </div>
            <h2 className="px-5 py-4 text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
              {section.title}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
