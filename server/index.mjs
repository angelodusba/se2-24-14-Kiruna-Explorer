import express from "express";
import morgan from "morgan";
import cors from "cors";
import initRoutes from "./src/routes.js";
import { registerErrorHandler } from "./src/helpers.js";

/* INIT */
const app = express();
const port = 3001;

/* MIDDLEWARES */
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

/* ROUTES */
initRoutes(app);

/* ERROR HANDLER */
registerErrorHandler(app);

/* START SERVER */
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
