import express, { Router } from "express";
import AttachmentController from "../controllers/attachmentController";
import { body } from "express-validator";
import ErrorHandler from "../helper";
import Authenticator from "./auth";

class AttachmentRoutes {
  private router: Router;
  private controller: AttachmentController;
  private authService: Authenticator;
  private errorHandler: ErrorHandler;

  constructor(authenticator: Authenticator) {
    this.authService = authenticator;
    this.router = express.Router();
    this.errorHandler = new ErrorHandler();
    this.controller = new AttachmentController();
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
    // Add a new attachment to a document
    this.router.post(
      "/:document_id",
      this.authService.isLoggedIn,
      this.authService.isUrbanPlanner,
      body("type").isString().withMessage("Parameter 'type' must be a string."),
      body("original").isBoolean().withMessage("Parameter 'original' must be a boolean."),
      this.errorHandler.validateRequest,
      (req: any, res: any, next: any) => {
        this.controller
          .addAttachment(req.params.document_id, req.body.type, req.body.original, req.body.path)
          .then((response) => res.status(201).json(response))
          .catch((err: any) => {
            next(err);
          });
      }
    );

    // Get all attachments of a document
    this.router.get("/:document_id", (req: any, res: any, next: any) => {
      this.controller
        .getAttachments(req.params.document_id)
        .then((response) => res.status(200).json(response))
        .catch((err: any) => {
          next(err);
        });
    });
  }
}
export default AttachmentRoutes;