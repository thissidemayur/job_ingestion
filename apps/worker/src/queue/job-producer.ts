import {job_ingestion_queue} from "./job-queue.js"
import type { PersistJobPayload, CanonicalJob } from "@job-ingestion/shared";

function toPersistJobPayload(job: CanonicalJob): PersistJobPayload {
    return {
      source: job.source,
      externalId: job.externalId,

      title: job.title,
      company: job.company,

      location: job.location,
      description: job.description,
      url: job.url,

      publishedAt: job.publishedAt?.toISOString(),
      fetchedAt: job.fetchedAt.toISOString(),
    };
}

export async function enqueueJob(job: CanonicalJob) {
    const payload = toPersistJobPayload(job)

    const queuedJob = await job_ingestion_queue.add("persist_job", payload);
    console.log(`Queued job: ${queuedJob.id}`);
    return queuedJob;
}