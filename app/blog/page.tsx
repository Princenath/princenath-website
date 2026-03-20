// app/blog/page.tsx
// Blog listing page — shows all articles from content/blog/

import Link from "next/link";
import { getAllBlogPosts, formatDate } from "@/lib/markdown";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on Cloud FinOps, AWS cost optimization, and data analysis by Prince Nath.",
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="max-w-4xl mx-auto px-6 pt-16 pb-20">

      {/* ── Page header ── */}
      <div className="mb-12">
        <p className="text-xs font-mono tracking-widest text-accent uppercase mb-4">
          Writing
        </p>
        <h1 className="font-display text-4xl font-bold text-ink mb-4">
          Articles
        </h1>
        <p className="text-base text-ash max-w-lg">
          Practical insights on Cloud FinOps, AWS cost optimization, and turning
          cloud data into savings.
        </p>
        <div className="divider mt-6" />
      </div>

      {/* ── Post list ── */}
      {posts.length === 0 ? (
        <p className="text-ash text-sm">No articles yet. Check back soon.</p>
      ) : (
        <div className="space-y-8">
          {posts.map((post, i) => (
            <article
              key={post.slug}
              className={`group border-b border-smoke pb-8 last:border-b-0 animate-fade-up opacity-start delay-${Math.min(i + 1, 5)}`}
            >
              {/* Tags row */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>

              {/* Title link */}
              <Link href={`/blog/${post.slug}`}>
                <h2 className="font-display text-xl md:text-2xl font-semibold text-ink 
                               group-hover:text-accent transition-colors leading-snug mb-2">
                  {post.title}
                </h2>
              </Link>

              {/* Excerpt */}
              <p className="text-sm md:text-base text-ash leading-relaxed mb-4 max-w-2xl">
                {post.excerpt}
              </p>

              {/* Meta row */}
              <div className="flex items-center gap-4">
                <time className="text-xs font-mono text-ash/70">{formatDate(post.date)}</time>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-medium text-accent hover:underline"
                >
                  Read article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
