// app/blog/[slug]/page.tsx
// Individual blog post page
// The [slug] matches the filename: e.g. content/blog/aws-cost-tips.md → /blog/aws-cost-tips

import { getAllBlogPosts, getBlogPost, formatDate } from "@/lib/markdown";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// ── Generate static params for all posts ─────────────
// Next.js pre-renders each post at build time
export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// ── Dynamic metadata per post ────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const post = await getBlogPost(params.slug);
    return {
      title: post.title,
      description: post.excerpt,
      keywords: post.tags,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: "article",
        publishedTime: post.date,
      },
    };
  } catch {
    return { title: "Post not found" };
  }
}

// ── Page Component ───────────────────────────────────
export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  // If the file doesn't exist, show 404
  let post;
  try {
    post = await getBlogPost(params.slug);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-6 pt-14 pb-20">

      {/* ── Breadcrumb ── */}
      <nav className="mb-10 text-xs font-mono text-ash" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-accent transition-colors">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-ink truncate max-w-[200px] inline-block align-bottom">{post.title}</span>
      </nav>

      {/* ── Article header ── */}
      <header className="mb-10">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {post.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight mb-4">
          {post.title}
        </h1>

        {/* Excerpt / subtitle */}
        <p className="text-base text-ash leading-relaxed mb-5 max-w-2xl">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs font-mono text-ash/70">
          <span>Prince Nath</span>
          <span>·</span>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>

        <div className="divider mt-6" />
      </header>

      {/* ── Markdown content ── */}
      {/* The 'prose' class is defined in globals.css */}
      <article
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.content! }}
      />

      {/* ── Back link ── */}
      <div className="mt-14 pt-8 border-t border-smoke">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-ash hover:text-accent transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to all articles
        </Link>
      </div>
    </div>
  );
}
