// Gives the MDX `about` page the same reading column as the rest of the site.
export default function AboutLayout({ children }: LayoutProps<"/about">) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {children}
    </div>
  );
}
