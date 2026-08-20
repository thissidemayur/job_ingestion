import dotenv from "dotenv";
import { z } from "zod";
import { fileURLToPath } from "node:url";
import path from "node:path";
const currentFile = fileURLToPath(import.meta.url);

const workerRoot = path.resolve(path.dirname(currentFile), "../../../..");

const envPath = path.resolve(workerRoot, ".env");

dotenv.config({
  path: envPath,
});


console.log(`REDIS_URL: `,process.env.REDIS_URL);

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
  REDIS_URL: z.string(),
});
