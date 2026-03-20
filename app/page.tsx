// app/page.tsx
// Homepage — hero, brief intro, featured content links

import Link from "next/link";
import { getAllBlogPosts, getAllCaseStudies, formatDate } from "@/lib/markdown";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prince Nath — Cloud FinOps & AWS Cost Optimization",
  description:
    "Cloud FinOps Analyst helping organizations optimize AWS costs and infrastructure. Articles, case studies, and insights.",
};

export default function HomePage() {
  // Fetch latest 3 blog posts and 2 case studies for homepage preview
  const blogPosts = getAllBlogPosts().slice(0, 3);
  const caseStudies = getAllCaseStudies().slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto px-6">

      {/* ═══════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════ */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-24">

        {/* Small label above headline */}
        <p className="text-xs font-mono tracking-widest text-accent uppercase mb-6 animate-fade-up opacity-start">
          Cloud FinOps · AWS · Data Analysis
        </p>

        {/* Main headline */}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-ink leading-tight max-w-2xl animate-fade-up opacity-start delay-1">
          Helping organizations{" "}
          <em className="not-italic text-accent">optimize AWS costs</em>{" "}
          and cloud infrastructure.
        </h1>

        {/* Intro paragraph */}
        <p className="mt-6 text-base md:text-lg text-ash leading-relaxed max-w-xl animate-fade-up opacity-start delay-2">
          I'm Prince Nath — a Cloud FinOps Analyst at Accenture. I work at the
          intersection of data analysis and cloud economics, turning complex
          billing data into actionable cost-saving strategies.
        </p>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-wrap gap-3 animate-fade-up opacity-start delay-3">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 bg-ink text-paper text-sm font-medium 
                       px-5 py-2.5 rounded-full hover:bg-accent transition-colors duration-200"
          >
            About me
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-transparent text-ink text-sm font-medium 
                       px-5 py-2.5 rounded-full border border-smoke hover:border-accent hover:text-accent transition-colors duration-200"
          >
            Read articles
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="divider mb-16" />

      {/* ═══════════════════════════════════════
          EXPERTISE BADGES
      ═══════════════════════════════════════ */}
      <section className="pb-16">
        <div className="flex flex-wrap gap-2">
          {[
            "AWS Cost Explorer",
            "FinOps Framework",
            "Reserved Instances",
            "Savings Plans",
            "Rightsizing",
            "Data Analysis",
            "Python",
            "SQL",
            "Azure Basics",
          ].map((skill) => (
            <span key={skill} className="tag">{skill}</span>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          LATEST ARTICLES
      ═══════════════════════════════════════ */}
      <section className="pb-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display text-2xl font-semibold text-ink">
            Latest Articles
          </h2>
          <Link href="/blog" className="text-sm text-ash hover:text-accent transition-colors">
            View all →
          </Link>
        </div>

        <div className="space-y-6">
          {blogPosts.map((post, i) => (
            <article
              key={post.slug}
              className={`group border border-smoke rounded-xl p-6 card-lift bg-paper animate-fade-up opacity-start delay-${i + 1}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>

                  {/* Title */}
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="font-display text-lg font-semibold text-ink group-hover:text-accent transition-colors leading-snug">
                      {post.title}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-sm text-ash mt-2 leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
                {/* Arrow icon */}
                <div className="shrink-0 text-smoke group-hover:text-accent transition-colors mt-1">
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              {/* Date */}
              <p className="text-xs text-ash/70 mt-4 font-mono">{formatDate(post.date)}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CASE STUDIES PREVIEW
      ═══════════════════════════════════════ */}
      <section className="pb-20">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display text-2xl font-semibold text-ink">
            Case Studies
          </h2>
          <Link href="/case-studies" className="text-sm text-ash hover:text-accent transition-colors">
            View all →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {caseStudies.map((cs, i) => (
            <Link
              key={cs.slug}
              href={`/case-studies/${cs.slug}`}
              className={`group block border border-smoke rounded-xl p-6 card-lift bg-paper animate-fade-up opacity-start delay-${i + 1}`}
            >
              {/* Industry label */}
              <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
                {cs.industry}
              </p>
              <h3 className="font-display text-lg font-semibold text-ink group-hover:text-accent transition-colors leading-snug mb-3">
                {cs.title}
              </h3>
              <p className="text-sm text-ash leading-relaxed line-clamp-2 mb-4">
                {cs.excerpt}
              </p>
              {/* Outcome chip */}
              <div className="inline-flex items-center gap-1.5 bg-mist border border-smoke rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-xs font-mono text-ash">{cs.outcome}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
