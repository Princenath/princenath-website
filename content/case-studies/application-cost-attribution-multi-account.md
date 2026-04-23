---
title: "Five Applications, One Bill, No Answers: Untangling Application Cost Attribution Across a Multi-Account AWS Environment"
date: "2026-01-20"
excerpt: "The client's ask sounded simple: tell us what each of our five applications costs to run on AWS. Three months later, after tag naming chaos, department pushback, a call to AWS about recovering historical data, and a Marketplace spend discovery that changed the numbers entirely, we had an answer. This is what the process actually looked like."
industry: "Enterprise SaaS / Multi-Account AWS"
outcome: "Attributed $2.1M in previously unallocated or misattributed AWS spend across 5 applications. Recovered 6 months of historical tag data via AWS backfill. Identified $217,000 in Marketplace and license costs that had been excluded from application cost totals. Delivered per-application cost baseline used by leadership for roadmap prioritisation."
tags: ["AWS", "Cost Attribution", "Tagging", "Multi-Account", "Cost Allocation", "FinOps", "AWS Marketplace", "Tag Backfill"]
---

## The ask

The head of engineering sent a single-line brief before our first call: "We need to know what each application costs us to run."

Five applications. Multiple AWS accounts. A shared services layer that nobody had fully mapped. And a finance team that had been asking the same question for eight months without getting an answer.

On paper it was a tag allocation exercise. Pull the cost data, group by application tag, present the breakdown. Two weeks, maybe three.

It took twelve weeks. And the number we delivered at the end was 34% higher than anyone in the room had expected, because the initial question had a hidden assumption buried inside it: that the bill they were looking at was the whole bill.

It wasn't.

---

## What we found in week one

The first thing we did was run a tag discovery query against the organisation's Cost and Usage Report data. Before you can measure tag coverage, you need to know what tags actually exist in the environment — not what the policy says should exist.

The policy said one tag: `Application`, with five permitted values matching each application name.

What we found was twenty-three distinct tag keys related to application attribution, accumulated across four years of engineers tagging things their own way. A sample of what `Application` values looked like across accounts:

- `payment-service`
- `PaymentService`
- `payment_service`
- `Payments`
- `payments-prod`
- `payments-v2`
- `pmt-svc`

Those are seven variations of the same application name. To AWS Cost Explorer, they are seven different things. A filter on `Application = payment-service` misses every resource tagged with any of the other six. Every team had been tagging resources. Nobody had been tagging them the same way.

This is the part that surprises people who haven't done this work before. The assumption is that a tagging problem means resources aren't tagged. Often the real problem is that resources are tagged — extensively, by diligent engineers who genuinely tried — but with no coordination. The data exists. It just doesn't add up.

Before we could measure anything, we needed a normalisation map. Every variant of every application name, mapped to a canonical value. That map took the better part of a week to build, and it required going back to account owners to confirm which tags referred to which application. Which brings us to the part nobody puts in the case study.

---

## The pushback

We sent a structured questionnaire to eight account owners across the organisation. We needed confirmation on tag variants, resource ownership, and which shared infrastructure should be attributed to which application. Simple questions with clear options.

Three people replied within 48 hours. One sent a reply saying the tagging was correct and we should use the data as-is. Four didn't respond at all.

After a follow-up, we got two more replies. The remaining two required escalation to the engineering leads, who had to ask their teams directly. Total time to collect the questionnaire responses: three weeks.

This is not unusual. Account owners are engineers with sprint commitments, not FinOps analysts. From their perspective, an email asking them to confirm tagging decisions for cost attribution purposes is low-priority work with no visible output. They are not obstructing deliberately. They just have other things to do.

The more difficult pushback came from two teams who disagreed with how shared infrastructure was being attributed. The organisation ran a shared data platform used by three of the five applications. Whoever got attributed the shared platform cost was going to show a higher number. Both teams argued the cost should be spread differently. Neither had a written policy to point to.

We resolved it with a split attribution model — shared costs divided by consumption percentage based on actual usage data from CloudWatch metrics, not split equally. That required another round of data collection and another round of review. Two additional weeks.

---

## The management problem

While the data collection was ongoing, we had a check-in with the CTO and VP of Engineering. They had been expecting a preliminary number by week four. We were in week six with no final number yet.

The conversation was direct. They understood there were complications. What they didn't understand was why tagging — something they had specifically mandated eighteen months earlier — hadn't already solved the problem. In their mental model, tags existed, the data should be in Cost Explorer, we should be able to filter by application and read the number off the chart.

