---
title: "AWS Finally Launched Database Savings Plans. Here's What Nobody's Telling You."
date: "2026-03-20"
excerpt: "Six years of the FinOps community asking for this. AWS delivered it at re:Invent 2025. The headline says 'up to 35% savings' — the reality is more complicated, more interesting, and more useful than the press release suggests."
tags: ["AWS", "Database Savings Plans", "RDS", "Aurora", "Cost Optimization", "FinOps", "Reserved Instances"]
---

Every year at re:Invent, there's one announcement that the FinOps community has been waiting for. This year it finally happened.

AWS launched Database Savings Plans in December 2025 — a flexible commitment instrument for managed database services that the community had been requesting, loudly and repeatedly, since Compute Savings Plans launched in 2019. The reaction in the FinOps Slack channels and LinkedIn threads was pretty much universal relief. Six years is a long time to wait.

But relief has a way of making people skip the fine print. And this particular announcement has fine print worth reading carefully before you log into Cost Explorer and start making commitments.

---

## The problem Database Savings Plans actually solve

To understand why this matters, you have to understand what the world looked like before December 2025.

If you ran compute on AWS — EC2, Lambda, Fargate — you had Compute Savings Plans. One commitment, flexible across instance families, sizes, regions, operating systems. You committed to spending $X per hour on compute, and AWS automatically applied the discount wherever your compute usage happened to land. Clean, simple, and genuinely useful for organisations running dynamic workloads.

Your databases got none of that.

For databases, the only commitment-based discount was Reserved Instances. And database RIs are unforgiving. You pick an engine. A specific instance family. A region. A deployment type — Single-AZ or Multi-AZ. All of those have to match exactly for the discount to apply. Change your mind about any one of those attributes and your RI sits there, billing you, covering nothing.

This matters because database infrastructure changes constantly. Teams migrate from RDS MySQL to Aurora PostgreSQL for performance reasons. They upgrade instance generations when newer hardware is available. They move workloads between regions for latency or compliance. Every one of those changes could strand an existing RI — and I wrote a whole piece about that particular problem if you want the gory details.

The other problem was serverless. Aurora Serverless v2, DynamoDB on-demand, ElastiCache Serverless — none of these had any commitment discount available at all. You ran serverless, you paid On-Demand rates, full stop. For organisations trying to modernise their database architecture toward serverless, that was a real financial disincentive.

Database Savings Plans fix both of those things.

---

## How they actually work

The mechanism is identical to Compute Savings Plans. You commit to spending a fixed dollar amount per hour across your eligible database usage. AWS automatically applies the discount to whatever database services you're running — regardless of engine, instance family, size, region, or deployment type.

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 16px 0;">Services Covered by Database Savings Plans</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
    <div style="background:#fff;border:1px solid #E8E8E5;border-radius:8px;padding:14px;">
      <p style="font-size:11px;font-family:monospace;color:#C8873A;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 10px 0;">Relational</p>
      <p style="font-size:13px;color:#0A0A0A;margin:0 0 4px 0;">Amazon Aurora</p>
      <p style="font-size:13px;color:#0A0A0A;margin:0 0 4px 0;">Amazon RDS</p>
      <p style="font-size:13px;color:#0A0A0A;margin:0;">AWS Database Migration Service</p>
    </div>
    <div style="background:#fff;border:1px solid #E8E8E5;border-radius:8px;padding:14px;">
      <p style="font-size:11px;font-family:monospace;color:#C8873A;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 10px 0;">NoSQL & Caching</p>
      <p style="font-size:13px;color:#0A0A0A;margin:0 0 4px 0;">Amazon DynamoDB</p>
      <p style="font-size:13px;color:#0A0A0A;margin:0 0 4px 0;">Amazon ElastiCache (Valkey only)</p>
      <p style="font-size:13px;color:#0A0A0A;margin:0;">Amazon Keyspaces</p>
    </div>
    <div style="background:#fff;border:1px solid #E8E8E5;border-radius:8px;padding:14px;">
      <p style="font-size:11px;font-family:monospace;color:#C8873A;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 10px 0;">Graph & Document</p>
      <p style="font-size:13px;color:#0A0A0A;margin:0 0 4px 0;">Amazon Neptune</p>
      <p style="font-size:13px;color:#0A0A0A;margin:0;">Amazon DocumentDB</p>
    </div>
    <div style="background:#fff;border:1px solid #E8E8E5;border-radius:8px;padding:14px;">
      <p style="font-size:11px;font-family:monospace;color:#C8873A;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 10px 0;">Time Series</p>
      <p style="font-size:13px;color:#0A0A0A;margin:0;">Amazon Timestream (InfluxDB only)</p>
    </div>
  </div>
  <p style="font-size:11px;color:#9B9B96;margin:12px 0 0 0;font-family:monospace;">* Redshift, MemoryDB, and OpenSearch are not covered. ElastiCache only covers Valkey — not Redis or Memcached.</p>
