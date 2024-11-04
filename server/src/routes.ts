import express from "express";
import ErrorHandler from "./helper";
import Authenticator from "./routers/auth";
import { AuthRoutes, UserRoutes } from "./routers/userRoutes";
import DocumentRoutes from "./routers/documentRoutes";
import StakeholderRoutes from "./routers/stakeholderRoutes";
import TypeRoutes from "./routers/typeRoutes";
import ConnectionRoutes from "./routers/connectionRoutes";

const prefix = "/kirunaexplorer";

/**
 * Initializes the routes for the application.
 *
 * @remarks
 * This function sets up the routes for the application.
 * It defines the routes.
 *
 * @param {express.Application} app - The express application instance.
 */
function initRoutes(app: express.Application) {
  /**
   * The authenticator object is used to authenticate users.
   * It is used to protect the routes by requiring users to be logged in.
   * All routes must have the authenticator object in order to work properly.
   */
  const authenticator = new Authenticator(app);
  const userRoutes = new UserRoutes(authenticator);
  const authRoutes = new AuthRoutes(authenticator);
  const documentRoutes = new DocumentRoutes(authenticator);
  const stakeholderRoutes = new StakeholderRoutes(authenticator);
  const typeRoutes = new TypeRoutes(authenticator);
  const connectionRoutes = new ConnectionRoutes(authenticator);

  /**
   * The routes for the user and authentication are defined here.
   */
  app.use(`${prefix}/users`, userRoutes.getRouter());
  app.use(`${prefix}/sessions`, authRoutes.getRouter());
  app.use(`${prefix}/documents`, documentRoutes.getRouter());
  app.use(`${prefix}/stakeholders`, stakeholderRoutes.getRouter());
  app.use(`${prefix}/types`, typeRoutes.getRouter());
  app.use(`${prefix}/connections`, connectionRoutes.getRouter());

  // Register global error handler
  ErrorHandler.registerErrorHandler(app);
}

export default initRoutes;
