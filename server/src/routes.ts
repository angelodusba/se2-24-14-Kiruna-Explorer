import express from "express";
import ErrorHandler from "./helper";
//import Authenticator from "./auth";
//import { UserRoutes, AuthRoutes } from "./routers/userRoutes";

const morgan = require("morgan");
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
  app.use(morgan("dev")); // Log requests to the console
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ limit: "25mb", extended: true }));

  /**
   * The authenticator object is used to authenticate users.
   * It is used to protect the routes by requiring users to be logged in.
   * All routes must have the authenticator object in order to work properly.
   */

  //const authenticator = new Authenticator(app);
  //const userRoutes = new UserRoutes(authenticator);
  //const authRoutes = new AuthRoutes(authenticator);

  /**
   * The routes for the user and authentication are defined here.
   */

  //app.use(`${prefix}/users`, userRoutes.getRouter());
  //app.use(`${prefix}/sessions`, authRoutes.getRouter());

  ErrorHandler.registerErrorHandler(app);
}

export default initRoutes;
