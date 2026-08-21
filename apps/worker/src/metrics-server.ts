import http from "node:http";
import { register } from "./config/metrics.js";
import { logger } from "./config/logger.js";

const server = http.createServer(async (req, res) => {
  if (req.url === "/metrics" && req.method === "GET") {
    res.setHeader("Content-Type", register.contentType);
    res.end(await register.metrics());
    return;
  }

  res.statusCode = 404;
  res.end("Not found");
});

export function startMetricsServer(port = 9090) {
  server.listen(port, () => {
    logger.info({ port }, "Metrics Server running");
  });

  return server;
}
