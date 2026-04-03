---
title: "$2.5 Million in the Dark: How a Tag Coverage Dashboard Changed the Executive Conversation on Cloud Cost Accountability"
date: "2026-04-03"
excerpt: "A large AWS organisation had been doing FinOps right on paper. Cost Explorer configured, budgets set, alerts in place. But 38% of their total cloud spend was completely untagged. No business unit. No application. No environment. $2.5 million a year that finance couldn't attribute, and that nobody owned. The problem wasn't technical. It was that nobody with authority had ever seen the number."
industry: "Enterprise / Multi-Account AWS"
outcome: "Identified $2.5M in unallocated annual cloud spend. Secured executive mandate to enforce tagging standards, implement AWS Config rules, and establish a 90-day roadmap to reduce unallocated cost below 5%."
tags: ["AWS", "CUR 2.0", "Athena", "QuickSight", "Cost Allocation", "Tagging", "FinOps", "AWS Config"]
---

## Background

The client was running a mature AWS environment. Multiple accounts, several business units, a dedicated cloud operations team. On paper the FinOps practice looked reasonably healthy. AWS Cost Explorer was enabled, monthly budget alerts were configured, and a tagging policy existed in their internal wiki. Every resource was supposed to carry at least four keys: `Environment`, `Application`, `Owner`, and `CostCenter`.

The wiki hadn't been enforced since it was written.

When we started the engagement, the initial ask was simple: build a tag coverage dashboard so the team could see which resources were tagged and which weren't. What nobody had put a number on yet was how much spend was flowing through untagged resources. That figure, once we surfaced it, changed the whole scope of the conversation.

The organisation's total AWS spend across accounts ran at roughly **$6.6 million annually**. Of that, **$2.5 million** — 38% — could not be attributed to any business unit, application, or team owner through the existing tag structure.

Getting that number in front of the right people was the actual work.

---

## The Problem

### Why Tagging Gaps Are Invisible Until They're Not

Tagging failures are slow accumulations, not sudden events. Each untagged resource is individually small — a Lambda function left over from a proof of concept, an RDS instance that predates the policy, an S3 bucket created by a third-party tool that never passes tags through. None of these triggers an alarm on its own. But across dozens of accounts and hundreds of engineers, over months and years, the unallocated spend builds quietly.

The team knew they had a tagging problem in the abstract. What they didn't have was the specific, quantified version of that problem. The number that makes a CTO or CFO ask "why hasn't this been fixed?" Without that number, tagging enforcement stays low on the backlog.

The point of this engagement was to produce that number, back it with queryable data, and present it in a format that made the business case for enforcement impossible to put off.

### Why We Started With CUR 2.0

The client's billing data was on legacy CUR, the original Cost and Usage Report format available since 2015. Legacy CUR works, but it has real limitations for tag-level cost analysis at scale.

Tag columns appear as `resource_tags_user_<key>`, dynamically generated and inconsistently named across accounts with different tag schemas. The format also doesn't distinguish between resources that were never tagged and resources where a tag was applied but not activated for cost allocation. And in organisations with many custom tag keys, the column count gets unwieldy fast.

CUR 2.0, generally available since late 2023, fixes these issues. The tag data is structured more cleanly, column naming is consistent, and the format integrates naturally with Athena. For an engagement where the whole point was tag-level cost analysis, migrating the client before building anything else was the right call.

The migration took one afternoon. CUR 2.0 is enabled in the AWS Billing console under Cost and Usage Reports, with the destination S3 bucket and Athena integration configured the same way as legacy CUR. Once the Glue crawler ran against the new export, the format change was invisible to Athena.

---

## The Approach

### Step 1: Tag Discovery Queries

Before measuring tag coverage, we needed to know what tags the organisation was actually using. The documented policy said four keys. Reality was more complicated.

We ran discovery queries against the CUR 2.0 data in Athena to pull every tag key present in the billing data, ranked by the number of resource-months they appeared on:

