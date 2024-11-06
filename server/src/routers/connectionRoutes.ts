import express, { Router } from "express";
import ConnectionController from "../controllers/connectionController";
import { body } from "express-validator";
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
          .withMessage("Each connection type must be a valid value from ConnectionType enum"),
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

    //GET CONNECTIONS
    /**
     * @swagger
     * /connections:
     *  get:
     *   summary: Get all connections
     *   description: Get all the connections
     *  responses:
     *   200:
     *   description: A list of connections
     *  content:
     *  application/json:
     *  schema:
     * type: array
     * items:
     * type: object
     * properties:
     * document_id_1:
     * type: integer
     * document_id_2:
     * type: integer
     * connection_type:
     * type: string
     * example: direct_conn
     * required:
     * - document_id_1
     * - document_id_2
     * - connection_type
     */
    this.router.get(
      "/",
      //this.authService.isLoggedIn,
      (req: any, res: any, next: any) => {
        this.controller
          .getConnections()
          .then((connections) => res.status(200).json(connections))
          .catch((err: any) => {
            next(err);
          });
      }
    );

    /**
     * Fetch the connections related to a certain document
     */
    this.router.get(
      "/document/:id",
      //this.authService.isLoggedIn,
      (req: any, res: any, next: any) => {
        this.controller
          .getConnectionsByDocumentId()
          .then((connections) => res.status(200).json(connections))
          .catch((err: any) => {
            next(err);
          });
      }
    );

    /**
     * @swagger
     * /connections/names:
     *  get:
     *   summary: Get connection names
     *  description: Get the connection names for a document
     * responses:
     * 200:
     * description: A list of connection names
     * content:
     * application/json:
     * schema:
     * type: array
     * items:
     * type: string
     * example: direct_conn
     * required:
     * - connection_name
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
