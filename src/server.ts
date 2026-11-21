import dotenv from "dotenv";
import "./types/express";
import "./lib/bigint";
import { app } from "./app";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
