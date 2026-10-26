---
title: "You Can Finally Budget Bedrock by Model. Here's the Budget to Set This Week."
date: "2026-10-26"
excerpt: "On October 8, AWS added Bedrock product attributes to Cost Explorer, Budgets, and Dashboards: model, provider, inference type, and feature as native billing dimensions. It landed as a What's New post on a Wednesday with no blog, no keynote, no announcement email. It is the single most useful AI cost feature AWS has shipped this year, it fixes a problem that has been quietly breaking Bedrock reporting for a year, and it comes with three limitations you need to know before you build a dashboard on it. Also: a correction to something I wrote in September."
tags: ["AWS", "Amazon Bedrock", "Cost Explorer", "AWS Budgets", "FinOps", "AI Cost Management", "Tokenomics", "Prompt Caching", "Cost Attribution", "FinOps for AI"]
---

## The feature I asked for in May arrived in October, quietly

Back in May, thirteen days before FinOps X, I wrote a list of what AWS should announce. One of the items was budget and alert support at the model level for Bedrock. Native, in Cost Explorer, without an Athena query.

It didn't come in June. The FinOps Agent took the stage instead, and fair enough.

It came on October 8, as a What's New post. No blog. No keynote. If you weren't watching the Cloud Financial Management feed that week you missed it, which is a pattern with AWS CFM launches I've written about before: the features that change how practitioners work rarely get the marketing budget.

Here's what shipped. Cost Explorer, AWS Budgets, and Cost Management Dashboards now carry a dimension called Bedrock product attributes, with four keys underneath it: model, model provider, inference type, and feature. You can group by them, filter by them, and set budgets on them. No additional charge. All commercial regions except GovCloud and China.

That paragraph undersells it. Let me explain why.

---

## The problem this fixes has been breaking your Bedrock reports for a year

Ask most teams for their total Bedrock spend last month and they'll give you a number from Cost Explorer filtered to Service = Amazon Bedrock.

That number is wrong, and has been for a while.

Anthropic and OpenAI models on Bedrock don't bill under the Amazon Bedrock service name. Each one bills under its own: Claude Sonnet 5.5 (Amazon Bedrock Edition), OpenAI GPT-6.1 Sol (Amazon Bedrock Edition), and so on, one service name per model. Amazon's own Nova models and some third-party models do bill under Amazon Bedrock. So a Service = Amazon Bedrock filter gives you Nova and Grok and leaves out every Claude and GPT line, which for most enterprises is the majority of the bill.

