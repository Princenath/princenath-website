---
title: "Your Bedrock Bill Is Growing. Do You Know Who's Spending It?"
date: "2026-05-15"
excerpt: "AWS launched granular cost attribution for Amazon Bedrock sixteen days ago. You can now see exactly which IAM principal called which model and what it cost, directly in CUR 2.0 and Cost Explorer. This is the first time that's been possible. For FinOps teams trying to govern AI spend before it becomes ungovernable, here's what the feature does, how to set it up, and where it still falls short."
tags: ["AWS", "Amazon Bedrock", "FinOps", "AI Cost Management", "Cost Attribution", "CUR 2.0", "IAM", "Cost Explorer", "FinOps for AI"]
---

## The bill nobody could explain

A few months ago, a FinOps team I heard about at a practitioner event opened their monthly AWS bill and saw Bedrock charges had tripled from the previous month. $140,000 to $430,000 in thirty days.

They went to Cost Explorer. They could see Bedrock as a service. They could see which models were being used. They could not see which team, application, or individual was responsible for the increase. The usage had come through a shared IAM role used by multiple services across multiple teams. There was no way to split it without going through CloudTrail logs manually, correlating request timestamps with deployment records, and guessing at the rest.

It took three weeks to trace the cause. A single team had deployed an agentic workflow that called Claude repeatedly in a loop to validate its own outputs. Nobody had reviewed it for cost before it went to production. Nobody had a budget for it. Nobody even knew it existed until the bill arrived.

That story is not unusual. It is increasingly common. And until sixteen days ago, AWS gave FinOps teams almost nothing to work with on the attribution side.

That changed on April 9.

---

## How bad is the AI cost visibility problem

Before getting into the feature, it's worth understanding the scale of what teams are dealing with.

The FinOps Foundation's State of FinOps 2026 report surveyed 1,192 practitioners representing over $83 billion in annual cloud spend. The finding that stands out: 98% of FinOps teams now manage AI spend. Two years ago that number was 31%. In a single year it went from a minority concern to essentially universal.

The top challenge those teams report is not price. It's visibility. Specifically, the inability to see which team, application, or use case is driving the spend, and therefore the inability to build accountability, set budgets, or identify waste.

Bedrock sits at the heart of both problems. When you call a model through Bedrock, the cost comes through in your CUR as a Marketplace purchase. You get the model name, the region, and the account. That's it. No IAM identity. No application context. No project tag. A team running three different AI products through the same AWS account could not separate their costs at all.

For context on what's at stake financially: a p5e.48xlarge GPU instance for ML workloads now costs $39.80 per hour after AWS's 15% price increase earlier this year. At 720 hours a month, that's $28,656 for one instance. An agentic workflow calling Claude Sonnet at heavy usage can easily run $50,000 to $80,000 a month depending on token volume. These are not small numbers to leave unattributed.

---

## What AWS just launched

On April 9, 2026, AWS released IAM principal-based cost attribution for Amazon Bedrock, available in all commercial regions where Bedrock is available.

Here's what it actually does.

When you make a Bedrock inference call, that call is made by an IAM principal: an IAM user, an IAM role, or a service account. AWS has always captured this in CloudTrail. What it has never done, until now, is surface that identity in your billing data.

The new feature writes the IAM principal identity directly into your CUR 2.0 data at the line-item level. Each Bedrock inference charge now carries a field showing which IAM principal made the call. If that principal has cost allocation tags applied to it, such as `Team: DataEngineering` or `Project: CustomerCopilot` or `CostCenter: 1042`, those tags flow through into the cost data and become filterable dimensions in Cost Explorer.

In practice, a FinOps team can now open Cost Explorer and ask: "Show me Bedrock spend grouped by Team tag for the last 30 days." And get an actual answer.

That has never been possible with Bedrock before.

---

## Setting it up

The setup is three steps. None of them require code.

**Step 1: Tag your IAM principals.**

Go to IAM in the AWS console. For every IAM role or user that makes Bedrock API calls, add cost allocation tags. At minimum: `Team`, `Project`, and `CostCenter`. If you have a service account used by your customer-facing AI product, tag it with `Project: CustomerCopilot`. If your data science team uses a shared role, tag it with `Team: DataScience`.

This is the step that takes the most time, because most organisations have not tagged their IAM principals at all. Run a CloudTrail query first to find which principals are actually making Bedrock calls, then prioritise tagging those.

```sql
-- Find IAM principals making Bedrock calls via CloudTrail (Athena query)
SELECT
  useridentity.arn AS principal_arn,
  useridentity.type AS principal_type,
  COUNT(*) AS call_count,
  DATE_TRUNC('day', eventtime) AS call_date
FROM cloudtrail_logs
WHERE eventsource = 'bedrock.amazonaws.com'
  AND eventname IN ('InvokeModel', 'InvokeModelWithResponseStream')
  AND eventtime >= CURRENT_DATE - INTERVAL '30' DAY
GROUP BY 1, 2, DATE_TRUNC('day', eventtime)
ORDER BY call_count DESC;
```

