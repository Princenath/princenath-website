---
title: "Understanding the FinOps Framework: A Practical Guide for Cloud Teams"
date: "2024-02-28"
excerpt: "The FinOps Foundation's framework gives cloud teams a shared language and operating model for managing cloud spend. Here's how to apply it in practice."
tags: ["FinOps", "Cloud Governance", "AWS", "Cost Management"]
---

If you've ever sat in a meeting where engineering says "we need more compute" and finance says "the cloud bill is out of control," you've witnessed the core problem the FinOps framework is designed to solve.

FinOps — short for Cloud Financial Operations — is a cultural practice and operating model that brings together engineering, finance, and business teams to manage cloud spending collaboratively. This post is a practical overview of the framework and how I've seen it applied at real organizations.

---

## What FinOps Actually Is

The [FinOps Foundation](https://finops.org) defines FinOps as "an evolving cloud financial management discipline and cultural practice that enables organizations to get maximum business value by helping engineering, finance, technology and business teams to collaborate on data-driven spending decisions."

That's a mouthful. In plain terms: **FinOps is about making cloud spending a shared responsibility, not just a finance problem.**

The three key ideas:
1. **Everyone owns cloud costs** — not just the finance team
2. **Decisions are made with data** — not gut feel or fear
3. **Speed and cost are balanced** — not traded against each other

---

## The Three Phases of FinOps

The FinOps lifecycle has three phases that organizations cycle through continuously:

### Phase 1: Inform

Before you can optimize, you need to *see* what's happening.

- Set up **Cost Allocation Tags** so spend is attributed to teams and products
- Build dashboards in **AWS Cost Explorer** or a third-party tool (CloudHealth, Apptio)
- Establish a **unit economics** baseline: cost per customer, cost per transaction, cost per deployed environment
- Share cost reports with engineering teams — many engineers have never seen their AWS bill

> Most organizations I work with are shocked to discover they have no clear answer to "which team owns this cost?" Visibility alone drives behavior change.

### Phase 2: Optimize

With visibility established, you can start reducing waste and improving efficiency.

**Quick wins (low effort, high impact):**
- Delete unattached EBS volumes and orphaned snapshots
- Right-size over-provisioned EC2 instances
- Purchase Reserved Instances or Savings Plans for baseline workloads

**Medium-term optimization:**
- Implement S3 lifecycle policies
- Migrate to ARM-based Graviton instances (up to 40% cheaper, often faster)
- Use Spot Instances for fault-tolerant batch workloads

**Strategic (longer-term):**
- Architect for cost efficiency from the start (e.g., using serverless where appropriate)
- Build cost gates into CI/CD pipelines — catch expensive infrastructure changes before deployment

### Phase 3: Operate

This is where FinOps becomes a practice rather than a project.

- Run regular **FinOps reviews** (weekly or bi-weekly) with engineering leads
- Set **budgets and anomaly alerts** in AWS Budgets
- Create a **chargeback or showback model** so teams see the cost of what they build
- Track KPIs over time: cost per unit, savings realized, coverage of commitments

---

## The FinOps Team Model

One of the most important structural insights from the FinOps framework is the concept of a **centralized FinOps practitioner** working with **distributed engineering ownership**.

```
                    ┌─────────────────────┐
                    │   FinOps Practitioner│
                    │  (central function)  │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
     ┌────────▼──────┐ ┌───────▼──────┐ ┌──────▼──────┐
     │  Engineering  │ │   Finance    │ │  Product    │
     │   Team A      │ │   Team       │ │   Team      │
     └───────────────┘ └──────────────┘ └─────────────┘
```

The FinOps practitioner:
- Provides tooling, training, and analysis
- Surfaces anomalies and optimization opportunities
- Sets standards (tagging policy, budget thresholds)

Engineering teams:
- Own their own costs
- Make decisions about trade-offs (speed vs. cost)
- Are accountable for their cloud spend

---

## Measuring FinOps Maturity

The FinOps Foundation defines three maturity levels — **Crawl, Walk, Run** — for each capability:

| Capability | Crawl | Walk | Run |
|---|---|---|---|
| Cost Visibility | No tagging | Some tags, manual reports | Full allocation, automated dashboards |
| Commitment Coverage | 0% | 50–70% | 70–90%+ |
| Rightsizing | Ad hoc | Quarterly review | Continuous, automated |
| Anomaly Detection | None | Email alerts | ML-based, real-time |

Most organizations I engage with are in **Crawl to Walk** territory. That's fine — the goal is incremental improvement, not perfection.

---

## Getting Started: A 90-Day FinOps Roadmap

**Days 1–30: Visibility**
- [ ] Audit existing tagging; define a company-wide tag schema
- [ ] Enable AWS Cost Explorer and Cost Allocation reports
- [ ] Create a Slack channel or shared doc for cost reporting
- [ ] Share first cost report with engineering and finance

**Days 31–60: Quick Wins**
- [ ] Identify and clean up idle resources (EBS, Elastic IPs, old snapshots)
- [ ] Pull rightsizing recommendations; resize 5–10 instances
- [ ] Set AWS Budgets with email alerts at 80% and 100% of monthly budget

**Days 61–90: Commitment & Process**
- [ ] Analyze baseline EC2/Fargate spend; purchase a Compute Savings Plan
- [ ] Run first FinOps review meeting with engineering leads
- [ ] Document your FinOps process and assign ownership

---

## The Biggest Mistake Teams Make

The most common failure mode I see: treating FinOps as a **one-time cleanup project** rather than an ongoing practice.

A team runs a cost optimization sprint, saves 30% on their AWS bill, declares victory, and moves on. Six months later, costs are back up because the underlying culture and processes didn't change.

FinOps works when it's embedded into how your engineering organization operates — not bolted on as an annual initiative.

---

*Want to discuss how to implement FinOps at your organization? [Reach out](/contact) — I'd be glad to help.*