</div>

The flexibility is real and meaningful. You can change from Aurora `db.r7g` to `db.r8g`. You can shift a workload from `eu-west-1` to `us-east-1`. You can migrate from RDS for Oracle to Aurora PostgreSQL. Your commitment follows you through all of it, applying automatically to whatever eligible usage you're running each hour.

---

## The part the headline doesn't tell you

"Up to 35% savings" is the number AWS leads with. It's technically accurate. It's also the number you'd get in the most favourable possible scenario.

Here's what the discount structure actually looks like:

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 16px 0;">Database Savings Plans — Actual Discount by Workload Type</p>
  <div style="display:flex;flex-direction:column;gap:10px;">
    <div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
        <div>
          <span style="font-size:13px;color:#0A0A0A;font-weight:500;">Serverless (Aurora Serverless v2, DocumentDB Serverless, etc.)</span>
        </div>
        <span style="font-size:13px;font-weight:700;color:#2D7D46;">Up to 35%</span>
      </div>
      <div style="background:#E8E8E5;border-radius:4px;height:8px;overflow:hidden;">
        <div style="background:#2D7D46;height:100%;width:35%;border-radius:4px;"></div>
      </div>
      <p style="font-size:11px;color:#9B9B96;margin:3px 0 0 0;font-family:monospace;">Previously: zero commitment options. This is entirely new savings.</p>
    </div>
    <div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
        <span style="font-size:13px;color:#0A0A0A;font-weight:500;">Provisioned instances — Gen 7+ (Aurora, RDS, DocumentDB, Neptune)</span>
        <span style="font-size:13px;font-weight:700;color:#C8873A;">Up to 20%</span>
      </div>
      <div style="background:#E8E8E5;border-radius:4px;height:8px;overflow:hidden;">
        <div style="background:#C8873A;height:100%;width:20%;border-radius:4px;"></div>
      </div>
      <p style="font-size:11px;color:#9B9B96;margin:3px 0 0 0;font-family:monospace;">Gen 7 and above only. db.r5, db.r6, db.t4g not eligible.</p>
    </div>
    <div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
        <span style="font-size:13px;color:#0A0A0A;font-weight:500;">DynamoDB on-demand throughput</span>
        <span style="font-size:13px;font-weight:700;color:#C8873A;">Up to 18%</span>
      </div>
      <div style="background:#E8E8E5;border-radius:4px;height:8px;overflow:hidden;">
        <div style="background:#C8873A;height:100%;width:18%;border-radius:4px;"></div>
      </div>
      <p style="font-size:11px;color:#9B9B96;margin:3px 0 0 0;font-family:monospace;">For spiky, unpredictable DynamoDB workloads that don't suit provisioned capacity.</p>
    </div>
    <div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
        <span style="font-size:13px;color:#0A0A0A;font-weight:500;">DynamoDB provisioned capacity</span>
        <span style="font-size:13px;font-weight:700;color:#9B9B96;">Up to 12%</span>
      </div>
      <div style="background:#E8E8E5;border-radius:4px;height:8px;overflow:hidden;">
        <div style="background:#9B9B96;height:100%;width:12%;border-radius:4px;"></div>
      </div>
      <p style="font-size:11px;color:#9B9B96;margin:3px 0 0 0;font-family:monospace;">Stacks on top of existing DynamoDB reserved capacity discounts.</p>
    </div>
    <div style="border-top:1px solid #E8E8E5;padding-top:12px;margin-top:4px;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0 0 4px 0;">For comparison — RDS Reserved Instances (1-year, no upfront)</p>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
        <span style="font-size:13px;color:#9B9B96;">Stable provisioned RDS workload, same instance family</span>
        <span style="font-size:13px;font-weight:700;color:#9B9B96;">30–35%</span>
      </div>
      <div style="background:#E8E8E5;border-radius:4px;height:8px;overflow:hidden;">
        <div style="background:#9B9B96;height:100%;width:34%;border-radius:4px;opacity:0.5;"></div>
      </div>
      <p style="font-size:11px;color:#9B9B96;margin:3px 0 0 0;font-family:monospace;">Higher discount, zero flexibility. Right for some workloads, wrong for others.</p>
    </div>
  </div>
