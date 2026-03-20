// components/Footer.tsx
// Minimal footer with copyright and social links

import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-smoke/60 bg-paper mt-20">
      <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* ── Copyright ── */}
        <p className="text-sm text-ash">
          © {year} Prince Nath. All rights reserved.
        </p>

        {/* ── Social links ── */}
        <div className="flex items-center gap-6">
          <a
            href="https://linkedin.com/in/theprincenath"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-ash hover:text-accent transition-colors flex items-center gap-1.5"
            aria-label="LinkedIn"
          >
            {/* LinkedIn icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
            LinkedIn
          </a>

          <a
            href="mailto:hello@princenath.com"
            className="text-sm text-ash hover:text-accent transition-colors flex items-center gap-1.5"
            aria-label="Email"
          >
            {/* Mail icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
