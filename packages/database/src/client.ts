import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";
import { fileURLToPath } from "node:url";
import path from "node:path";

const currentFile = fileURLToPath(import.meta.url);
const databasePackageRoot = path.resolve(path.dirname(currentFile), "..");
const envPath = path.resolve(databasePackageRoot, "../../.env");
console.log("ENV PATH: ",envPath)
dotenv.config({
  path: envPath,
});

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

console.log("Database URL:", connectionString.replace(/:[^:@]+@/, ":****@"));

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

export { prisma };
