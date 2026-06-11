---
title: "FinOps X Day 2: From Alerts to Agents, FOCUS 1.4, and the Honest Truth About Where Most Practices Actually Stand"
date: "2026-06-11"
excerpt: "Day 2 of FinOps X presented a Crawl, Walk, Run model for agentic FinOps maturity, announced FOCUS 1.4, and featured Google, Oracle, IBM, and Flexera shipping autonomous cost management features. Mike Fuller's line — AI won't take FinOps jobs, but practitioners who know AI better will , was the most important thing said at this conference. Here's what Day 2 delivered, what I think it means, and what the community isn't saying out loud."
tags: ["FinOps X 2026", "FOCUS 1.4", "Agentic FinOps", "AI for FinOps", "Google Cloud", "FinOps Foundation", "Tokenomicon", "FinOps Maturity", "Cost Management"]
---

## The line that cut through the noise

Mike Fuller, CTO of the FinOps Foundation, said the most honest thing anyone said on a FinOps stage this year.

"AI won't take FinOps jobs. But FinOps practitioners who know AI better will."

Two sentences. Most people took comfort from the first one and moved on. I think the second one deserves a lot more attention than it's getting.

That line wasn't a reassurance. It was a competitive warning delivered politely in front of 2,500 people. The practitioners who treat it as good news are reading it wrong.

---

## What Day 2 actually was

The title was "From Alerts to Agents." The framing was a maturity model presented by Ishita Vyas, APAC Community Lead at the FinOps Foundation: Crawl, Walk, Run.

**Crawl** is basic automation. Reports run on schedule. Budget alerts fire when thresholds are crossed. The system tells you something happened. You decide what to do about it.

**Walk** is contextual intelligence. Anomalies are surfaced with explanations. Recommendations carry business context. The system tells you what happened and suggests a response.

**Run** is agentic execution. Approved actions execute autonomously based on policy you've defined. Recommendations route to the right teams without a practitioner manually forwarding them. Routine optimisations complete without requiring a human to review each one.

Here's what I noticed and what nobody said clearly on stage: the conference was operating at Run. The tooling announcements, the practitioner stories, the product launches — all calibrated for teams that have already passed Crawl and Walk. But most of the practitioners I talk to in this industry are still at Crawl, either configuring their first Cost Anomaly Detection monitors or trying to get tag coverage above 80%.

That gap between where the conversation is happening and where most teams actually sit is the real story of Day 2. Not the announcements.

---

## FOCUS 1.4: the announcement the room underreacted to

Shawn Alpay, Director of Data Engineering at the FinOps Foundation, announced FOCUS 1.4. The room did not erupt. It should have been louder.

FOCUS 1.4 adds Invoice Reconciliation and Commitment Details to the specification. These sound technical. They solve problems that every FinOps practitioner with more than one account spends hours on every single month.

Invoice reconciliation is the process of matching what your billing console shows to what your invoice says. They never match cleanly. AWS invoice timing, credit applications, reserved instance amortisation handling, refund processing — all of these create differences between the CUR data and the actual invoice that finance needs to sign off on. Every team I've worked with has a spreadsheet for this. Most of them have multiple spreadsheets, one per account, reconciled manually before month-end close.

FOCUS 1.4 means billing exports can now carry the fields needed to tie line-item cost data back to invoice references in a standardised format. Across providers. If your cost data is in FOCUS 1.4 format and your provider implements it properly, the reconciliation spreadsheet goes away.

The Commitment Details addition is similarly practical. Reserved Instance and Savings Plans data — purchase date, term length, remaining value, utilisation rate — will be expressible in a standardised schema rather than requiring provider-specific queries. Anyone building internal dashboards or feeding cost data into finance systems should be targeting FOCUS 1.4 for any new build.

My honest take: FOCUS gets announced every year and practitioners nod politely. I've been watching FOCUS adoption more carefully over the past twelve months and the pace has changed. AWS supports it. Oracle announced FOCUS 1.3 support at the same keynote. Google is working toward it. The specification is now mature enough to build on seriously. If you haven't started migrating your reporting to FOCUS, the question has shifted from "should we?" to "why haven't we?"

---

## Google and the autonomous cost controls question nobody is asking

Sarah McMullin from Google Cloud announced Automated Spend Caps alongside their FinOps AI Explainability Agent and full-stack AI cost visibility.

Automated Spend Caps means you set a spending limit and when it's hit, something happens automatically : throttling, alerting, workload suspension : depending on the policy you configure. No human has to approve it in the moment.

On Day 1, AWS announced the FinOps Agent with autonomous execution capability. On Day 2, Google announced Automated Spend Caps. Two hyperscalers, consecutive days, same direction: the platforms are building the ability to take autonomous cost management actions in your environment.

I think this is the right direction. I also think most teams are not ready for it.

The challenge with autonomous cost controls is that the policy layer underneath them requires more precision than most FinOps teams have built. "Stop the workload when spend exceeds $50,000" is a policy. But which workloads? In which accounts? With what exceptions for production? What happens if a critical payment processing service gets throttled at 2am because it hit a spend cap configured for a development environment?

