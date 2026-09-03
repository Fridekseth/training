import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ResearchLibrary } from "@/components/research-library";
import { papers } from "@/content/papers";
import { sortPapers } from "@/lib/papers";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Annotated sources on maritime interfaces, training and design systems, collected for a self-directed interaction design course.",
};

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <PageHeader
        title="Research"
        lead="Papers, standards and references behind the project, each with the findings I want to keep and a note on why it matters here."
      />
      <ResearchLibrary papers={sortPapers(papers)} />
    </div>
  );
}
