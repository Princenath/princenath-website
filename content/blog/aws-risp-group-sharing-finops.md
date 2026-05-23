---
title: "Your RI Discount Is Helping Someone Else. AWS Finally Fixed It."
date: "2026-05-24"
excerpt: "For years, Reserved Instances and Savings Plans in AWS applied across your entire organisation by default. The team that bought the commitment didn't always get the discount. Finance corrected it manually every month. AWS launched RISP Group Sharing in November 2025 and that problem now has a real fix. Here's what actually changed, how the two modes work in practice, and what to check before you enable it."
tags: ["AWS", "Reserved Instances", "Savings Plans", "FinOps", "Chargeback", "Cost Allocation", "RISP Group Sharing", "Multi-Account AWS", "Commitment Management"]
---

## The meeting nobody looked forward to

Every quarter, the same conversation.

The payments engineering team would sit across from finance and explain, again, that the $47,000 in RI savings showing on their monthly chargeback report was wrong. The savings weren't theirs. They had purchased a batch of m5.xlarge Reserved Instances for their production workload, but the discount had been consumed by the development platform team running the same instance type in a different account. The development team's workload happened to start earlier in the billing cycle. AWS applied the discount there first. Payments got on-demand rates on their own production instances and was expected to absorb the cost.

Finance would adjust it manually. Spreadsheet open, savings reallocated by hand to the account that had actually purchased the commitment. The process took most of a Friday afternoon and still felt like guesswork by the end of it.

Across all their commitment types — EC2, RDS, ElastiCache — the payments team was losing roughly $23,000 in annual savings to other accounts every year. Not because they had bought the wrong commitments. Because AWS had no mechanism to keep discounts where they were purchased.

This is not a niche problem. It is one of the most common operational headaches in enterprise AWS cost management, and it has existed since Reserved Instances were introduced in 2009. It has a name in the FinOps community: discount leakage. Some teams call it discount theft, which is more accurate.

AWS fixed it on November 19, 2025, with the general availability of RISP Group Sharing.

---

## Why this happens in the first place

When you purchase a Reserved Instance or a Savings Plan in AWS, the discount applies automatically to matching usage across your entire AWS Organisation. AWS optimises for utilisation, not for attribution. If your organisation has 50 accounts and any of them runs usage that matches the commitment you purchased, AWS applies the discount there, regardless of which account or team bought it.

The logic is sound from a pure utilisation standpoint. An unused RI earns you nothing. AWS wants to make sure your commitment gets applied somewhere. The problem is that "somewhere" is often not where the team that made the financial commitment intended.

Here is what that looks like in real numbers. An m5.xlarge 1-year No Upfront Reserved Instance in us-east-1 costs $0.0928 per hour versus the on-demand rate of $0.192. That's a 52% saving. At 720 hours a month, a single instance saves $720. Across a fleet of 100 m5.xlarge instances, that's $72,000 a month in savings from reserved pricing alone.

If those savings flow to the wrong team, finance has to track down where they went, calculate the correct reallocation, update the chargeback report, and get sign-off before the month closes. In large organisations managing hundreds of commitments across multiple instance families and regions, this is a substantial recurring effort every single month.

The State of FinOps 2026 report, based on 1,192 practitioners representing over $83 billion in annual cloud spend, lists accurate cost allocation as one of the top ongoing challenges. RISP leakage sits at the centre of that problem. You cannot build a trustworthy chargeback model when discounts are flowing to accounts in ways you cannot predict or control.

---

## What RISP Group Sharing does

Before November 2025, AWS gave you two options. Sharing on, the default, where discounts apply anywhere in the org and the first matching usage wins. Or sharing off, where discounts only apply to the purchasing account — which solved the leakage problem but created a new one. If your own account didn't have enough matching usage to absorb the commitment, the discount sat idle rather than flowing to someone who could use it.

