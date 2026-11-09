import type { Metadata } from "next";
import Link from "next/link";
import { PlannedItems } from "@/components/docs/planned-items";
import { ArrowBack } from "@/components/icons";
import { PageHeader } from "@/components/page-header";
import { getDocumentationSection, getSectionItems } from "@/lib/documentation";
import { PAGE_CONTAINER } from "@/lib/layout";

const section = getDocumentationSection("visual-language");

export const metadata: Metadata = {
  title: `${section.title} · Documentation`,
  description: section.text,
};

export default function VisualLanguagePage() {
  return (
    <div className={`${PAGE_CONTAINER} py-16`}>
      <Link
        href="/documentation"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
      >
        <ArrowBack className="size-3.5" />
        Documentation
      </Link>
      <PageHeader title={section.title} lead={section.text} />
      <div className="mt-10">
        <PlannedItems section="visual-language" items={getSectionItems("visual-language")} />
      </div>
    </div>
  );
}
