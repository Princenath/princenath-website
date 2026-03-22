// app/sitemap.ts
// Next.js 14 dynamic sitemap — auto-generates sitemap.xml at build time
// Automatically includes every blog post and case study as you add them
// Accessible at: https://princenath.com/sitemap.xml

import { MetadataRoute } from "next";
import { getAllBlogPosts, getAllCaseStudies } from "@/lib/markdown";

const BASE_URL = "https://princenath.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // ── Static pages ─────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0, // Homepage = highest priority
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9, // Blog index — updated frequently
    },
    {
      url: `${BASE_URL}/case-studies`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9, // Case studies index
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // ── Dynamic blog post pages ───────────────────────────
  // Reads content/blog/*.md — every new post is automatically included
  const blogPosts = getAllBlogPosts();
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8, // Individual articles — high value for SEO
  }));

  // ── Dynamic case study pages ──────────────────────────
  // Reads content/case-studies/*.md — every new case study auto-included
  const caseStudies = getAllCaseStudies();
  const caseStudyPages: MetadataRoute.Sitemap = caseStudies.map((cs) => ({
    url: `${BASE_URL}/case-studies/${cs.slug}`,
    lastModified: new Date(cs.date),
    changeFrequency: "monthly" as const,
    priority: 0.8, // Case studies — high value for SEO
  }));

  // ── Return combined sitemap ───────────────────────────
  return [...staticPages, ...blogPages, ...caseStudyPages];
}
