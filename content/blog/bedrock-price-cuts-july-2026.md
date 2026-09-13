---
title: "Your Bedrock Bill Just Got Cheaper. Did Anyone Tell You?"
date: "2026-09-13"
excerpt: "On July 30, AWS cut on-demand inference prices for GPT-5.6 Luna on Bedrock by 80%. GPT-5.6 Terra dropped 20%. The reductions applied automatically — no engineering action required, no notification sent to your FinOps team. The model your team chose six months ago at the old price point may now be the wrong economic choice, and nobody's job description includes checking that unless you've made it someone's job."
tags: ["AWS", "Amazon Bedrock", "AI Cost Management", "FinOps", "GPT-5.6", "Model Pricing", "Token Economics", "Cost Optimization", "AI FinOps"]
---

## The bill went down. Nobody told you.

On July 30, AWS cut on-demand inference prices for GPT-5.6 Luna on Amazon Bedrock by 80%.

Let that number sit for a second. Eighty percent.

GPT-5.6 Terra dropped 20% at the same time. GPT-5.6 Sol was unchanged. The reductions matched OpenAI's own first-party pricing changes and applied automatically : no new SKU, no opt-in, no engineering work required. If you were running GPT-5.6 Luna workloads on Bedrock before July 30, your bill is now significantly lower than it was in June without anyone at your company doing a single thing.

Which sounds like good news. And it is. Except for one problem.

If nobody on your team is actively reviewing model pricing against your current workload routing, you probably don't know it happened. And if you don't know it happened, you definitely haven't reviewed whether the architecture decisions you made six months ago still make sense at today's prices.

That gap between "prices changed" and "we updated our routing to reflect it" is where FinOps practitioners earn their keep.

---

## What the numbers actually look like

Before July 30, GPT-5.6 Luna on Bedrock was running at approximately $1.10 per million input tokens and $6.60 per million output tokens. Those are the implied prior rates calculated from the 80% reduction.

After the cut: $0.22 per million input tokens and $1.32 per million output tokens on Bedrock's in-region pricing (OpenAI's own first-party rates are marginally lower at $0.20/$1.20; Bedrock carries a small uplift for in-region data residency).

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 16px 0;">GPT-5.6 Family on Bedrock — Before vs After July 30, 2026</p>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr;gap:0;border:1px solid #E8E8E5;border-radius:8px;overflow:hidden;">
    <div style="padding:10px 12px;background:#0A0A0A;border-right:1px solid #1a1a1a;"><p style="font-size:10px;color:#9B9B96;margin:0;font-family:monospace;">MODEL</p></div>
    <div style="padding:10px 12px;background:#0A0A0A;border-right:1px solid #1a1a1a;"><p style="font-size:10px;color:#9B9B96;margin:0;font-family:monospace;">INPUT (BEFORE)</p></div>
    <div style="padding:10px 12px;background:#0A0A0A;border-right:1px solid #1a1a1a;"><p style="font-size:10px;color:#9B9B96;margin:0;font-family:monospace;">INPUT (AFTER)</p></div>
    <div style="padding:10px 12px;background:#0A0A0A;border-right:1px solid #1a1a1a;"><p style="font-size:10px;color:#9B9B96;margin:0;font-family:monospace;">OUTPUT (AFTER)</p></div>
    <div style="padding:10px 12px;background:#0A0A0A;"><p style="font-size:10px;color:#9B9B96;margin:0;font-family:monospace;">CUT</p></div>
    <div style="padding:10px 12px;background:#FFF3E8;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;font-weight:600;">GPT-5.6 Luna</p></div>
    <div style="padding:10px 12px;background:#FFF3E8;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#9B9B96;margin:0;text-decoration:line-through;">~$1.10/1M</p></div>
    <div style="padding:10px 12px;background:#FFF3E8;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;font-weight:700;margin:0;">$0.22/1M</p></div>
    <div style="padding:10px 12px;background:#FFF3E8;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;font-weight:700;margin:0;">$1.32/1M</p></div>
    <div style="padding:10px 12px;background:#FFF3E8;border-top:1px solid #E8E8E5;"><p style="font-size:12px;color:#C8873A;font-weight:700;margin:0;">80%</p></div>
    <div style="padding:10px 12px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;font-weight:600;">GPT-5.6 Terra</p></div>
    <div style="padding:10px 12px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#9B9B96;margin:0;text-decoration:line-through;">~$2.75/1M</p></div>
    <div style="padding:10px 12px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;font-weight:700;margin:0;">~$2.20/1M</p></div>
    <div style="padding:10px 12px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;font-weight:700;margin:0;">~$13.20/1M</p></div>
    <div style="padding:10px 12px;background:#FAFAF9;border-top:1px solid #E8E8E5;"><p style="font-size:12px;color:#C8873A;font-weight:700;margin:0;">20%</p></div>
    <div style="padding:10px 12px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;font-weight:600;">GPT-5.6 Sol</p></div>
    <div style="padding:10px 12px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#9B9B96;margin:0;">Unchanged</p></div>
    <div style="padding:10px 12px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#9B9B96;margin:0;">Unchanged</p></div>
    <div style="padding:10px 12px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#9B9B96;margin:0;">Unchanged</p></div>
    <div style="padding:10px 12px;background:#fff;border-top:1px solid #E8E8E5;"><p style="font-size:12px;color:#9B9B96;margin:0;">0%</p></div>
  </div>
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;margin:10px 0 0 0;">Bedrock in-region rates (US East N. Virginia, Ohio; US West Oregon). Verify current rates at aws.amazon.com/bedrock/pricing. Prior rates implied from stated percentage reductions.</p>
</div>

