// app/tools/page.tsx
// Tools listing page — shows all available free tools

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free FinOps Tools",
  description:
    "Free AWS cost calculators and FinOps tools by Prince Nath. Calculate Athena query costs, estimate savings from optimisation, and more.",
};

const TOOLS = [
  {
    href: "/tools/athena-cost-calculator",
    label: "Athena Query Cost Estimator",
    description:
      "See exactly what your Athena queries cost today — and what they'd cost with Parquet format and partitioning applied. Includes monthly impact based on your query frequency.",
    tags: ["Athena", "S3", "Cost Optimisation"],
    status: "live",
  },
  // Add new tools here as they're built
];

export default function ToolsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-16 pb-20">

      {/* ── Page header ── */}
      <div className="mb-12">
        <p className="text-xs font-mono tracking-widest text-accent uppercase mb-4">
          Free Tools
        </p>
        <h1 className="font-display text-4xl font-bold text-ink mb-4">
          FinOps Calculators
        </h1>
        <p className="text-base text-ash max-w-lg">
          Practical tools for cloud cost analysis. Built from real client
          problems — no sign-up, no data collected, everything runs in your browser.
        </p>
        <div className="divider mt-6" />
      </div>

      {/* ── Tools grid ── */}
      <div className="space-y-5">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group block border border-smoke rounded-xl p-7 card-lift bg-paper hover:border-accent transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Status badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-accent bg-mist border border-smoke px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Free tool
                  </span>
                </div>

                <h2 className="font-display text-xl font-semibold text-ink group-hover:text-accent transition-colors leading-snug mb-2">
                  {tool.label}
                </h2>

                <p className="text-sm text-ash leading-relaxed mb-4 max-w-xl">
                  {tool.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {tool.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="shrink-0 text-smoke group-hover:text-accent transition-colors mt-1">
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
