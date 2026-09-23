import { PAGE_CONTAINER, PROSE_WIDTH } from "@/lib/layout";
// Gives the MDX `about` page the same reading column as the rest of the site.
export default function AboutLayout({ children }: LayoutProps<"/about">) {
  return (
    <div className={`${PAGE_CONTAINER} py-16`}>
      <div className={`mx-auto ${PROSE_WIDTH}`}>{children}</div>
    </div>
  );
}