The practical meaning for a high-volume workload: a customer service automation running 10 million conversations a month at an average of 300 input tokens and 200 output tokens per exchange was costing roughly $33,000 per month in input alone at the prior Luna rate. At today's rate, that same workload costs $6,600 in input. The output cost drops from $13,200 to $2,640.

That's a monthly saving of over $36,000 on a single workload. Not from rightsizing. Not from a Savings Plans purchase. From a price reduction that happened automatically while your team was working on other things.

---

## The asymmetry that actually matters

Something about the shape of this cut is worth paying close attention to.

Luna got 80%. Terra got 20%. Sol got nothing.

That pattern is not random. Luna is AWS and OpenAI positioning for high-volume, high-frequency inference: classification tasks, summarization, customer service routing, content moderation, any workload where you're making a lot of calls at relatively low complexity per call. The massive price reduction is a direct signal that this is the tier being competed on hardest.

Terra sits in the middle : everyday production work requiring more sophisticated reasoning than Luna. The 20% reduction maintains Terra's position between Luna and Sol without collapsing the price ladder.

Sol, the flagship model for deep reasoning and complex multi-step agentic tasks, didn't move. Premium capability still commands premium pricing. The signal there is equally clear: if your workload genuinely needs Sol-level reasoning, AWS isn't competing on price for it yet.

The implication for anyone currently running a mix of workloads: if you deployed Terra or Sol for tasks that Luna could now handle at acceptable quality, the economics of that routing decision just changed significantly. Luna at $0.22 per million input tokens is no longer a cost-cutting compromise — it's within striking range of models that were considered budget options before this cut.

---

## The routing question your team hasn't asked yet

Here's the conversation that should be happening this week and probably isn't.

When your team originally chose a model for each workload, they made that choice at a specific set of prices against a specific capability benchmark. Both of those things change over time. Model prices shift. Model capabilities improve. The workload that required Terra six months ago might run adequately on Luna today. The workload you kept on a third-party API because Bedrock pricing was unfavourable might now tip back to Bedrock.

That review doesn't happen automatically. It requires someone to ask the question.

The routing audit worth running right now looks like this:

