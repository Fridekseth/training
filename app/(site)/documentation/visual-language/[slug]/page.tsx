import type { Metadata } from "next";
import { SectionItemPage } from "@/components/docs/section-item-page";
import { getDocumentationSection, getSectionItems } from "@/lib/documentation";

const KEY = "visual-language";

export function generateStaticParams() {
  return getSectionItems(KEY).map(({ slug }) => ({ slug }));
}

// Every page is known at build time, so an unknown slug 404s without rendering.
export const dynamicParams = false;

export async function generateMetadata(
  props: PageProps<"/documentation/visual-language/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const item = getSectionItems(KEY).find((candidate) => candidate.slug === slug);
  return { title: `${item?.title} · ${getDocumentationSection(KEY).title} · Documentation` };
}

export default async function Page(props: PageProps<"/documentation/visual-language/[slug]">) {
  const { slug } = await props.params;
  return <SectionItemPage section={KEY} slug={slug} />;
}
