// lib/markdown.ts
// Utility functions to read and parse Markdown files
// Used by both blog and case studies pages

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkGfm from "remark-gfm";

// ── Types ────────────────────────────────────────────

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content?: string; // Only populated on individual post pages
}

export interface CaseStudy {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  industry: string;
  outcome: string; // Short one-line outcome for listing cards
  tags: string[];
  content?: string;
}

// ── Blog helpers ─────────────────────────────────────

// Directory where blog markdown files live
const BLOG_DIR = path.join(process.cwd(), "content/blog");

/**
 * Get all blog posts sorted by date (newest first).
 * Reads all .md files in content/blog/
 */
export function getAllBlogPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const fullPath = path.join(BLOG_DIR, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title || "Untitled",
      date: data.date || "",
      excerpt: data.excerpt || "",
      tags: data.tags || [],
    };
  });

  // Sort newest first
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Get a single blog post by slug, including rendered HTML content.
 */
export async function getBlogPost(slug: string): Promise<BlogPost> {
  const fullPath = path.join(BLOG_DIR, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  // Convert markdown to HTML
  const processedContent = await remark()
    .use(remarkGfm) // GitHub-flavored markdown (tables, checkboxes, etc.)
    .use(remarkHtml, { sanitize: false })
    .process(content);

  return {
    slug,
    title: data.title || "Untitled",
    date: data.date || "",
    excerpt: data.excerpt || "",
    tags: data.tags || [],
    content: processedContent.toString(),
  };
}

// ── Case Studies helpers ─────────────────────────────

const CASE_DIR = path.join(process.cwd(), "content/case-studies");

/**
 * Get all case studies sorted by date.
 */
export function getAllCaseStudies(): CaseStudy[] {
  const files = fs.readdirSync(CASE_DIR).filter((f) => f.endsWith(".md"));

  const studies = files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const fullPath = path.join(CASE_DIR, filename);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title || "Untitled",
      date: data.date || "",
      excerpt: data.excerpt || "",
      industry: data.industry || "",
      outcome: data.outcome || "",
      tags: data.tags || [],
    };
  });

  return studies.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Get a single case study by slug, with rendered HTML content.
 */
export async function getCaseStudy(slug: string): Promise<CaseStudy> {
  const fullPath = path.join(CASE_DIR, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);

  return {
    slug,
    title: data.title || "Untitled",
    date: data.date || "",
    excerpt: data.excerpt || "",
    industry: data.industry || "",
    outcome: data.outcome || "",
    tags: data.tags || [],
    content: processedContent.toString(),
  };
}

// ── Utility ──────────────────────────────────────────

/**
 * Format a date string like "2024-03-15" → "March 15, 2024"
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
