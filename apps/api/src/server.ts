import "dotenv/config";
import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";
import { logger } from "./config/logger";
import type { Server } from "node:http";

let server: Server | undefined;

const serverStart = async () => {
  try {
    await prisma.$connect();
    logger.info("Database connected successfully");
    server = app.listen(env.PORT, () => {
      logger.info(
        {
          service: env.SERVICE_NAME,
          port: env.PORT,
        },
        "HTTP server started",
      );
    });
  } catch (error) {
    logger.error(error, "Failed to start server");
    await prisma.$disconnect();
    process.exit(1);
  }
};

serverStart();

const gracefullShutDown = async(signal:string) => {
  logger.info({signal},"Gracefull shutdown started")
  
  if (!server) {
    await prisma.$disconnect();
    process.exit(0);

  }

  server.close(async()=>{
    logger.info("HTTP server closed")

    await prisma.$disconnect()
    logger.info("Database disconnected")

    process.exit(0)
  })
};


process.on("SIGINT", async () => gracefullShutDown("SIGINT"));
process.on("SIGTERM", async () => gracefullShutDown("SIGTERM"));
