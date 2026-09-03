// Augments the `*.mdx` module type from `@types/mdx` with the named exports our
// posts declare. Must stay a script (no top-level import/export) so it merges
// with the ambient declaration instead of becoming a module of its own.
declare module "*.mdx" {
  export const metadata: import("@/lib/posts").PostFrontmatter;
}
