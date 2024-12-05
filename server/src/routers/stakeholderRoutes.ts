import express, { Router } from "express";
import StakeholderController from "../controllers/stakeholderController";
import { body } from "express-validator";
import ErrorHandler from "../helper";
import Authenticator from "./auth";

class StakeholderRoutes {
  private router: Router;
  private controller: StakeholderController;
  private authService: Authenticator;
  private errorHandler: ErrorHandler;

  constructor(authenticator: Authenticator) {
    this.authService = authenticator;
    this.router = express.Router();
    this.errorHandler = new ErrorHandler();
    this.controller = new StakeholderController();
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
     * Route for retrieving all stakeholders.
     * It returns an array of stakeholders.
     */
    this.router.get("/", (req: any, res: any, next: any) =>
      this.controller
        .getStakeholders()
        .then((stakeholders) => res.status(200).json(stakeholders))
        .catch((err: any) => next(err))
    );

    /**
     * Route for creating a new document stakeholder.
     * It requires authentication, authorization, and validation middlewares to protect the route.
     * It expects the following parameters:
     * - name: string. It cannot be empty.
     * It returns a 200 status code if the stakeholder is created successfully or a 409 status code if the stakeholder already exists.
     */
    this.router.post(
      "/",
      this.authService.isLoggedIn,
      this.authService.isUrbanPlanner,
      body("name").isString().notEmpty().withMessage("Field 'name' is required"),
      this.errorHandler.validateRequest,
      (req: any, res: any, next: any) => {
        this.controller
          .createStakeholder(req.body.name)
          .then(() => res.status(200).end())
          .catch((err: any) => {
            next(err);
          });
      }
    );
  }
}

export default StakeholderRoutes;
