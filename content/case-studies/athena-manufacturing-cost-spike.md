---
title: "The $47,000 Athena Bill: How a Real-Time Manufacturing Dashboard Was Quietly Bankrupting Its Own Pipeline"
date: "2026-02-18"
excerpt: "A manufacturing company's Athena costs exploded to nearly 10x their baseline in a single billing cycle. Their data team was doing everything right — real-time streaming, live dashboards, instant insights from the factory floor. They just had no idea what it was costing them to do it."
industry: "Manufacturing / Industrial"
outcome: "89% reduction in Athena costs — from $47,000 to ~$5,200/month"
tags: ["AWS", "Athena", "Kinesis", "S3", "QuickSight", "Parquet", "FinOps", "Data Engineering"]
---

## Background

The client runs a large-scale manufacturing operation — multiple plants, hundreds of sensors, thousands of data points flowing off the factory floor every minute. Equipment telemetry, production line throughput, defect rates, temperature readings, cycle times. The kind of data that, if you can actually query it in real time, gives operations managers a meaningful edge.

Their data engineering team had built exactly that. Kinesis Data Streams was ingesting the raw sensor feed. Firehose was landing it in S3 as JSON. Athena was sitting on top of that S3 data, and QuickSight dashboards were querying Athena to give plant managers live visibility into what was happening on the floor. The dashboards were set to the fastest available refresh rate — as close to real time as QuickSight supports.

It was genuinely impressive work. The kind of architecture that gets presented at re:Invent.

It was also generating an Athena bill that had gone from approximately **$4,800/month** at baseline to just under **$47,000** in a single cycle — a spike the finance team flagged with the kind of urgency usually reserved for production outages.

Nobody on the data team had seen it coming. From their perspective, the pipeline was working perfectly.

---

## The Problem

### What $47,000 of Athena Looks Like in Practice

Athena charges $5 per terabyte of data scanned. That's the entire pricing model — you don't pay for compute time, you don't pay per query, you pay for how much data each query touches in S3. It's an elegantly simple pricing structure that becomes an extremely expensive one if your queries are scanning more data than they need to.

When the Athena bill hit $47,000, that implied roughly **9.4 terabytes of data scanned** in a single month. Against a raw data volume that the team estimated at around 800GB for the same period. Something was scanning far more than the actual data size — and doing it repeatedly.

The QuickSight dashboard refresh rate was the first thing to look at. Set to one-minute intervals, the dashboards were triggering Athena queries **every 60 seconds, around the clock, seven days a week**. That's approximately 43,800 query executions per month, per dashboard. They had six dashboards running.

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 16px 0;">Query Volume — Monthly Estimate at 1-Minute Refresh</p>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:0;border:1px solid #E8E8E5;border-radius:8px;overflow:hidden;">
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;">
      <p style="font-size:11px;color:#9B9B96;margin:0 0 4px 0;font-family:monospace;">DASHBOARD</p>
      <p style="font-size:12px;font-weight:600;color:#0A0A0A;margin:0;">Name</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;">
      <p style="font-size:11px;color:#9B9B96;margin:0 0 4px 0;font-family:monospace;">QUERIES/MONTH</p>
      <p style="font-size:12px;font-weight:600;color:#0A0A0A;margin:0;">Executions</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;">
      <p style="font-size:11px;color:#9B9B96;margin:0 0 4px 0;font-family:monospace;">AVG SCAN/QUERY</p>
      <p style="font-size:12px;font-weight:600;color:#0A0A0A;margin:0;">Data Touched</p>
    </div>
    <div style="padding:12px 16px;background:#fff;">
      <p style="font-size:11px;color:#9B9B96;margin:0 0 4px 0;font-family:monospace;">MONTHLY COST</p>
      <p style="font-size:12px;font-weight:600;color:#C8873A;margin:0;">Athena Charges</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">Production Line</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">43,800</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">~380 MB</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">~$8,100</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">Defect Tracking</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">43,800</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">~410 MB</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">~$8,800</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">Equipment Health</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">43,800</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">~350 MB</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">~$7,500</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">Energy & Utilities</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">43,800</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">~460 MB</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">~$9,800</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">Throughput Summary</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">43,800</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">~290 MB</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">~$6,200</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">Shift Overview</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#0A0A0A;margin:0;">43,800</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">~310 MB</p>
    </div>
    <div style="padding:12px 16px;background:#fff;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;color:#C8873A;font-weight:600;margin:0;">~$6,600</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;font-weight:700;color:#0A0A0A;margin:0;">Total (6 dashboards)</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;font-weight:700;color:#0A0A0A;margin:0;">262,800</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-right:1px solid #E8E8E5;border-top:1px solid #E8E8E5;">
      <p style="font-size:12px;font-weight:700;color:#C8873A;margin:0;">~9.4 TB total</p>
    </div>
    <div style="padding:12px 16px;background:#FAFAF9;border-top:1px solid #E8E8E5;">
      <p style="font-size:13px;font-weight:700;color:#C8873A;margin:0;">~$47,000</p>
    </div>
  </div>
  <p style="font-size:11px;color:#9B9B96;margin:12px 0 0 0;font-family:monospace;">* Figures anonymized. Per-query scan sizes derived from Athena query execution logs.</p>
