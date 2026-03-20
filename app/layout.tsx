// app/layout.tsx
// Root layout — wraps every page with nav + footer
// Edit siteConfig below to update site-wide info

import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ── Site-wide SEO metadata ──────────────────────────
export const metadata: Metadata = {
  title: {
    default: "Prince Nath — Cloud FinOps & AWS Cost Optimization",
    template: "%s | Prince Nath",
  },
  description:
    "Cloud FinOps Analyst helping organizations optimize AWS costs and infrastructure. Articles, case studies, and insights on cloud cost management.",
  keywords: [
    "Cloud FinOps",
    "AWS Cost Optimization",
    "Cloud Cost Management",
    "FinOps Analyst",
    "AWS",
    "Data Analysis",
  ],
  authors: [{ name: "Prince Nath" }],
  creator: "Prince Nath",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://princenath.com",
    siteName: "Prince Nath",
    title: "Prince Nath — Cloud FinOps & AWS Cost Optimization",
    description:
      "Cloud FinOps Analyst helping organizations optimize AWS costs and infrastructure.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prince Nath — Cloud FinOps & AWS Cost Optimization",
    description:
      "Cloud FinOps Analyst helping organizations optimize AWS costs and infrastructure.",
    creator: "@princenath",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-paper">
        {/* ── Navigation ── */}
        <Navbar />

        {/* ── Main content — grows to fill available height ── */}
        <main className="flex-1">{children}</main>

        {/* ── Footer ── */}
        <Footer />
      </body>
    </html>
  );
}
