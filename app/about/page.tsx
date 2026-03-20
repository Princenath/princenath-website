// app/about/page.tsx
// About page — professional journey, skills, values

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Prince Nath — Cloud FinOps Consultant at Accenture. Background in data analysis, AWS cost optimization, and FinOps frameworks.",
};

// ── Skills grouped by category ───────────────────────
const SKILLS = [
  {
    category: "Cloud & FinOps",
    items: ["AWS Cost Explorer", "AWS Budgets", "Savings Plans", "Reserved Instances", "Spot Instances", "FinOps Framework", "Rightsizing", "Azure Basics"],
  },
  {
    category: "Data & Analysis",
    items: ["Python", "SQL", "Pandas", "Excel / Power BI", "Data Visualization", "Cost Allocation"],
  },
  {
    category: "Tools & Platforms",
    items: ["AWS Console", "Flexera", "CloudHealth", "Anodot", "Terraform (basics)", "GitHub", "Jira", "Confluence"],
  },
];

// ── Timeline / career journey ────────────────────────
const TIMELINE = [
  {
    year: "Present",
    role: "Cloud FinOps Consultant",
    company: "Accenture",
    description:
      "Working with enterprise clients to analyze AWS cloud spend, identify waste, and implement cost optimization strategies. Leveraging the FinOps framework to drive accountability across engineering and finance teams.",
  },
  {
    year: "Earlier",
    role: "Data Analyst",
    company: "Arcesium",
    description:
      "Built dashboards and automated reporting pipelines for business stakeholders. Developed strong foundations in SQL, Python, and data storytelling — skills that now directly power cloud cost analysis work.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-16 pb-20">

      {/* ── Page header ── */}
      <div className="mb-14">
        <p className="text-xs font-mono tracking-widest text-accent uppercase mb-4">
          About
        </p>
        <h1 className="font-display text-4xl font-bold text-ink mb-5">
          Hi, I'm Prince Nath.
        </h1>
        <div className="divider" />
      </div>

      {/* ── Two-column layout on desktop ── */}
      <div className="grid md:grid-cols-3 gap-12">

        {/* Left column: bio */}
        <div className="md:col-span-2 space-y-6">
          <p className="text-base text-ink/80 leading-relaxed">
            I'm a <strong className="text-ink">Cloud FinOps Consultant at Accenture</strong>, where I help
            organizations understand, control, and reduce their AWS cloud spending.
            My background in data analysis gives me an edge in translating raw billing
            data into clear, actionable insights.
          </p>

          <p className="text-base text-ink/80 leading-relaxed">
            I believe cloud cost optimization isn't just about cutting spend — it's
            about <em>understanding value</em>. Every dollar saved should be redirected
            toward innovation. I use the FinOps framework, AWS-native tooling, and
            data-driven analysis to help teams build a culture of cost awareness.
          </p>

          <p className="text-base text-ink/80 leading-relaxed">
            Outside of work, I write about cloud economics on this blog, explore
            new AWS services, and contribute to the broader FinOps community.
          </p>

          <div className="flex gap-4 pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-ink text-paper text-sm font-medium 
                         px-5 py-2.5 rounded-full hover:bg-accent transition-colors"
            >
              Get in touch
            </Link>
            <a
              href="https://linkedin.com/in/theprincenath"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-smoke text-ink text-sm font-medium 
                         px-5 py-2.5 rounded-full hover:border-accent hover:text-accent transition-colors"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>

        {/* Right column: quick facts */}
        <div className="space-y-6">
          <div className="bg-mist border border-smoke rounded-xl p-5">
            <h3 className="font-display text-sm font-semibold text-ink mb-4">Quick Facts</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs font-mono text-ash uppercase tracking-wide">Role</dt>
                <dd className="text-ink mt-0.5">Cloud FinOps Consultant</dd>
              </div>
              <div>
                <dt className="text-xs font-mono text-ash uppercase tracking-wide">Company</dt>
                <dd className="text-ink mt-0.5">Accenture</dd>
              </div>
              <div>
                <dt className="text-xs font-mono text-ash uppercase tracking-wide">Focus</dt>
                <dd className="text-ink mt-0.5">AWS Cost Optimization</dd>
                <dd className="text-ink mt-0.5">Azure Cost Optimization</dd>
              </div>
              <div>
                <dt className="text-xs font-mono text-ash uppercase tracking-wide">Certifications</dt>
                <dd className="text-ink mt-0.5">AWS Certified Solutions Architect - Associate</dd>
                <dd className="text-ink mt-0.5">FinOps Certified Practitioner</dd>
                <dd className="text-ink mt-0.5">FinOps Certified FOCUS Analyst</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* ── Career Timeline ── */}
      <section className="mt-16">
        <h2 className="font-display text-2xl font-semibold text-ink mb-8">
          Career Journey
        </h2>
        <div className="space-y-0">
          {TIMELINE.map((item, i) => (
            <div key={i} className="flex gap-6 relative">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-accent mt-1.5 shrink-0 z-10" />
                {i < TIMELINE.length - 1 && (
                  <div className="w-px flex-1 bg-smoke mt-1" />
                )}
              </div>
              {/* Content */}
              <div className="pb-10">
                <p className="text-xs font-mono text-accent uppercase tracking-wide mb-1">
                  {item.year}
                </p>
                <h3 className="font-display text-lg font-semibold text-ink">
                  {item.role}
                </h3>
                <p className="text-sm text-ash mb-2">{item.company}</p>
                <p className="text-sm text-ink/80 leading-relaxed max-w-lg">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Skills ── */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-ink mb-8">
          Skills & Tools
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {SKILLS.map((group) => (
            <div key={group.category} className="border border-smoke rounded-xl p-5">
              <h3 className="text-xs font-mono text-accent uppercase tracking-wider mb-4">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span key={skill} className="tag">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
