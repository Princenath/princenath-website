---
title: "The FinOps Practitioner's Guide to Amazon Q in Cost Explorer: Prompts That Actually Work"
date: "2026-04-15"
excerpt: "AWS embedded Amazon Q directly into Cost Explorer nine days ago. You can now type plain English questions and the visualisations update automatically. Most coverage has been technical. This is the practitioner's version — the specific prompts to run, in the order to run them, for a complete cost analysis from morning review to executive reporting."
tags: ["AWS", "Amazon Q", "Cost Explorer", "FinOps", "Cost Analysis", "Cost Optimization", "AI", "AWS Cost Management"]
---

## Something changed in Cost Explorer nine days ago

On April 6, 2026, AWS embedded Amazon Q Developer directly into Cost Explorer. If you haven't opened Cost Explorer since then, there's a row of suggested prompts sitting above your Cost and Usage Overview that wasn't there before.

You can type a question — "What drove my cost increase last week?" — and two things happen at once. Amazon Q opens a chat panel with a written analysis. Cost Explorer automatically reconfigures itself with the right filters, date range, groupings, and visualisation to match what you asked.

No separate console. No new integration to set up. No API. If Cost Explorer is enabled in your account and your IAM role has the right permissions, it is already there.

The reason this matters for FinOps practitioners specifically is that the slowest part of most cost analysis workflows has never been understanding data once you see it. It's getting Cost Explorer into the right configuration to show it to you. Selecting the service filter, adjusting the grouping, changing the date range, switching between chart types. That configuration work is now optional. You can describe what you want instead.

This post covers how to use it, what prompts actually produce useful output, and where the feature runs out of road.

---

## Three things to have in place first

Amazon Q in Cost Explorer pulls from three underlying services. If they're not set up, some of the prompts below will give you incomplete answers.

**Cost Explorer enabled.** Takes up to 24 hours to process historical data after enabling. If you set it up today, come back tomorrow for the historical analysis queries.

**Cost Optimization Hub enrolled.** Without this, prompts asking for rightsizing and commitment recommendations won't return much. Enrol in the Billing and Cost Management console — it usually takes less than 30 minutes to generate initial recommendations.

**Cost Anomaly Detection configured.** Amazon Q draws on anomaly data when you ask about unusual spending. If you don't have a monitor set up, those questions just return nothing useful.

If all three are in place, you get the full capability.

---

## Morning review: figuring out what happened overnight

The first thing most FinOps practitioners do each day is check whether anything unusual happened. This used to mean manually setting filters across a few Cost Explorer views. Now it's two prompts.

**Start here:**
> "What were my top 5 cost drivers this week and how do they compare to last week?"

Amazon Q identifies your highest-spend services, shows the week-over-week change for each, and updates Cost Explorer with a grouped view. If something looks off, the follow-up:

> "Did I have any cost anomalies in the last 7 days? Show me what triggered them."

This pulls from your Cost Anomaly Detection data and surfaces both what spiked and when it started. For multi-account environments, be specific:

> "Show me cost anomalies across all accounts in the last 7 days, grouped by account."

At this stage you're looking for signals. One or two items that need investigation today. The goal is not to understand everything — it's to know where to look next.

---

## Service-level investigation: finding out why

Once you've spotted a service that needs investigating, Amazon Q's follow-up conversation is where the real time saving shows. It holds context across the whole conversation, so you don't need to restate what you're looking at each time.

Here's how a typical EC2 investigation sequence runs:

Start broad:
> "Show me my EC2 costs broken down by instance type for the last 3 months."

Then narrow:
> "Which instance types had the biggest increase month over month?"

Then drill to region:
> "Which region is running the most of those instances and what's the cost?"

Then check purchasing model:
> "What percentage of those instances are on-demand versus reserved or spot?"

That sequence takes about two minutes in a conversation. To replicate it manually in Cost Explorer, you'd configure four separate filter combinations and switch between report views for each one.

For RDS, the sequence looks different. The question that tends to surface the most opportunity:

> "Which database instances ran continuously without any downtime last month?"

Follow that with:
> "What would my RDS cost have been if the non-production instances in that list had been stopped outside business hours?"

Amazon Q will estimate the savings from stopping dev and staging databases during off-hours. The number is directional rather than exact, but it gives you the basis for a conversation with the engineering team — and that conversation is usually worth having.

---

## Tag coverage: putting a number on the problem

Most FinOps teams know their tag coverage is imperfect. The harder problem is that nobody has quantified exactly how much spend is sitting unallocated. Amazon Q surfaces this without any query building.

> "How much of my total spend last month was on resources with no CostCenter tag?"

> "Show me the top 10 most expensive untagged resources by service last month."

> "Which AWS accounts have the worst tag coverage by spend this month?"

