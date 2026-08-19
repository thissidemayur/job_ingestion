import express from "express";
import routes from "./routes";
import { notFoundMiddleware } from "./middleware/notFound.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import { httpLogger } from "./config/httpLogger";
import { requestIdMiddleware } from "./middleware/requestId.middleware";
import helmet from "helmet";
import cors from "cors"
import { env } from "./config/env";
import compression from "compression";

const app = express();

app.use(requestIdMiddleware);
app.use(httpLogger);

app.use(helmet())

app.use(cors({
    origin: env.CLIENT_ORIGIN,
    credentials:true,
}))

app.use(compression())

app.use(express.json({
    limit:"1mb"
}));

app.use("/api/v1", routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
