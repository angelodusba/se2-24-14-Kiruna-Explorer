import express, { Router } from "express";
import ConnectionController from "../controllers/connectionController";
import { body, query } from "express-validator";
import ErrorHandler from "../helper";
import Authenticator from "./auth";
import { ConnectionType } from "../models/connection";

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
      this.authService.isLoggedIn,
      this.authService.isUrbanPlanner,
      [
        body("starting_document_id").isInt(),
        body("connections").isArray().isLength({ min: 1 }),
        body("connections.*.connected_document_id").isInt(),
        body("connections.*.connection_types")
          .isArray()
          .withMessage("connection_types must be an array")
          .custom((value: string[]) => {
            // Check each string in the array to ensure it's one of the allowed values from ConnectionType
            const validConnectionTypes: string[] = Object.values(ConnectionType);
            for (const type of value) {
              if (!validConnectionTypes.includes(type)) {
                throw new Error(`Invalid connection type: ${type}`);
              }
            }
            return true;
          })
          .withMessage(
            "Each connection type must be a valid value in ['direct_conn', 'collateral_conn',  'prevision_conn', 'update_conn']"
          ),
      ],
      this.errorHandler.validateRequest,
      (req: any, res: any, next: any) => {
        this.controller
          .createConnections(req.body.starting_document_id, req.body.connections)
          .then(() => res.status(200).end())
          .catch((err: any) => {
            next(err);
          });
      }
    );

    /**
     * GET /connections?document_id
     * Retrieves a list of connection filtered by the optional parameter document_id
     */
    this.router.get(
      "/",
      query("document_id").optional().isInt({ min: 1 }).withMessage("Page must be an integer greater than 0"),
      this.errorHandler.validateRequest,
      async (req: any, res: any, next: any) => {
        try {
          const connections = Number(req.query.document_id)
            ? await this.controller.getConnectionsByDocumentId(Number(req.query.document_id))
            : await this.controller.getConnections();
          res.status(200).json(connections);
        } catch (err: any) {
          next(err);
        }
      }
    );

    /**
     * GET /connections/names
     * Retrieves a list of connection names
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

    // Modify connections?
    this.router.put(
      "/",
      this.authService.isLoggedIn,
      this.authService.isUrbanPlanner,
      [
        body("starting_document_id").isInt(),
        body("connections").isArray(),
        body("connections.*.document_id").isInt(),
        body("connections.*.connection_types")
          .isArray()
          .withMessage("connection_types must be an array")
          .custom((value: string[]) => {
            // Check each string in the array to ensure it's one of the allowed values from ConnectionType
            const validConnectionTypes: string[] = Object.values(ConnectionType);
            for (const type of value) {
              if (!validConnectionTypes.includes(type)) {
                throw new Error(`Invalid connection type: ${type}`);
              }
            }
            return true;
          })
          .withMessage(
            "Each connection type must be a valid value in ['direct_conn', 'collateral_conn',  'prevision_conn', 'update_conn']"
          ),
      ],
      this.errorHandler.validateRequest,
      (req: any, res: any, next: any) => {
        this.controller
          .updateConnections(req.body.starting_document_id, req.body.connections)
          .then(() => res.status(200).end())
          .catch((err: any) => {
            next(err);
          });
      }
    );
  }
}

export default ConnectionRoutes;
