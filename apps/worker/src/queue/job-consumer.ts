import { Worker } from "bullmq";
import type { PersistJobPayload } from "@job-ingestion/shared";
import { disconnectDatabase, upsertJob } from "@job-ingestion/database";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import {
  jobsFailedTotal,
  jobsProcessedTotal,
  jobsProcessingDuration,
} from "../config/metrics.js";
import { startMetricsServer } from "../metrics-server.js";

const redis = new URL(env.REDIS_URL);
const consumerLogger = logger.child({
  opereation: "persistent_job",
});

export const jobConsumer = new Worker<PersistJobPayload>(
  "job-ingestion",
  async (job) => {
    const endTimer = jobsProcessingDuration.startTimer();

    consumerLogger.info(
      { jobId: job.id, attempts: job.attemptsMade + 1 },
      "Processing job",
    );

    const payload = job.data;

    try {
      await upsertJob({
        source: payload.source,
        externalId: payload.externalId,

        title: payload.title,
        company: payload.company,

        location: payload.location,
        description: payload.description,
        url: payload.url,
        publishedAt: payload.publishedAt
          ? new Date(payload.publishedAt)
          : undefined,

        fetchedAt: new Date(payload.fetchedAt),
      });

      consumerLogger.info(
        {
          jobId: job.id,
        },
        "Job Completed",
      );

      jobsProcessedTotal.inc();
    } catch (error) {
      jobsFailedTotal.inc();

      throw error;
    } finally {
      endTimer();
    }
  },
  {
    connection: {
      host: redis.hostname,
      port: Number(redis.port),
    },
  },
);

jobConsumer.on("failed", (job, error) => {
  consumerLogger.error(
    {
      jobId: job?.id,
      err: error,
    },
    "Job failed",
  );
});

jobConsumer.on("completed", (job) => {
  consumerLogger.info({ jobId: job.id }, "job completed");
});

// shutdown
let shuttingDown = false;
async function shutdown(signal: string) {
  if (shuttingDown) return;

  shuttingDown = true;

  console.log(`Recieved ${signal}. Starting gracefull shutdown...`);

  try {
    await jobConsumer.close();
    console.log("Job consumer closed.");

    await disconnectDatabase();
    console.log("Database connection closed.");

    console.log("Graceful shutdown completed.");
  } catch (error) {
    console.error(`Error during gracefull shutdown: `, error);
    process.exit(1);
  }
}

process.on("SIGNIT", () => {
  shutdown("SIGNIT");
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});

startMetricsServer(9090);