</div>

The query volume alone wasn't the issue — 43,800 queries per month is large but not unreasonable for a production analytics system. The issue was what each query was scanning.

### Two Compounding Problems

Every query was scanning hundreds of megabytes when it should have been scanning a fraction of that. Two architectural decisions, made innocently at build time, were responsible.

**Problem 1: Raw JSON/CSV landing directly in S3, no format conversion.**

Kinesis Firehose was delivering raw data off the sensor feed directly into S3 — uncompressed JSON files, exactly as they arrived from the factory floor. JSON is a row-oriented format. When Athena queries a JSON file, it has to read the entire file to find the columns it needs, even if the query only touches two or three fields out of fifty. For a dashboard query like `SELECT machine_id, throughput_rate, timestamp FROM sensor_data WHERE plant = 'Plant_A'`, Athena was reading every single field on every single record — temperature, pressure, humidity, error codes, calibration offsets, all of it — just to return three columns.

Columnar formats like Apache Parquet work the opposite way: Athena reads only the columns referenced in the query. The difference in data scanned between JSON and Parquet for a typical dashboard query is not marginal — it's often 85–95% less data touched.

**Problem 2: No partitioning on the S3 data.**

The Firehose delivery was landing files in a flat S3 prefix structure — essentially a single bucket of time-stamped files with no logical organisation by plant, date, machine type, or any other query-relevant dimension. Every Athena query had to scan the entire dataset to find the records it needed.

The sensor data at this point was accumulating at roughly 800GB per month — twelve months of history meant the Athena table was backed by approximately **9.6TB of raw data**. A dashboard query asking for the last hour of production line data was scanning all 9.6TB to find the ~200MB of relevant records.

<div style="margin:28px 0;padding:20px 24px;border-left:3px solid #C8873A;background:#FAFAF9;border-radius:0 8px 8px 0;">
  <p style="font-size:11px;font-family:monospace;color:#C8873A;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px 0;">Why It Took a Year to Surface</p>
  <p style="font-size:14px;color:#0A0A0A;line-height:1.6;margin:0;">The architecture had been running for about a year at manageable — if wasteful — cost levels. The bill spiked when the data team added three new dashboards in the same month and expanded historical coverage from 6 months to 12. That doubled both the query volume and the per-query scan size simultaneously. A slow burn became a fire.</p>
</div>

### The Question the Data Team Actually Asked

When we presented the diagnosis, the data team's immediate response was reasonable and technically sharp: *"Fine, we understand Parquet and partitioning. But our data is coming in off a live sensor feed via Kinesis. We can't stop the stream to convert it. How do you convert data that's arriving in real time?"*

This is the question worth answering in detail, because it's the one most teams get stuck on.

---

## Analysis

Before designing the solution, we needed to understand the data shape and query patterns precisely. Optimising an Athena pipeline without knowing how it gets queried is like buying the right answer to the wrong question.

