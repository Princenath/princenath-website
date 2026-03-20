---
title: "The RDS Reserved Instance Trap: Why Your Commitment Isn't Doing What You Think"
date: "2025-03-20"
excerpt: "RDS Reserved Instances are fundamentally different from EC2 RIs in ways that catch even experienced teams off guard. Here's what goes wrong, why it's harder to fix than you'd expect, and what your options actually are."
tags: ["AWS", "RDS", "Reserved Instances", "FinOps", "Cost Optimization"]
---

Of all the billing mistakes I've seen on AWS accounts, incorrectly purchased RDS Reserved Instances are among the most frustrating — not because they're hard to understand in hindsight, but because they're so easy to get wrong, and so expensive to ignore.

The pattern is almost always the same. A team decides to commit on their RDS spend. They've done EC2 RIs before, they know the drill — find the instance, buy the reservation, save money. They go through the RDS Reserved Instance purchase flow, confirm the order, and assume they're done.

A few weeks later, the RI shows as "active" but the discount isn't applying. Or it's applying to the wrong database. Or it's applying to a completely different region than expected. The team raises a ticket with AWS Support, discovers the reservation can't be modified or exchanged the way EC2 RIs can, and the finance team is now looking at a committed spend that isn't generating any savings.

This post is about why that happens, how to catch it before it costs you, and what remedies you actually have.

---

## Why RDS RIs Are Not Like EC2 RIs

Most FinOps practitioners learn Reserved Instances on EC2 first. EC2 has two RI types:

- **Standard RIs** — locked to a specific instance family, OS, and region, but convertible within certain limits
- **Convertible RIs** — can be exchanged for other Convertible RIs of equal or greater value, giving you a way out if your needs change

EC2 also has **Compute Savings Plans**, which are even more flexible and apply automatically across instance families, sizes, and even Lambda.

RDS has none of this flexibility. There are no Convertible RIs for RDS. There are no Savings Plans that cover RDS. What RDS has is a single RI type that locks you into a very specific combination of attributes — and if any one of those attributes doesn't match what you're actually running, the discount doesn't apply.

The attributes that must match exactly are:

| Attribute | Example values | Notes |
|---|---|---|
| DB engine | MySQL, PostgreSQL, Oracle, SQL Server, MariaDB, Aurora | Cannot change after purchase |
| DB instance class | db.r6g.xlarge, db.t3.medium | Size matters — no flexibility across families |
| Deployment type | Single-AZ or Multi-AZ | Separate SKUs, priced differently |
| License model | License-included or Bring Your Own License (BYOL) | Oracle and SQL Server only |
| Region | us-east-1, eu-west-1 | Region-locked, no flexibility |

Every single one of these must match the running DB instance for the reservation to apply. If your RDS instance is a `db.r6g.xlarge` running Multi-AZ PostgreSQL in `us-east-1` and you purchased a reservation for a `db.r6g.xlarge` running Single-AZ PostgreSQL in `us-east-1`, the discount does not apply. You're paying On-Demand rates on the instance and burning through a reservation that covers nothing.

---

## The Most Common Ways This Goes Wrong

### 1. Single-AZ vs Multi-AZ Mismatch

This is the most frequent mistake I see, and it's an easy one to make. In the AWS Console, when you go to purchase an RDS RI, the Multi-AZ toggle is easy to miss. The pricing difference is significant (Multi-AZ RIs cost roughly twice as much as Single-AZ), which means:

- If you buy a **Single-AZ RI** but your instance runs **Multi-AZ**, the RI doesn't apply — you're overpaying on the instance and wasting the reservation
- If you buy a **Multi-AZ RI** but your instance runs **Single-AZ**, the RI does apply (AWS maps it down), but you've paid for Multi-AZ coverage you're not using — a different form of waste

Always verify your deployment type before purchasing. Run this CLI command to check:

```bash
aws rds describe-db-instances \
  --query "DBInstances[*].{ID:DBInstanceIdentifier, Class:DBInstanceClass, Engine:Engine, MultiAZ:MultiAZ}" \
  --output table
```

### 2. Engine Mismatch

Aurora is **not** the same engine as MySQL or PostgreSQL in AWS billing terms, even though Aurora MySQL is compatible with MySQL and Aurora PostgreSQL is compatible with PostgreSQL. They're separate SKUs with separate reservation types.

