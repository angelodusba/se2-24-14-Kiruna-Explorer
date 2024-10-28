import cors from "cors";
import express from "express";
import initRoutes from "./src/routes";
import dotenv from "dotenv";

const env = dotenv.config({ path: "../.env" });
if (env.error) {
  throw new Error("File `.env` not found. Please create it.");
}
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

const app: express.Application = express();
const port: number = 3001;

app.use(cors(corsOptions));

initRoutes(app);

if (!module.parent) {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

export { app };
