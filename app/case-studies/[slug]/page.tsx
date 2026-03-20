// app/case-studies/[slug]/page.tsx
// Individual case study page

import { getAllCaseStudies, getCaseStudy, formatDate } from "@/lib/markdown";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const studies = getAllCaseStudies();
  return studies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const cs = await getCaseStudy(params.slug);
    return {
      title: cs.title,
      description: cs.excerpt,
      keywords: cs.tags,
    };
  } catch {
    return { title: "Case study not found" };
  }
}

export default async function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  let cs;
  try {
    cs = await getCaseStudy(params.slug);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-6 pt-14 pb-20">

      {/* ── Breadcrumb ── */}
      <nav className="mb-10 text-xs font-mono text-ash" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/case-studies" className="hover:text-accent transition-colors">Case Studies</Link>
        <span className="mx-2">/</span>
        <span className="text-ink truncate max-w-[200px] inline-block align-bottom">{cs.title}</span>
      </nav>

      {/* ── Case study header ── */}
      <header className="mb-10">
        {/* Industry + tags */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="text-xs font-mono text-accent uppercase tracking-wider bg-mist border border-smoke px-2.5 py-1 rounded-full">
            {cs.industry}
          </span>
          {cs.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight mb-4">
          {cs.title}
        </h1>

        <p className="text-base text-ash leading-relaxed mb-5 max-w-2xl">
          {cs.excerpt}
        </p>

        {/* Outcome highlight banner */}
        <div className="flex items-center gap-3 bg-mist border border-smoke rounded-lg p-4 mb-5">
          <div className="w-1 h-12 bg-accent rounded-full shrink-0" />
          <div>
            <p className="text-xs font-mono text-ash uppercase tracking-wide">Key Outcome</p>
            <p className="text-base font-semibold text-ink mt-0.5">{cs.outcome}</p>
          </div>
        </div>

        {/* Date */}
        <p className="text-xs font-mono text-ash/70">{formatDate(cs.date)}</p>

        <div className="divider mt-6" />
      </header>

      {/* ── Markdown content ── */}
      <article
        className="prose"
        dangerouslySetInnerHTML={{ __html: cs.content! }}
      />

      {/* ── Back link ── */}
      <div className="mt-14 pt-8 border-t border-smoke">
        <Link
          href="/case-studies"
          className="inline-flex items-center gap-2 text-sm text-ash hover:text-accent transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to case studies
        </Link>
      </div>
    </div>
  );
}
