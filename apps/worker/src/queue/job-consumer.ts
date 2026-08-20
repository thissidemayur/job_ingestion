import { Worker } from "bullmq";
import type { PersistJobPayload } from "@job-ingestion/shared";
import { upsertJob } from "@job-ingestion/database";
import { env } from "../config/env.js";


const redis = new URL(env.REDIS_URL)

export const jobConsumer = new Worker<PersistJobPayload>("job-ingestion",async(job)=>{
        console.log(`Processing job: ${job.id}`);

    const payload = job.data

    await upsertJob({
      source: payload.source,
      externalId: payload.externalId,

      title: payload.title,
      company: payload.company,

      location: payload.location,
      description: payload.description,
      url: payload.url,
      publishedAt: payload.publishedAt
        ? new Date(payload.publishedAt): undefined,

      fetchedAt: new Date(payload.fetchedAt),
    });

        console.log(`Completed job: ${job.id}`);

},{
    connection:{
        host:redis.hostname,
        port:Number(redis.port)
    }
});


jobConsumer.on("failed",(job,error)=>{
      console.error(`Job ${job?.id ?? "unknown"} failed:`, error);
})

jobConsumer.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});