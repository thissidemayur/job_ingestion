import { Worker } from "bullmq";
import type { PersistJobPayload } from "@job-ingestion/shared";
import { disconnectDatabase, upsertJob } from "@job-ingestion/database";
import { env } from "../config/env.js";

const redis = new URL(env.REDIS_URL);

export const jobConsumer = new Worker<PersistJobPayload>(
  "job-ingestion",
  async (job) => {
    console.log(`Processing job: ${job.id}`);

    const payload = job.data;

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

    console.log(`Completed job: ${job.id}`);
  },
  {
    connection: {
      host: redis.hostname,
      port: Number(redis.port),
    },
  },
);

jobConsumer.on("failed", (job, error) => {
  console.error(`Job ${job?.id ?? "unknown"} failed:`, error);
});

jobConsumer.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

let shuttingDown = false;
async function shutdown(signal: string) {
  if (shuttingDown) return;

  shuttingDown = true;

  console.log(`Recieved ${signal}. Starting gracefull shutdown...`);

  try {
    await jobConsumer.close();
    console.log("Job consumer closed.");

    await disconnectDatabase()
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