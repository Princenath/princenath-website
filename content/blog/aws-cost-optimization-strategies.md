---
title: "5 AWS Cost Optimization Strategies Every FinOps Team Should Know"
date: "2024-03-15"
excerpt: "From Reserved Instances to rightsizing, here are the five highest-impact strategies to reduce your AWS bill without sacrificing performance."
tags: ["AWS", "Cost Optimization", "FinOps", "Reserved Instances"]
---

Cloud spending has a way of quietly spiralling. One team spins up an EC2 cluster for a proof-of-concept, another forgets to delete a NAT Gateway, and before long the monthly AWS bill has doubled with nobody quite sure why.

In my work as a Cloud FinOps Analyst, I've seen this pattern repeatedly. The good news: most cloud waste is addressable with a structured approach. Here are the five strategies I return to on every engagement.

---

## 1. Right-size Your EC2 Instances

The single biggest source of waste I encounter is **over-provisioned compute**. Teams choose instance types based on peak load estimates (or fear), and those instances then idle at 5–15% CPU utilization most of the month.

**How to find candidates:**
- Open **AWS Cost Explorer** → Right Sizing Recommendations
- Use **CloudWatch** metrics to identify instances averaging < 20% CPU over 14 days
- Consider memory and network alongside CPU — don't just right-size on CPU alone

**What to do:**
- Move from `m5.2xlarge` to `m5.large` where utilization supports it
- Test in staging first; document the instance type change for rollback
- Set up CloudWatch alarms at 70% CPU so you'll know if utilization rises after resizing

A single rightsizing pass on a mid-sized AWS account can yield **15–30% savings on EC2 alone**.

---

## 2. Commit with Reserved Instances and Savings Plans

On-Demand pricing is convenient, but you pay a significant premium for that flexibility. If you have any predictable, steady-state workloads (and most organizations do), you should be committing.

**Reserved Instances (RIs):**
- 1-year or 3-year commitments on specific instance families
- Up to **72% discount** vs On-Demand
- Convertible RIs give flexibility to change instance type if needed

**Compute Savings Plans:**
- More flexible than RIs — apply to any EC2 instance, Lambda, and Fargate
- Up to **66% discount**
- Recommended for most teams as the starting point

**My rule of thumb:** Look at your lowest-watermark EC2 spend over the past 3 months. That baseline is safe to commit with 1-year Standard RIs or a Compute Savings Plan.

```
Baseline monthly EC2 spend:    $10,000
Committed at 40% discount:     $6,000/month
Annual saving:                 $48,000
```

---

## 3. Clean Up Idle and Orphaned Resources

Every AWS account accumulates zombie resources — things that were created, forgotten, and are now silently billing you every month.

**Common culprits to check:**

| Resource | What to look for |
|---|---|
| EBS Volumes | Volumes in `available` state (not attached) |
| Elastic IPs | Allocated but not associated with a running instance |
| Load Balancers | ALBs/NLBs with no registered targets |
| Snapshots | Old AMI snapshots older than 90 days |
| NAT Gateways | In VPCs with minimal traffic |

**Automation tip:** Use **AWS Trusted Advisor** (available on Business/Enterprise support) or the open-source tool **Cloud Custodian** to schedule automated detection and alerting of idle resources.

---

## 4. Implement a Tagging Strategy

You cannot optimize what you cannot measure. Without tags, AWS cost reports show you *what* you're spending — not *who* is spending it or *why*.

A solid tagging strategy should include at minimum:

```
Environment:   production | staging | dev
Team:          platform | data | frontend | backend
Project:       the product or initiative driving the spend
CostCenter:    maps to your finance team's chart of accounts
```

**Getting started:**
1. Define your tag schema in a company wiki page
2. Use **AWS Tag Editor** to find untagged resources
3. Enforce tagging at resource creation with **AWS Service Control Policies (SCPs)** or **AWS Config rules**
4. Build a Cost Allocation report in Cost Explorer using these tags

Once tagging is in place, you can produce team-level cost reports and create accountability for spend — which is the foundation of the FinOps framework.

---

## 5. Use S3 Intelligent-Tiering and Lifecycle Policies

S3 is deceptively easy to ignore — objects are cheap individually, but at scale the storage costs and data retrieval fees add up fast.

**S3 Intelligent-Tiering:**
- AWS automatically moves objects between frequent and infrequent access tiers
- No retrieval fees for Intelligent-Tiering
- Best for objects with unpredictable access patterns

**Lifecycle Policies (for predictable patterns):**
- Objects not accessed for 30 days → move to S3 Standard-IA (saves ~45%)
- Objects not accessed for 90 days → move to S3 Glacier Instant Retrieval
- Objects not accessed for 180 days → expire or move to Glacier Deep Archive

```json
{
  "Rules": [{
    "Status": "Enabled",
    "Transitions": [
      { "Days": 30,  "StorageClass": "STANDARD_IA" },
      { "Days": 90,  "StorageClass": "GLACIER_IR" },
      { "Days": 180, "StorageClass": "DEEP_ARCHIVE" }
    ]
  }]
}
```

One client I worked with reduced their S3 bill by **$4,200/month** simply by applying lifecycle policies to their log archive buckets.

---

## Putting It Together

None of these strategies requires a massive initiative. You can start small:

1. **Week 1:** Pull rightsizing recommendations from Cost Explorer and pick 5 instances to resize
2. **Week 2:** Identify and delete orphaned EBS volumes and Elastic IPs
3. **Month 1:** Define and enforce a tag schema for new resources
4. **Month 2:** Purchase a Compute Savings Plan for your baseline EC2 spend
5. **Ongoing:** Review Cost Explorer weekly; set budgets and alerts

Cloud cost optimization is a practice, not a project. The teams that treat it as ongoing discipline — not a one-time cleanup — are the ones who keep their AWS bills predictable and under control.

---

*Have questions about any of these strategies? [Get in touch](/contact) — I'm happy to discuss your specific AWS environment.*
