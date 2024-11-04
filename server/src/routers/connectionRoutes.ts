import express, { Router } from "express";
import ConnectionController from "../controllers/connectionController";
import { body } from "express-validator";
import ErrorHandler from "../helper";
import Authenticator from "./auth";

class ConnectionRoutes {
  private router: Router;
  private controller: ConnectionController;
  private authService: Authenticator;
  private errorHandler: ErrorHandler;

  constructor(authenticator: Authenticator) {
    this.authService = authenticator;
    this.router = express.Router();
    this.errorHandler = new ErrorHandler();
    this.controller = new ConnectionController();
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
    //POST CONNECTIONS
    /**
     * @swagger
     * /connections:
     *   post:
     *     summary: Create new connections
     *     description: Create a number of new connections
     */
    this.router.post(
      "/",
      //this.authService.isLoggedIn,
      [
        body("starting_document_id").isInt(),
        body("connections").isArray().isLength({ min: 1 }),
        body("connections.*.connected_document_id").isInt(),
        body("connections.*.connection_name").isString(),
      ],
      this.errorHandler.validateRequest,
      async (req: any, res: any) => {
        try {
          const starting_document_id = req.body.starting_document_id;
          const connections = req.body.connections;
          const result = await this.controller.createConnections(starting_document_id, connections);
          res.status(200).json(result);
        } catch (err: any) {
          res.status(500).json({ error: err.message });
        }
      }
    );

    //GET CONNECTIONS
    /**
     * @swagger
     * /connections:
     *  get:
     *   summary: Get all connections
     *   description: Get all the connections
     */
    this.router.get(
      "/",
      //this.authService.isLoggedIn,
      async (req: any, res: any) => {
        try {
          const result = await this.controller.getConnections();
          res.status(200).json(result);
        } catch (err: any) {
          res.status(500).json({ error: err.message });
        }
      }
    );

    /**
     * @swagger
     * /connections/names:
     *  get:
     *   summary: Get connection names
     *  description: Get the connection names for a document
     */
    this.router.get(
      "/names",
      //this.authService.isLoggedIn,
      (req: any, res: any, next: any) => {
        this.controller
          .getConnectionNames()
          .then((connections) => res.status(200).json(connections))
          .catch((err: any) => next(err));
      }
    );
  }
}

export default ConnectionRoutes;
