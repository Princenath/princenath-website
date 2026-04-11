---
title: "AWS Just Rewrote the Rules for S3. Here's What FinOps Teams Need to Check."
date: "2026-04-11"
excerpt: "S3 Files launched four days ago. S3 Vectors went GA at re:Invent. Object size limits jumped from 5TB to 50TB. Account-regional namespaces removed a naming constraint that has existed since 2006. AWS has made more changes to S3 in the past five months than in the previous five years. Some of these changes are technical. Several of them have direct cost implications your team may not have modelled yet."
tags: ["AWS", "S3", "S3 Files", "EFS", "FinOps", "Storage", "Cost Optimization", "S3 Vectors", "Cloud Storage"]
---

## S3 is no longer just object storage

For twenty years the mental model was simple. S3 is where you put things. EFS is where you mount things. The two did not overlap. That distinction shaped how architects made storage decisions, how teams split their budgets, and how FinOps practitioners reviewed storage line items.

That model broke on April 7, 2026.

AWS launched S3 Files, which lets you mount any S3 bucket as a native NFS file system on EC2, ECS, EKS, Lambda, and Fargate. No copying data to a separate service. No sync pipelines. No FUSE hacks. The same bucket your analytics jobs query with Athena can now be mounted like a local directory by your application servers.

This is the biggest single change to S3 since the service launched. And it arrived alongside four other updates — S3 Vectors, account-regional namespaces, 50TB object support, and Express One Zone price cuts — that together represent a fundamental shift in what S3 is and how much it costs to use it.

Here's what changed, what it costs, and where the FinOps opportunities are.

---

## The five changes, explained

### 1. S3 Files: Mount your bucket like a file system

The problem S3 Files solves is one most data engineering teams know well. You have a dataset in S3. Your analytics pipeline queries it through Athena. Your ML training jobs need to access it through a file system path. Your application servers need to write processed output back somewhere.

The traditional answer involved maintaining two storage systems: an S3 bucket for analytics and durability, and an EFS volume (or EBS snapshots, or FSx) for compute workloads that expected a file path. Data got copied between them. Sync pipelines kept things in (approximate) alignment. When they broke, engineers spent days debugging inconsistencies between what the database thought was there and what the file system showed.

S3 Files eliminates that architecture. The bucket is the source of truth. Applications mount it over NFS and work with standard file operations. The S3 API continues to work on the same objects simultaneously.

The technical architecture underneath is two-tier. S3 Files provisions a caching layer built on EFS infrastructure. Small files (below 128 KB by default) get loaded into this high-performance layer on first access and served from there at sub-millisecond latency for subsequent reads. Large files (1 MB and above) stream directly from S3, bypassing the cache entirely.

This is not just a gateway that translates file calls into S3 API requests, which is what FUSE-based tools like Mountpoint did. It is a proper managed file system with NFS v4.1+ support, full POSIX semantics, read-after-write consistency, and file locking. The distinction matters for applications that depend on these properties.

S3 Files is available today across 34 AWS regions.

### 2. S3 Vectors: Vector storage at S3 prices

At re:Invent 2025, AWS made S3 Vectors generally available. It lets you store and query vector embeddings directly in S3 buckets, supporting up to 2 billion vectors per index and 20 trillion vectors per bucket.

The cost comparison is stark. Dedicated vector databases like Pinecone and Weaviate have been the default choice for teams building RAG pipelines and semantic search. S3 Vectors reduces the cost of storing and querying vectors by up to 90% compared to those specialised services, according to AWS.

For FinOps practitioners, the question to ask is straightforward: if your team is running a vector database as a separate managed service, have you evaluated whether S3 Vectors handles your query patterns at acceptable latency? For many read-heavy retrieval workloads, the answer will be yes.

### 3. Account-regional namespaces: No more globally unique bucket names

Since S3 launched in 2006, every bucket name had to be globally unique across all AWS accounts worldwide. This created increasingly ridiculous naming conventions — `companyname-prod-analytics-eu-west-1-20231104-v2` — as teams worked around the constraint.

In March 2026, AWS introduced account-regional namespaces. Bucket names now only need to be unique within your account and region. Two different accounts can have a bucket both called `logs` in `us-east-1`.

Buckets in the new namespace follow a naming convention that ends in `-an` and includes your account ID and region code. Existing buckets are unaffected.

