---
title: "When a Marketplace Tool Nearly Doubled the AWS Bill: The Elastio Incident"
date: "2025-03-10"
excerpt: "A client's S3, GuardDuty, and CloudTrail charges started spiking without any apparent infrastructure change. The culprit turned out to be a backup tool purchased from the AWS Marketplace that nobody remembered was still running."
industry: "Financial Services"
outcome: "Billing relief secured from AWS + runaway charges fully stopped"
tags: ["AWS", "S3", "GuardDuty", "CloudTrail", "Marketplace", "Anomaly Detection"]
---

## Background

This one started with a confused email from a client's finance lead: their AWS bill had jumped by roughly 40% over two months, and nobody in engineering could explain it. No new services had been launched. No migrations were in flight. Headcount was flat. On paper, nothing had changed.

That kind of unexplained growth is actually one of the more interesting problems to work on — because it almost always has a single root cause, and finding it requires treating the billing data like an investigation, not a report.

**What we were seeing when we first looked at Cost Explorer:**

- S3 charges up significantly — but S3 storage metrics hadn't moved
- GuardDuty charges had roughly doubled from the prior month baseline
- CloudTrail charges were elevated and climbing week-over-week
- All three were moving together, which immediately suggested a common cause

The correlated spike across three services was the first useful signal. These aren't services that typically move in lockstep. S3 storage costs go up when you add data. GuardDuty costs scale with the volume of events it analyzes. CloudTrail costs scale with API call volume. For all three to spike simultaneously pointed toward something that was generating unusually high read/write activity and API call volume at the same time.

---

## The Problem

### Pulling the Thread

The first thing we did was separate the *storage* components of S3 from the *request* components. S3 billing has two distinct parts that people often conflate: what you pay to store data, and what you pay for the API requests (GET, PUT, LIST, etc.) made against that data.

Storage was flat. Requests were through the roof.

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;font-family:inherit;">
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 16px 0;">S3 Cost Breakdown — 3 Month Comparison</p>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0;border:1px solid #E8E8E5;border-radius:8px;overflow:hidden;">
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;">
      <p style="font-size:11px;color:#9B9B96;margin:0 0 4px 0;font-family:monospace;">MONTH</p>
      <p style="font-size:13px;font-weight:600;color:#0A0A0A;margin:0;">Category</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;">
      <p style="font-size:11px;color:#9B9B96;margin:0 0 4px 0;font-family:monospace;">BASELINE (avg)</p>
      <p style="font-size:13px;font-weight:600;color:#0A0A0A;margin:0;">Normal Month</p>
    </div>
    <div style="padding:12px 16px;background:#fff;">
      <p style="font-size:11px;color:#9B9B96;margin:0 0 4px 0;font-family:monospace;">SPIKE MONTH</p>
      <p style="font-size:13px;font-weight:600;color:#C8873A;margin:0;">During Incident</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:13px;color:#0A0A0A;margin:0;">Storage (GB-month)</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:13px;color:#0A0A0A;margin:0;">~$1,200</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-top:1px solid #E8E8E5;">
      <p style="font-size:13px;color:#0A0A0A;margin:0;">~$1,230 <span style="color:#9B9B96;font-size:11px;">(flat)</span></p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:13px;color:#0A0A0A;margin:0;">API Requests (GET/LIST/PUT)</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:13px;color:#0A0A0A;margin:0;">~$340</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-top:1px solid #E8E8E5;">
      <p style="font-size:13px;color:#C8873A;font-weight:600;margin:0;">~$4,100 <span style="font-size:11px;font-weight:400;">(+1,106%)</span></p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:13px;color:#0A0A0A;margin:0;">Data Retrieval / Scans</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:13px;color:#0A0A0A;margin:0;">~$90</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-top:1px solid #E8E8E5;">
      <p style="font-size:13px;color:#C8873A;font-weight:600;margin:0;">~$2,800 <span style="font-size:11px;font-weight:400;">(+3,011%)</span></p>
    </div>
  </div>
  <p style="font-size:11px;color:#9B9B96;margin:12px 0 0 0;font-family:monospace;">* Figures anonymized. Proportions reflect actual incident.</p>
