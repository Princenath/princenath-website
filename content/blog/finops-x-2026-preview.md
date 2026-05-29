---
title: "FinOps X 2026: What Practitioners Should Actually Be Watching For"
date: "2026-05-29"
excerpt: "FinOps X opens in San Diego on June 8. AWS will be there with senior leadership, a hands-on GameDay, and almost certainly a set of product announcements. Based on what's been building in the CFM space over the past six months and where the community's attention sits heading into the conference, here's what's worth paying close attention to — and what's likely to get announced while everyone is looking elsewhere."
tags: ["FinOps X", "FinOps Foundation", "AWS", "FinOps 2026", "Amazon Q", "FOCUS", "AI Cost Management", "Cloud Cost Management"]
---

## Thirteen days out

FinOps X starts in San Diego on June 8. Four days, the FinOps Foundation's annual conference, and the one event in the year where AWS consistently announces things that actually change how practitioners work.

The pattern has been reliable. At FinOps X 2025, AWS announced the Cost Comparison feature in Cost Explorer, multi-source billing views for organisations managing multiple payer accounts, and several enhancements to Cost Categories. None of those made the technology press. All of them are in regular use by FinOps teams today.

That's the thing about FinOps X announcements. They rarely make headlines outside the community. They don't need to. They're designed for the 1,200-odd practitioners in the room who spend their professional lives in the AWS Billing console , not for the broader tech press. That specificity is what makes the conference worth paying attention to if you're in this field.

This is not a guide to the conference agenda. It's a read on where the field is heading and what's likely to land over those four days, based on what AWS has been building toward and what the community has been vocal about wanting.

---

## Where the community's attention actually sits

Before getting into specific predictions, it's worth being honest about the state of the FinOps community heading into this conference. The conversation has shifted significantly in twelve months.

The 2026 State of FinOps report, which surveyed 1,192 practitioners representing over $83 billion in annual cloud spend, drew a line that would have been unthinkable two years ago: 98% of FinOps teams now manage AI spend. In 2024, that number was 31%. The field absorbed an entirely new cost category in roughly eighteen months, and most teams are still building the governance infrastructure to match.

The top three challenges practitioners reported were visibility into AI costs, allocating those costs to the right teams and business units, and proving the ROI of AI investments to leadership. All three are governance and attribution problems, not engineering problems. They sit squarely in FinOps territory.

The second significant shift is the FOCUS standard. The FinOps Foundation's open specification for normalising cloud cost data across providers has moved from early adopter territory to mainstream expectation. AWS now exports CUR data in FOCUS 1.2 schema. The question is no longer whether FOCUS matters — it's what AWS announces to deepen its implementation.

These two themes — AI cost governance and FOCUS standardisation — are where the loudest practitioner conversations have been in the lead-up to the conference. Every AWS announcement worth watching will connect back to one of them.

---

## What AWS is likely to announce

This is educated speculation based on what's been building in the AWS Cloud Financial Management product suite, what practitioners have been asking for publicly, and what AWS has historically announced at this event. Not predictions. Hypotheses worth paying attention to.

**Amazon Q capabilities for FinOps, extended.**

AWS launched natural language querying inside Cost Explorer in April 2026. The initial feature is genuinely useful — you can describe an analysis in plain English and Cost Explorer reconfigures itself around the question. But the current version has real limits. It can't run complex multi-step analysis across CUR data. It can't correlate commitment coverage against anomaly data in a single query. It can't generate a chargeback report from a prompt.

The next logical extension is deeper integration between Amazon Q and CUR 2.0 — the ability to query your raw billing data through a conversational interface rather than writing Athena SQL. If AWS announces this or moves toward it at FinOps X, it's the single biggest change to how FinOps teams will interact with cost data in the next two years. Watch for any announcement that connects Amazon Q directly to Data Exports or Athena-based analysis.

**AI cost governance tooling.**

AWS has been releasing AI attribution features in pieces: IAM principal attribution for Bedrock in April, operation names in CUR in May. The pattern suggests a larger governance framework being assembled incrementally rather than announced all at once.

At FinOps X, watch for either a consolidation announcement — bringing these pieces together into a named AI Cost Governance capability — or the next increment: budget and alert support at the model or operation level, native Bedrock cost-per-inference metrics in Cost Explorer, or Bedrock-specific anomaly detection that understands token-based spending patterns rather than just dollar thresholds.

Any of these would directly address the top practitioner complaint from the State of FinOps report. AWS knows that. FinOps X is the right venue to announce it.