RISP Group Sharing introduces a third option: define groups of accounts using Cost Categories and control exactly how discounts flow across those groups. Two modes. Different use cases.

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:28px;margin:28px 0;">
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 24px 0;">How Discount Flow Changes Across Each Mode</p>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;">
    <div style="background:#fff;border:1px solid #E8E8E5;border-radius:8px;padding:20px;">
      <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 12px 0;">Default (No Groups)</p>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
        <div style="background:#FAFAF9;border:1px solid #E8E8E5;border-radius:4px;padding:8px 12px;">
          <p style="font-size:11px;color:#0A0A0A;margin:0;">Payments buys 100 RIs</p>
        </div>
        <div style="text-align:center;color:#9B9B96;font-size:16px;">↓</div>
        <div style="background:#FAFAF9;border:1px solid #E8E8E5;border-radius:4px;padding:8px 12px;">
          <p style="font-size:11px;color:#C8873A;margin:0;font-weight:600;">Dev team matches first → gets 20 RIs</p>
        </div>
        <div style="text-align:center;color:#9B9B96;font-size:16px;">↓</div>
        <div style="background:#FAFAF9;border:1px solid #E8E8E5;border-radius:4px;padding:8px 12px;">
          <p style="font-size:11px;color:#0A0A0A;margin:0;">Payments gets remaining 80</p>
        </div>
      </div>
      <p style="font-size:11px;color:#C8873A;font-weight:600;margin:0;">$1,440/month lost to wrong team</p>
    </div>
    <div style="background:#fff;border:2px solid #C8873A;border-radius:8px;padding:20px;">
      <p style="font-size:11px;font-family:monospace;color:#C8873A;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 12px 0;">Prioritised Group ★</p>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
        <div style="background:#FAFAF9;border:1px solid #E8E8E5;border-radius:4px;padding:8px 12px;">
          <p style="font-size:11px;color:#0A0A0A;margin:0;">Payments buys 100 RIs</p>
        </div>
        <div style="text-align:center;color:#9B9B96;font-size:16px;">↓</div>
        <div style="background:#FAFAF9;border:1px solid #E8E8E5;border-radius:4px;padding:8px 12px;">
          <p style="font-size:11px;color:#0A0A0A;margin:0;font-weight:600;">Payments group gets all 100 first</p>
        </div>
        <div style="text-align:center;color:#9B9B96;font-size:16px;">↓</div>
        <div style="background:#FAFAF9;border:1px solid #E8E8E5;border-radius:4px;padding:8px 12px;">
          <p style="font-size:11px;color:#0A0A0A;margin:0;">Unused capacity flows to rest of org</p>
        </div>
      </div>
      <p style="font-size:11px;color:#0A0A0A;font-weight:600;margin:0;">Attribution accurate. No waste.</p>
    </div>
    <div style="background:#fff;border:1px solid #E8E8E5;border-radius:8px;padding:20px;">
      <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 12px 0;">Restricted Group</p>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
        <div style="background:#FAFAF9;border:1px solid #E8E8E5;border-radius:4px;padding:8px 12px;">
          <p style="font-size:11px;color:#0A0A0A;margin:0;">Payments buys 100 RIs</p>
        </div>
        <div style="text-align:center;color:#9B9B96;font-size:16px;">↓</div>
        <div style="background:#FAFAF9;border:1px solid #E8E8E5;border-radius:4px;padding:8px 12px;">
          <p style="font-size:11px;color:#0A0A0A;margin:0;font-weight:600;">Payments group only. No spillover.</p>
        </div>
        <div style="text-align:center;color:#9B9B96;font-size:16px;">↓</div>
        <div style="background:#FAFAF9;border:1px solid #E8E8E5;border-radius:4px;padding:8px 12px;">
          <p style="font-size:11px;color:#C8873A;margin:0;">Unused capacity is wasted if group underutilises</p>
        </div>
      </div>
      <p style="font-size:11px;color:#9B9B96;font-weight:600;margin:0;">Complete isolation. Use only for regulated BUs.</p>
    </div>
  </div>
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;margin:16px 0 0 0;">★ Prioritised is the right default for most enterprise teams. Restricted is for business units with strict financial or regulatory separation requirements.</p>
</div>

The practical difference between the two modes comes down to one question: what happens to the discount when your group's usage doesn't fill the commitment?

With Prioritised, unused capacity flows to the rest of the organisation. Your team's accounts get priority. Any remainder doesn't go to waste. If the payments team buys 100 RIs and only uses 80, the other 20 can still benefit someone else in the org — but payments gets their 80 attributed correctly, every time, without waiting to see which account happens to match first in the billing cycle.

With Restricted, unused capacity stays locked in the group whether it's used or not. A payments group running at 70% RI utilisation would waste 30% of their commitment rather than letting it flow elsewhere. This sounds inefficient, and usually is. The only time it makes sense is when a business unit has strict regulatory, contractual, or internal accounting requirements that prohibit any cross-unit cost allocation, even from unused capacity.

For most enterprise teams, Prioritised is the right answer.

---

## The numbers before and after

To make this concrete, here is the payments team scenario tracked across one year, before and after enabling Prioritised Group Sharing.