The FinOps relevance here is indirect but real. Consistent, predictable bucket naming across environments makes cost allocation tagging more reliable. Teams that previously embedded workarounds into bucket names to avoid collisions can now standardise naming conventions in line with their tagging taxonomy.

### 4. 50TB object size support

AWS raised the maximum individual object size in S3 from 5TB to 50TB. This is specifically designed for foundation model training datasets, where a single training corpus can exceed 5TB as a single file.

For most FinOps work this is informational — it expands what S3 can hold, it doesn't change pricing per GB. The implication worth noting is that teams building large-scale ML infrastructure now have one fewer reason to route data through other storage tiers or split datasets artificially.

### 5. S3 Express One Zone price cuts

AWS reduced storage pricing for S3 Express One Zone by 31% and GET request costs by 85% in 2025. Express One Zone is S3's single-AZ, high-performance tier delivering single-digit millisecond latency — faster than standard S3, designed for latency-sensitive ML training and analytics workloads.

The price cuts make Express One Zone worth re-evaluating for teams that looked at it when it launched and decided it was too expensive. At the new pricing, the gap between Express One Zone and other high-performance storage options has narrowed considerably.

---

## The FinOps question: What does S3 Files actually cost?

S3 Files has a pricing structure that takes some working through. Understanding it properly is the difference between using it correctly and getting a bill that surprises you.

There are three cost layers:

**Layer 1 — Standard S3 storage (unchanged).** Your bucket stores data at normal S3 rates regardless of whether S3 Files is enabled. A 1TB bucket at S3 Standard costs $23.55/month whether it has a mount target or not. Nothing changes here.

**Layer 2 — High-performance cache storage.** This is the new cost. When you access files through the NFS mount, S3 Files caches that data on a high-performance storage layer built on EFS infrastructure. The rate is $0.30/GB-month — the same as EFS Performance-optimized Standard pricing, because it is literally EFS infrastructure underneath. You only pay this on the data actively in the cache, not your total bucket size.

**Layer 3 — Data access charges.** Reads from the cache cost $0.03/GB. Writes cost $0.06/GB. Large reads (1MB and above) that stream directly from S3 bypass the cache entirely and incur only standard S3 GET request costs, not S3 Files access charges.

The key insight is that S3 Files charges you EFS rates on your hot working set and S3 rates on everything else. If you have a 10TB bucket but only actively work with 200GB of small files at a time, you pay EFS prices on 200GB and S3 prices on 9.8TB.

EFS, by contrast, charges you for every byte stored whether you touched it this month or not.

---

## S3 Files vs EFS: where the numbers land

Here is a concrete comparison for a common FinOps scenario: a data engineering team with a 5TB dataset where roughly 300GB is the active working set at any given time.

**With EFS Standard:**
- 5TB storage at $0.30/GB: $1,530/month
- Plus read/write access charges on top

**With S3 Files:**
- 5TB in S3 Standard at $0.023/GB: $117.76/month
- 300GB active cache at $0.30/GB: $90/month
- Access charges on the 300GB working set
- Total base: roughly $208/month before access charges

That is a rough 7x cost difference on storage alone before you factor in access patterns. The gap widens further if you use S3 Intelligent-Tiering for the cold portion of the bucket — data untouched for 90 days drops to around $0.0125/GB, which means the 4.7TB of cold data costs about $59/month instead of $108.

The scenario where EFS still wins is when your entire dataset is hot. If all 5TB is being actively read and written constantly, the cache would need to hold all of it, which eliminates the cost advantage. But most real datasets don't look like that. There are hot files and cold files, and the ratio matters enormously for S3 Files cost efficiency.

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 16px 0;">Storage Cost Comparison — 5TB Dataset, 300GB Active Working Set (us-east-1)</p>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0;border:1px solid #E8E8E5;border-radius:8px;overflow:hidden;">
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;">
      <p style="font-size:11px;color:#9B9B96;margin:0 0 4px 0;font-family:monospace;">SERVICE</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;">
      <p style="font-size:11px;color:#9B9B96;margin:0 0 4px 0;font-family:monospace;">MONTHLY STORAGE COST</p>
    </div>
    <div style="padding:12px 16px;background:#fff;">
      <p style="font-size:11px;color:#9B9B96;margin:0 0 4px 0;font-family:monospace;">NOTES</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">EFS Standard</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">~$1,530/month</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#9B9B96;margin:0;">Charges on all 5TB regardless of access</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">S3 Files (S3 Standard base)</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;font-weight:600;margin:0;">~$208/month</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#9B9B96;margin:0;">Cache charges on 300GB only; remainder at S3 rates</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">S3 Files (Intelligent-Tiering base)</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;font-weight:600;margin:0;">~$149/month</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#9B9B96;margin:0;">Cold 4.7TB drops to ~$0.0125/GB after 90 days idle</p>
    </div>
  </div>
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;margin:12px 0 0 0;">Estimates based on us-east-1 pricing April 2026. Access charges excluded. Verify current rates at aws.amazon.com/s3/pricing</p>
</div>

