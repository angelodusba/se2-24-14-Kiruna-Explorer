import express, {Router} from "express";
import AreaController from "../controllers/areaController";
import Area from "../models/area";
import {body} from "express-validator";
import ErrorHandler from "../helper";
import Authenticator from "./auth";

class AreaRoutes{
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
        .then((types) => res.status(200).json(types))
        .catch((err: any) => next(err))
    );
    }
  
}

export default AreaRoutes;