The workaround was to search "bedrock" in the Service filter, select all 32 results (that's the current count, it grows with every model launch), and remember to redo it every time a new model appears. Half the teams I've seen doing this had a stale filter. One had a dashboard widget labelled "Total Bedrock" that was missing two Claude models that had launched since the widget was built.

The product attributes fix this cleanly. Group by Model with no Service filter at all, and Cost Explorer returns only Bedrock costs, every model side by side regardless of which service name it bills under, with a final row for costs that carry no model attribute (AgentCore, mostly). Group by Model provider and the Claude lines collapse to Anthropic, the GPT lines to OpenAI.

No service filter to maintain. No stale widgets.

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 16px 0;">The Four Bedrock Product Attributes — And What You Use Each One For</p>
  <div style="display:grid;grid-template-columns:1fr 1.4fr 1.6fr;gap:0;border:1px solid #E8E8E5;border-radius:8px;overflow:hidden;">
    <div style="padding:10px 12px;background:#0A0A0A;border-right:1px solid #1a1a1a;"><p style="font-size:10px;color:#9B9B96;margin:0;font-family:monospace;">ATTRIBUTE</p></div>
    <div style="padding:10px 12px;background:#0A0A0A;border-right:1px solid #1a1a1a;"><p style="font-size:10px;color:#9B9B96;margin:0;font-family:monospace;">EXAMPLE VALUES</p></div>
    <div style="padding:10px 12px;background:#0A0A0A;"><p style="font-size:10px;color:#9B9B96;margin:0;font-family:monospace;">WHAT IT'S FOR</p></div>
    <div style="padding:10px 12px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;font-weight:600;">Model</p></div>
    <div style="padding:10px 12px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;">Claude Sonnet 5.5, Claude Opus 5.5, OpenAI GPT-6.1 Sol, Nova 2.0 Lite</p></div>
    <div style="padding:10px 12px;background:#FAFAF9;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;">Which model is eating the bill. Per-model budgets.</p></div>
    <div style="padding:10px 12px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;font-weight:600;">Model provider</p></div>
    <div style="padding:10px 12px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;">Anthropic, OpenAI, xAI</p></div>
    <div style="padding:10px 12px;background:#fff;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;">Vendor concentration. Negotiation prep. (See the Nova caveat below.)</p></div>
    <div style="padding:10px 12px;background:#FFF3E8;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;font-weight:600;">Inference type</p></div>
    <div style="padding:10px 12px;background:#FFF3E8;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;">Input tokens, Output tokens, Input tokens global, Output tokens global, Prompt cache read input tokens, Prompt cache write input tokens</p></div>
    <div style="padding:10px 12px;background:#FFF3E8;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#C8873A;margin:0;font-weight:600;">The important one. Cache hit visibility. Global vs regional endpoint mix.</p></div>
    <div style="padding:10px 12px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;font-weight:600;">Feature</p></div>
    <div style="padding:10px 12px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;">On-demand Inference, Reranker</p></div>
    <div style="padding:10px 12px;background:#fff;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;">Separating inference from the rest. Thin so far in practice.</p></div>
  </div>
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;margin:10px 0 0 0;">Values are the ones that appear in Cost Explorer for models you've actually used. The list only populates with usage history. Attribute data starts 1 September 2026.</p>
</div>

---

## Inference type is the one to pay attention to

Model-level grouping is the headline. Inference type is where the money is.

Until now, Cost Explorer showed you Bedrock in dollars. If you wanted to know what share of a model's cost was input versus output, or whether prompt caching was actually firing, you needed CUR 2.0 in Athena and a query that knew the usage type strings. Most teams never built it. They enabled caching in the API call, assumed it worked, and never checked.

Inference type gives you six buckets per model: input, output, input global, output global, cache read, cache write. Group a model by inference type and three questions get answered in one view.

**Is caching on?** A model with meaningful input spend and zero in the cache read row is a model where nobody enabled it, or where the prompt is structured so the cache never hits. Either way it's a conversation.

**Is caching working?** Cache read dollars relative to input dollars, adjusted for the read rate, tells you roughly what fraction of input tokens are being served from cache. At a 0.1x read rate, $1 of cache read spend represents the same tokens as $10 of full-rate input. If cache reads are a rounding error next to input, the hit rate is low and the prompt ordering probably needs fixing: static system prompt and tool definitions first, per-request content last.

**Global or regional?** Input tokens global and Output tokens global are the global cross-region inference profile. Regional endpoints carry roughly a 10% premium. If a workload with no data residency requirement is billing as regional, that's a config change worth a line in someone's backlog.

This matters more than it did a month ago, for a specific reason.

---

## The cache read cut that makes this urgent

On October 7, one day before the product attributes launch, AWS cut the cache read price for Claude Sonnet 5.5 on Bedrock by 50%. The pricing page carries a one-line note to that effect. Sonnet 5.5 cache reads now bill at 0.05x the input rate, down from 0.1x. Opus 5.5 is already at 0.05x. Haiku 5.5 is at 0.1x.

Here's what that does to a workload I'd consider typical for a customer-facing assistant: 5 million calls a day, a 2,000-token system prompt plus tool definitions that never change, on Sonnet 5.5 through a global endpoint at $2 per million input tokens.

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 16px 0;">Daily Cost of a 2,000-Token Static Prefix — 5M Calls/Day on Claude Sonnet 5.5 (Illustrative)</p>
  <div style="display:grid;grid-template-columns:1.6fr 1fr 1fr;gap:0;border:1px solid #E8E8E5;border-radius:8px;overflow:hidden;">
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;"><p style="font-size:11px;color:#9B9B96;margin:0;font-family:monospace;">SCENARIO</p></div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;"><p style="font-size:11px;color:#9B9B96;margin:0;font-family:monospace;">DAILY COST</p></div>
    <div style="padding:12px 16px;background:#fff;"><p style="font-size:11px;color:#9B9B96;margin:0;font-family:monospace;">ANNUALISED</p></div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">No caching — full input rate on 10B tokens</p></div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">$20,000</p></div>
    <div style="padding:12px 16px;background:#FAFAF9;border-top:1px solid #E8E8E5;"><p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">$7.3M</p></div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">Caching at the old 0.1x read rate</p></div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:12px;color:#0A0A0A;font-weight:600;margin:0;">$2,000</p></div>
    <div style="padding:12px 16px;background:#fff;border-top:1px solid #E8E8E5;"><p style="font-size:12px;color:#0A0A0A;font-weight:600;margin:0;">$730,000</p></div>
    <div style="padding:12px 16px;background:#FFF3E8;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:600;">Caching at the new 0.05x read rate (from 7 Oct)</p></div>
    <div style="padding:12px 16px;background:#FFF3E8;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:12px;color:#0A0A0A;font-weight:700;margin:0;">$1,000</p></div>
    <div style="padding:12px 16px;background:#FFF3E8;border-top:1px solid #E8E8E5;"><p style="font-size:12px;color:#0A0A0A;font-weight:700;margin:0;">$365,000</p></div>
  </div>
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;margin:12px 0 0 0;">Prefix tokens only; per-request content and output excluded. Assumes a high cache hit rate and ignores cache write charges, which are small at this volume. Verify current rates at aws.amazon.com/bedrock/pricing.</p>
</div>

The teams that had caching on got another $365,000 a year handed to them on October 7 for doing nothing. The teams that never enabled it are now leaving $19,000 a day on the table on this one workload. The product attributes launch means you can tell which group you're in from the console, in about ninety seconds, without opening Athena.

I'd run that check before anything else in this post.

---

## The budget that wasn't possible before

The second thing to set up is the per-model budget.

The $140,000 to $430,000 Bedrock story I wrote about in May, where an agentic loop ran unbudgeted for a month because nobody could see it, had one structural cause: there was no way to put a budget on a model. You could budget the Bedrock service, which as we've established doesn't even include Claude. You could budget an account. Neither catches a single workload tripling its Opus usage inside an account that also runs twenty other things.

AWS Budgets now accepts the product attributes as filters. A budget on Model = Claude Opus 5.5, monthly, with an alert at 80% of a number you've actually thought about, fires in the first week of a runaway loop instead of on the invoice.

What the number should be is a judgement call per model tier, but the shape I'd use: for Haiku-class and Nova workloads, budget on the aggregate because volume is the point and individual spikes are cheap. For Sonnet-class, budget per model with a threshold based on the last 30 days plus whatever growth you've agreed with the product team. For Opus and Fable-class models, budget per model and set the alert low, because at $10 to $50 per million output tokens the question is never "is this a lot" but "did someone mean to do this."

Combine the model filter with the IAM principal tags from the April attribution feature and you get the version of this that holds up in a chargeback conversation: Model = Opus 5.5, Team = DataEngineering, alert at $X. The announcement also mentions cost allocation tags on application inference profiles, which if your platform team has set them up gives you the per-application cut without touching IAM at all.

---

## Setting it up, and what it looks like

In the console: Cost Explorer, Group by, pick Product attribute, pick Model. Leave the Service filter empty. That's the whole thing. For the cache check, add a second group-by on Inference type and filter to the model you care about.

From the CLI, if you'd rather script it into a weekly report:

```bash
# Bedrock spend by model and inference type, current month — no Service filter needed
aws ce get-cost-and-usage \
  --time-period Start=2026-10-01,End=2026-10-26 \
  --granularity MONTHLY \
  --metrics UnblendedCost UsageQuantity \
  --group-by Type=PRODUCT_ATTRIBUTE,Key=model \
             Type=PRODUCT_ATTRIBUTE,Key=inferenceType
```

UsageQuantity alongside the cost is worth pulling, because for inference rows the unit is tokens, which turns the cache ratio from an inference into an actual number. Check the unit field in the response before trusting it for a model you haven't looked at before.

Here's roughly what a month looks like once it's grouped, for an environment running a mix of Claude models:

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 16px 0;">Monthly Bedrock Spend by Model × Inference Type (Illustrative)</p>
  <div style="display:grid;grid-template-columns:1.3fr 1fr 1fr 1fr 1fr 1.2fr;gap:0;border:1px solid #E8E8E5;border-radius:8px;overflow:hidden;">
    <div style="padding:10px 12px;background:#0A0A0A;border-right:1px solid #1a1a1a;"><p style="font-size:10px;color:#9B9B96;margin:0;font-family:monospace;">MODEL</p></div>
    <div style="padding:10px 12px;background:#0A0A0A;border-right:1px solid #1a1a1a;"><p style="font-size:10px;color:#9B9B96;margin:0;font-family:monospace;">INPUT</p></div>
    <div style="padding:10px 12px;background:#0A0A0A;border-right:1px solid #1a1a1a;"><p style="font-size:10px;color:#9B9B96;margin:0;font-family:monospace;">OUTPUT</p></div>
    <div style="padding:10px 12px;background:#0A0A0A;border-right:1px solid #1a1a1a;"><p style="font-size:10px;color:#9B9B96;margin:0;font-family:monospace;">CACHE READ</p></div>
    <div style="padding:10px 12px;background:#0A0A0A;border-right:1px solid #1a1a1a;"><p style="font-size:10px;color:#9B9B96;margin:0;font-family:monospace;">CACHE WRITE</p></div>
    <div style="padding:10px 12px;background:#0A0A0A;"><p style="font-size:10px;color:#9B9B96;margin:0;font-family:monospace;">READ THIS AS</p></div>
    <div style="padding:10px 12px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;font-weight:600;">Claude Sonnet 5.5</p></div>
    <div style="padding:10px 12px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;">$41,200</p></div>
    <div style="padding:10px 12px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;">$58,400</p></div>
    <div style="padding:10px 12px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;">$6,900</p></div>
    <div style="padding:10px 12px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;">$1,100</p></div>
    <div style="padding:10px 12px;background:#FAFAF9;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;">Caching on, hit rate healthy</p></div>
    <div style="padding:10px 12px;background:#FFF3E8;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;font-weight:600;">Claude Opus 5.5</p></div>
    <div style="padding:10px 12px;background:#FFF3E8;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#C8873A;margin:0;font-weight:600;">$63,500</p></div>
    <div style="padding:10px 12px;background:#FFF3E8;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#C8873A;margin:0;font-weight:600;">$121,000</p></div>
    <div style="padding:10px 12px;background:#FFF3E8;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#C8873A;margin:0;font-weight:700;">$0</p></div>
    <div style="padding:10px 12px;background:#FFF3E8;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#C8873A;margin:0;font-weight:700;">$0</p></div>
    <div style="padding:10px 12px;background:#FFF3E8;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#C8873A;margin:0;font-weight:600;">Caching never enabled. Act on this.</p></div>
    <div style="padding:10px 12px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;font-weight:600;">Claude Haiku 5.5</p></div>
    <div style="padding:10px 12px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;">$9,800</p></div>
    <div style="padding:10px 12px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;">$14,200</p></div>
    <div style="padding:10px 12px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;">$2,400</p></div>
    <div style="padding:10px 12px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;">$600</p></div>
    <div style="padding:10px 12px;background:#fff;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#0A0A0A;margin:0;">Fine</p></div>
    <div style="padding:10px 12px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#9B9B96;margin:0;font-weight:600;">No product attribute</p></div>
    <div style="padding:10px 12px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#9B9B96;margin:0;">—</p></div>
    <div style="padding:10px 12px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#9B9B96;margin:0;">—</p></div>
    <div style="padding:10px 12px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#9B9B96;margin:0;">—</p></div>
    <div style="padding:10px 12px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#9B9B96;margin:0;">—</p></div>
    <div style="padding:10px 12px;background:#FAFAF9;border-top:1px solid #E8E8E5;"><p style="font-size:11px;color:#9B9B96;margin:0;">$18,300 — AgentCore, Guardrails, etc.</p></div>
  </div>
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;margin:10px 0 0 0;">Illustrative figures. The Opus row is the point: $184,500 a month on the most expensive model in the account with no cache activity at all. That was invisible in Cost Explorer before October 8.</p>
</div>

The Opus row is the kind of thing this feature exists to surface. A model at $5 per million input tokens, running what is almost certainly a long static prefix, with nobody having turned on caching. At that spend level the fix is worth more per month than most rightsizing exercises produce in a quarter.

---

## Where it falls short

Three things, and the first one matters for anything you build in the next six weeks.

**Attribute data starts on September 1, 2026.** Not before. If you ask the API for product attributes on a period that includes August, it returns an error. In the console, extending the date range before September 1 pops a dialog warning that your attribute selections will be cleared. The practical consequence: you can't do a 90-day trend by model until December. For the October review you have about eight weeks of data. Build the dashboard anyway; just don't present a quarter-over-quarter comparison from it until there's a quarter in it.

**Model provider is blank for some models, including Amazon's own.** Nova models bill with an empty provider attribute. So does at least one Grok variant, while another Grok version shows xAI correctly. The effect is that a filter on Model provider = Anthropic, OpenAI, xAI silently drops Nova. Nova is the model family AWS most wants you to run and the one that most often does the high-volume classification work. If your vendor-concentration widget uses the provider filter, it will understate Amazon's own share of the bill. Group by Model instead, or use the "No product attribute" bucket explicitly. I'd expect AWS to clean this up, but as of the week I'm writing it's live.

**It's dollars by inference type, not a token-level cost model.** You get input, output, cache read, cache write as cost buckets per model. You don't get prompts, you don't get per-request cost, you don't get which application inference profile drove the cache misses. The Feature attribute, in the accounts I've seen reported, shows On-demand Inference and very little else so far; batch and reserved capacity may populate as usage appears, but don't assume they will. For anything below the model-by-inference-type grain, it's still CUR 2.0 and Athena, and still Bedrock invocation logging to CloudWatch for prompt-level work.

None of these are reasons not to use it. They're reasons to know what the dashboard is telling you.

---

## A correction to something I wrote in September

In the July price cuts piece, I said Claude Sonnet 5's promotional $2/$10 rate on Bedrock had expired on August 31 and reverted to $3/$15, and that teams were paying the higher price without knowing.

That was wrong. Anthropic cancelled the increase on August 10. The pricing docs carry a note that the scheduled September 1 rise will not occur, and $2/$10 is the standing rate, on the direct API and on Bedrock. Nobody running Sonnet 5 saw their rate go up on September 1.

I'm correcting it here rather than quietly editing the old post because the mistake is a useful one. I was tracking the announced schedule, not the current pricing page, and the schedule changed. Which is the exact failure mode that post was warning other people about. If I can get it wrong while writing about it, the team that chose a model six months ago and hasn't looked at the pricing page since has no chance. The fix isn't vigilance. It's a monthly line item on someone's calendar that says "re-read the Bedrock pricing page and diff it against last month."

---

## What Amsterdam said this feature is for

Tokenomicon ran in Amsterdam on September 22 and 23. Five hundred practitioners, sold out, the first event under the Tokenomics Foundation that the Linux Foundation formally established on August 4. I wrote in June that I'd be watching it for how mature AI FinOps actually is versus how mature the keynotes suggest. The State of Tokenomics survey, released at the closing keynote, gave a clearer answer than I expected.

472 responses across 11 industries. Asked for their biggest challenge, 43% said proving AI value or ROI. 27% said visibility and attribution of spend. 7% said cost or pricing complexity.

Read those three numbers against the October 8 launch. The product attributes directly address the 27%: they're the native, console-level version of "which model, which token type, which team" that practitioners have been building by hand. FOCUS 1.5, planned for later this year, is specced to add model ID, input/output/cached token distinction, and a PrincipalId to the open standard; AWS shipped the Cost Explorer equivalent of all three before the spec landed.

What it does nothing for is the 43%. A dashboard that shows Opus at $184,500 a month with no caching tells you the spend is inefficient. It tells you nothing about whether the feature running on Opus is worth $184,500 a month to the business. That's still the unsolved problem, and the survey had one more number on it: organisations with a clearly named owner for AI economics were almost four times more likely to connect AI spend to a measurable outcome. 12% had no owner at all.

That's the real takeaway from October. The visibility problem is being solved faster than I expected, by AWS natively, and it's now cheap enough to set up that there's no excuse for a team to be running blind on Bedrock. The value problem isn't a tooling problem and no What's New post is going to fix it. Someone has to own it.

---

## What to do this week

In order, because the first one is ninety seconds and might be the most expensive thing you find all quarter.

Open Cost Explorer, group by Product attribute: Model, no Service filter, this month. Note any model where cache read is zero and input is significant. Send that list to whoever owns those workloads with the pricing table above.

For each Sonnet, Opus, and Fable-class model, create a Budget filtered on Model with an alert at a number you've reasoned about from the last eight weeks. Add an IAM principal tag filter if your tagging sweep from April is in place.

Rebuild any dashboard widget or saved report that currently uses a Service filter to capture Bedrock. Switch it to the Model or Provider attribute. Check the Nova line is still in it after you do.

Put a recurring monthly entry on someone's calendar to re-read the Bedrock pricing page and compare it against the previous month. Thirty minutes. Catches cache read cuts, catches cancelled increases, catches the next 80% drop.

Find out who owns AI economics in your organisation. If the answer takes more than one sentence, that's the finding.

---

*Building Bedrock reporting on the new product attributes, or trying to work out who should own AI spend in your organisation? [Get in touch](/contact) — the cache check and the per-model budgets are a half-day of work, and the ownership question is usually the one that actually needs the conversation.*