That mental model is right about how tagging is supposed to work. It doesn't account for the gap between a tagging policy existing on paper and tagging working correctly in practice. Those are two different states, and the distance between them is months of accumulated decisions made by engineers who were focused on shipping, not on cost attribution.

We scheduled a separate working session with both of them to walk through the tag discovery output — specifically to show the twenty-three tag variants and explain concretely why Cost Explorer couldn't reconcile them automatically. Once they saw the actual data rather than a description of the problem, the conversation changed. The question stopped being "why isn't this done" and became "what do you need to finish it."

That session was not in the original project plan. It took half a day. It was the most important thing we did in the first six weeks.

---

## The backfill question

Once the normalisation map was built and tag variants were cleaned up, we had a working picture of current spend. But the client wanted historical data — specifically the past twelve months — to understand cost trends per application, not just a snapshot.

The problem: most of the correct tags had only been in place for the past two to three months, applied during a remediation effort that happened before we arrived. Historical data showed the old tag variants, or no tags at all on some resources.

We contacted AWS to understand the options. This is the point where most teams assume the historical data is simply lost. It isn't — but recovering it requires meeting a specific condition.

AWS allows cost allocation tags to be backfilled for up to twelve months of historical data. The condition is that the tag must have already been applied to the resource during the period you're trying to backfill. You're not adding new tags to old data. You're asking AWS to retroactively activate a tag that already existed on a resource so it appears in your cost reports for the months it was present.

In practice, this meant resources that had been tagged — even with the wrong variant — could potentially have corrected historical data recovered, if the original tag was still on the resource. Resources that had never been tagged at all were not recoverable.

We ran the backfill request through the Billing console under Cost Allocation Tags. For roughly 60% of the resource base, we recovered between four and eight months of historical tag data. For the remaining 40%, mostly newer resources created during a platform migration that had followed the correct policy from the start, we had complete twelve-month history.

The 40% of resources with no recoverable history required a different approach: we used account-level attribution for those months, assigning costs based on which accounts the resources lived in, cross-referenced with the account-to-application mapping the organisation already maintained for other purposes.

It wasn't perfect. We were transparent about that. Some of the historical numbers were estimates rather than exact tag-based allocations, and we documented which months used which methodology in the final report.

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 16px 0;">Historical Data Recovery — By Method</p>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px;background:#E8E8E5;border-radius:8px;overflow:hidden;">
    <div style="background:#fff;padding:18px;text-align:center;">
      <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px 0;">Tag Backfill (Exact)</p>
      <p style="font-size:28px;font-weight:700;color:#0A0A0A;margin:0;font-family:'Playfair Display',Georgia,serif;">60%</p>
      <p style="font-size:11px;color:#9B9B96;margin:6px 0 0 0;font-family:monospace;">4–8 months recovered per resource</p>
    </div>
    <div style="background:#fff;padding:18px;text-align:center;">
      <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px 0;">Account Attribution (Est.)</p>
      <p style="font-size:28px;font-weight:700;color:#C8873A;margin:0;font-family:'Playfair Display',Georgia,serif;">32%</p>
      <p style="font-size:11px;color:#9B9B96;margin:6px 0 0 0;font-family:monospace;">Estimated from account-to-app mapping</p>
    </div>
    <div style="background:#fff;padding:18px;text-align:center;">
      <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px 0;">Not Recoverable</p>
      <p style="font-size:28px;font-weight:700;color:#C8873A;margin:0;font-family:'Playfair Display',Georgia,serif;">8%</p>
      <p style="font-size:11px;color:#9B9B96;margin:6px 0 0 0;font-family:monospace;">No tag history, no account mapping available</p>
    </div>
  </div>
</div>

---

## The discovery that changed the numbers

At week eight, with the tag normalisation done and historical data largely recovered, we ran a full cost summary across all five applications. Total attributed spend for the trailing twelve months: $1.58 million.

Then we ran a separate query against the Cost and Usage Report, filtering by Billing Entity for AWS Marketplace charges. We cross-referenced those charges with the application attribution map.

$217,000 in Marketplace and license spend had not been included in anyone's cost calculations. Not excluded deliberately — simply not thought of. When engineers discussed "application cost," they meant AWS service charges: EC2, RDS, S3, data transfer. Marketplace software fees ran as separate line items on the same bill, under a different billing entity, and had never been pulled into the application view.

