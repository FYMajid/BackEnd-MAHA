import dotenv from "dotenv";
import express from "express";
import path from "path";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./middleware/error";
import { logger } from "./middleware/logger";
import routes from "./routes";
import { swaggerSpec } from "./lib/swagger";

export const app = express();

dotenv.config();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", routes);

app.use(errorHandler);