We pulled 30 days of Athena query execution logs and analysed every query the dashboards were running:

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 16px 0;">Query Pattern Analysis — 30-Day Sample</p>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <div style="background:#fff;border:1px solid #E8E8E5;border-radius:8px;padding:16px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
        <p style="font-size:13px;font-weight:600;color:#0A0A0A;margin:0;">Filter dimension used in WHERE clause</p>
        <span style="font-size:11px;font-family:monospace;color:#C8873A;background:#F4F4F2;padding:2px 8px;border-radius:4px;">96% of queries</span>
      </div>
      <p style="font-size:12px;color:#9B9B96;margin:0;line-height:1.5;">Nearly every query filtered by <code style="font-size:11px;background:#F4F4F2;padding:1px 4px;border-radius:3px;">plant_id</code>, <code style="font-size:11px;background:#F4F4F2;padding:1px 4px;border-radius:3px;">line_id</code>, or both. These were the obvious partition candidates.</p>
    </div>
    <div style="background:#fff;border:1px solid #E8E8E5;border-radius:8px;padding:16px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
        <p style="font-size:13px;font-weight:600;color:#0A0A0A;margin:0;">Time window of data requested</p>
        <span style="font-size:11px;font-family:monospace;color:#C8873A;background:#F4F4F2;padding:2px 8px;border-radius:4px;">Last 1–24 hours</span>
      </div>
      <p style="font-size:12px;color:#9B9B96;margin:0;line-height:1.5;">No dashboard query looked back more than 24 hours. All 9.6TB of historical data was being scanned every minute for queries that only needed the last few hours.</p>
    </div>
    <div style="background:#fff;border:1px solid #E8E8E5;border-radius:8px;padding:16px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
        <p style="font-size:13px;font-weight:600;color:#0A0A0A;margin:0;">Columns actually used per query</p>
        <span style="font-size:11px;font-family:monospace;color:#C8873A;background:#F4F4F2;padding:2px 8px;border-radius:4px;">Avg 4.2 of 52 fields</span>
      </div>
      <p style="font-size:12px;color:#9B9B96;margin:0;line-height:1.5;">The raw JSON schema had 52 fields. Dashboard queries used an average of 4. In JSON format, Athena was scanning all 52 every time. Parquet would reduce that to exactly 4.</p>
    </div>
  </div>
</div>

The numbers made the solution obvious. Partition by `plant_id`, `line_id`, and date. Convert to Parquet. The live-streaming constraint was the only real engineering challenge.

---

## Solution

### Answering the Real-Time Question

The data team's concern — *how do you convert a live stream to Parquet?* — has a clean answer that lives inside the existing Kinesis architecture. No new services required, no pipeline rebuilds, no batch jobs running overnight.

**Amazon Kinesis Data Firehose has native Parquet conversion and dynamic partitioning built in.**

This is a feature that many teams don't know exists because Firehose is usually introduced as a delivery mechanism — a pipe that moves data from a stream to S3. It's actually much more than that. Firehose can transform the format of every record in flight, converting JSON to Parquet before the file ever lands in S3. It can also dynamically partition the output based on fields within the data itself — routing records to S3 prefixes like `plant_id=Plant_A/line_id=Line_03/date=2025-01-15/` as they stream through.

The result: every file that lands in S3 is already Parquet, already partitioned. Athena doesn't need to scan anything it doesn't need to.

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 20px 0;">Architecture — Before vs After</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
    <div style="background:#fff;border:1px solid #E8E8E5;border-radius:8px;padding:16px;">
      <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 14px 0;">Before</p>
      <div style="display:flex;flex-direction:column;gap:2px;">
        <div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:6px;padding:10px 12px;">
          <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">Factory Sensors</p>
        </div>
        <div style="text-align:center;color:#9B9B96;font-size:11px;padding:2px 0;">↓</div>
        <div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:6px;padding:10px 12px;">
          <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">Kinesis Data Streams</p>
        </div>
        <div style="text-align:center;color:#9B9B96;font-size:11px;padding:2px 0;">↓</div>
        <div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:6px;padding:10px 12px;">
          <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">Firehose → S3 (raw JSON, flat prefix)</p>
          <p style="font-size:10px;color:#C8873A;margin:2px 0 0 0;font-family:monospace;">No format conversion. No partitioning.</p>
        </div>
        <div style="text-align:center;color:#9B9B96;font-size:11px;padding:2px 0;">↓</div>
        <div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:6px;padding:10px 12px;">
          <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">Athena (full table scan every query)</p>
          <p style="font-size:10px;color:#C8873A;margin:2px 0 0 0;font-family:monospace;">Scans ~9.6 TB per query.</p>
        </div>
        <div style="text-align:center;color:#9B9B96;font-size:11px;padding:2px 0;">↓</div>
        <div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:6px;padding:10px 12px;">
          <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">QuickSight (1-min refresh)</p>
        </div>
      </div>
    </div>
    <div style="background:#fff;border:1px solid #C8873A;border-radius:8px;padding:16px;">
      <p style="font-size:11px;font-family:monospace;color:#C8873A;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 14px 0;">After</p>
      <div style="display:flex;flex-direction:column;gap:2px;">
        <div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:6px;padding:10px 12px;">
          <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">Factory Sensors</p>
        </div>
        <div style="text-align:center;color:#9B9B96;font-size:11px;padding:2px 0;">↓</div>
        <div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:6px;padding:10px 12px;">
          <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">Kinesis Data Streams</p>
        </div>
        <div style="text-align:center;color:#9B9B96;font-size:11px;padding:2px 0;">↓</div>
        <div style="background:#fff0e0;border:1px solid #C8873A;border-radius:6px;padding:10px 12px;">
          <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:600;">Firehose → S3 (Parquet + Dynamic Partitioning)</p>
          <p style="font-size:10px;color:#C8873A;margin:2px 0 0 0;font-family:monospace;">In-flight conversion. plant_id / line_id / date prefixes.</p>
        </div>
        <div style="text-align:center;color:#9B9B96;font-size:11px;padding:2px 0;">↓</div>
        <div style="background:#fff0e0;border:1px solid #C8873A;border-radius:6px;padding:10px 12px;">
          <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:600;">Athena (partition + column pruning)</p>
          <p style="font-size:10px;color:#C8873A;margin:2px 0 0 0;font-family:monospace;">Scans ~18 MB per query. 99.8% reduction.</p>
        </div>
        <div style="text-align:center;color:#9B9B96;font-size:11px;padding:2px 0;">↓</div>
        <div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:6px;padding:10px 12px;">
          <p style="font-size:12px;color:#0A0A0A;margin:0;font-weight:500;">QuickSight (1-min refresh — unchanged)</p>
        </div>
      </div>
    </div>
  </div>
