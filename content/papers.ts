import type { Paper } from "@/lib/papers";

/**
 * The research library. Add an entry per source; the page picks up filters,
 * keyword chips and counts automatically.
 *
 * Entries prefixed "Example —" are placeholders showing the shape of a full
 * record. Replace them with sources you have actually read.
 */
export const papers: Paper[] = [
  {
    id: "openbridge-design-system",
    title: "OpenBridge Design System",
    authors: ["OpenBridge (University of South-Eastern Norway)"],
    year: 2024,
    venue: "openbridge.no",
    kind: "Design system / documentation",
    url: "https://www.openbridge.no/",
    category: "Design Systems",
    keywords: [
      "OpenBridge",
      "maritime",
      "design system",
      "components",
      "bridge design",
    ],
    keyFindings: [
      "Defines a shared component library, palette and layout grid so equipment from different vendors reads as one coherent bridge.",
      "Ships day, dusk and night colour themes as first-class modes rather than an afterthought, driven by the light conditions on a real bridge.",
      "Documentation is aimed at both designers and vendors — the primary artefact is the guideline, not a running product.",
    ],
    relevance:
      "The system my course is built around. Its documentation covers components thoroughly but says comparatively little about how an operator learns them — the gap I want to work in.",
    status: "reading",
  },
  {
    id: "example-journal-article",
    title: "Example — a journal article, showing the full record shape",
    authors: ["Lastname, A.", "Lastname, B."],
    year: 2023,
    venue: "Journal Name, 12(3), 45–67",
    kind: "Journal article",
    url: "https://example.com/paper",
    doi: "10.0000/example.doi",
    category: "Training & Learning",
    keywords: ["training", "skill acquisition", "simulation"],
    keyFindings: [
      "One finding per bullet — write it as a claim you could defend, not a topic label.",
      "Note the evidence: how many participants, what task, what was measured.",
      "Record what the study does not settle; those gaps become your research questions.",
    ],
    relevance:
      "Say in one or two sentences why this source changes what you will design.",
    status: "to read",
  },
  {
    id: "example-standard",
    title: "Example — a standard or regulation",
    authors: ["Issuing Body"],
    year: 2019,
    venue: "Standard reference number",
    kind: "Standard",
    url: "https://example.com/standard",
    category: "Standards & Regulation",
    keywords: ["regulation", "type approval", "human-centred design"],
    keyFindings: [
      "Standards constrain what a training layer is allowed to do to a bridge interface — capture the specific clause, not the gist.",
    ],
    relevance:
      "Constraints worth knowing early, so the concept does not need retrofitting later.",
    status: "to read",
  },
];
