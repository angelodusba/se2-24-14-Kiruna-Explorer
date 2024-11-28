import express, { Router } from "express";
import AreaController from "../controllers/areaController";
import { body } from "express-validator";
import ErrorHandler from "../helper";
import Authenticator from "./auth";

class AreaRoutes {
  private router: Router;
  private controller: AreaController;
  private authService: Authenticator;
  private errorHandler: ErrorHandler;
  constructor(authenticator: Authenticator) {
    this.authService = authenticator;
    this.router = express.Router();
    this.errorHandler = new ErrorHandler();
    this.controller = new AreaController();
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
     * Route for retrieving all Areas.
     * It returns an array of Areas.
     */
    this.router.get("/", (req: any, res: any, next: any) =>
      this.controller
        .getAreas()
        .then((areas) => res.status(200).json(areas))
        .catch((err: any) => next(err))
    );

    this.router.post(
      "/",
      this.authService.isLoggedIn,
      this.authService.isUrbanPlanner,
      body("name").isString().notEmpty().withMessage("Field 'name' is required"),
      body("location")
        .isArray()
        .isLength({ min: 1 })
        .withMessage("Location must be a non-empty array.")
        .bail()
        .custom((value: any) => {
          if (
            !value.every(
              (coord: any) =>
                typeof coord === "object" &&
                coord !== null &&
                !isNaN(Number(coord.lat)) &&
                !isNaN(Number(coord.lng))
            )
          ) {
            throw new Error(
              "Each coordinate must be an object with numeric lat and lng properties."
            );
          }
          return true; // Indicates the validation passed
        }),
      this.errorHandler.validateRequest,
      (req: any, res: any, next: any) => {
        this.controller
          .createArea(req.body.name, req.body.location)
          .then(() => res.status(200).end())
          .catch((err: any) => {
            next(err);
          });
      }
    );
  }  
}

export default AreaRoutes;
