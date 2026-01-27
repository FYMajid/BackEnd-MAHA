import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/error";
import { logger } from "./middleware/logger";
import userController from "./app/user/controller";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(logger);
app.use(errorHandler);

app.use("/api/users", userController);

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
