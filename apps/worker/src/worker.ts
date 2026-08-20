import {ingestArbeitnowJobs} from "@job-ingestion/ingestion"
import { enqueueJob } from "./queue/job-producer.js";

async function run() {
    try {
        console.log("Starting Arbitnow ingestion...");

        const jobs = await ingestArbeitnowJobs();

        console.log(`Fetched and normalized: ${jobs.length} jobs`);


        for (const job of jobs) {
          await enqueueJob(job);
        }

        console.log(`Enqueued: ${jobs.length} jobs`);
    } catch (error) {
        console.error("Ingestion failed:");
        console.error(error);
        process.exitCode = 1;
    }
}

run()