```sql
-- Discover all active tag keys and their coverage
SELECT
  tag_key,
  COUNT(DISTINCT line_item_resource_id) AS tagged_resources,
  ROUND(SUM(line_item_unblended_cost), 2) AS total_cost_covered
FROM (
  SELECT
    line_item_resource_id,
    line_item_unblended_cost,
    t.tag_key
  FROM cur2_database.cur2_table
  CROSS JOIN UNNEST(
    ARRAY[
      IF(resource_tags_user_environment IS NOT NULL, 'Environment', NULL),
      IF(resource_tags_user_application IS NOT NULL, 'Application', NULL),
      IF(resource_tags_user_owner IS NOT NULL, 'Owner', NULL),
      IF(resource_tags_user_costcenter IS NOT NULL, 'CostCenter', NULL),
      IF(resource_tags_user_project IS NOT NULL, 'Project', NULL),
      IF(resource_tags_user_team IS NOT NULL, 'Team', NULL)
    ]
  ) AS t(tag_key)
  WHERE line_item_line_item_type = 'Usage'
    AND bill_billing_period_start_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '3' MONTH)
    AND t.tag_key IS NOT NULL
)
GROUP BY tag_key
ORDER BY total_cost_covered DESC;
```

The results told a story the team hadn't seen before. The organisation was using **11 distinct tag keys** across the environment, not the 4 in the policy. Some were legacy keys from an older naming convention. Some had been added by individual teams without coordination. Some appeared on fewer than 3% of resources.

Understanding the actual tag landscape, not the intended one, shaped everything that came next.

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 16px 0;">Tag Discovery Results — Top Keys by Cost Coverage</p>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:0;border:1px solid #E8E8E5;border-radius:8px;overflow:hidden;">
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;">
      <p style="font-size:11px;color:#9B9B96;margin:0 0 4px 0;font-family:monospace;">TAG KEY</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;">
      <p style="font-size:11px;color:#9B9B96;margin:0 0 4px 0;font-family:monospace;">RESOURCES TAGGED</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;">
      <p style="font-size:11px;color:#9B9B96;margin:0 0 4px 0;font-family:monospace;">COST COVERED</p>
    </div>
    <div style="padding:12px 16px;background:#fff;">
      <p style="font-size:11px;color:#9B9B96;margin:0 0 4px 0;font-family:monospace;">COVERAGE %</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">Environment</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">4,812</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">$4,890,000</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">74%</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">Application</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">3,941</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">$4,230,000</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">64%</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">CostCenter</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">2,890</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">$3,100,000</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">47%</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">Owner</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">2,103</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">$2,640,000</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">40%</p>
    </div>
  </div>
</div>

### Step 2: Quantifying Unallocated Cost

With the tag landscape mapped, we built the central query. A resource counted as "unallocated" if it was missing all four mandatory tag keys at once. A resource with `Environment` but not `CostCenter` was partially tagged but still couldn't be charged back to a business unit. For the executive report, we split this into two buckets: fully untagged and partially tagged.

```sql
-- Unallocated cost analysis across the full AWS org
SELECT
  line_item_usage_account_id AS account_id,
  product_product_name AS service,
  CASE
    WHEN resource_tags_user_costcenter IS NULL
     AND resource_tags_user_application IS NULL
     AND resource_tags_user_environment IS NULL
     AND resource_tags_user_owner IS NULL
    THEN 'Fully Untagged'
    WHEN resource_tags_user_costcenter IS NULL
      OR resource_tags_user_application IS NULL
    THEN 'Partially Tagged — Not Allocatable'
    ELSE 'Fully Allocated'
  END AS allocation_status,
  ROUND(SUM(line_item_unblended_cost), 2) AS total_cost,
  COUNT(DISTINCT line_item_resource_id) AS resource_count
FROM cur2_database.cur2_table
WHERE line_item_line_item_type = 'Usage'
  AND bill_billing_period_start_date >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY 1, 2, 3
ORDER BY total_cost DESC;
```