The team held three types of commitments: EC2 Reserved Instances for their main application fleet, RDS Reserved Instances for their database layer, and an EC2 Compute Savings Plan covering their more variable workloads.

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 16px 0;">Annual Leakage by Commitment Type — Payments Team (Illustrative)</p>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:0;border:1px solid #E8E8E5;border-radius:8px;overflow:hidden;">
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;">
      <p style="font-size:11px;color:#9B9B96;margin:0;font-family:monospace;">COMMITMENT TYPE</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;">
      <p style="font-size:11px;color:#9B9B96;margin:0;font-family:monospace;">ANNUAL SAVINGS PURCHASED</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;">
      <p style="font-size:11px;color:#9B9B96;margin:0;font-family:monospace;">LEAKED TO OTHER ACCOUNTS</p>
    </div>
    <div style="padding:12px 16px;background:#fff;">
      <p style="font-size:11px;color:#9B9B96;margin:0;font-family:monospace;">LEAK %</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">EC2 Reserved Instances</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">$86,400</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">$17,136</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">20%</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">RDS Reserved Instances</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">$31,200</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">$4,368</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">14%</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">Compute Savings Plan</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">$14,400</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">$1,584</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">11%</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:700;">Total</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;font-weight:700;margin:0;">$132,000</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:700;margin:0;">$23,088</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:700;margin:0;">17.5%</p>
    </div>
  </div>
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;margin:12px 0 0 0;">Illustrative figures. The total $23,088 in leaked savings was being manually reallocated every month, costing finance several hours of reconciliation work per billing cycle.</p>
</div>

After enabling Prioritised Group Sharing, every row above becomes zero. The payments team receives the full discount on every commitment they purchased. The development platform team that was previously receiving leaked discounts sees its effective EC2 rates increase — which is accurate — and the monthly reallocation spreadsheet disappears.

---

## Setting it up

The configuration lives in Billing Preferences in the AWS Billing and Cost Management console. Two things need to be in place first.

**Run the leakage analysis before touching any settings.** Map your current RI and Savings Plans portfolio to business units. The question to answer: which accounts are consuming discounts they didn't purchase, and by how much?

Pull this from Cost Explorer using the RI utilisation and coverage reports, filtered by account. Set the date range to the last three months and group by account. Accounts showing high RI coverage but few or no RI purchases are consuming leaked discounts. Accounts showing RI purchases but lower-than-expected coverage are the ones losing discounts to other accounts.

That analysis surfaces the $23,000 equivalent in your own environment. Do it regardless of whether you enable group sharing. It often reveals $10,000 to $100,000 in misallocated savings that finance has been manually correcting without knowing the root cause.

**Set up Cost Categories.** RISP Group Sharing uses Cost Categories as the grouping mechanism. If you haven't configured them, do this first. Cost Categories let you define rules that map accounts to named categories — Payments, Analytics, Infrastructure, and so on. If your organisation already has Cost Categories for reporting purposes, you can reuse them here directly.

**The setup itself:**

Go to Billing and Cost Management, open Billing Preferences, and find the "Reserved Instances and Savings Plans discount sharing" section. The guided setup walks you through creating your first group, selecting the relevant Cost Category, and choosing Prioritised or Restricted mode.

