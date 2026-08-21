import { ingestArbeitnowJobs } from "@job-ingestion/ingestion";
import { enqueueJob } from "./queue/job-producer.js";
import { jobConsumer } from "./queue/job-consumer.js";
import { logger } from "./config/logger.js";

async function run() {
  try {
    logger.info("Starting Arbitnow ingestion...");

    const jobs = await ingestArbeitnowJobs();

    logger.info(
      {
        jobCout: jobs.length,
      },
      "job fetched and normalized",
    );

    for (const job of jobs) {
      await enqueueJob(job);
    }

    logger.info(
      {
        jobCout: jobs.length,
      },
      "job enqued",
    );
  } catch (error) {
    logger.error({ err: error }, "Ingestion failed:");
    process.exitCode = 1;
  }
}

run();
