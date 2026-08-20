import {Queue} from "bullmq"
import { env } from "../config/env.js"

const redis =new URL(env.REDIS_URL)

const job_ingestion_queue = new Queue("job-ingestion",{
    connection:{
        host:redis.hostname,
        port:Number(redis.port)
    }
})


export {job_ingestion_queue}