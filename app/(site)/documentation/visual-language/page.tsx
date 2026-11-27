import type { Metadata } from "next";
import { PlannedItems } from "@/components/docs/planned-items";
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
      <PageHeader title={section.title} lead={section.text} />
      <div className="mt-10">
        <PlannedItems section="visual-language" items={getSectionItems("visual-language")} />
      </div>
    </div>
  );
}
