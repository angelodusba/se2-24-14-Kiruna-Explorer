import express, { Router } from "express";
import TypeController from "../controllers/typeController";
import Type from "../models/type";
import { body } from "express-validator";
import ErrorHandler from "../helper";
import Authenticator from "./auth";

class TypeRoutes {
  private router: Router;
  private controller: TypeController;
  private authService: Authenticator;
  private errorHandler: ErrorHandler;

  constructor(authenticator: Authenticator) {
    this.authService = authenticator;
    this.router = express.Router();
    this.errorHandler = new ErrorHandler();
    this.controller = new TypeController();
    this.initRoutes();
  }

  /**
   * Get the router instance.
   * @returns The router instance.
   */
  getRouter(): Router {
    return this.router;
  }

  initRoutes() {
    /**
     * Route for retrieving all documents types.
     * It requires the user to be logged in and to be an urban planner.
     * It returns an array of types.
     */
    this.router.get("/", (req: any, res: any, next: any) =>
      this.controller
        .getTypes()
        .then((types) => res.status(200).json(types))
        .catch((err: any) => next(err))
    );
  }
}

export default TypeRoutes;