Aggregated across all accounts for the trailing 12 months:

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px;background:#E8E8E5;border-radius:8px;overflow:hidden;">
    <div style="background:#fff;padding:20px;text-align:center;">
      <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px 0;">Fully Allocated</p>
      <p style="font-size:26px;font-weight:700;color:#0A0A0A;margin:0;font-family:'Playfair Display',Georgia,serif;">$4.1M</p>
      <p style="font-size:11px;color:#9B9B96;margin:4px 0 0 0;font-family:monospace;">62% of total spend</p>
    </div>
    <div style="background:#fff;padding:20px;text-align:center;">
      <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px 0;">Partially Tagged</p>
      <p style="font-size:26px;font-weight:700;color:#C8873A;margin:0;font-family:'Playfair Display',Georgia,serif;">$1.4M</p>
      <p style="font-size:11px;color:#9B9B96;margin:4px 0 0 0;font-family:monospace;">21% of total spend</p>
    </div>
    <div style="background:#fff;padding:20px;text-align:center;">
      <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px 0;">Fully Untagged</p>
      <p style="font-size:26px;font-weight:700;color:#C8873A;margin:0;font-family:'Playfair Display',Georgia,serif;">$1.1M</p>
      <p style="font-size:11px;color:#9B9B96;margin:4px 0 0 0;font-family:monospace;">17% of total spend</p>
    </div>
  </div>
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-align:center;margin:16px 0 0 0;">Combined unallocated spend: $2.5M — 38% of $6.6M total annual AWS spend</p>
</div>

The $2.5M combined fully untagged and partially tagged spend that couldn't be charged back to any business unit or application, regardless of what Cost Explorer showed. This was the number we took upstairs.

### Step 3: Building the QuickSight Dashboard

The Athena queries gave us the data. QuickSight gave us the format that would land in a room with a CFO.

The dashboard had four views:

**Organisation-wide tag coverage heatmap.** Every AWS account plotted against coverage percentage for each mandatory key. Accounts below 60% on any key shown in amber. Below 40% in red. Three accounts were responsible for the bulk of unallocated spend. They were visible immediately.

**Unallocated cost by service.** EC2 and RDS were the biggest contributors — not because they were the most untagged by percentage, but because they were the most expensive services. A 30% tagging gap on EC2 creates more financial exposure than a 90% gap on Lambda.

**Trend over 12 months.** This chart got the most silence in the room. Unallocated spend as a share of total spend had gone up in eight of the previous twelve months. The problem was getting worse, not holding steady.

**Top unallocated resources by cost.** A ranked list of the twenty most expensive untagged resource IDs, with service type, account, and trailing 90-day cost. These were the first ones to fix.

---

## Getting Executive Buy-In

This is the part that doesn't appear in most FinOps write-ups, which is probably why most tagging initiatives stall at the team level.

The dashboard was presented in a 20-minute slot with the Head of Engineering, the VP of Finance, and two business unit leads. We did not open with the technical problem. We opened with the business consequence: $2.5 million a year that finance couldn't assign to a cost centre, a product, or a team. For a finance audience, that's not a cloud infrastructure issue — that's an accounting issue. Framing it that way got the VP of Finance's attention in a way that "we have a tagging hygiene problem" never would.

The trend chart was the turning point. Showing that unallocated spend was growing despite the policy being in place shifted the question from "why haven't you fixed this" to "what do you need to fix this." The difference between a compliance conversation and a resource conversation.

The outcome was a formal mandate, not a recommendation, with three specific deliverables:

1. Tag enforcement via AWS Config rules for all new resources in production and staging accounts, with automatic remediation for six of the eleven active tag keys
2. A 90-day remediation sprint to address existing untagged resources, prioritised by the top 20 list from the dashboard
3. A monthly tag coverage review built into the FinOps reporting cycle, with account owners accountable for their coverage percentage

---

## Implementation: AWS Config Rules for Tag Enforcement

Once the mandate was in place, the enforcement layer was simple to build. AWS Config's `required-tags` managed rule checks that specified tags are present on supported resources. We deployed this across the organisation's accounts using AWS Organizations and a CloudFormation StackSet:

