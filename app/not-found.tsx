// app/not-found.tsx
// Custom 404 page

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-32 pb-20 text-center">
      <p className="text-xs font-mono text-accent uppercase tracking-widest mb-4">404</p>
      <h1 className="font-display text-4xl font-bold text-ink mb-4">Page not found</h1>
      <p className="text-base text-ash mb-8 max-w-sm mx-auto">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-ink text-paper text-sm font-medium 
                   px-5 py-2.5 rounded-full hover:bg-accent transition-colors"
      >
        ← Back to home
      </Link>
    </div>
  );
}
