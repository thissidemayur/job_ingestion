import { ingestArbeitnowJobs } from "@job-ingestion/ingestion";
import { enqueueJob } from "./queue/job-producer.js";
import { logger } from "./config/logger.js";
import { jobsFetchedTotal } from "./config/metrics.js";

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

    jobsFetchedTotal.inc(jobs.length);

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
