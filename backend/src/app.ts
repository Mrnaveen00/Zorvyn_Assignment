import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import swaggerUi from "swagger-ui-express";

const YAML = require("yamljs");

import { errorMiddleware } from "./middleware/error.middleware";
import { notFoundMiddleware } from "./middleware/not-found.middleware";
import { apiRouter } from "./routes";

export const app = express();
const swaggerDocument = YAML.load(path.join(process.cwd(), "docs", "openapi.yaml"));

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/docs", (_req, res) => {
  res.redirect("/api/docs/");
});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", apiRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