One timing detail that matters: changes take effect from the current billing period onward, not retroactively. If you enable group sharing on May 15, the May bill reflects the new rules from that date forward, not from May 1. Plan your chargeback reports accordingly for the first transition month.

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 20px 0;">Pre-Flight Checklist Before Enabling RISP Group Sharing</p>
  <div style="display:flex;flex-direction:column;gap:10px;">
    <div style="display:flex;align-items:flex-start;gap:12px;background:#fff;border:1px solid #E8E8E5;border-radius:6px;padding:14px 16px;">
      <div style="width:20px;height:20px;background:#0A0A0A;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
        <p style="font-size:10px;color:#fff;margin:0;font-weight:700;">1</p>
      </div>
      <div>
        <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:600;">Run leakage analysis in Cost Explorer</p>
        <p style="font-size:11px;color:#9B9B96;margin:4px 0 0 0;">RI utilisation and coverage reports filtered by account, last 3 months. Find accounts receiving discounts they didn't purchase.</p>
      </div>
    </div>
    <div style="display:flex;align-items:flex-start;gap:12px;background:#fff;border:1px solid #E8E8E5;border-radius:6px;padding:14px 16px;">
      <div style="width:20px;height:20px;background:#0A0A0A;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
        <p style="font-size:10px;color:#fff;margin:0;font-weight:700;">2</p>
      </div>
      <div>
        <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:600;">Configure Cost Categories by business unit</p>
        <p style="font-size:11px;color:#9B9B96;margin:4px 0 0 0;">Group accounts by team or BU. Reuse existing Cost Categories if available. These become your sharing group definitions.</p>
      </div>
    </div>
    <div style="display:flex;align-items:flex-start;gap:12px;background:#fff;border:1px solid #E8E8E5;border-radius:6px;padding:14px 16px;">
      <div style="width:20px;height:20px;background:#0A0A0A;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
        <p style="font-size:10px;color:#fff;margin:0;font-weight:700;">3</p>
      </div>
      <div>
        <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:600;">Check utilisation at group level, not org level</p>
        <p style="font-size:11px;color:#9B9B96;margin:4px 0 0 0;">A group with low matching usage will show lower utilisation after enabling sharing. Identify any groups that may need commitment adjustments before you switch.</p>
      </div>
    </div>
    <div style="display:flex;align-items:flex-start;gap:12px;background:#fff;border:1px solid #E8E8E5;border-radius:6px;padding:14px 16px;">
      <div style="width:20px;height:20px;background:#0A0A0A;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
        <p style="font-size:10px;color:#fff;margin:0;font-weight:700;">4</p>
      </div>
      <div>
        <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:600;">Brief the teams currently receiving leaked discounts</p>
        <p style="font-size:11px;color:#9B9B96;margin:4px 0 0 0;">Development and staging accounts that benefited from production RIs will see effective rates increase in month one. Get ahead of it before the billing report lands.</p>
      </div>
    </div>
    <div style="display:flex;align-items:flex-start;gap:12px;background:#fff;border:1px solid #E8E8E5;border-radius:6px;padding:14px 16px;">
      <div style="width:20px;height:20px;background:#0A0A0A;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
        <p style="font-size:10px;color:#fff;margin:0;font-weight:700;">5</p>
      </div>
      <div>
        <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:600;">Time the enablement to the start of a billing cycle</p>
        <p style="font-size:11px;color:#9B9B96;margin:4px 0 0 0;">Changes apply from enablement date forward, not from month start. Enable on the 1st to keep chargeback reports clean for the transition month.</p>
      </div>
    </div>
  </div>
</div>

---

## What to watch in the first billing cycle

Two things to monitor after enabling group sharing.

**Utilisation rates by group.** In the default sharing model, low utilisation in one group was partially masked because unused capacity flowed to other accounts and still registered as utilised at the org level. After enabling Prioritised sharing, a group with genuinely low matching usage will show a lower utilisation rate because the overspill is now controlled. Any group dropping below 85% utilisation after enabling sharing needs its commitment strategy reviewed.

**Cost increases in recipient accounts.** Accounts that were quietly benefiting from leaked discounts will see their effective rates go up in the first month. This is accurate billing. It will still generate questions. The development platform team that was receiving payments' leaked discounts will notice their EC2 costs look higher. Brief those team leads before the report lands, not after.

---

## One thing the feature doesn't solve

RISP Group Sharing controls where discounts go. It doesn't tell you whether you've bought the right commitments to begin with.

Organisations that have been purchasing RIs at org level — looking at blended utilisation numbers that average across many teams — often find that individual group utilisation looks very different once accounts are separated. Some groups turn out to have more commitments than their usage warrants. Others have gaps. The org-level view was hiding the imbalance by averaging across all of them.

The pre-flight leakage analysis will surface most of this before you enable anything. Some commitments will need to be exchanged — Convertible RIs and Compute Savings Plans both give you flexibility here — and some teams will need to rebuild their purchasing strategy from the group level up rather than from an org-level average.

That is additional work. But it's a more accurate picture of your actual commitment position than the blended view most teams have been working from. Fixing it properly takes about a quarter. The result is a commitment portfolio that is owned, utilised, and attributed correctly, which is what the discipline is supposed to produce.

---

## The chargeback model this unlocks

The longer-term benefit of RISP Group Sharing is not just the accuracy of one billing cycle. It's the accountability model it makes possible.

When discount attribution is predictable, you can build a genuine showback model where each business unit sees its full cloud economics: the cost of resources it runs, the discounts it purchased, the utilisation rate of those discounts, and the ROI on each commitment. Teams that previously had no incentive to invest in their own RIs because the discounts might end up elsewhere now have a clear reason to build commitment strategies. The accountability loop closes in a way it can't when discounts are leaking across account boundaries unpredictably.

The payments team from the opening eventually ran the pre-flight analysis, set up Cost Categories by business unit, and enabled Prioritised Group Sharing at the start of a billing cycle. The $23,088 in annual leaked savings came back to the accounts that had purchased the commitments. The quarterly chargeback meeting got shorter. Not gone entirely. But the Friday afternoon spreadsheet was gone, and that was enough.

---

*Managing RI or Savings Plans chargeback across multiple business units and wondering where to start? [Get in touch](/contact) — the leakage analysis in Cost Explorer is usually the fastest way to see exactly what's flowing where before making any configuration changes.*
