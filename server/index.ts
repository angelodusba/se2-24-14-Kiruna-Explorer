import dotenv from "dotenv";

const env =
  process.env.NODE_ENV === "dev"
    ? dotenv.config({ path: "../.env" })
    : dotenv.config({ path: "../.env.test" });
if (env.error) {
  throw new Error("File `.env` not found. Please create it.");
}
import cors from "cors";
import express from "express";
import initRoutes from "./src/routes";
import morgan from "morgan";
import * as db from "./src/db/db";

const app: express.Application = express();
const port: number = Number(process.env.EXPRESS_PORT) || 3001;

/* MIDDLEWARES */
const corsOptions = {
  origin: `http://localhost:5173`,
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(morgan("dev")); // Log requests to the console
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

/* INIT */
db.init(); // Test db connection on startup
initRoutes(app); // Setup routes

if (!module.parent) {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

export { app };