The Marketplace costs were trackable because AWS Marketplace AMI software charges inherit the tags of the underlying EC2 instances. If the EC2 instance running Application A was tagged correctly, the software license fee for the AMI running on that instance carried the same tag. The data was there. Nobody had looked for it.

Of the $217,000 in Marketplace spend:

- $94,000 was a commercial database software license running on the infrastructure of one specific application — an application that had been consistently identified as the lowest-cost application in the portfolio. It wasn't. It just hadn't been counted correctly.
- $71,000 was a security scanning tool deployed across shared infrastructure, which we split across three applications using the same consumption-based methodology as the shared data platform.
- $52,000 was miscellaneous ISV tooling spread across the remaining applications in smaller amounts.

Adding the Marketplace spend to the service charges brought total attributed spend to $1.8 million. Then we added the shared services allocation, which had also been excluded from initial estimates. Final number: $2.1 million against a figure the client had been working with of approximately $1.56 million.

The gap between what they thought they spent and what they actually spent was $540,000 per year. Not because costs had been hidden. Because the question "what does this application cost" had never been defined to include everything that costs money.

---

## Building the per-application picture

With the full cost scope defined, we built the breakdown across all five applications. These figures cover a full trailing twelve months including Marketplace spend and shared service allocation.

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 16px 0;">Per-Application Annual Cost — Full Attribution (Illustrative)</p>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:0;border:1px solid #E8E8E5;border-radius:8px;overflow:hidden;">
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;">
      <p style="font-size:11px;color:#9B9B96;margin:0;font-family:monospace;">APPLICATION</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;">
      <p style="font-size:11px;color:#9B9B96;margin:0;font-family:monospace;">AWS SERVICES</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;">
      <p style="font-size:11px;color:#9B9B96;margin:0;font-family:monospace;">MARKETPLACE + SHARED</p>
    </div>
    <div style="padding:12px 16px;background:#fff;">
      <p style="font-size:11px;color:#9B9B96;margin:0;font-family:monospace;">TOTAL</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">Payment Service</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">$580,000</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">$128,000</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;font-weight:700;color:#0A0A0A;margin:0;">$708,000</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">Analytics Platform</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">$390,000</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">$87,000</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;font-weight:700;color:#0A0A0A;margin:0;">$477,000</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">Customer Portal</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">$310,000</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">$63,000</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;font-weight:700;color:#0A0A0A;margin:0;">$373,000</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">Internal Tools</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">$190,000</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">$42,000</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;font-weight:700;color:#0A0A0A;margin:0;">$232,000</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">Data Pipeline</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">$108,000</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">$202,000</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;font-weight:700;color:#C8873A;margin:0;">$310,000</p>
    </div>
  </div>
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;margin:12px 0 0 0;">Illustrative figures representing a full-attribution model including Marketplace, license, and shared service costs.</p>
</div>

The Data Pipeline row was the one that generated the most discussion. Its AWS service cost of $108,000 had made it look like the cheapest application in the portfolio. With shared infrastructure and Marketplace license costs properly attributed, it came in at $310,000 — third highest, not lowest. The $94,000 database license that had been sitting unattributed for twelve months belonged to this application.

The engineering team responsible for Data Pipeline had been arguing for expanded infrastructure investment based partly on their low apparent cost footprint. That conversation changed.

---

## Presenting the value

The final presentation to the CTO, VP of Engineering, and VP of Finance covered three things.

First, the methodology: how costs were attributed, which numbers were exact versus estimated, and why the historical methodology varied by time period. This was not the interesting part of the presentation, but it was the necessary part. If you present a number without explaining how it was derived, every follow-up question becomes a methodology question and you spend the whole meeting defending the number rather than discussing what to do with it.

Second, the findings: the per-application breakdown, the Marketplace discovery, and the historical trend showing each application's cost trajectory over twelve months. The trend was as important as the snapshot. Two applications had been growing at over 20% per quarter. One had been declining steadily, likely reflecting reduced usage of an internal tool that engineering had partially deprecated without fully shutting down.

Third, and the part leadership actually wanted: what they could do with this information. Three specific uses came out of the data that would not have been possible without it.

