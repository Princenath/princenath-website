"use client";
// app/tools/athena-cost-calculator/page.tsx
// Interactive Athena Query Cost Estimator
// Pricing: $5 per TB scanned, 10MB minimum per query
// Shows raw cost vs optimised cost with partitioning + Parquet

import { useState, useCallback } from "react";
import Link from "next/link";

// ── Athena pricing constants ─────────────────────────
const PRICE_PER_TB = 5; // USD per TB scanned
const MIN_SCAN_MB = 10; // AWS 10MB minimum per query
const PARQUET_REDUCTION = 0.87; // columnar format scans ~87% less on avg
const PARTITION_REDUCTION = 0.92; // good partitioning prunes ~92% on avg
const COMBINED_REDUCTION = 0.97; // both together: ~97% less scanned

function formatCost(usd: number): string {
  if (usd < 0.001) return "< $0.001";
  if (usd < 1) return `$${usd.toFixed(4)}`;
  return `$${usd.toFixed(2)}`;
}

function formatMonthlyCost(usd: number): string {
  if (usd < 1) return `$${usd.toFixed(2)}`;
  return `$${usd.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function calcCost(scanGB: number): number {
  // Apply 10MB minimum
  const effectiveGB = Math.max(scanGB, MIN_SCAN_MB / 1024);
  return (effectiveGB / 1024) * PRICE_PER_TB;
}

export default function AthenaCalculatorPage() {
  const [scanGB, setScanGB] = useState<string>("");
  const [queriesPerDay, setQueriesPerDay] = useState<string>("1");
  const [unit, setUnit] = useState<"GB" | "TB">("GB");
  const [hasResult, setHasResult] = useState(false);

  // Convert input to GB for calculation
  const scanInGB = useCallback(() => {
    const val = parseFloat(scanGB) || 0;
    return unit === "TB" ? val * 1024 : val;
  }, [scanGB, unit]);

  const qpd = parseFloat(queriesPerDay) || 1;
  const gbScanned = scanInGB();

  // Per-query costs
  const rawCost = calcCost(gbScanned);
  const parquetCost = calcCost(gbScanned * (1 - PARQUET_REDUCTION));
  const partitionCost = calcCost(gbScanned * (1 - PARTITION_REDUCTION));
  const optimisedCost = calcCost(gbScanned * (1 - COMBINED_REDUCTION));

  // Monthly costs (30 days)
  const monthlyRaw = rawCost * qpd * 30;
  const monthlyOptimised = optimisedCost * qpd * 30;
  const monthlySaving = monthlyRaw - monthlyOptimised;
  const savingPct = monthlyRaw > 0 ? (monthlySaving / monthlyRaw) * 100 : 0;

  function handleCalculate() {
    if (parseFloat(scanGB) > 0) setHasResult(true);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 pt-16 pb-20">

      {/* ── Breadcrumb ── */}
      <nav className="mb-10 text-xs font-mono text-ash">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/tools" className="hover:text-accent transition-colors">Tools</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Athena Cost Calculator</span>
      </nav>

      {/* ── Header ── */}
      <div className="mb-12">
        <p className="text-xs font-mono tracking-widest text-accent uppercase mb-4">
          Free Tool
        </p>
        <h1 className="font-display text-4xl font-bold text-ink mb-4 leading-tight">
          Athena Query Cost Estimator
        </h1>
        <p className="text-base text-ash max-w-xl leading-relaxed mb-2">
          AWS Athena charges <strong className="text-ink">$5 per terabyte scanned</strong>, with a 10MB minimum per query.
          See exactly what your queries cost — and what they'd cost with proper optimisation applied.
        </p>
        <p className="text-xs font-mono text-ash/70">
          Based on real-world data from a $47,000 Athena bill investigation.{" "}
          <Link href="/case-studies/athena-manufacturing-cost-spike" className="text-accent hover:underline">
            Read the case study →
          </Link>
        </p>
        <div className="divider mt-6" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">

        {/* ── Left: Inputs ── */}
        <div className="space-y-6">
          <div className="border border-smoke rounded-xl p-6 bg-paper">
            <h2 className="font-display text-lg font-semibold text-ink mb-5">
              Your Query
            </h2>

            {/* Data scanned input */}
            <div className="mb-5">
              <label className="block text-xs font-mono text-ash uppercase tracking-wide mb-2">
                Data scanned per query
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={scanGB}
                  onChange={(e) => { setScanGB(e.target.value); setHasResult(false); }}
                  placeholder="e.g. 380"
                  className="flex-1 bg-mist border border-smoke rounded-lg px-4 py-3 
                             text-sm font-mono text-ink placeholder:text-ash/50
                             focus:outline-none focus:border-accent transition-colors"
                />
                {/* Unit toggle */}
                <div className="flex border border-smoke rounded-lg overflow-hidden">
                  {(["GB", "TB"] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => { setUnit(u); setHasResult(false); }}
                      className={`px-4 py-3 text-xs font-mono transition-colors ${
                        unit === u
                          ? "bg-ink text-paper"
                          : "bg-mist text-ash hover:text-ink"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-ash/60 mt-1.5 font-mono">
                Find this in Athena → Query history → Data scanned
              </p>
            </div>

            {/* Queries per day */}
            <div className="mb-6">
              <label className="block text-xs font-mono text-ash uppercase tracking-wide mb-2">
                Queries per day
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={queriesPerDay}
                onChange={(e) => { setQueriesPerDay(e.target.value); setHasResult(false); }}
                placeholder="1"
                className="w-full bg-mist border border-smoke rounded-lg px-4 py-3 
                           text-sm font-mono text-ink placeholder:text-ash/50
                           focus:outline-none focus:border-accent transition-colors"
              />
              <p className="text-xs text-ash/60 mt-1.5 font-mono">
                A dashboard refreshing every minute = 1,440/day
              </p>
            </div>

            {/* Calculate button */}
            <button
              onClick={handleCalculate}
              disabled={!scanGB || parseFloat(scanGB) <= 0}
              className="w-full bg-ink text-paper text-sm font-medium py-3 rounded-full
                         hover:bg-accent transition-colors duration-200
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Calculate cost
            </button>
          </div>

          {/* ── How this is calculated ── */}
          <div className="border border-smoke rounded-xl p-5 bg-mist">
            <h3 className="text-xs font-mono text-ash uppercase tracking-wider mb-3">
              How it's calculated
            </h3>
            <div className="space-y-2 text-xs font-mono text-ash leading-relaxed">
              <p><span className="text-ink">Athena price:</span> $5.00 per TB scanned (us-east-1 standard rate)</p>
              <p><span className="text-ink">Minimum:</span> 10MB charged per query</p>
              <p><span className="text-ink">Parquet:</span> ~87% less data scanned vs JSON/CSV</p>
              <p><span className="text-ink">Partitioning:</span> ~92% reduction with proper WHERE clauses</p>
              <p><span className="text-ink">Both combined:</span> ~97% less data scanned</p>
            </div>

            {/* ── Disclaimer ── */}
            <div className="mt-4 pt-4 border-t border-smoke space-y-2">
              <p className="text-xs font-mono text-ash/80 font-semibold uppercase tracking-wide">
                Important — estimates only
              </p>
              <p className="text-xs text-ash/70 leading-relaxed">
                The Athena price ($5/TB) and 10MB minimum are official AWS figures confirmed at time of publication. Always verify current rates at{" "}
                <a
                  href="https://aws.amazon.com/athena/pricing/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  aws.amazon.com/athena/pricing
                </a>
                {" "}as pricing may vary by region or change over time.
              </p>
              <p className="text-xs text-ash/70 leading-relaxed">
                The optimisation reduction percentages (Parquet, partitioning) are indicative estimates based on real-world query analysis. AWS states a range of 30–90% savings depending on schema width, number of columns referenced, partition key alignment, and data distribution. Your actual savings will vary.
              </p>
              <p className="text-xs text-ash/70 leading-relaxed">
                This tool is for planning and awareness purposes only. Do not use these figures for financial commitments, invoicing, or billing disputes. Always validate against your actual Athena query history in the AWS console.
              </p>
            </div>
          </div>
        </div>

        {/* ── Right: Results ── */}
        <div className="space-y-4">

          {!hasResult ? (
            <div className="border border-smoke border-dashed rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
              <div className="w-12 h-12 rounded-full bg-mist border border-smoke flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ash">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <path d="M8 21h8M12 17v4"/>
                  <path d="M6 8h.01M10 8h8M6 12h.01M10 12h5"/>
                </svg>
              </div>
              <p className="text-sm text-ash">Enter your query's data scanned above to see the cost breakdown.</p>
            </div>
          ) : (
            <>
              {/* Per-query costs */}
              <div className="border border-smoke rounded-xl p-6 bg-paper animate-fade-up">
                <h2 className="font-display text-lg font-semibold text-ink mb-4">
                  Per-query cost
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      label: "Current (raw JSON/CSV, no partitioning)",
                      cost: rawCost,
                      highlight: false,
                      bad: true,
                    },
                    {
                      label: "With Parquet format only",
                      cost: parquetCost,
                      highlight: false,
                      bad: false,
                    },
                    {
                      label: "With partitioning only",
                      cost: partitionCost,
                      highlight: false,
                      bad: false,
                    },
                    {
                      label: "With Parquet + partitioning",
                      cost: optimisedCost,
                      highlight: true,
                      bad: false,
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className={`flex items-center justify-between rounded-lg px-4 py-3 ${
                        row.highlight
                          ? "bg-ink text-paper"
                          : "bg-mist border border-smoke"
                      }`}
                    >
                      <span className={`text-xs leading-snug max-w-[200px] ${row.highlight ? "text-paper/80" : "text-ash"}`}>
                        {row.label}
                      </span>
                      <span className={`text-sm font-mono font-semibold ${
                        row.highlight ? "text-accent-light" : row.bad ? "text-red-500" : "text-ink"
                      }`}>
                        {formatCost(row.cost)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly impact */}
              <div className="border border-smoke rounded-xl p-6 bg-paper animate-fade-up">
                <h2 className="font-display text-lg font-semibold text-ink mb-1">
                  Monthly impact
                </h2>
                <p className="text-xs font-mono text-ash mb-4">
                  Based on {parseFloat(queriesPerDay).toLocaleString()} quer{parseFloat(queriesPerDay) === 1 ? "y" : "ies"}/day × 30 days
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-mist border border-smoke rounded-lg p-4">
                    <p className="text-xs font-mono text-ash uppercase tracking-wide mb-1">Current monthly</p>
                    <p className="text-xl font-mono font-bold text-red-500">{formatMonthlyCost(monthlyRaw)}</p>
                  </div>
                  <div className="bg-ink rounded-lg p-4">
                    <p className="text-xs font-mono text-paper/60 uppercase tracking-wide mb-1">Optimised monthly</p>
                    <p className="text-xl font-mono font-bold text-accent-light">{formatMonthlyCost(monthlyOptimised)}</p>
                  </div>
                </div>

                {/* Savings bar */}
                <div className="bg-mist border border-smoke rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-mono text-ash">Potential monthly saving</span>
                    <span className="text-xs font-mono font-semibold text-accent">
                      {savingPct.toFixed(0)}% reduction
                    </span>
                  </div>
                  <div className="bg-smoke rounded-full h-2 overflow-hidden mb-3">
                    <div
                      className="bg-accent h-2 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(savingPct, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-ash font-mono">You could save</span>
                    <span className="text-base font-mono font-bold text-accent">
                      {formatMonthlyCost(monthlySaving)}/month
                    </span>
                  </div>
                  {monthlySaving > 0 && (
                    <p className="text-xs font-mono text-ash/60 mt-1 text-right">
                      {formatMonthlyCost(monthlySaving * 12)}/year
                    </p>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="border border-accent/30 rounded-xl p-5 bg-accent/5">
                <p className="text-xs font-mono text-accent uppercase tracking-wide mb-2">Next step</p>
                <p className="text-sm text-ink leading-relaxed mb-3">
                  To implement Parquet conversion on a live Kinesis stream without rebuilding your pipeline, read the full case study that inspired this tool.
                </p>
                <Link
                  href="/case-studies/athena-manufacturing-cost-spike"
                  className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                >
                  Read the case study →
                </Link>
              </div>

              {/* Results disclaimer */}
              <p className="text-xs text-ash/50 leading-relaxed font-mono px-1">
                ⚠ Estimates only. Optimisation savings depend on your schema width, query patterns, and partition design — AWS states a range of 30–90%. Verify current Athena pricing at aws.amazon.com/athena/pricing. Not for use in financial commitments or billing disputes.
              </p>
            </>
          )}
        </div>
      </div>

      {/* ── Explanation section ── */}
      <div className="mt-16 pt-10 border-t border-smoke">
        <h2 className="font-display text-2xl font-semibold text-ink mb-6">
          Why Athena costs spiral without you noticing
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              title: "Raw format scanning",
              body: "JSON and CSV are row-oriented. Athena reads every field on every record, even if your query only needs three columns out of fifty. A 380MB scan per query on 52-column JSON is mostly wasted reads.",
            },
            {
              title: "No partition pruning",
              body: "Without partitions, every query scans your entire dataset history. A dashboard asking for the last hour's data still reads all 9.6TB of historical records to find it.",
            },
            {
              title: "Dashboard refresh rates",
              body: "A single poorly-structured query running once is a nuisance. The same query running every minute across six dashboards is $47,000 a month. Frequency multiplies everything.",
            },
          ].map((item) => (
            <div key={item.title} className="border border-smoke rounded-xl p-5">
              <h3 className="font-semibold text-ink text-sm mb-2">{item.title}</h3>
              <p className="text-sm text-ash leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
