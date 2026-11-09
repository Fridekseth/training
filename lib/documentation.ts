/** The three sections of the documentation, in the order they are shown. */
export const DOCUMENTATION_SECTIONS = [
  {
    slug: "visual-language",
    /** A picture for the card on the documentation page, from `public/`. */
    image: "/hero/application-layers.svg",
    imageAlt: "Isometric drawings of puzzle pieces, speech bubbles, a book, a bar chart and a magnifying glass in teal",
    imagePosition: "object-center",
    title: "Visual language",
    text: "The visual language for learning has the important task of separating learning from the main interface. It can be seen as a pedagogical layer, separate from the main OpenBridge identity, while at the same time appearing in the same family. Visual aspects like color, elevation, illustrations, work together to give the learning patterns their distinct look and feel.",
  },
  {
    slug: "components",
    /** A picture for the card on the documentation page, from `public/`. */
    image: "/documentation/components-overview.webp",
    imageAlt: "The components of the learning pattern on one sheet: illustrations, colors, frames, an explanation box, notifications, comment pins, the step menu and a thread",
    // The sheet is shifted up so its heading is out of the frame. Its background is white, so the empty strip below is not seen.
    imagePosition: "object-center -translate-y-[10%]",
    imageBg: "bg-white",
    title: "Components",
    text: "Components for learning are interactive building blocks that are made specifically to support the OpenBridge learning patterns. They are either customized versions of existing OpenBridge UI components, or new components that follow the OpenBridge guidelines. They are organized into categories based on their purpose: Action, communication, navigation.",
  },
  {
    slug: "patterns",
    /** A picture for the card on the documentation page, from `public/`. */
    image: "/posts/connecting-prototype-to-learning-theory/guided-step-deploy.png",
    imageAlt: "A guided step in the Wavefoil prototype: an explanation box pointing at the Deploy foils button, with the mode tab in the corner",
    imagePosition: "object-center",
    title: "Patterns",
    text: "The Learning patterns are the foundation for how learning in OpenBridge works. They show the essential patterns for layout and interaction, and are made to fit different learning scenarios.",
  },
] as const;

export type DocumentationSection = (typeof DOCUMENTATION_SECTIONS)[number];

export function getDocumentationSection(slug: DocumentationSection["slug"]) {
  return DOCUMENTATION_SECTIONS.find((section) => section.slug === slug)!;
}

export type SectionKey = "visual-language" | "patterns";

export type SectionItem = { slug: string; title: string };

const slugify = (title: string) => title.toLowerCase().replace(/\s+/g, "-");

/** The pages planned for the sections that are not components, in the order they are shown. */
const ITEM_TITLES: Record<SectionKey, string[]> = {
  "visual-language": [
    "Color",
    "Illustration",
    "Icons",
    "Elevation",
    "Animation",
    "Tone of voice",
    "Cursors",
  ],
  patterns: ["Overview", "Learn", "Explore", "Collaborate", "Practice", "Test", "Second screen"],
};

export function getSectionItems(section: SectionKey): SectionItem[] {
  return ITEM_TITLES[section].map((title) => ({ title, slug: slugify(title) }));
}
