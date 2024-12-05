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
     * It returns an array of types.
     */
    this.router.get("/", (req: any, res: any, next: any) =>
      this.controller
        .getTypes()
        .then((types) => res.status(200).json(types))
        .catch((err: any) => next(err))
    );

    /**
     * Route for creating a new document type.
     * It requires authentication, authorization, and validation middlewares to protect the route.
     * It expects the following parameters:
     * - name: string. It cannot be empty.
     * It returns a 200 status code if the type is created successfully or a 409 status code if the type already exists.
     */
    this.router.post(
      "/",
      this.authService.isLoggedIn,
      this.authService.isUrbanPlanner,
      body("name").isString().notEmpty().withMessage("Field 'name' is required"),
      this.errorHandler.validateRequest,
      (req: any, res: any, next: any) => {
        this.controller
          .createType(req.body.name)
          .then(() => res.status(200).end())
          .catch((err: any) => {
            next(err);
          });
      }
    );
  }
}

export default TypeRoutes;
