// app/layout.tsx
// Root layout — wraps every page with nav + footer
// Edit siteConfig below to update site-wide info

import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ── Site-wide SEO metadata ──────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL("https://princenath.com"),
  alternates: {
    canonical: "https://princenath.com",
  },
  title: {
    default: "Prince Nath — Cloud FinOps & AI Cost Governance",
    template: "%s | Prince Nath",
  },
  description:
    "Cloud FinOps Consultant specializing in AWS cost optimization and AI cost governance. Helping organizations control cloud and AI spend before it scales out of control.",
  keywords: [
    "Cloud FinOps",
    "AWS Cost Optimization",
    "Cloud Cost Management",
    "FinOps Analyst",
    "AWS",
    "Data Analysis",
    "AI Cost Governance",
    "FinOps for AI",
    "Amazon Bedrock Cost Optimization", 
    "LLM Cost Management",
    "Agentic FinOps",
    "AI FinOps"
  ],
  authors: [{ name: "Prince Nath" }],
  creator: "Prince Nath",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://princenath.com",
    siteName: "Prince Nath",
    title: "Prince Nath — Cloud FinOps & AI Cost Governance",
    description:
      "Cloud FinOps Consultant specializing in AWS cost optimization and AI cost governance. Helping organizations control cloud and AI spend before it scales out of control.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prince Nath — Cloud FinOps & AI Cost Governance",
    description:
      "Cloud FinOps Consultant specializing in AWS cost optimization and AI cost governance. Helping organizations control cloud and AI spend before it scales out of control.",
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
