// app/contact/page.tsx
// Contact page — email, LinkedIn, and a simple message prompt

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Prince Nath for Cloud FinOps consulting, AWS cost optimization, or collaboration.",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-16 pb-20">

      {/* ── Page header ── */}
      <div className="mb-14">
        <p className="text-xs font-mono tracking-widest text-accent uppercase mb-4">
          Contact
        </p>
        <h1 className="font-display text-4xl font-bold text-ink mb-5">
          Let's talk.
        </h1>
        <p className="text-base text-ash max-w-lg mb-6">
          Whether you're looking to optimize your AWS spend, explore a FinOps
          engagement, or just want to connect — I'd love to hear from you.
        </p>
        <div className="divider" />
      </div>

      {/* ── Contact options ── */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">

        {/* Email card */}
        <a
          href="mailto:hello@princenath.com" // ← Update with your real email
          className="group block border border-smoke rounded-xl p-7 card-lift bg-paper hover:border-accent transition-all"
        >
          <div className="w-10 h-10 bg-mist border border-smoke rounded-lg flex items-center justify-center mb-5 group-hover:border-accent transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ash group-hover:text-accent transition-colors">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h2 className="font-display text-lg font-semibold text-ink mb-1 group-hover:text-accent transition-colors">
            Email
          </h2>
          <p className="text-sm text-ash mb-3">
            Best for project inquiries and consulting questions.
          </p>
          <p className="text-sm font-mono text-accent">
            hello@princenath.com {/* ← Update */}
          </p>
        </a>

        {/* LinkedIn card */}
        <a
          href="https://linkedin.com/in/theprincenath" // ← Update with your LinkedIn URL
          target="_blank"
          rel="noopener noreferrer"
          className="group block border border-smoke rounded-xl p-7 card-lift bg-paper hover:border-accent transition-all"
        >
          <div className="w-10 h-10 bg-mist border border-smoke rounded-lg flex items-center justify-center mb-5 group-hover:border-accent transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-ash group-hover:text-accent transition-colors">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </div>
          <h2 className="font-display text-lg font-semibold text-ink mb-1 group-hover:text-accent transition-colors">
            LinkedIn
          </h2>
          <p className="text-sm text-ash mb-3">
            Connect professionally or send a message there.
          </p>
          <p className="text-sm font-mono text-accent">
            linkedin.com/in/theprincenath {/* ← Update */}
          </p>
        </a>
      </div>

      {/* ── What I can help with ── */}
      <section>
        <h2 className="font-display text-2xl font-semibold text-ink mb-6">
          What I can help with
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              title: "AWS Cost Audit",
              desc: "Review your current AWS spend and identify the top opportunities for savings.",
            },
            {
              title: "FinOps Strategy",
              desc: "Build a FinOps practice from scratch — tooling, processes, and team alignment.",
            },
            {
              title: "Reserved Instance Planning",
              desc: "Analyze usage patterns and recommend RI/Savings Plan purchases.",
            },
            {
              title: "Cost Allocation & Tagging",
              desc: "Design a tagging strategy so every dollar is tracked to a team or product.",
            },
          ].map((item) => (
            <div key={item.title} className="border border-smoke rounded-xl p-5">
              <h3 className="font-semibold text-ink text-sm mb-1">{item.title}</h3>
              <p className="text-sm text-ash leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
