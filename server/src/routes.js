import ExampleRoutes from "./routes/exampleRoutes.js";

const PREFIX = "/api";

function initRoutes(app) {
  const exampleRoutes = new ExampleRoutes();

  app.use(`${PREFIX}/example`, exampleRoutes.getRouter());
}

export default initRoutes;