**Roadmap prioritisation by cost-per-feature.** The organisation was planning to invest heavily in expanding the Analytics Platform. The cost data showed that Analytics was already the second most expensive application in the portfolio and growing fast. That doesn't mean the investment was wrong, but it changed the conversation from "let's expand Analytics" to "let's expand Analytics and simultaneously look at whether the current architecture is as efficient as it should be before we scale it further."

**Budget accountability by application team.** Finance had been allocating cloud budget at the business unit level because application-level data didn't exist. With per-application baselines established, the next budget cycle could set application-level targets and hold engineering teams accountable for their own numbers. That accountability shift was something the VP of Finance had been trying to create for two years.

**The deprecation case.** The Internal Tools application had been running at $232,000 per year. Leadership believed it was largely unused — a legacy platform that three teams had nominally replaced with SaaS tools but never fully migrated off. The cost data gave them a concrete number to put against the migration effort. A full migration would cost roughly $60,000 in engineering time. Running the platform for another year cost $232,000. The decision made itself.

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px;background:#E8E8E5;border-radius:8px;overflow:hidden;">
    <div style="background:#fff;padding:20px;text-align:center;">
      <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px 0;">Spend Previously Unattributed</p>
      <p style="font-size:28px;font-weight:700;color:#C8873A;margin:0;font-family:'Playfair Display',Georgia,serif;">$540K</p>
      <p style="font-size:11px;color:#9B9B96;margin:6px 0 0 0;font-family:monospace;">34% above initial estimates</p>
    </div>
    <div style="background:#fff;padding:20px;text-align:center;">
      <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px 0;">Marketplace Costs Recovered</p>
      <p style="font-size:28px;font-weight:700;color:#C8873A;margin:0;font-family:'Playfair Display',Georgia,serif;">$217K</p>
      <p style="font-size:11px;color:#9B9B96;margin:6px 0 0 0;font-family:monospace;">Previously excluded from all application views</p>
    </div>
    <div style="background:#fff;padding:20px;text-align:center;">
      <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px 0;">Projected Saving Identified</p>
      <p style="font-size:28px;font-weight:700;color:#0A0A0A;margin:0;font-family:'Playfair Display',Georgia,serif;">$172K</p>
      <p style="font-size:11px;color:#9B9B96;margin:6px 0 0 0;font-family:monospace;">Internal Tools deprecation + architecture review</p>
    </div>
  </div>
</div>

---

## What made this hard

Looking back at twelve weeks of work, the technical complexity was not the hard part. The Athena queries, the tag normalisation, the backfill process, the Marketplace cost reconciliation — those were all solvable problems with clear methods.

The hard part was the gap between how leadership thought the problem should work and how it actually worked. A tagging policy on paper looks like a solved problem. The real state of tagging in a four-year-old multi-account environment looks nothing like the policy. Closing that gap requires going account by account, team by team, tag variant by tag variant. It requires conversations that nobody has budgeted time for. It requires explaining to a CTO why their mandate from eighteen months ago didn't produce the outcome they expected.

None of that is in any FinOps framework document. It's just the work.

The other thing that made this hard: the question "what does this application cost" sounds precise. It isn't. Does it include Marketplace licenses? Shared infrastructure? The data transfer costs from integrations between applications? Support contract allocations? Every one of those questions has a defensible answer in either direction. The methodology decision matters as much as the data collection. Getting everyone to agree on what the question actually means before you start answering it is unglamorous, time-consuming work that directly determines whether the final number is trusted or argued with for six months.

We got sign-off on the methodology in week three, before we had any final numbers. That decision saved us more time than any technical shortcut we could have found.

---

## What came next

Six months after the engagement closed, the Internal Tools migration had completed. The platform was shut down. The $232,000 annual spend was off the books.

The Analytics Platform architecture review identified $84,000 in annual savings from rightsizing and storage class changes — work that would not have been prioritised without the cost visibility that showed Analytics growing faster than any other application in the portfolio.

Per-application budgets were set for the following fiscal year. For the first time, engineering teams had a number they owned and a monthly report showing how they were tracking against it.

The tag governance piece — the part that started all of this — is still a work in progress. Tag coverage for the five applications now sits at 91% by spend, up from an estimated 63% when we arrived. The remaining 9% is mostly shared infrastructure and a small number of untaggable resource types. That's not perfect. It's good enough to trust the numbers.

---

*Working through a similar attribution problem across multiple accounts or applications? [Get in touch](/contact) — the tag normalisation and Marketplace cost recovery steps are usually where the most value gets found, and both are faster than they look.*
