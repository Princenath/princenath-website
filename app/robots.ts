// app/robots.ts
// Next.js 14 dynamic robots.txt generator
// Accessible at: https://princenath.com/robots.txt

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all crawlers (Googlebot, Bingbot, etc.) full access
        userAgent: "*",
        allow: "/",
        // Nothing to disallow on a personal/portfolio site
      },
    ],
    // Points crawlers directly to the sitemap
    sitemap: "https://princenath.com/sitemap.xml",
  };
}
