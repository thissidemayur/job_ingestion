import dotenv from "dotenv"
import { envSchema } from "./env.schema.js";


dotenv.config({});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(`Invalid enviornment variables`);
  console.error(parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsedEnv.data;

console.log(`REDIS_URL: ${env.REDIS_URL}`)