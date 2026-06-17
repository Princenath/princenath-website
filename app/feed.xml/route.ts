import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const SITE_URL = 'https://princenath.com';

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const blogDir = path.join(process.cwd(), 'content/blog');
  const caseStudyDir = path.join(process.cwd(), 'content/case-studies');

  type FeedItem = {
    title: string;
    excerpt: string;
    date: string;
    slug: string;
    type: 'blog' | 'case-studies';
  };

  const items: FeedItem[] = [];

  for (const [dir, type] of [[blogDir, 'blog'], [caseStudyDir, 'case-studies']] as const) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
    for (const file of files) {
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
      const { data } = matter(raw);
      items.push({
        title: data.title || 'Untitled',
        excerpt: data.excerpt || '',
        date: data.date || new Date().toISOString(),
        slug: file.replace(/\.md$/, ''),
        type,
      });
    }
  }

  items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const rssItems = items
    .map(
      (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${SITE_URL}/${item.type}/${item.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/${item.type}/${item.slug}</guid>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      <description>${escapeXml(item.excerpt)}</description>
    </item>`
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Prince Nath — Cloud FinOps</title>
    <link>${SITE_URL}</link>
    <description>FinOps case studies, AWS cost management guides, and practitioner insights from Prince Nath.</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
