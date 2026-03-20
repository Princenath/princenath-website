# Prince Nath — Personal Website

A clean, minimal personal website built with **Next.js 14**, **Tailwind CSS**, and **Markdown-based content**. Focused on Cloud FinOps, AWS cost optimization, and data analysis.

---

## 🗂 Folder Structure

```
prince-nath-website/
│
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (nav + footer wraps every page)
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Global styles + Tailwind imports
│   ├── not-found.tsx           # Custom 404 page
│   │
│   ├── blog/
│   │   ├── page.tsx            # Blog listing page (/blog)
│   │   └── [slug]/
│   │       └── page.tsx        # Individual blog post (/blog/my-article)
│   │
│   ├── case-studies/
│   │   ├── page.tsx            # Case studies listing (/case-studies)
│   │   └── [slug]/
│   │       └── page.tsx        # Individual case study
│   │
│   ├── about/
│   │   └── page.tsx            # About page
│   │
│   └── contact/
│       └── page.tsx            # Contact page
│
├── components/
│   ├── Navbar.tsx              # Top navigation bar
│   └── Footer.tsx              # Footer
│
├── content/                    # ✏️  YOUR CONTENT LIVES HERE
│   ├── blog/                   # Add blog posts here as .md files
│   │   ├── aws-cost-optimization-strategies.md
│   │   └── finops-framework-guide.md
│   │
│   └── case-studies/           # Add case studies here as .md files
│       └── saas-aws-cost-reduction.md
│
├── lib/
│   └── markdown.ts             # Utility: reads & parses markdown files
│
├── public/                     # Static files (favicon, images, etc.)
│
├── tailwind.config.ts          # Tailwind configuration (colors, fonts)
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
└── package.json
```

---

## 🚀 Getting Started Locally

### Prerequisites