**FOCUS 1.2 tooling improvements.**

AWS recently shipped CUR data exports in FOCUS 1.2 specification. The spec is now available. The harder question for practitioners is: what do you do with it? Most teams don't have the tooling to ingest FOCUS-format data natively alongside their existing CUR pipelines.

Watch for announcements that make FOCUS data actionable inside AWS's own tools — Cost Explorer views built on FOCUS data, native FOCUS schema support in AWS Glue, or guidance on migrating from legacy CUR to FOCUS 1.2 without losing existing report configurations. The spec being available and the spec being usable are two different things.

**Multi-source billing views, expanded.**

Last year AWS announced the ability to aggregate billing views from up to 20 different payer accounts in a single unified view. This is specifically designed for large enterprises running multiple AWS organisations and for managed service providers overseeing customer accounts.

The current limit of 20 payer accounts is a constraint that larger organisations are already hitting. An expansion of that limit, or deeper functionality within multi-source views, would be the natural next step. Not the flashiest announcement but relevant to any team managing complex multi-account or multi-organisation billing structures.

---

## The session worth watching regardless of announcements

Every year at FinOps X, AWS runs a keynote session specifically on Cloud Financial Management product updates. It's typically delivered by the Director or VP of the CFM product organisation, and it's where the announcements land.

Beyond that session, the practitioners-only working groups and community discussions often produce more useful signal than the official agenda. The problems practitioners are actively trying to solve — not the product features AWS wants to spotlight — come out in those sessions. If you're attending, the breakout discussions on AI cost attribution and FOCUS adoption will tell you more about where the field is heading than the keynote.

If you're not attending, the FinOps Foundation community Slack is active during the conference. Most major announcements surface there within hours.

---

## What won't get announced but should

This is the list every practitioner has. The things that have been on the wishlist for years and keep not appearing.

Native showback at the resource level without requiring CUR queries. Cost Explorer's filter and group-by capabilities are powerful, but producing a meaningful showback report for a business unit or product team still requires either a custom Athena setup or a third-party tool. AWS has the data. The reporting layer for end users who aren't FinOps practitioners remains underdeveloped.

Commitment management automation. The ability to set rules for automatic RI exchange or Savings Plans adjustment when utilisation drops below a threshold. Right now this requires either custom Lambda automation or a third-party commitment management tool. AWS has moved in this direction with Compute Optimizer recommendations but has not closed the loop to autonomous action.

Cross-cloud FOCUS reporting natively within AWS. If you manage AWS and Azure spend, you're currently stitching together FOCUS exports from two consoles and building your own unified view. AWS building a native multi-cloud cost aggregation layer would change the game for multi-cloud enterprises. This has been a consistent community ask for three years. It hasn't happened. Maybe this year.

---

## The broader context worth understanding

FinOps X 2026 sits at a specific moment in the field's evolution. The practices that most mature FinOps teams have built — commitment management, tag governance, chargeback models, anomaly detection — were designed for infrastructure spend. EC2 instances, RDS databases, S3 buckets. Costs that grow predictably with usage and can be governed with the same tools year to year.

AI spend breaks almost all of those assumptions. Token-based pricing models don't map cleanly to commitment vehicles. Attribution at the IAM level is a workaround, not a purpose-built solution. Anomaly detection calibrated for infrastructure doesn't catch an agentic loop running over a weekend. The FinOps Foundation updated its mission statement earlier this year, from "Advancing the People who manage the Value of Cloud" to "Advancing the People who manage the Value of Technology," specifically in response to this shift.

That mission change is more than wordsmithing. It signals that the discipline is being asked to govern a much wider category of technology spend than it was designed for, on a faster timeline than any previous expansion of cloud services.

The announcements that come out of FinOps X 2026 will give a clear read on how AWS thinks that governance problem should be solved. Whether through native tooling extensions, deeper Amazon Q integration, FOCUS standardisation, or something nobody is predicting.

The practitioners who pay attention to those announcements and move quickly to implement what's useful will be ahead of teams that wait for the quarterly review cycle to catch up.

---

## After the conference

I'll publish a follow-up covering what was actually announced, what it means in practice, and what the community reactions were. If you're tracking the same questions, the AWS Cloud Financial Management blog and the FinOps Foundation Slack will have the primary sources within hours of each session.

FinOps X 2026 runs June 8-11. Watch the CFM keynote first.

---

*Tracking AI cost governance or FOCUS adoption at your organisation and not sure where the gaps are? [Get in touch](/contact) — the attribution and governance questions are the ones most teams are working through right now.*
