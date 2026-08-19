import {z} from "zod"


export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.coerce.number().int().min(1).max(65535),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
  SERVICE_NAME: z.string().min(1),
  CLIENT_ORIGIN: z.url(),
});