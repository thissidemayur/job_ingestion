import client from "prom-client";

const collectDefaultMetrics = client.collectDefaultMetrics;

const Registry = client.Registry;
const register = new Registry();

// default node metrics
collectDefaultMetrics({ register });

export const jobsFetchedTotal = new client.Counter({
  name: "job_ingestion_jobs_fetched_total",
  help: "Total number of job fetched and normalized from job source",
  registers: [register],
});

export const jobsEnqueuedTotal = new client.Counter({
  name: "job_ingestion_jobs_enqueued_total",
  help: "Total no of jobs successfully enqued into BullMq",
  registers: [register],
});

export const jobsProcessedTotal = new client.Counter({
  name: "job_ingestion_jobs_processed_total",
  help: "Total number of jobs successfully persisted",
  registers: [register],
});

export const jobsFailedTotal = new client.Counter({
  name: "job_ingestion_job_processed_total",
  help: "Total number of jobs successfully persisted",
  registers: [register],
});

export const jobsProcessingDuration = new client.Histogram({
  name: "job_ingestion_job_processing_duration_seconds",
  help: "Time spent processing a single ingestion job.",
  registers: [register],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
});

export { register };
