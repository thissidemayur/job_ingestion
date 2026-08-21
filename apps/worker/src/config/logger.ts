import pino from "pino";
import { env } from "./env.js";

export const logger = pino({
  name: "job_ingestion_worker",
  level: env.LOG_LEVEL,
  transport:
    env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
      : undefined,

    base:{
        service:"worker",
    },
    timestamp: pino.stdTimeFunctions.isoTime
});