</div>

### Implementation

The changes broke down into three parts.

**Part 1: Define the schema in AWS Glue Data Catalog**

Firehose's Parquet conversion needs to know the schema upfront — it can't infer it from the JSON on the fly. We created a Glue table with the sensor data schema, with `plant_id`, `line_id`, and `event_date` defined as partition keys.

```sql
CREATE EXTERNAL TABLE sensor_data_parquet (
  machine_id      STRING,
  timestamp_utc   TIMESTAMP,
  throughput_rate DOUBLE,
  defect_count    INT,
  cycle_time_ms   INT,
  temperature_c   DOUBLE,
  pressure_bar    DOUBLE,
  power_kw        DOUBLE
  -- remaining fields...
)
PARTITIONED BY (
  plant_id    STRING,
  line_id     STRING,
  event_date  DATE
)
STORED AS PARQUET
LOCATION 's3://manufacturing-analytics/sensor-data-parquet/'
TBLPROPERTIES ('parquet.compression'='SNAPPY');
```

**Part 2: Reconfigure the Firehose delivery stream**

In the existing Firehose delivery stream configuration, we made two changes:

- **Record format conversion**: Enabled, output format set to Apache Parquet, Glue table reference pointed to the schema above
- **Dynamic partitioning**: Enabled, with S3 prefix configured to extract `plant_id`, `line_id`, and date from the incoming JSON records using JQ expressions

```
S3 prefix: sensor-data-parquet/plant_id=!{partitionKeyFromQuery:plant_id}/line_id=!{partitionKeyFromQuery:line_id}/event_date=!{timestamp:yyyy-MM-dd}/
```

Buffer configuration set to 64MB or 300 seconds (whichever comes first) — large enough to produce reasonably sized Parquet files rather than thousands of tiny ones, which is its own Athena performance problem.

**Part 3: Rewrite historical data**

The existing 9.6TB of raw JSON needed to be converted. We ran a one-time AWS Glue ETL job that read the raw JSON from S3, converted it to Parquet with SNAPPY compression, and wrote it to the new partitioned prefix structure. The Glue job ran over a weekend — approximately 14 hours for the full historical dataset.

Once the historical backfill was complete, the old raw JSON prefix was archived to S3 Glacier Instant Retrieval (retained for compliance, accessed essentially never).

**Part 4: Update Athena queries with partition filters**

The existing Athena queries didn't include `WHERE plant_id = ...` or `WHERE event_date >= ...` clauses — they didn't need to, because the data wasn't partitioned. Adding those filters was a 10-minute job but the single most important change for query cost. Athena's partition pruning only works if the query actually specifies the partition key.

```sql
-- Before: scans entire table
SELECT machine_id, throughput_rate, timestamp_utc
FROM sensor_data
WHERE line_id = 'Line_03'
ORDER BY timestamp_utc DESC
LIMIT 1000;

-- After: scans only matching partition (~18 MB vs ~9.6 TB)
SELECT machine_id, throughput_rate, timestamp_utc
FROM sensor_data_parquet
WHERE plant_id = 'Plant_A'
  AND line_id = 'Line_03'
  AND event_date >= DATE_ADD('day', -1, CURRENT_DATE)
ORDER BY timestamp_utc DESC
LIMIT 1000;
```

