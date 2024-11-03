import express, { Router } from "express";
import DocumentController from "../controllers/documentController";
import { body } from "express-validator";
import ErrorHandler from "../helper";
import Authenticator from "./auth";

class DocumentRoutes {
  private router: Router;
  private controller: DocumentController;
  private authService: Authenticator;
  private errorHandler: ErrorHandler;

  constructor(authenticator: Authenticator) {
    this.authService = authenticator;
    this.router = express.Router();
    this.errorHandler = new ErrorHandler();
    this.controller = new DocumentController();
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
    // Create a new document
    this.router.post(
      "/",
      // Validation
      body("title").notEmpty().withMessage("Title must not be empty."),
      body("description").notEmpty().withMessage("Description must not be empty."),
      body("type_id").isInt().withMessage("Type ID must be an integer."),
      body("issue_date")
        .notEmpty()
        .withMessage("Issue date must not be empty.")
        .matches(
          /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$|^([0][1-9]|[1][0-2])\/(\d{4})$|^\d{4}$/
        )
        .withMessage("Issue date must be in the format DD/MM/YYYY or MM/YYYY or YYYY."),
      body("scale").notEmpty().withMessage("Scale must not be empty."),
      body("location")
        .isArray({ min: 1 })
        .withMessage("Location must be an array of strings with at least one coordinate."),
      body("language").optional().isString(),
      //body('pages').optional().isObject().withMessage('Pages must be an object.'),
      body("stakeholders")
        .isArray({ min: 1 })
        .withMessage("Stakeholders must be an array of integers with at least one ID."),
      this.errorHandler.validateRequest,
      //this.authService.isUrbanPlanner,
      (req: any, res: any, next: any) => {
        //console.log(req.body);
        this.controller
          .createDocument(
            req.body.title,
            req.body.description,
            req.body.type_id,
            req.body.issue_date,
            req.body.scale,
            req.body.location,
            req.body.language,
            req.body.pages,
            req.body.stakeholders
          )
          .then(() => res.status(200).end())
          .catch((err: any) => {
            next(err);
          });
      }
    );

    // Get all documents
    /*
        this.router.get('/', (req: any, res: any, next: any) => {
            this.documentController.getAllDocuments()
                .then((result: any) => {
                    res.status(200).send(result);
                })
                .catch((err: any) => next(err));
        });
        */
  }
}

export default DocumentRoutes;
