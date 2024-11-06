import express, { Router } from "express";
import DocumentController from "../controllers/documentController";
import { body, param } from "express-validator";
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
      //this.authService.isLoggedIn,
      this.authService.isUrbanPlanner,
      // Validation
      body("title").notEmpty().withMessage("Title must not be empty."),
      body("description").notEmpty().withMessage("Description must not be empty."),
      body("type_id").isInt().withMessage("Type ID must be an integer."),
      body("issue_date")
        .notEmpty()
        .withMessage("Issue date must not be empty.")
        .matches(
          /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$|^(0[1-9]|1[0-2])\/(\d{4})$|^\d{4}$/
        )
        .withMessage("Issue date must be in the format DD/MM/YYYY or MM/YYYY or YYYY.")
        .bail()
        .custom((value) => {
          if (value.split("/").length < 3) return true;
          const [day, month, year] = value.split("/").map(Number);
          const date = new Date(year, month - 1, day);
          // Check if the date is valid
          if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
          ) {
            throw new Error("Issue date must be a valid date.");
          }
          return true; // Indicates the validation passed
        }),
      body("scale").notEmpty().withMessage("Scale must not be empty."),
      body("location")
        .isArray()
        .withMessage("Location must be an array.")
        .bail()
        .custom((value: any) => {
          if (
            !value.every(
              (coord: any) =>
                typeof coord === "object" &&
                coord !== null &&
                typeof coord.lat === "number" &&
                typeof coord.lng === "number"
            )
          ) {
            throw new Error(
              "Each coordinate must be an object with numeric lat and lng properties."
            );
          }
          return true; // Indicates the validation passed
        }),
      body("language").optional().isString(),
      body("pages").optional().isString(),
      body("stakeholders")
        .isArray({ min: 1 })
        .withMessage("Stakeholders must be an array of integers with at least one ID."),
      this.errorHandler.validateRequest,
      (req: any, res: any, next: any) => {
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

    this.router.get("/names", (req: any, res: any, next: any) => {
      this.controller
        .getDocumentsNames()
        .then((documents) => res.status(200).json(documents))
        .catch((err: any) => {
          next(err);
        });
    });

    this.router.get("/location", (req: any, res: any, next: any) => {
      this.controller
        .getDocumentsLocation()
        .then((docsLocation) => res.status(200).json(docsLocation))
        .catch((err: any) => {
          next(err);
        });
    });

    this.router.get(
      "/:id",
      // this.authService.isLoggedin(),
      param("id")
        .notEmpty()
        .withMessage("Id must not be empty.")
        .bail()
        .isInt({ gt: 0 })
        .withMessage("Param id must be a number greater than 0."),
      this.errorHandler.validateRequest,
      (req: any, res: any, next: any) => {
        this.controller
          .getDocumentById(req.params.id)
          .then((document) => res.status(200).json(document))
          .catch((err: any) => {
            next(err);
          });
      }
    );
  }
}

export default DocumentRoutes;
