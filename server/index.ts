import cors from "cors";
import express from "express";
import initRoutes from "./src/routes";
import dotenv from "dotenv";
import morgan from "morgan";

const env = dotenv.config({ path: "../.env" });
if (env.error) {
  throw new Error("File `.env` not found. Please create it.");
}
import * as db from "./src/db/db"; // It must be imported after initializing the env configuration

const app: express.Application = express();
const port: number = Number(process.env.EXPRESS_PORT) || 3001;

/* MIDDLEWARES */
const corsOptions = {
  origin: `http://localhost:${port}`,
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