```yaml
# CloudFormation — required-tags Config rule, deployed via StackSet
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  RequiredTagsRule:
    Type: AWS::Config::ConfigRule
    Properties:
      ConfigRuleName: required-mandatory-tags
      Description: Enforce mandatory cost allocation tags on all billable resources
      Source:
        Owner: AWS
        SourceIdentifier: REQUIRED_TAGS
      InputParameters:
        tag1Key: CostCenter
        tag2Key: Application
        tag3Key: Environment
        tag4Key: Owner
      Scope:
        ComplianceResourceTypes:
          - AWS::EC2::Instance
          - AWS::RDS::DBInstance
          - AWS::S3::Bucket
          - AWS::Lambda::Function
          - AWS::ECS::Service
          - AWS::EKS::Cluster
```

For the remediation sprint, we worked through the top 20 resource list account by account, prioritising by cost. Within 90 days, total unallocated spend dropped from 38% to 14%. Not yet at the 5% target, but enough of a reduction to keep the executive attention going.

---

## Outcome

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px;background:#E8E8E5;border-radius:8px;overflow:hidden;">
    <div style="background:#fff;padding:20px;text-align:center;">
      <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px 0;">Unallocated Spend Identified</p>
      <p style="font-size:26px;font-weight:700;color:#C8873A;margin:0;font-family:'Playfair Display',Georgia,serif;">$2.5M</p>
      <p style="font-size:11px;color:#9B9B96;margin:4px 0 0 0;font-family:monospace;">38% of total annual AWS spend</p>
    </div>
    <div style="background:#fff;padding:20px;text-align:center;">
      <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px 0;">Coverage After 90 Days</p>
      <p style="font-size:11px;color:#9B9B96;margin:0 0 4px 0;text-decoration:line-through;">62% allocated</p>
      <p style="font-size:26px;font-weight:700;color:#0A0A0A;margin:0;font-family:'Playfair Display',Georgia,serif;">86% allocated</p>
      <p style="font-size:11px;color:#C8873A;margin:4px 0 0 0;font-family:monospace;">from 62% baseline</p>
    </div>
    <div style="background:#fff;padding:20px;text-align:center;">
      <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px 0;">Executive Mandate</p>
      <p style="font-size:26px;font-weight:700;color:#0A0A0A;margin:0;font-family:'Playfair Display',Georgia,serif;">Secured</p>
      <p style="font-size:11px;color:#9B9B96;margin:4px 0 0 0;font-family:monospace;">Config rules + monthly review cadence</p>
    </div>
  </div>
</div>

The dashboard runs on a monthly refresh cycle. Tag coverage is now a standing agenda item in the FinOps review, with account owners accountable for their numbers the same way they're accountable for budget variances.

---

## What We Learned

**The number has to be financial, not operational.** "We have 4,000 untagged resources" gets a nod and moves on. "$2.5 million we cannot account for" stops the meeting. If you're trying to get buy-in for a tagging programme, the first work is translating the operational metric into money.

**Migrate to CUR 2.0 before building any tag analysis.** The structured tag columns and cleaner schema make Athena queries significantly easier to write and maintain. If you're still on legacy CUR and doing cost allocation work, the migration is a one-afternoon task with a real return.

**Run discovery queries before writing enforcement rules.** The instinct is to start enforcing the policy as documented. The problem is the documented policy rarely matches what's actually in the environment. Discovery queries first means you're working with the real picture, not the intended one. You'll find the legacy keys and team-specific conventions that need consolidating before you can enforce anything properly.

**The trend line matters more than the snapshot.** The fact that unallocated spend was increasing month over month was more persuasive than the raw dollar figure on its own. A static problem can be deferred. A growing one has urgency built in.

**Config rules enforce the future, not the past.** AWS Config's required-tags rule stops new untagged resources from being created. It does nothing about the existing backlog. Both tracks need to run at once: enforcement for new provisioning, remediation for existing resources. Prioritise the remediation by cost, not resource count.

---

*Trying to get a handle on how much of your AWS spend you can actually attribute? [Get in touch](/contact) — the tag discovery queries above are usually the fastest place to start.*
