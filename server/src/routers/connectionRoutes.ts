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
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               starting_document_id:
         *                 type: number
         *               connections:
         *                 type: array
         *                 items:
         *                   type: object
         *                   properties:
         *                     connected_document_id:
         *                       type: number
         *                     connection_name:
         *                       type: string
         *             required:
         *               - starting_document_id
         *               - connections
         *     responses:
         *       200:
         *         description: OK
         *       400:
         *         description: Bad Request
         *       401:
         *         description: Unauthorized
         *       500:
         *         description: Internal Server Error
         *     tags:
         *       - connections
         *     security:
         *       - bearerAuth: []
         */
        this.router.post("/", 
            //this.authService.isLoggedIn, 
            [
            body("starting_document_id").isInt(),
            body("connections").isArray().isLength({ min: 1 }),
            body("connections.*.connected_document_id").isInt(),
            body("connections.*.connection_name").isString()
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
            });

        //GET CONNECTIONS
        /**
         * @swagger
         * /connections:
         *  get:
         *   summary: Get all connections
         *   description: Get all the connections
         *    responses:
         *     200:
         *      description: OK
         *     500:
         *      description: Internal Server Error
         */
        this.router.get("/", 
            //this.authService.isLoggedIn, 
            async (req: any, res: any) => {
                try {
                    const result = await this.controller.getConnections();
                    res.status(200).json(result);
                } catch (err: any) {
                    res.status(500).json({ error: err.message });
                }
            });
        
        /**
         * @swagger
         * /connections/names:
         *  get:
         *   summary: Get connection names
         *  description: Get the connection names for a document
         *    responses:
         *     200:
         *      description: OK
        */
        this.router.get("/names", 
            //this.authService.isLoggedIn, 
            async (req: any, res: any) => {
                try {
                    const result = await this.controller.getConnectionNames();
                    res.status(200).json(result);
                } catch (err: any) {
                    res.status(500).json({ error: err.message });
                }
            });
    }
}

export default ConnectionRoutes;