This tells you exactly which roles are responsible for Bedrock usage before you start tagging. You're not working blind.

**Step 2: Activate the tags for cost allocation.**

In the Billing and Cost Management console, go to Cost Allocation Tags. Find the tags you applied to your IAM principals and activate them. AWS takes up to 24 hours to start reflecting activated tags in new billing data.

**Step 3: Configure your CUR 2.0 export.**

When setting up or editing your CUR 2.0 data export, enable the option "Include caller identity (IAM principal) allocation data." Once active, each Bedrock line item in your export carries the principal identity and any tags associated with it.

After that, Cost Explorer picks it up automatically. No dashboard rebuild required.

---

## What the data looks like

Once the tags are flowing, a monthly Bedrock cost summary by team might look like this:

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 16px 0;">Monthly Bedrock Spend by Team Tag — After IAM Attribution (Illustrative)</p>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:0;border:1px solid #E8E8E5;border-radius:8px;overflow:hidden;">
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;">
      <p style="font-size:11px;color:#9B9B96;margin:0;font-family:monospace;">TEAM</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;">
      <p style="font-size:11px;color:#9B9B96;margin:0;font-family:monospace;">MODEL USED</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;">
      <p style="font-size:11px;color:#9B9B96;margin:0;font-family:monospace;">MONTHLY SPEND</p>
    </div>
    <div style="padding:12px 16px;background:#fff;">
      <p style="font-size:11px;color:#9B9B96;margin:0;font-family:monospace;">MOM CHANGE</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">Data Engineering</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">Claude Sonnet 3.7</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">$187,400</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">+208%</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">Customer Products</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">Claude Haiku 3.5</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;font-weight:600;margin:0;">$94,200</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">+12%</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">Platform Engineering</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">Mixed models</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;font-weight:600;margin:0;">$41,800</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">+5%</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">Unattributed</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#9B9B96;margin:0;">No IAM tags</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">$106,600</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#9B9B96;margin:0;">Unknown</p>
    </div>
  </div>
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;margin:12px 0 0 0;">Illustrative figures. The Data Engineering 208% increase is the signal that warrants investigation.</p>
</div>

The Data Engineering row with a 208% month-over-month increase is what you act on. That's the agentic workflow running without a budget. Without IAM attribution, that number was buried in a single Bedrock line item showing "Claude Sonnet 3.7: $430,000" with no indication of who was responsible.

The unattributed row is what you still need to fix. $106,600 with no IAM tags means those principals weren't caught during the tagging sweep. Go back to CloudTrail, find the remaining principals, tag them, and that bucket shrinks.

---

## Where the feature still falls short

This is the honest part.

**IAM attribution is not token-level attribution.** The feature tells you which principal called Bedrock and what it cost in dollars. It does not tell you how many input tokens versus output tokens drove that cost, which specific prompts were most expensive, or whether the spend was efficient relative to the output it produced. For that level of detail, you still need Bedrock model invocation logging to CloudWatch, and you need to build your own analysis on top of it.

**Shared roles are still a problem.** If three different applications use the same IAM execution role, the attribution lands on the role, not the application. You'll know Data Engineering is spending $187,000 a month. You won't automatically know which of their four AI features is responsible. The fix is separate IAM roles per application, which is also better security practice, but it's a platform change that takes time.

**Direct API calls can bypass it.** Some teams call Bedrock using long-term IAM access keys, often in development environments or from tools that don't use role assumption properly. If those access keys aren't tagged and don't appear in your CloudTrail sweep, the calls are invisible. This is a governance problem more than a feature gap, but the result is the same: unattributed spend.

**It doesn't tell you if the spend is worth it.** Attribution tells you who is spending what. It says nothing about whether the AI application is delivering business value. A team spending $50,000 a month on Bedrock to power a feature driving $2 million in revenue looks identical in Cost Explorer to a team spending $50,000 on internal tooling with ten users. The ROI question remains unsolved by any native AWS tooling.

---

## The bigger picture

The FinOps Foundation updated its mission in 2026 from "Advancing the People who manage the Value of Cloud" to "Advancing the People who manage the Value of Technology." The change reflects exactly what's happening with AI spend: FinOps teams are being asked to govern something that wasn't in scope two years ago and is now growing faster than anything else on the bill.

Two years ago, 31% of FinOps teams managed AI spend. Today it's 98%. The teams that are ahead of this problem are the ones that built attribution infrastructure before the spend scaled. The teams that are behind it are the ones that will spend Q3 tracing where $400,000 went.

The IAM attribution feature is a real step forward. Tag your principals now, before the Bedrock bill is the number your CFO asks about in the next QBR.

---

*Managing Bedrock spend across multiple teams and trying to build an attribution model that actually holds? [Get in touch](/contact) — the IAM tagging sweep and CUR 2.0 setup is usually faster than teams expect.*
