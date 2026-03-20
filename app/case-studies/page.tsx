// app/case-studies/page.tsx
// Case Studies listing page

import Link from "next/link";
import { getAllCaseStudies, formatDate } from "@/lib/markdown";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real-world Cloud FinOps and AWS cost optimization case studies by Prince Nath.",
};

export default function CaseStudiesPage() {
  const studies = getAllCaseStudies();

  return (
    <div className="max-w-4xl mx-auto px-6 pt-16 pb-20">

      {/* ── Page header ── */}
      <div className="mb-12">
        <p className="text-xs font-mono tracking-widest text-accent uppercase mb-4">
          Work
        </p>
        <h1 className="font-display text-4xl font-bold text-ink mb-4">
          Case Studies
        </h1>
        <p className="text-base text-ash max-w-lg">
          Deep-dives into real cloud cost optimization engagements — including
          the problem, analysis approach, solution, and measurable outcomes.
        </p>
        <div className="divider mt-6" />
      </div>

      {/* ── Studies grid ── */}
      {studies.length === 0 ? (
        <p className="text-ash text-sm">No case studies yet. Check back soon.</p>
      ) : (
        <div className="space-y-6">
          {studies.map((cs, i) => (
            <Link
              key={cs.slug}
              href={`/case-studies/${cs.slug}`}
              className={`group block border border-smoke rounded-xl p-7 card-lift bg-paper animate-fade-up opacity-start delay-${Math.min(i + 1, 5)}`}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">

                {/* Left: content */}
                <div className="flex-1">
                  {/* Industry label */}
                  <p className="text-xs font-mono text-accent uppercase tracking-wider mb-3">
                    {cs.industry}
                  </p>

                  <h2 className="font-display text-xl font-semibold text-ink group-hover:text-accent 
                                 transition-colors leading-snug mb-3">
                    {cs.title}
                  </h2>

                  <p className="text-sm text-ash leading-relaxed mb-4 max-w-2xl">
                    {cs.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {cs.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Right: outcome box */}
                <div className="shrink-0 md:w-48 bg-mist border border-smoke rounded-lg p-4 text-center">
                  <p className="text-xs font-mono text-ash uppercase tracking-wide mb-1">Outcome</p>
                  <p className="text-sm font-semibold text-accent leading-snug">{cs.outcome}</p>
                  <p className="text-xs text-ash/70 mt-2 font-mono">{formatDate(cs.date)}</p>
                </div>

              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
