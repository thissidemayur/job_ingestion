import type { CanonicalJob } from "@job-ingestion/shared";
import {prisma} from "../client.js"

export async function upsertJob(job: CanonicalJob) {
    return prisma.job.upsert({
      where: {
        source_externalId: {
          source: job.source,
          externalId: job.externalId,
        },
      },

      create: {
        source: job.source,
        externalId: job.externalId,
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        url: job.url,
        publishedAt: job.publishedAt,
        fetchedAt: job.fetchedAt,
      },

      update: {
        title: job.title,
        company: job.company,
        location: job.location,
        description: job.description,
        url: job.url,
        publishedAt: job.publishedAt,
        fetchedAt: job.fetchedAt,
      },
    });
}