If your team migrated from RDS MySQL to Aurora MySQL and forgot to update the RI purchase accordingly — or bought an Aurora RI before the migration completed — the reservation will sit unused.

Also worth noting: Aurora Serverless v2 is billed in Aurora Capacity Units (ACUs) and is **not covered** by standard RDS Reserved Instances at all. This catches teams who bought RDS RIs for Aurora instances that were subsequently converted to Serverless v2.

### 3. Instance Class Family Mismatch

EC2 Reserved Instances within the same family (e.g., buying an `m5.xlarge` RI helps cover an `m5.2xlarge` on a normalized unit basis). RDS does not work this way. An RI for a `db.r5.xlarge` does not normalize toward a `db.r6g.xlarge` even though they're both memory-optimized classes.

When teams upgrade their RDS instances to the newer Graviton-based classes (db.r6g, db.r7g) — often for the performance gains and lower On-Demand pricing — their existing RIs for the older Intel-based classes (db.r5, db.m5) stop applying. The reservation stays active, billing continues, and the savings disappear.

### 4. Region Lock with No Cross-Region Flexibility

This one is rarer but expensive when it happens. An RI purchased in `us-east-1` cannot be applied to an instance running in `eu-west-1`. If your architecture team moved a database workload to a different region (for latency, compliance, or disaster recovery reasons), any reservations in the old region become stranded.

Unlike EC2, there's no equivalent to the "region-flexible" Compute Savings Plans that cover workloads regardless of which region they run in.

---

## Diagnosing Whether Your RIs Are Actually Applying

Before assuming everything is fine, go verify this directly. Most teams don't.

**Step 1: Check RI utilization in Cost Explorer**

Go to AWS Cost Explorer → Reservations → Utilization Report → Filter by Service: RDS.

Any RI with utilization below 100% is either partially wasted or completely unused. A brand new RI at 0% utilization after 48 hours is a red flag — billing data takes 24–48 hours to reflect, but after that window, 0% means something isn't matching.

**Step 2: Pull the Coverage Report**

Cost Explorer → Reservations → Coverage Report → Service: RDS.

This shows the inverse: what percentage of your RDS *instance hours* are being covered by reservations. If you have active RIs but coverage is low, you have a mismatch.

**Step 3: Cross-reference attributes manually**

Pull your active RIs:

```bash
aws rds describe-reserved-db-instances \
  --query "ReservedDBInstances[*].{ID:ReservedDBInstanceId, Class:DBInstanceClass, Engine:ProductDescription, MultiAZ:MultiAZ, State:State}" \
  --output table
```

Pull your running instances:

```bash
aws rds describe-db-instances \
  --query "DBInstances[*].{ID:DBInstanceIdentifier, Class:DBInstanceClass, Engine:Engine, MultiAZ:MultiAZ}" \
  --output table
```

Then manually compare. Every RI attribute must have a corresponding running instance that matches. Any RI with no match is stranded.

---

## What You Can Do About It

This is where people get frustrated. Because unlike EC2, your options are genuinely limited.

### Option 1: Modify Your Running Instance to Match the RI

If the RI is correct (right engine, right region, right license model) but the running instance is a different size or Multi-AZ setting, you may be able to modify the instance to match the reservation. This is often the cleanest fix — especially if you were planning to resize or change the deployment type anyway.

Caveats:
- Changing Multi-AZ setting on a production database requires a maintenance window and will cause a brief failover (typically under 60 seconds for Multi-AZ → Single-AZ, longer for the reverse)
- Resizing the instance class also requires downtime unless you use a blue/green deployment

### Option 2: Contact AWS Support for a One-Time Modification

AWS Support can, in certain circumstances, modify an RDS Reserved Instance — for example, changing the instance class within the same family, or correcting a deployment type (Single-AZ ↔ Multi-AZ). This is handled as a goodwill exception, not a guaranteed entitlement.

**How to approach this request:**

Open a support case with case type **Account and Billing Support** (not Technical Support). In the case description, be specific:

> "We purchased an RDS RI [RI ID] for [db.r6g.xlarge, Single-AZ, PostgreSQL, us-east-1] but our running instance [instance ID] is [db.r6g.xlarge, Multi-AZ, PostgreSQL, us-east-1]. We'd like to request a one-time modification to update the RI deployment type from Single-AZ to Multi-AZ to align with our actual workload."