</div>

The request volume told us something was aggressively scanning S3 — not reading specific objects, but iterating across buckets repeatedly. The LIST request count alone was several orders of magnitude higher than baseline.

### Why GuardDuty and CloudTrail Were Also Affected

This is the part that makes the Elastio situation particularly expensive and easy to misdiagnose.

**GuardDuty** pricing is based on the volume of data sources it analyzes. One of those sources is S3 data event logs. When something starts repeatedly scanning S3, GuardDuty is analyzing every one of those events. More S3 API activity = more GuardDuty analysis volume = higher GuardDuty bill. The two are directly coupled in a way that isn't obvious until you've seen it happen.

**CloudTrail** similarly bills on the volume of API events recorded (beyond the free tier of management events). S3 data events — if enabled — are recorded by CloudTrail for every GET, PUT, and LIST operation. A scanning tool hitting S3 thousands of times per hour generates an equivalent flood of CloudTrail records.

The three services were amplifying each other's costs because they were all downstream of the same event source: relentless, repeated S3 API calls.

<div style="margin:28px 0;padding:20px 24px;border-left:3px solid #C8873A;background:#FAFAF9;border-radius:0 8px 8px 0;">
  <p style="font-size:11px;font-family:monospace;color:#C8873A;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px 0;">Key Insight</p>
  <p style="font-size:14px;color:#0A0A0A;line-height:1.6;margin:0;">S3 data event logging creates a cost multiplier effect. One tool scanning S3 aggressively doesn't just spike S3 costs — it proportionally inflates every AWS service that has S3 data events as an input. GuardDuty and CloudTrail are the most common amplifiers.</p>
</div>

### Identifying the Source

Once we knew it was S3 API activity, the next step was finding what was generating it. We pulled CloudTrail logs filtered to S3 data events and looked at the `userIdentity` field — specifically the `arn` of the principal making the calls.

The ARN pattern pointed to an IAM role with a name that included `elastio`. A quick search confirmed it: Elastio is a cloud-native backup and ransomware recovery tool available on the AWS Marketplace. The client had purchased it several months earlier to evaluate as a backup solution for their EC2 instances and S3 data.

The evaluation had apparently been concluded — or at least, nobody was actively using it — but the Elastio deployment was still running. And it had been configured to run continuous scanning across all S3 buckets.

Here's what Elastio was doing on a loop:

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 20px 0;">Elastio Scan Loop — What Was Running</p>
  <div style="display:flex;flex-direction:column;gap:0;">
    <div style="display:flex;align-items:flex-start;gap:16px;padding:14px 0;border-bottom:1px solid #E8E8E5;">
      <div style="width:28px;height:28px;border-radius:50%;background:#C8873A;color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;shrink:0;flex-shrink:0;">1</div>
      <div>
        <p style="font-size:13px;font-weight:600;color:#0A0A0A;margin:0 0 2px 0;">Enumerate all S3 buckets</p>
        <p style="font-size:12px;color:#9B9B96;margin:0;font-family:monospace;">LIST operations across every bucket in the account</p>
      </div>
    </div>
    <div style="display:flex;align-items:flex-start;gap:16px;padding:14px 0;border-bottom:1px solid #E8E8E5;">
      <div style="width:28px;height:28px;border-radius:50%;background:#C8873A;color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">2</div>
      <div>
        <p style="font-size:13px;font-weight:600;color:#0A0A0A;margin:0 0 2px 0;">Scan object metadata for change detection</p>
        <p style="font-size:12px;color:#9B9B96;margin:0;font-family:monospace;">HEAD and GET requests on individual objects to check for ransomware indicators</p>
      </div>
    </div>
    <div style="display:flex;align-items:flex-start;gap:16px;padding:14px 0;border-bottom:1px solid #E8E8E5;">
      <div style="width:28px;height:28px;border-radius:50%;background:#C8873A;color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">3</div>
      <div>
        <p style="font-size:13px;font-weight:600;color:#0A0A0A;margin:0 0 2px 0;">Write scan metadata back to S3</p>
        <p style="font-size:12px;color:#9B9B96;margin:0;font-family:monospace;">PUT operations storing scan results — generating more objects, more future scan targets</p>
      </div>
    </div>
    <div style="display:flex;align-items:flex-start;gap:16px;padding:14px 0;">
      <div style="width:28px;height:28px;border-radius:50%;background:#C8873A;color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">4</div>
      <div>
        <p style="font-size:13px;font-weight:600;color:#0A0A0A;margin:0 0 2px 0;">Repeat on a short interval</p>
        <p style="font-size:12px;color:#9B9B96;margin:0;font-family:monospace;">Continuous scanning schedule — not a one-time backup job</p>
      </div>
    </div>
  </div>
