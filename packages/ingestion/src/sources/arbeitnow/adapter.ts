import type { CanonicalJob } from "@job-ingestion/shared";
import type { ArbeitnowJob } from "./schema.js";

// normalization process
export function toCanonicalJob(job: ArbeitnowJob): CanonicalJob {
  return {
    source: "arbeitnow",
    externalId: job.slug,

    title: job.title,
    company: job.company_name,

    location: job.location || undefined,
    description: job.description || undefined,
    url: job.url,

    publishedAt: new Date(job.created_at * 1000),
    fetchedAt: new Date(),
  };
}
