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
     * Route for retrieving all areas.
     * It returns an array of Area objects.
     */
    this.router.get("/", (req: any, res: any, next: any) =>
      this.controller
        .getAreas()
        .then((areas) => res.status(200).json(areas))
        .catch((err: any) => next(err))
    );

    /**
     * Route for retrieving the municipality area.
     * It returns an Area object.
     */
    this.router.get("/municipality", (req: any, res: any, next: any) =>
      this.controller
        .getMunicipalityArea()
        .then((area) => res.status(200).json(area))
        .catch((err: any) => next(err))
    );

    /**
     * Route for registering a new area.
     */
    this.router.post(
      "/",
      this.authService.isLoggedIn,
      this.authService.isUrbanPlanner,
      body("name").isString().notEmpty().withMessage("Name must be a non-empty string"),
      body("location")
        .isArray({ min: 4 })
        .withMessage("Location must be an array with at least 3 points")
        .bail()
        .custom((points) => {
          // Check each point has 'lat' and 'lng'
          for (const point of points) {
            if (
              typeof point.lat !== "number" ||
              typeof point.lng !== "number" ||
              point.lat < -90 ||
              point.lat > 90 ||
              point.lng < -180 ||
              point.lng > 180
            ) {
              throw new Error("Each point in location must have a valid value of 'lat' and 'lng'");
            }
          }
          // Check if first and last points are identical to form a closed polygon
          const first = points[0];
          const last = points[points.length - 1];
          if (first.lat !== last.lat || first.lng !== last.lng) {
            throw new Error("The polygon must be closed (first and last points must be identical)");
          }
          return true;
        }),
      this.errorHandler.validateRequest,
      (req: any, res: any, next: any) =>
        this.controller
          .createArea(req.body.name, req.body.location)
          .then((area) => res.status(200).json(area))
          .catch((err: any) => next(err))
    );
  }
}

export default AreaRoutes;