</div>

Step 3 is where it compounds on itself: Elastio was writing scan result objects back into the same S3 buckets it was scanning. On the next scan cycle, those new objects were also scanned. The blast radius was growing with each iteration.

---

## Analysis

With the root cause confirmed, we needed to understand the full financial impact before going to AWS. This required pulling the Cost and Usage Report (CUR) for the previous 90 days and isolating all charges attributable to the Elastio IAM role and the scan activity it triggered.

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 20px 0;">Attributable Charges — 90-Day Period</p>
  <div style="display:flex;flex-direction:column;gap:10px;">
    <div>
      <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
        <span style="font-size:13px;color:#0A0A0A;">S3 API Requests &amp; Retrieval</span>
        <span style="font-size:13px;font-weight:600;color:#C8873A;">~$20,700</span>
      </div>
      <div style="background:#E8E8E5;border-radius:4px;height:8px;overflow:hidden;">
        <div style="background:#C8873A;height:100%;width:62%;border-radius:4px;"></div>
      </div>
    </div>
    <div>
      <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
        <span style="font-size:13px;color:#0A0A0A;">GuardDuty (S3 event volume)</span>
        <span style="font-size:13px;font-weight:600;color:#C8873A;">~$7,400</span>
      </div>
      <div style="background:#E8E8E5;border-radius:4px;height:8px;overflow:hidden;">
        <div style="background:#C8873A;height:100%;width:22%;border-radius:4px;"></div>
      </div>
    </div>
    <div>
      <div style="display:flex;justify-content:space-between;margin-bottom:5px;">
        <span style="font-size:13px;color:#0A0A0A;">CloudTrail Data Events</span>
        <span style="font-size:13px;font-weight:600;color:#C8873A;">~$5,300</span>
      </div>
      <div style="background:#E8E8E5;border-radius:4px;height:8px;overflow:hidden;">
        <div style="background:#C8873A;height:100%;width:16%;border-radius:4px;"></div>
      </div>
    </div>
    <div style="border-top:1px solid #E8E8E5;padding-top:12px;margin-top:4px;display:flex;justify-content:space-between;">
      <span style="font-size:13px;font-weight:600;color:#0A0A0A;">Total attributable to Elastio scanning</span>
      <span style="font-size:15px;font-weight:700;color:#C8873A;">~$33,400</span>
    </div>
  </div>
</div>

Two things were important to document clearly before contacting AWS:

**1. Timeline of charges vs. Elastio activation date.** We pulled the Elastio subscription start date from the AWS Marketplace console and overlaid it against the cost trend. The charges tracked almost exactly to when continuous scanning was enabled — there was a visible inflection point in the Cost Explorer graph that matched the date.

**2. Confirmation that Elastio had been stopped.** AWS Support will not entertain a billing relief request if the underlying cause is still running. We deprovisioned the Elastio stack entirely before opening the case — terminated the EC2 instances it was running on, deleted its IAM roles, and confirmed via CloudTrail that the S3 scan activity had stopped.

---

## Solution

### Immediate Remediation

Stopping Elastio required more than just cancelling the Marketplace subscription. The tool had deployed infrastructure into the client's account that persisted independently:

```bash
# Identify Elastio-related resources
aws ec2 describe-instances \
  --filters "Name=tag:elastio*,Values=*" \
  --query "Reservations[*].Instances[*].{ID:InstanceId,State:State.Name}" \
  --output table

# Check for Elastio IAM roles
aws iam list-roles \
  --query "Roles[?contains(RoleName, 'elastio')].{Name:RoleName,Created:CreateDate}" \
  --output table

# List S3 objects written by Elastio (scan metadata)
aws s3 ls s3://YOUR-BUCKET/ --recursive | grep elastio
```