Pull your Bedrock cost data from Cost Explorer, grouped by model, for the last 90 days. Your Data Exports now include model name and inference type as standard metadata fields — both have been available since July. Identify the workloads running on Luna, Terra, and Sol respectively. For any workload currently on Terra, ask: was this placed on Terra because of a quality requirement or because Luna was too expensive at the time? At $0.22 per million input tokens versus the old rate, the answer to the second question changes.

For workloads on Sol that involve high-volume routine steps alongside complex reasoning steps: the 80% Luna price drop makes routing within a single agentic workflow more attractive. Push the classification and summarisation steps to Luna. Keep the deep reasoning on Sol. The blended cost per workflow drops significantly without compromising the quality of the reasoning that actually matters.

---

## The cache read angle nobody is talking about

Luna's prompt cache read pricing is $0.022 per million tokens : that's 10% of the input price.

At the old Luna input price of $1.10 per million tokens, cache reads were already a useful optimisation. At $0.22 per million input tokens, the 10% cache read rate becomes even more interesting because the base to compare against has fallen.

Here's the practical version: any workload passing a large, consistent system prompt or context block on every call is paying full input rate on tokens that don't change. Prompt caching stores that block and charges the cache read rate on subsequent calls. At the new Luna pricing, a workload with a 2,000-token system prompt running 5 million daily calls saves roughly $2,000 per day from caching alone — $730,000 annualised — on top of the baseline savings from the price cut itself.

If your team enabled prompt caching before July 30, the savings compound. If they haven't enabled it yet, the price cut just made the caching setup more urgent than it was.

---

## The pricing event that already passed unnoticed

The GPT-5.6 cuts are the main story here, but there's a secondary one worth naming.

Claude Sonnet 5 launched on Bedrock with promotional pricing of $2 per million input tokens and $10 per million output tokens. That rate expired on August 31 and reverted to $3 and $15 per million tokens. Teams that were running Sonnet 5 workloads at the promotional rate have been paying the higher price for two weeks and most of them don't know it yet.

That's not a criticism of those teams. It's a description of how AI pricing currently works. Promotional rates, model launches, price cuts, price reversions — none of it comes with a calendar notification. The information is public. The burden of tracking it sits entirely with whoever owns AI cost governance at your organisation.

If nobody owns it, things like this pass unnoticed. Which is exactly what the GPT-5.6 price cut is testing right now across every team running those models. The cut happened on July 30. It's September 13 today. Six weeks. Most teams still haven't reviewed their routing against the new rates.

---

## What this week's review should actually produce

Practically, here's what a team doing this right would come out of a single review session with.

A workload map showing every Bedrock model currently in production, the monthly token volume for each, and the tier it sits on. This doesn't require anything beyond Cost Explorer with model grouping turned on — the metadata is there.

A routing recommendation for any workload currently on Terra where Luna quality would be adequate. This requires a quality test, not just a cost calculation, but the test is worth running given the scale of the price difference.

A caching decision for any workload with a stable, large system prompt. The implementation is a Bedrock API setting, not a significant engineering project.

A migration timeline for any workloads you want to move to Claude Sonnet 5 before August 31, if the promotional pricing makes it competitive for your use case.

None of this is complicated. All of it requires someone to sit down and actually do it.

The thing that tends to block this kind of review isn't technical complexity. It's that AI cost governance doesn't have a natural owner in most organisations yet. FinOps teams are still building the muscle for it. Engineering teams aren't looking at pricing pages. Finance teams don't have visibility into which model is running which workload.

The gap between "prices changed" and "we updated our architecture to reflect it" is where real money gets left on the table. The July 30 Bedrock price cuts are large enough and transparent enough that they're a good forcing function for building that review process before the next change arrives with less fanfare.

---

*Running GPT-5.6 workloads on Bedrock and haven't reviewed your routing since the price cuts? [Get in touch](/contact) — the workload map and routing analysis is usually faster to build than teams expect.*
