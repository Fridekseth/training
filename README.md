# Training in OpenBridge

Project hub for a self-directed interaction design course exploring how
training can be integrated into [OpenBridge](https://www.openbridge.no/)
interfaces. Built with Next.js 16 (App Router), MDX and Tailwind v4.

```bash
npm run dev
```

## Structure

| Path                      | What it is                                       |
| ------------------------- | ------------------------------------------------ |
| `content/posts/*.mdx`     | Process entries, one file per entry              |
| `content/papers.ts`       | The research library data                        |
| `lib/posts.ts`            | Loads posts + frontmatter from `content/posts`    |
| `lib/papers.ts`           | Types, categories and helpers for the library    |
| `mdx-components.tsx`      | How markdown elements are styled                 |
| `app/globals.css`         | Colour tokens for light and dark                 |

## Adding a process entry

Drop a new `.mdx` file into `content/posts/`. The filename becomes the URL, and
the listing picks it up with no other wiring. Every post starts with a
`metadata` export:

```mdx
export const metadata = {
  title: "Entry title",
  date: "2026-09-02",
  summary: "One or two sentences shown in the listing.",
  stage: "research",
  tags: ["OpenBridge", "prototype"],
  draft: true,
};

Write the entry here as normal markdown.
```

`title`, `date` and `summary` are required; `stage`, `tags` and `draft` are
optional. Fields are type-checked against `PostFrontmatter` in `lib/posts.ts`.

**Drafts.** `draft: true` hides an entry from the listing in production builds
while keeping it visible in `next dev`. The entry's own page is still built, so
its URL stays shareable: unlisted, not private. Delete the field to publish.

You can import and use React components inside any `.mdx` file, which is how
interactive figures can go straight into an entry.

## Adding a research source

Append an entry to the array in `content/papers.ts`. Search, category filters
and counts on `/research` all derive from the data, so nothing else to update.

Every source carries these fields, all required:

| Field         | Type       | Notes                                        |
| ------------- | ---------- | -------------------------------------------- |
| `id`          | `string`   | Slug, used as the anchor on `/research`       |
| `title`       | `string`   |                                              |
| `authors`     | `string[]` |                                              |
| `year`        | `number`   |                                              |
| `venue`       | `string`   | Journal, conference, course, publisher       |
| `url`         | `string?`  | Omit when the source has no public link       |
| `accessed`    | `string?`  | ISO date the link was last checked; omit alongside `url` |
| `citation`    | `string`   | Full reference, in your citation style       |
| `category`    | union[]    | One or more of `CATEGORIES`: `learning`, `neuroscience`, `ID`, `UX` |
| `type`        | union      | One of `TYPES`: `lecture`, `article`, `book`, `chapter`, `design` |
| `keywords`    | `string[]` | Rendered as chips; click one to search it    |
| `keyFindings` | `string[]` | One claim per bullet, not a topic label      |
| `relevance`   | `string[]` | One bullet per reason it changes your design |

`category` and `type` draw on union types, so TypeScript rejects a typo rather
than letting the source drop silently out of the filters. Add a value to
`CATEGORIES` or `TYPES` in `lib/papers.ts` and it becomes usable immediately:
a new category appears as a filter as soon as a source uses it. A source can
sit in several categories and shows up under each.

Every field except `url` and `accessed` is required, which keeps records
complete. A source you have logged but not yet worked through can carry empty
`keyFindings` and `relevance` arrays; those sections are hidden on the card
until you fill them in. If a required field genuinely does not apply to some
source, mark it optional with `?` in `lib/papers.ts`.

## Light and dark

The palette lives in `app/globals.css`, where each token is declared once with
both values via CSS `light-dark()`. Switching theme flips a single
`color-scheme` property rather than restating the palette, so adding a colour
means editing one line.

The toggle in the nav bar follows the system preference until you click it;
after that your choice is stored in `localStorage` and wins in both directions.
An inline script in `app/layout.tsx` applies the stored theme while the HTML is
being parsed, so there is no flash of the wrong palette on load.

## Notes

- Every route is statically prerendered; `npm run build` catches a bad date,
  a missing field or a broken category before it ships.
- Markdown images render as plain `<img>` because markdown carries no
  dimensions. Import `next/image` inside an `.mdx` file when you want an
  optimised image.