The cleanup involved:
- Terminating 3 EC2 instances (Elastio's scanning workers)
- Deleting 4 IAM roles and associated policies
- Removing the Elastio-specific S3 bucket it had created for its own metadata
- Cleaning up scan result objects Elastio had written into the client's existing buckets

Once everything was removed, we monitored CloudTrail for 24 hours to confirm zero residual activity from Elastio principals. S3 request volume returned to baseline within the same day.

### The AWS Support Case

With the account clean and the evidence documented, we opened a support case under **Account and Billing Support**. The framing matters here — this is a billing exception request, not a technical support issue, and it should be treated as such from the first message.

Our case documentation included:

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 16px 0;">AWS Support Case — What We Included</p>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <div style="display:flex;gap:12px;align-items:flex-start;">
      <div style="width:20px;height:20px;border-radius:4px;background:#0A0A0A;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div>
        <p style="font-size:13px;font-weight:600;color:#0A0A0A;margin:0 0 2px 0;">Root cause with evidence</p>
        <p style="font-size:12px;color:#9B9B96;margin:0;line-height:1.5;">CloudTrail log excerpts showing the Elastio IAM principal, timestamps of scan activity, and the Marketplace subscription activation date correlated to the cost inflection point.</p>
      </div>
    </div>
    <div style="display:flex;gap:12px;align-items:flex-start;">
      <div style="width:20px;height:20px;border-radius:4px;background:#0A0A0A;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div>
        <p style="font-size:13px;font-weight:600;color:#0A0A0A;margin:0 0 2px 0;">Confirmation of remediation</p>
        <p style="font-size:12px;color:#9B9B96;margin:0;line-height:1.5;">Screenshots of the Marketplace subscription cancellation, IAM role deletion, and 24-hour CloudTrail monitoring showing zero residual activity.</p>
      </div>
    </div>
    <div style="display:flex;gap:12px;align-items:flex-start;">
      <div style="width:20px;height:20px;border-radius:4px;background:#0A0A0A;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div>
        <p style="font-size:13px;font-weight:600;color:#0A0A0A;margin:0 0 2px 0;">Quantified impact breakdown</p>
        <p style="font-size:12px;color:#9B9B96;margin:0;line-height:1.5;">Service-by-service breakdown of charges attributable to Elastio vs. baseline, with the delta clearly calculated per month.</p>
      </div>
    </div>
    <div style="display:flex;gap:12px;align-items:flex-start;">
      <div style="width:20px;height:20px;border-radius:4px;background:#0A0A0A;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div>
        <p style="font-size:13px;font-weight:600;color:#0A0A0A;margin:0 0 2px 0;">Forward-looking controls</p>
        <p style="font-size:12px;color:#9B9B96;margin:0;line-height:1.5;">A written summary of the guardrails we were implementing to prevent recurrence — AWS Budgets anomaly detection, S3 request monitoring, and a Marketplace procurement process.</p>
      </div>
    </div>
  </div>
</div>

AWS granted a one-time billing credit covering approximately 60% of the attributable charges. They were explicit that the credit was contingent on us confirming the preventive controls were in place — which we had to document in writing as a follow-up to the case.

This is worth understanding: AWS doesn't issue billing relief because something was unfair. They issue it as a goodwill exception when they have confidence the same mistake won't happen again and when the case is clearly presented. The quality of documentation in the support case directly affected the outcome.

### Preventive Controls Put in Place

AWS required confirmation of best practices before closing the case. Here's what we implemented:

**1. AWS Budgets — Anomaly Detection**

Set up anomaly detection budgets (not just fixed-threshold budgets) on the three services involved. Anomaly detection uses ML to identify unusual spend patterns relative to historical behavior, rather than requiring you to predict a specific dollar threshold.

```
Services covered: S3, GuardDuty, CloudTrail
Alert threshold: Any spend anomaly exceeding $500 above expected
Notification: SNS → email to finance lead and FinOps team
```

**2. S3 Request Monitoring via CloudWatch**

Created a CloudWatch metric filter on CloudTrail logs to count S3 LIST and GET operations per hour, with an alarm at 5x the 30-day average baseline. This would have caught the Elastio scanning within hours of it starting rather than weeks.

**3. Marketplace Procurement Policy**

This was arguably the most important control, and the hardest to implement because it required a process change rather than a technical one. We worked with the client's IT leadership to establish:

- All AWS Marketplace purchases require sign-off from the FinOps team before activation
- Any Marketplace tool deployed for evaluation must have a defined end date in a tracking doc
- Marketplace subscriptions are reviewed quarterly against active usage

The Elastio tool had been purchased by a security engineer who was evaluating backup solutions. Nobody in finance or FinOps was in the loop. By the time the evaluation concluded, the tool was simply forgotten — still running, still scanning, still billing.

**4. IAM Least-Privilege Review for Third-Party Tools**

Elastio had been granted broad S3 read access across all buckets in the account. We implemented a policy requiring third-party tools to be granted access only to specific, named buckets — not `*`. Had this been in place initially, Elastio's scan scope would have been limited and the cost impact significantly smaller.

---

## Outcome

The immediate financial outcome:

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px;background:#E8E8E5;border-radius:8px;overflow:hidden;">
    <div style="background:#fff;padding:20px;text-align:center;">
      <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px 0;">Charges Attributed</p>
      <p style="font-size:26px;font-weight:700;color:#0A0A0A;margin:0;font-family:'Playfair Display',Georgia,serif;">~$33,400</p>
      <p style="font-size:11px;color:#9B9B96;margin:4px 0 0 0;">90-day period</p>
    </div>
    <div style="background:#fff;padding:20px;text-align:center;">
      <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px 0;">AWS Credit Issued</p>
      <p style="font-size:26px;font-weight:700;color:#C8873A;margin:0;font-family:'Playfair Display',Georgia,serif;">~$20,000</p>
      <p style="font-size:11px;color:#9B9B96;margin:4px 0 0 0;">one-time goodwill</p>
    </div>
    <div style="background:#fff;padding:20px;text-align:center;">
      <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px 0;">Monthly Run Rate</p>
      <p style="font-size:26px;font-weight:700;color:#0A0A0A;margin:0;font-family:'Playfair Display',Georgia,serif;">Normalized</p>
      <p style="font-size:11px;color:#9B9B96;margin:4px 0 0 0;">back to baseline</p>
    </div>
  </div>
</div>

Beyond the numbers, the client came out of this with something they didn't have before: actual visibility into what Marketplace tools were running in their account and a process for keeping that list accurate going forward.

---

## Lessons Learned

**1. Correlated spikes across unrelated services almost always share a single root cause.** S3, GuardDuty, and CloudTrail don't naturally move together. When three services spike in the same direction at the same time, start looking for the common upstream event — not three separate problems.

**2. Marketplace tools are a blind spot for most FinOps teams.** Software subscriptions on the Marketplace are easy to purchase and easy to forget. The cost of the subscription itself is usually small; the cost of what the tool does to your underlying AWS services is often much larger and completely invisible until you look for it specifically.

**3. S3 data event logging creates a cost multiplier effect.** If you have CloudTrail S3 data event logging enabled (which many security-conscious organizations do), any tool that hammers S3 with API calls will proportionally inflate your CloudTrail and GuardDuty bills. The relationship is direct and roughly linear.

**4. AWS billing relief is possible but requires preparation.** A vague "this seems like it shouldn't have happened" support request gets you nowhere. A well-documented case with root cause evidence, confirmed remediation, and forward-looking controls gets results. The work we put into the case documentation directly contributed to a favorable outcome.

**5. IAM scope for third-party tools should always be bucket-specific, never `*`.** Granting a backup or security tool access to all S3 buckets in an account is convenient for the vendor and expensive for you if anything goes wrong. Scope it down at the time of deployment, not after an incident.

---

*Running Marketplace tools in your AWS environment without clear visibility into their costs? [Get in touch](/contact) — it's worth taking a look before it becomes an incident.*