</div>

The number that jumps out is 20% for provisioned instances — compared to 30-35% from a 1-year no-upfront RDS Reserved Instance on the same workload. For a stable, long-lived RDS fleet that isn't going anywhere, that gap is real money.

But the comparison misses something important: what you're buying with the lower discount. With an RI, you're locked to a specific engine, family, region, and deployment type. Change any of those and you've got a stranded reservation generating zero savings. The Database Savings Plan costs you 10-15% in discount depth, and in exchange you can change anything — engine, region, instance generation, deployment model — without losing a penny of your commitment.

Whether that trade is worth it depends entirely on how stable your database fleet actually is.

---

## The instance generation constraint nobody mentions

There's a detail buried in the AWS documentation that changes the calculus for a lot of teams.

**Database Savings Plans only apply to Generation 7 and newer instances.**

That means `db.r7g`, `db.m7g`, `db.m7i`, `db.m8g` and above. It does not cover `db.r6g`, `db.r5`, `db.m5`, `db.t4g`, `db.t3`, or any other older generation that's still running in the majority of production environments.

If you have a fleet of `db.r5.xlarge` Aurora instances — extremely common — Database Savings Plans don't touch them. You still need RIs for those, or you upgrade first and then apply the Savings Plan.

Here's why that matters practically. A `db.r6g.large` instance in `us-east-1` is approximately 11% cheaper than its Generation 7 equivalent on the base On-Demand price. The 20% Savings Plan discount applies to the higher Generation 7 price. After accounting for the price increase, the net saving over just staying on `db.r6g` with an RI works out to around 9-10% in many cases. Unless the upgrade also gives you performance benefits that justify it, upgrading purely to qualify for the Savings Plan rarely pencils out.

This is AWS nudging customers toward newer instance generations through pricing incentives. That's fine — it's good architecture — but it means the Database Savings Plans story is really a story about teams that are already running modern stacks or actively migrating to them.

---

## Where Database Savings Plans genuinely shine

Two scenarios where this new instrument is the clear right choice:

**Serverless databases.** Before December 2025, if you ran Aurora Serverless v2, you paid On-Demand rates. Full stop. No commitment option existed. Now you can get up to 35% off that usage with a Database Savings Plan. For teams that have adopted serverless database architecture, this is entirely incremental savings that simply didn't exist before. There's no comparison to make — it's 35% off something that was previously at full price.

**Teams mid-migration.** If you're moving from RDS for Oracle to Aurora PostgreSQL, or from provisioned RDS to Aurora Serverless, buying a rigid RI during that transition is a commitment to an infrastructure state that's about to change. The Database Savings Plan lets you maintain commitment-based discounts throughout the migration without buying and then stranding reservations for architectures you're leaving behind.

---

## Where Reserved Instances still win

For a production RDS fleet running `db.r7g` instances with consistent, predictable load — the same engine, same region, no migrations planned — a 1-year standard RI still gives you 30-35% off versus 20% from the Savings Plan. On a $50,000/month RDS bill, that's a $5,000-7,500 monthly difference.

The only reason to choose the Savings Plan in that scenario is if you're not confident the workload stays stable. If there's even a reasonable chance of a migration, an upgrade, or a region change in the next 12 months, the Savings Plan's flexibility starts to look more valuable than the extra discount depth.

---