---

## Where S3 Files doesn't help

S3 Files is not the right answer for every workload. Being clear about this matters for FinOps recommendations.

**Pure database workloads** still need EBS. If you're running PostgreSQL or MySQL, you need block storage with consistent low-latency I/O. S3 Files is not a database storage layer.

**Entirely hot datasets** where all data is actively accessed simultaneously. If your 5TB of data is constantly being read in full, the cache needs to hold all of it and you lose the cost advantage over EFS.

**Workloads that only need the S3 API.** If your pipeline is already working cleanly through the S3 API — Athena, Glue, SageMaker — there is no reason to add S3 Files. It adds cost without benefit for pure object storage access patterns.

The ideal profile for S3 Files is a large dataset with a small active working set, accessed by both file-system-oriented compute and object-storage-oriented analytics. That description fits a large share of data engineering workloads.

---

## What FinOps teams should audit now

These changes create concrete review opportunities that are worth adding to your next storage optimisation sprint.

**Check for teams running parallel EFS and S3 for the same data.** The most common pattern this replaces is a team that maintains both an EFS volume for their compute workloads and an S3 bucket for analytics and backup. That two-system architecture now has a one-system alternative. Look in Cost Explorer for accounts showing both EFS and S3 spend in the same cost centre or application tag — those are your candidates.

**Re-evaluate any provisioned EFS throughput.** Teams that provisioned throughput because their burst baseline wasn't enough were paying a significant premium. EFS now has an Elastic throughput mode that scales automatically without provisioning. Check for `ProvisedThroughputInMibps` charges in your EFS line items. If the workload is bursty rather than sustained, Elastic mode will be cheaper.

**Look at your vector database spend.** If your team is paying for Pinecone, Weaviate, Zilliz or similar services, S3 Vectors is worth evaluating. The 90% cost reduction claim is for storage and query costs. The tradeoff is query latency versus dedicated vector databases — S3 Vectors targets the bulk of retrieval use cases, not the highest-performance real-time search.

**Audit S3 Express One Zone at the new pricing.** The 85% reduction in GET request costs changes the break-even point for latency-sensitive workloads. If your team evaluated Express One Zone when it launched and passed, the new pricing warrants a second look for ML training pipelines and high-frequency analytics.

**Tag your S3 Files file systems from day one.** S3 Files is a new service that will start appearing in bills shortly as teams adopt it. If tagging governance isn't in place before teams start creating file systems, you'll be chasing unallocated S3 Files spend six months from now. Add S3 Files to your required-tags Config rule scope now.

---

## The bigger picture

The five changes above are not isolated product updates. They follow a consistent direction: AWS is positioning S3 as the single storage layer for the enterprise data stack, capable of handling object access, file system access, vector search, and analytics in one place.

The FinOps implication is that the storage architecture review questions are changing. The old question was "which storage service should I use for this workload?" The new question is increasingly "do I need a separate storage service at all, or can this run on S3 with the right access layer on top?"

That shift has real budget implications. EFS at $0.30/GB-month against S3 at $0.023/GB-month is a 13x cost difference on the storage tier alone. For teams that can move to S3 Files for workloads currently on EFS, the savings compounds with scale.

None of this means EFS is obsolete. Workloads that need pure NFS semantics with no S3 integration, consistent low-latency access across a fully hot dataset, or specific compliance requirements around file storage will still land on EFS. But the number of workloads that need those specific properties is smaller than the number currently paying EFS rates.

The storage audit questions worth asking today are the same ones that surface the most saving in FinOps work generally: are we using the right tool for the actual access pattern, or did we make a decision two years ago that hasn't been revisited?

---

*Reviewing your AWS storage architecture and not sure where to start? [Get in touch](/contact) — the cost difference between EFS and S3 Files adds up quickly at scale, and the access pattern analysis is usually faster than teams expect.*
