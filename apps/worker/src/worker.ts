import {ingestArbeitnowJobs} from "@job-ingestion/ingestion"
import {upsertJob} from "@job-ingestion/database"

async function run() {
    console.log("Starting Arbitnow ingestion...")

    const jobs = await ingestArbeitnowJobs()
    console.log(`Fetched and normalized: ${jobs.length} jobs`)

    let created=0;
    let updated=0;

    for (const job of jobs) {
        await upsertJob(job)

    }
    console.log(`Persisted: ${jobs.length} jobs`)
}

run().catch((error)=>{
console.error("Ingestion failed:");
console.error(error);    
  process.exitCode = 1;

})