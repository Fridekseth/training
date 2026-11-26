import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // The round N badge in the corner of the page while developing is hidden. Errors are still shown.
  devIndicators: false,
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
