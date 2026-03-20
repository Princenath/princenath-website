// components/Navbar.tsx
// Top navigation bar — minimal, sticky, responsive

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// ── Nav links definition — add new pages here ──────
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-sm border-b border-smoke/60">
      <nav className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* ── Logo / Name ── */}
        <Link
          href="/"
          className="font-display text-lg font-semibold text-ink hover:text-accent transition-colors"
        >
          Prince Nath
        </Link>

        {/* ── Desktop nav links ── */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            // Highlight the active page
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-accent ${
                    isActive ? "text-accent" : "text-ash hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── CTA button — visible desktop ── */}
        <Link
          href="/contact"
          className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium 
                     bg-ink text-paper px-4 py-2 rounded-full 
                     hover:bg-accent transition-colors duration-200"
        >
          Let's talk
        </Link>

        {/* ── Mobile hamburger button ── */}
        <button
          className="md:hidden p-2 text-ash hover:text-ink transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            // X icon when open
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : (
            // Hamburger icon
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </nav>

      {/* ── Mobile dropdown menu ── */}
      {menuOpen && (
        <div className="md:hidden border-t border-smoke/60 bg-paper animate-fade-in">
          <ul className="max-w-4xl mx-auto px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`text-sm font-medium transition-colors hover:text-accent ${
                      isActive ? "text-accent" : "text-ash"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="inline-flex text-sm font-medium bg-ink text-paper px-4 py-2 rounded-full hover:bg-accent transition-colors"
              >
                Let's talk
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
