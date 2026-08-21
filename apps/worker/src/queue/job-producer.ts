import { logger } from "../config/logger.js";
import { jobsEnqueuedTotal } from "../config/metrics.js";
import { job_ingestion_queue } from "./job-queue.js";
import type { PersistJobPayload, CanonicalJob } from "@job-ingestion/shared";

const producerLogger = logger.child({
  operation: "enqueue_job",
});

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
  const payload = toPersistJobPayload(job);

  const queuedJob = await job_ingestion_queue.add("persist-job", payload, {
    attempts: 3, //job retry 3 times
    backoff: {
      // prevent immediate retry stroms
      type: "exponential",
      delay: 1000,
    },
  });
  producerLogger.debug(
    { jobId: queuedJob.id, source: job.source, externalId: job.externalId },
    "job queued",
  );
  jobsEnqueuedTotal.inc();

  return queuedJob;
}