## How to decide — a practical framework

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 20px 0;">Decision Framework — Database Savings Plans vs Reserved Instances</p>
  <div style="display:flex;flex-direction:column;gap:3px;">
    <div style="display:grid;grid-template-columns:24px 1fr;gap:12px;align-items:flex-start;padding:14px;background:#fff;border:1px solid #E8E8E5;border-radius:8px;">
      <p style="font-size:13px;color:#2D7D46;margin:0;font-weight:700;">✓</p>
      <div>
        <p style="font-size:13px;font-weight:600;color:#0A0A0A;margin:0 0 2px 0;">Use Database Savings Plans if...</p>
        <p style="font-size:12px;color:#9B9B96;margin:0;line-height:1.6;">You run Aurora Serverless v2 or other serverless database services. You're mid-migration between engines or instance generations. You have database workloads spread across multiple regions that shift. You run Gen 7+ instances and value flexibility over squeezing every last percent of discount.</p>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:24px 1fr;gap:12px;align-items:flex-start;padding:14px;background:#fff;border:1px solid #E8E8E5;border-radius:8px;">
      <p style="font-size:13px;color:#C8873A;margin:0;font-weight:700;">→</p>
      <div>
        <p style="font-size:13px;font-weight:600;color:#0A0A0A;margin:0 0 2px 0;">Stick with Reserved Instances if...</p>
        <p style="font-size:12px;color:#9B9B96;margin:0;line-height:1.6;">You run stable, predictable provisioned database workloads that won't change engines, regions, or instance families in the next 12 months. You have older generation instances (Gen 6 and below) — the Savings Plan won't cover them anyway. You want maximum discount depth and can accept the rigidity.</p>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:24px 1fr;gap:12px;align-items:flex-start;padding:14px;background:#fff;border:1px solid #E8E8E5;border-radius:8px;">
      <p style="font-size:13px;color:#0A0A0A;margin:0;font-weight:700;">↔</p>
      <div>
        <p style="font-size:13px;font-weight:600;color:#0A0A0A;margin:0 0 2px 0;">Run both for most large environments</p>
        <p style="font-size:12px;color:#9B9B96;margin:0;line-height:1.6;">Cover your legacy Gen 6 and older RDS fleet with RIs as before. Apply a Database Savings Plan to your Gen 7+ and serverless workloads. This hybrid approach is what most organisations with mixed database estates will end up doing for the next 2-3 years as they modernise.</p>
      </div>
    </div>
  </div>
</div>

---

## Before you purchase — the non-negotiable step

Every time a new commitment instrument launches, some teams go straight to Cost Explorer and start buying. Don't.

The golden rule of any AWS commitment: **optimise first, commit second.**

Before purchasing any Database Savings Plan, check three things:

**1. Are your databases right-sized?** Committing to a dollar-per-hour amount on an over-provisioned database fleet locks in waste. Run rightsizing recommendations in Cost Explorer, look at CloudWatch CPU and memory utilisation over the past 30 days, and make sure you're not committing to more than you actually need.

**2. What generation are your instances?** If most of your RDS fleet is still on Gen 5 or Gen 6, a Database Savings Plan covers none of it. Either use RIs for that fleet or factor in the migration cost before deciding whether upgrading to qualify for the Savings Plan makes financial sense.

**3. Use the Savings Plan Purchase Analyzer.** In Cost Explorer under Savings Plans, the Purchase Analyzer lets you simulate different commitment amounts and see the projected savings, coverage, and utilisation based on your actual historical usage. Run it before committing to anything. It's the most useful tool AWS released in 2024 and it works for Database Savings Plans too.

---

## What this means for the FinOps community

The broader significance here is less about the specific discount numbers and more about what this signals.

Database costs are consistently among the top three AWS spend categories for most organisations — typically sitting behind EC2 and data transfer, but ahead of everything else. Before December 2025, a significant portion of that spend had no flexible commitment mechanism at all. Serverless databases, newer instance generations, mixed-engine environments — all of it was either locked into rigid RIs or running On-Demand with no discount.

That gap is now closed, at least partially. Database Savings Plans won't replace RIs for everyone. The hybrid approach — RIs for stable legacy workloads, Savings Plans for modern and serverless architecture — will be the reality for most organisations for the next few years.

But the direction is clear. AWS is steadily moving its pricing model toward flexible spend-based commitments and away from rigid configuration-based reservations. Database Savings Plans are the next step in that direction. They won't be the last.

---

*If you're evaluating whether to add Database Savings Plans to your commitment strategy, the Savings Plan Purchase Analyzer in Cost Explorer is your starting point. Run it against your actual usage before making any decisions. If you want a second opinion on the analysis, [get in touch](/contact).*
