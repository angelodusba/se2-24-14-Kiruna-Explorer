import express, { Router } from "express";
import StakeHolderController from "../controllers/stakeHolderController";
import StakeHolder from "../models/stakeHolder";
import { body } from "express-validator";
import ErrorHandler from "../helper";
import Authenticator from "./auth";

class StakeHolderRoutes {
  private router: Router;
  private controller: StakeHolderController;
  private authService: Authenticator;
  private errorHandler: ErrorHandler;

  constructor(authenticator: Authenticator) {
    this.authService = authenticator;
    this.router = express.Router();
    this.errorHandler = new ErrorHandler();
    this.controller = new StakeHolderController();
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
    this.router.get(
      "/",
      //this.authService.isUrbanPlanner,
      (req: any, res: any, next: any) =>
        this.controller
          .getStakeHolders()
          .then((stakeholders: StakeHolder[]) => res.status(200).json(stakeholders))
          .catch((err: any) => next(err))
    );


  }
}

export default StakeHolderRoutes;