A few things that improve your chances:
- The RI was purchased recently (within 30–60 days) — AWS is more accommodating with fresh mistakes than year-old ones
- The requested change is within the same engine and instance family — asking to change PostgreSQL to Aurora is a different ask than changing Single-AZ to Multi-AZ
- You have Business or Enterprise Support — response quality and flexibility is noticeably better at these tiers
- You're a customer with significant AWS spend — account teams have more flexibility for larger accounts

AWS will not guarantee this outcome. I've seen teams get modifications approved within 24 hours, and I've seen similar requests denied. Having clear documentation of what was purchased versus what's running strengthens your case.

### Option 3: Sell on the AWS Marketplace (Standard RIs Only)

Standard Reserved Instances for EC2 can be listed on the AWS Reserved Instance Marketplace. RDS Reserved Instances **cannot**. This route is not available for RDS.

### Option 4: Run the Wrong Instance Temporarily

This sounds counterintuitive but it's sometimes the right call for short-term mismatches. If you have 8 months left on a 1-year RI for a `db.r6g.xlarge Single-AZ PostgreSQL` instance, and you're currently running a `db.r6g.large`, one option is to scale up the running instance to match the reservation. You paid for the larger instance anyway — you might as well get the workload to use it.

This only makes sense if the RI value is large enough to justify the operational change. Do the math: compare the remaining RI value against the cost of running the instance at a suboptimal size.

### Option 5: Let It Expire and Buy Correctly Next Time

The most painful option, but sometimes the right one. If the mismatch can't be corrected and AWS Support won't modify the RI, the reservation will continue billing until it expires. The mitigation is to:

1. Document exactly what went wrong (mismatch type, RI attributes vs. instance attributes)
2. Make sure the running instance is at least partially covered by the stranded RI if possible (resize or reconfigure to match)
3. Set a calendar reminder before the RI expiry date to purchase a correct replacement

---

## Prevention: A Pre-Purchase Checklist

Before buying any RDS Reserved Instance, run through this checklist:

```
□ Confirm running instance engine exactly (MySQL vs Aurora MySQL vs PostgreSQL)
□ Check if Aurora Serverless v2 is involved — RIs don't apply
□ Confirm instance class (db.r6g vs db.r5 — these are different)
□ Check Multi-AZ status in console AND via CLI (console display can be misleading)
□ Verify license model for Oracle/SQL Server (license-included vs BYOL)
□ Confirm the AWS region the instance actually runs in
□ Cross-check attributes between the RI purchase screen and describe-db-instances output
□ Start with a 1-year term, not 3-year, until you have high confidence in the workload
```

The 60 seconds this takes before confirming a purchase is worth more than hours of support tickets afterward.

---

## A Note on Aurora

Aurora deserves its own mention because its billing model is the most frequently misunderstood.

Aurora clusters have a **cluster endpoint** and **reader endpoints**, but reservations apply at the **instance level** — specifically to each `db.r*` or `db.t*` instance in the cluster. A 3-node Aurora cluster (1 writer, 2 readers) needs 3 separate RIs to achieve full coverage.

Aurora also has a quirk where the engine shown in the billing console depends on how the cluster was created. An Aurora MySQL 3.x cluster will show as `aurora-mysql` in Cost Explorer — not `mysql` and not `aurora`. If you're cross-referencing RI attributes against CUR data, use the exact engine string from the billing data, not the console display name.

---

## The Bigger Picture

RDS Reserved Instances are valuable — the discounts are real (up to 69% off On-Demand for 3-year, all-upfront) and database costs are often a significant chunk of a company's AWS bill. The rigidity that makes them easy to get wrong also means the savings are meaningful when they're applied correctly.

The teams that handle this well treat RDS RI purchases as an ops event, not a finance checkbox. They pull CLI output before purchasing, they verify utilization reports after purchasing, and they track RI expiry dates the same way they track certificate renewals.

If you're currently sitting on stranded RDS RIs and unsure what to do, start with the diagnosis steps above. Know exactly what you have before you call AWS Support — a precise, well-documented request is the difference between a quick resolution and a closed-as-expected ticket.

---

*Working through a specific RDS RI situation? [Get in touch](/contact) — happy to take a look at the details.*