---

## Outcome

<div style="background:#F4F4F2;border:1px solid #E8E8E5;border-radius:12px;padding:24px;margin:28px 0;">
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px;background:#E8E8E5;border-radius:8px;overflow:hidden;">
    <div style="background:#fff;padding:20px;text-align:center;">
      <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px 0;">Data Scanned / Query</p>
      <p style="font-size:11px;color:#9B9B96;margin:0 0 4px 0;text-decoration:line-through;">~380 MB avg</p>
      <p style="font-size:26px;font-weight:700;color:#0A0A0A;margin:0;font-family:'Playfair Display',Georgia,serif;">~18 MB</p>
      <p style="font-size:11px;color:#C8873A;margin:4px 0 0 0;font-family:monospace;">95% reduction</p>
    </div>
    <div style="background:#fff;padding:20px;text-align:center;">
      <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px 0;">Monthly Athena Cost</p>
      <p style="font-size:11px;color:#9B9B96;margin:0 0 4px 0;text-decoration:line-through;">$47,000</p>
      <p style="font-size:26px;font-weight:700;color:#C8873A;margin:0;font-family:'Playfair Display',Georgia,serif;">~$5,200</p>
      <p style="font-size:11px;color:#9B9B96;margin:4px 0 0 0;font-family:monospace;">89% reduction</p>
    </div>
    <div style="background:#fff;padding:20px;text-align:center;">
      <p style="font-size:11px;font-family:monospace;color:#9B9B96;text-transform:uppercase;letter-spacing:0.06em;margin:0 0 8px 0;">Annual Saving</p>
      <p style="font-size:26px;font-weight:700;color:#0A0A0A;margin:0;font-family:'Playfair Display',Georgia,serif;">$501,600</p>
      <p style="font-size:11px;color:#9B9B96;margin:4px 0 0 0;font-family:monospace;">at current query volume</p>
    </div>
  </div>
</div>

The dashboard refresh rate stayed at one minute. The operations managers kept their real-time visibility. The data team didn't have to change their tooling, their workflow, or anything about how they build and publish dashboards. The only thing that changed was what happened inside the pipeline between Kinesis and S3 — and how the Athena queries specified their filters.

Beyond the direct cost reduction, query execution time dropped from an average of 14 seconds per query to under 2 seconds. The dashboards were faster, not just cheaper.

---

## Lessons Learned

**1. Athena's pricing model punishes the path of least resistance.** Landing raw JSON directly in S3 and querying it with Athena is the easiest way to get a pipeline working. It's also one of the most expensive ways to run it at scale. The effort to add Parquet conversion and partitioning at build time is small — the cost of retrofitting it after the bill has already exploded is much larger.

**2. Kinesis Firehose is not just a pipe.** Most teams use Firehose as a delivery mechanism and nothing more. The native Parquet conversion and dynamic partitioning features eliminate the most common reason teams build separate ETL layers between their stream and their analytics queries. If your architecture has a Glue or Lambda job converting raw S3 files to a better format, that step can probably live inside Firehose instead.

**3. The real-time constraint doesn't prevent format conversion — it just changes where it happens.** The data team's instinct was to treat "live data" and "Parquet" as incompatible requirements. They're not. Firehose converts in-flight, and the conversion adds latency measured in milliseconds, not minutes. The data still lands in S3 within the configured buffer window (in this case, within 5 minutes at most). For a dashboard refreshing every minute, that latency is irrelevant.

**4. Partition keys should be chosen based on query patterns, not data structure.** The temptation is to partition by whatever fields seem natural in the data — in this case, that might have been `machine_id` or `sensor_type`. The right answer was `plant_id` and `line_id` because those were what 96% of queries actually filtered on. Partitioning by a key that doesn't appear in WHERE clauses does nothing.

**5. Query costs compound with dashboard refresh rates.** A single poorly-optimised query running once is a nuisance. The same query running every minute, across six dashboards, 24 hours a day, is a $47,000 monthly bill. Before setting any dashboard to its maximum refresh rate, it's worth calculating the implied monthly query cost and confirming the architecture can support it efficiently.

---

*Running Athena on top of a streaming data pipeline and not sure whether your query costs are where they should be? [Get in touch](/contact) — this is usually a faster audit than teams expect.*
