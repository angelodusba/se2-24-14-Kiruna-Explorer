import cors from "cors";
import express from "express";
import initRoutes from "./src/routes";
import dotenv from "dotenv";

const env = dotenv.config({ path: "../.env" });
if (env.error) {
  throw new Error("File `.env` not found. Please create it.");
}

import * as db from "./src/db/db"; // It must be imported after initializing the env configuration

const app: express.Application = express();
const port: number = 3001;

const corsOptions = {
  origin: `http://localhost:${port}`,
  credentials: true,
};
app.use(cors(corsOptions));
db.init(); // Test db connection on startup
initRoutes(app);

if (!module.parent) {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

export { app };