Previously surfacing this data required Athena queries against CUR exports — which itself required setting up the CUR export, creating the Glue crawler, writing the SQL, and interpreting the results. The Amazon Q version isn't as granular as CUR-level analysis, but for a weekly check or an initial conversation with leadership about why tagging matters, it's fast enough to be genuinely useful.

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 16px 0;">Example Output — Unallocated Spend by Account (Illustrative)</p>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0;border:1px solid #E8E8E5;border-radius:8px;overflow:hidden;">
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;">
      <p style="font-size:11px;color:#9B9B96;margin:0 0 4px 0;font-family:monospace;">ACCOUNT</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;">
      <p style="font-size:11px;color:#9B9B96;margin:0 0 4px 0;font-family:monospace;">UNTAGGED SPEND</p>
    </div>
    <div style="padding:12px 16px;background:#fff;">
      <p style="font-size:11px;color:#9B9B96;margin:0 0 4px 0;font-family:monospace;">% OF ACCOUNT TOTAL</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">Production</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">$18,400</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">22%</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">Development</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">$31,200</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">47%</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">Shared Services</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">$9,800</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">31%</p>
    </div>
  </div>
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;margin:12px 0 0 0;">Illustrative figures. Amazon Q generates this breakdown from your actual Cost Explorer data when prompted.</p>
</div>

---

## Commitment coverage: are you buying enough — or too much

Savings Plans and Reserved Instance analysis is where most FinOps teams lose the most manual time each month. The data exists in Cost Explorer but getting a complete picture requires navigating multiple views — coverage reports, utilisation reports, the Cost Optimization Hub recommendations panel — and correlating them yourself.

A sequence that covers the full picture in one conversation:

> "What is my current Savings Plans coverage rate for EC2 this month?"

> "Which EC2 instance families have the lowest Savings Plans coverage?"

> "What Savings Plans would Cost Optimization Hub recommend based on my last 30 days of usage?"

> "If I purchased the recommended Savings Plans, what would my estimated monthly saving be?"

> "What is my current Reserved Instance utilisation rate for RDS?"

> "Do I have any RDS Reserved Instances that are underutilised or expiring in the next 90 days?"

Six prompts. Five to eight minutes. Previously this was 30 to 45 minutes of manual navigation and a spreadsheet to correlate the answers.

The answers aren't more accurate than what you'd find manually — they draw from the same underlying data. The entire saving is in the navigation.

---

## Forecasting: what does next month look like

Before a monthly review or a quarterly planning session:

> "What is my projected total cost for this month based on current spend rate?"

> "Which services are tracking above their budget for this month?"

> "What is my month-over-month cost growth rate for the last 6 months by service?"

> "If current trends continue, what will my EC2 cost be in Q3 this year?"

The forecasting prompts use Cost Explorer's existing forecasting model, not a separate Amazon Q prediction. What you're getting is the same forecast surfaced through a conversational interface rather than a separate report.

If something is tracking over budget, the follow-up that tends to be most useful:

> "Show me which accounts are most likely to exceed budget this month and by how much."

---

## Preparing the executive report

This is where FinOps practitioners spend a disproportionate amount of time — pulling numbers together for a leadership view. These prompts won't write the slide for you, but they get the numbers and context in one place without stitching together five separate Cost Explorer reports manually.

> "Give me a summary of last month's AWS spend versus the prior month, with the top 3 drivers of change."

> "Which teams or cost centres had the biggest spend increase last month?"

> "What cost optimisation actions would have the highest dollar impact if actioned this month?"

> "Show me a 6-month cost trend by environment — production, staging, and development."

Copy the Amazon Q text response into your reporting template, verify the figures against the Cost Explorer visualisation that updated automatically, and you have what you need.

---

## Where it works well and where it doesn't

The honest summary.

**Works well:** Getting Cost Explorer into the right configuration fast. Multi-step conversations where each follow-up builds on the last. Surfacing recommendations from Cost Optimization Hub alongside cost data in the same session, instead of navigating to a separate console section.

**Doesn't work:** CUR-level analysis. If you need individual resource IDs, tag values on specific resources, or line-item granularity, you still need Athena against your CUR exports. Amazon Q in Cost Explorer works at the service, account, and region level. Not the resource level.

**Also doesn't work:** Making changes. Amazon Q can tell you that rightsizing a set of EC2 instances would save $4,200 per month. It cannot action that. The engineering team still has to do it.

**Cross-organisational gaps:** If you manage multiple AWS organisations rather than multiple accounts within one, the current feature has limits. Custom billing views help but don't fully bridge it.

---

## Two things that consistently improve the output

Specify the time period in every prompt where it matters. "What are my top services by cost?" defaults to the current month. "What are my top services by cost in the last 90 days?" is more useful for trend spotting. Be explicit.

Ask for comparisons rather than snapshots. "What is my EC2 cost this month?" gives you a number. "What is my EC2 cost this month compared to the same period last month?" gives you context. Comparisons are where Amazon Q adds more value than a manual Cost Explorer lookup, because configuring a comparison view manually takes several steps.

---

## Getting access

Amazon Q cost analysis in Cost Explorer needs the right IAM permissions. The key ones: `ce:GetCostAndUsage`, `ce:GetReservationCoverage`, `ce:GetSavingsPlansCoverage`, and `q:SendMessage`.

Open Cost Explorer in the Billing and Cost Management console. Look for the suggested prompts row at the top of the Cost and Usage Overview page. If it's not there, check that Cost Explorer is enabled and that your IAM role includes the Amazon Q permissions above.

---

*Using Amazon Q in Cost Explorer and finding prompts that work for your environment? [Get in touch](/contact) — the workflow above is a starting point. The most useful prompts are always the ones built around your actual spending patterns.*
