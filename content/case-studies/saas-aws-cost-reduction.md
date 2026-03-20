---
title: "Reducing AWS Spend by 42% for a Mid-Size SaaS Company"
date: "2024-01-20"
excerpt: "A SaaS company with 200+ engineers was spending $180,000/month on AWS with no cost allocation, unchecked On-Demand usage, and zero Reserved Instance coverage. Here's how we brought that under control."
industry: "SaaS / Technology"
outcome: "42% cost reduction — $75,600/month saved"
tags: ["AWS", "EC2", "Reserved Instances", "Cost Allocation", "FinOps"]
---

## Background

A fast-growing B2B SaaS company had scaled from 20 to 200+ engineers over three years. Their AWS footprint had grown proportionally — but their cloud cost practices hadn't. By the time I was engaged, they were spending approximately **$180,000/month** on AWS with no clear ownership model for that spend.

**The immediate symptoms:**
- Month-over-month cost growth of 8–12% with no corresponding growth in revenue or user base
- Finance team receiving a monthly bill with no ability to attribute costs to products or teams
- Engineers unaware of the cost implications of their infrastructure choices
- Zero Reserved Instance or Savings Plan coverage

---

## The Problem

Three root causes were driving the runaway spend:

### 1. No Cost Visibility

The AWS account had no tagging strategy. Every resource — EC2 instances, RDS databases, S3 buckets, load balancers — was untagged. This meant the $180,000 monthly bill arrived as an undifferentiated blob. Finance couldn't answer "which team is spending this?" and engineering couldn't answer "is our product profitable on an infrastructure basis?"

### 2. Massive Over-Provisioning

Without cost awareness, engineers had defaulted to large instance types. A review of their EC2 fleet found:

- **68% of EC2 instances** were running below 15% average CPU over a 30-day window
- 12 `m5.4xlarge` instances ($0.768/hr each) were used for microservices averaging 4% CPU
- Several `r5.2xlarge` memory-optimized instances were running workloads that didn't require high memory
- Development and staging environments were running 24/7 on production-class instances

### 3. All On-Demand, No Commitments

100% of their EC2 and Fargate spend was On-Demand. For a company with 3+ years of stable baseline workloads, this was the most expensive possible pricing model.

```
Monthly EC2 On-Demand spend:     $94,000
Equivalent with Savings Plan:    ~$54,000
Monthly overpayment:             ~$40,000
```

---

## Analysis

The engagement began with a 2-week discovery phase:

**Week 1: Data Collection**
- Exported 6 months of Cost and Usage Reports (CUR) to S3
- Used AWS Cost Explorer to identify top 20 cost drivers
- Ran Python scripts against the CUR data to segment spend by service, region, and instance type
- Pulled CloudWatch CPU/memory metrics for all EC2 instances

**Week 2: Pattern Analysis**

The CloudWatch data revealed clear patterns:

| Instance Category | Count | Avg CPU | Monthly Cost | Recommended Action |
|---|---|---|---|---|
| Heavily over-provisioned | 47 | < 10% | $42,300 | Right-size 2 tiers down |
| Moderately over-provisioned | 31 | 10–20% | $18,600 | Right-size 1 tier down |
| Appropriately sized | 28 | 20–60% | $22,100 | Commit with Savings Plan |
| Under-provisioned | 3 | > 80% | $3,100 | Scale up or investigate |

A cost anomaly analysis also found:
- $4,200/month in forgotten data transfer fees from a deprecated cross-region replication job
- $2,800/month in unattached EBS volumes (73 volumes, some dating back 2 years)
- $1,100/month in Elastic IPs not associated with running instances

---

## Solution

The optimization was executed in three phases over 90 days:

### Phase 1: Quick Wins (Weeks 1–4)

**Tagging:**
- Defined a four-key tag schema: `Team`, `Environment`, `Product`, `CostCenter`
- Used AWS Tag Editor to audit all resources
- Wrote an AWS Config rule to alert on untagged resource creation going forward
- Engineering leads were given their team's cost report for the first time

**Zombie resource cleanup:**
- Deleted 73 unattached EBS volumes: **$2,800/month saved**
- Released 18 unassociated Elastic IPs: **$1,100/month saved**
- Terminated the cross-region replication job after confirming with the data team it was unused: **$4,200/month saved**
- Identified and terminated 8 forgotten development instances: **$3,600/month saved**

**Phase 1 total: $11,700/month saved**

### Phase 2: Rightsizing (Weeks 5–10)

Working with engineering leads, we systematically right-sized over-provisioned instances:

- 47 heavily over-provisioned instances right-sized 2 tiers (e.g., `m5.2xlarge` → `m5.large`)
- 31 moderately over-provisioned instances right-sized 1 tier
- All dev/staging environments moved to a scheduled start/stop policy (8am–8pm weekdays only)

**Key enabler:** We set up CloudWatch dashboards per team so engineers could see their instance metrics in real time. This transparency changed behavior — several engineers proactively right-sized their own instances before we asked.

**Phase 2 total: $38,400/month saved (rightsizing) + $6,200/month (dev/staging scheduling)**

### Phase 3: Commitment Strategy (Weeks 10–12)

With rightsizing complete, we had a clear picture of the stable baseline workload. We purchased:

- **1-year Compute Savings Plan** covering $32,000/month of On-Demand EC2 spend
- Effective discount: 38% → **$12,160/month saved**
- Reserved `m5.large` instances for the 12 most stable microservices: **$3,140/month saved**

**Phase 3 total: $15,300/month saved**

---

## Outcome

Over 90 days, the company's monthly AWS spend dropped from **$180,000 to $104,400** — a **42% reduction**.

| Category | Monthly Savings |
|---|---|
| Zombie resource cleanup | $11,700 |
| EC2 rightsizing | $38,400 |
| Dev/staging scheduling | $6,200 |
| Savings Plans & RIs | $15,300 |
| **Total** | **$75,600** |

**Annualized savings: $907,200**

Beyond the direct cost savings, the company established a sustainable FinOps practice:

- Weekly cost review meetings with engineering leads
- Automated anomaly alerts via AWS Budgets
- A tagging compliance score tracked on a shared dashboard
- New hire onboarding includes a "cloud cost awareness" module

---

## Lessons Learned

**1. Visibility drives behavior.** The single highest-leverage action was sharing cost reports with engineering teams. Engineers aren't indifferent to cost — they just didn't have the information to act on it.

**2. Start with cleanup before committing.** Purchasing Reserved Instances before rightsizing locks in waste. Always clean up and right-size first, then commit.

**3. Dev/staging scheduling is underrated.** Development environments that run 24/7 are burning money for 16 hours a day when nobody is working. Scheduled stop/start policies are easy to implement and require no code changes.

**4. FinOps is a cultural change, not a technical fix.** The tools and analysis are the easy part. Getting buy-in from engineering teams — and making cost a first-class metric alongside performance and reliability — is where the real work happens.

---

*Interested in a similar engagement for your AWS environment? [Get in touch](/contact).*
