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
     * It requires the user to be logged in and to be an urban planner.
     * It returns an array of stakeholders.
     */
    this.router.get("/", (req: any, res: any, next: any) =>
      this.controller
        .getStakeholders()
        .then((stakeholders) => res.status(200).json(stakeholders))
        .catch((err: any) => next(err))
    );
  }
}

export default StakeholderRoutes;