- **Node.js** version 18 or higher ([download](https://nodejs.org))
- **npm** (comes with Node.js)

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The page auto-updates as you edit files.

### 3. Build for production (optional local test)

```bash
npm run build
npm run start
```

---

## ✏️ How to Add New Blog Posts

This is the most important thing to know. You never need to edit any code to publish a new article.

### Step 1: Create a new `.md` file

Go to the `content/blog/` folder and create a new file. The filename becomes the URL slug.

**Example:** `content/blog/aws-savings-plans-explained.md` → URL: `/blog/aws-savings-plans-explained`

### Step 2: Add the frontmatter (metadata at the top)

Every blog post must start with this block between `---` lines:

```markdown
---
title: "Your Article Title Here"
date: "2024-04-10"
excerpt: "A 1–2 sentence summary shown on listing pages and in SEO previews."
tags: ["AWS", "Cost Optimization", "FinOps"]
---

Your article content starts here...
```

**Frontmatter fields:**

| Field     | Required | Description                                      |
|-----------|----------|--------------------------------------------------|
| `title`   | ✅ Yes   | The article title                                |
| `date`    | ✅ Yes   | Publication date in `YYYY-MM-DD` format          |
| `excerpt` | ✅ Yes   | Short summary (1–2 sentences)                    |
| `tags`    | ✅ Yes   | Array of tags: `["AWS", "FinOps"]`               |

### Step 3: Write your content in Markdown

After the closing `---`, write your article using standard Markdown:

```markdown
## This is a heading

Regular paragraph text here.

**Bold text** and *italic text*.

- Bullet point one
- Bullet point two

### Code blocks

```bash
aws cost-explorer get-cost-and-usage ...
```

> This is a blockquote.

| Column 1 | Column 2 |
|----------|----------|
| Data A   | Data B   |
```

That's it! Save the file and your new post will appear automatically.

---

## 🔬 How to Add New Case Studies

Same process as blog posts, but with additional frontmatter fields.

### Create a file in `content/case-studies/`

```markdown
---
title: "Your Case Study Title"
date: "2024-04-15"
excerpt: "Brief description of the engagement and what was achieved."
industry: "E-commerce / Retail"
outcome: "35% cost reduction — $45,000/month saved"
tags: ["AWS", "EC2", "Cost Optimization"]
---

## Background

Describe the client situation...

## The Problem

What challenges were they facing...

## Analysis

How you analyzed the situation...

## Solution

What you implemented...

## Outcome

The results achieved...
```

**Additional frontmatter fields for case studies:**

| Field      | Required | Description                                       |
|------------|----------|---------------------------------------------------|
| `industry` | ✅ Yes   | Industry/sector label shown on listing cards      |
| `outcome`  | ✅ Yes   | One-line result shown as a highlight chip         |

---

## 🎨 Customization Guide

### Update your personal info

| What to change | Where to change it |
|---|---|
| Your name in the nav | `components/Navbar.tsx` — line 1 text |
| Your email address | `app/contact/page.tsx` — update `href="mailto:..."` |
| Your LinkedIn URL | `app/contact/page.tsx` and `components/Footer.tsx` |
| Your GitHub URL | `components/Footer.tsx` |
| Site SEO metadata | `app/layout.tsx` — the `metadata` export |
| Homepage headline | `app/page.tsx` — the `<h1>` tag |
| About page content | `app/about/page.tsx` — `TIMELINE` and `SKILLS` arrays |

### Change colors

Open `tailwind.config.ts` and find the `colors` section:

```ts
colors: {
  ink:    "#0A0A0A",   // Main text color
  paper:  "#FAFAF9",   // Background
  mist:   "#F4F4F2",   // Light card backgrounds
  smoke:  "#E8E8E5",   // Borders
  ash:    "#9B9B96",   // Muted text
  accent: {
    DEFAULT: "#C8873A", // ← Change this to your preferred accent color
    light:   "#F0C080",
    dark:    "#8B5A1F",
  },
}
```

### Change fonts

In `app/globals.css`, update the Google Fonts import URL with your preferred fonts. Then update the `fontFamily` section in `tailwind.config.ts`.

---

## 🌐 Deploying to Vercel

Vercel is the recommended host (made by the Next.js team — it's essentially zero-config).

### Method 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# From your project folder, run:
vercel

# Follow the prompts. Vercel will detect Next.js automatically.
```

### Method 2: Deploy via GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com) and sign up/log in
   - Click **"New Project"**
   - Import your GitHub repository
   - Vercel auto-detects Next.js — no configuration needed
   - Click **"Deploy"**

3. **Your site is live!** Every time you push to `main`, Vercel automatically rebuilds and deploys.

### Adding a custom domain

In your Vercel project dashboard → Settings → Domains → Add your domain (e.g., `princenath.com`). Vercel handles SSL certificates automatically.

---

## 📝 Publishing Workflow (Day-to-Day)

Once deployed, adding new content is as simple as:

```bash
# 1. Create your new markdown file
# e.g., content/blog/my-new-article.md

# 2. Add frontmatter and write content

# 3. Preview locally
npm run dev

# 4. Commit and push
git add .
git commit -m "Add new article: My New Article Title"
git push

# 5. Vercel automatically deploys in ~30 seconds
```

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org) | React framework with App Router |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [gray-matter](https://github.com/jonschlinkert/gray-matter) | Parse markdown frontmatter |
| [remark](https://github.com/remarkjs/remark) | Convert markdown to HTML |
| [remark-gfm](https://github.com/remarkjs/remark-gfm) | GitHub-flavored markdown (tables, etc.) |
| [Vercel](https://vercel.com) | Hosting and deployment |

---

## ❓ Common Questions

**Q: Can I add images to blog posts?**
Put images in the `public/` folder (e.g., `public/images/my-chart.png`), then reference them in markdown as `![Alt text](/images/my-chart.png)`.

**Q: Can I add more pages?**
Yes — create a new folder in `app/` with a `page.tsx` file. For example, `app/speaking/page.tsx` would create a page at `/speaking`. Add it to the nav in `components/Navbar.tsx`.

**Q: How do I change the number of posts shown on the homepage?**
In `app/page.tsx`, find `.slice(0, 3)` for blog posts and `.slice(0, 2)` for case studies, and change the numbers.

**Q: Can I use MDX (Markdown + React components)?**
The current setup uses plain Markdown for simplicity. MDX support can be added by installing `@next/mdx` — see the [Next.js MDX docs](https://nextjs.org/docs/app/building-your-application/configuring/mdx).

---

*Built with Next.js and Tailwind CSS. Designed for clarity and speed.*