The feature is only as good as the governance surrounding it. And in my experience, most organisations build the governance after something goes wrong, not before. The teams that implement Automated Spend Caps or the AWS FinOps Agent carefully — with documented policies, exception lists, escalation procedures, and clear account owner accountability — will benefit enormously. The teams that configure them quickly because it sounds like a good idea will eventually explain to an engineering lead why a production service was suspended.

That's not a reason to avoid these features. It's a reason to treat them as governance problems before you treat them as tooling problems.

---

## Pinterest's Layer Cake: the framing that should change how you categorise AI spend

Ambud Sharma from Pinterest introduced two flavours of AI spend: Product AI (external customer-facing features) and Internal AI (tooling and infrastructure). He called the framework for stacking optimisations across them the "Tokenomic Layer Cake."

This is more useful than it might look on a slide.

Almost every FinOps conversation about AI costs I've had in the past six months collapses all AI spend into a single line. "Our Bedrock spend is $430,000 this month." That number tells you almost nothing about whether the spend is justified or not.

$430,000 for a customer-facing AI feature serving 200,000 daily active users can be perfectly reasonable. The same amount for internal tooling used by 20 engineers is a very different conversation. The same amount for a series of experiments that never shipped is a problem nobody has noticed yet.

The Product AI vs Internal AI distinction is the first cut that makes any AI cost conversation actionable. If you can't tell your CFO which AI spend is customer-facing and which is internal, you don't have an AI FinOps practice : you have a billing report.

---

## MetLife on speed: the framing I keep coming back to

Sonali Niswander from MetLife sat down with J.R. Storment and said: "AI is cloud all over again, only 10x faster."

I've been sitting with that since I read it.

Cloud adoption at enterprise scale took about a decade to go from experiment to governed. FinOps as a formal discipline is roughly ten years old. The certifications, the frameworks, the tooling ecosystems, the CFO-level conversations about cloud efficiency — all of that was built over a decade of hard-won experience.

AI is running the same adoption curve in about eighteen months. The governance frameworks are being written right now. The best practices are being argued out at conferences exactly like this one. Nobody has ten years of AI FinOps experience because the discipline is ten months old at most.

What that means in practice is that the teams that invest seriously in AI cost governance now : before the problems are obvious, before the CFO has already seen a $600,000 monthly Bedrock bill , will be far better positioned than the teams that wait for a budget meeting to force the conversation.

The MetLife framing is honest in a way that vendor keynotes usually aren't. It names the urgency without pretending the solutions are already figured out.

---

## IBM and Flexera: worth watching

IBM Cloudability announced Conversational Insights, the Cloudability MCP Server, and the FOCUS AI Agent. The MCP Server is specifically interesting because it means Cloudability's cost data can be accessed through any MCP-compatible interface. Practitioners building internal tooling or integrating cost data into developer workflows don't have to build their own data pipeline from scratch.

Flexera and ProperOps announced Unified Autonomous Rate and Workload Optimization through ProperOps+. Autonomous commitment purchasing decisions based on policy you define. The pitch is that commitment management — which today requires a practitioner to review coverage reports, identify gaps, model options, and execute purchases — can be handled autonomously once the policy framework is in place.

I think this is directionally correct and I also think the policy framework being "in place" is doing a lot of work in that sentence. Autonomous RI purchasing is great until the autonomous system locks in a 3-year commitment on an instance type that engineering is planning to migrate away from next quarter. The practitioner's job in this scenario shifts from executing purchases to designing the policy guardrails that keep autonomous systems from making expensive mistakes.

That's a higher-skill job than running a coverage report. Which is exactly the point.

---

## Tokenomicon: a new conference and what it signals

J.R. confirmed that Tokenomicon — a dedicated conference for AI economics — will hold its first events in Amsterdam September 22-23, 2026, followed by London February 8-9, 2027. FinOps X will eventually evolve into Tokenomicon as the primary annual gathering.

Creating a separate conference is a meaningful commitment. It signals that the FinOps Foundation believes AI cost governance is large enough, distinct enough, and growing fast enough to warrant its own dedicated community event rather than a track within the existing conference.

I'm going to be watching the Amsterdam event closely. The quality of the practitioner content — real case studies with real numbers, governance frameworks that have been stress-tested in production — will tell us a lot about how mature AI FinOps actually is versus how mature the conference keynotes suggest it is.

---

## The honest read on two days

Both days of FinOps X 2026 were building toward the same conclusion, just from different angles.

Day 1 said: the economics of AI are different and harder than cloud, and the industry needs new frameworks to manage them.

Day 2 said: the tools to automate the routine work are here, and the practitioners who survive and thrive are the ones who operate above the automation layer.

Put together, the message is that FinOps is expanding in scope at exactly the moment that the lower-value parts of the existing scope are being automated away. The discipline needs practitioners who can govern AI spend, measure business value, and design the policy frameworks that keep autonomous cost management systems from making expensive mistakes.

That's a harder job than tagging governance and Savings Plans analysis. It's also a more valuable one. The question from Day 2 isn't whether the field is changing. It clearly is. The question is how fast you're changing with it.

If you're still at Crawl on the agentic maturity model, you're not behind yet. But the distance between Crawl and where the industry is heading is longer than it was twelve months ago, and it gets longer every quarter.

---

*Working through what the shift to agentic FinOps and AI cost governance means for your practice or your team? [Get in touch](/contact) — the gap between where most teams are and where the tooling is heading is where most of the strategic work sits right now.*
