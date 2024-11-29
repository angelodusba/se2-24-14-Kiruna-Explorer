import express, { NextFunction, Request, Response, Router } from "express";
import DocumentController from "../controllers/documentController";
import { body, param, query } from "express-validator";
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
      this.authService.isLoggedIn,
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
        .custom((points: any) => {
          // Check each point has 'lat' and 'lng'
          for (const point of points) {
            if (
              typeof point.lat !== "number" ||
              typeof point.lng !== "number" ||
              point.lat < -90 ||
              point.lat > 90 ||
              point.lng < -180 ||
              point.lng > 180
            ) {
              throw new Error("Each point in location must have a valid value of 'lat' and 'lng'");
            }
          }
          return true; // Indicates the validation passed
        }),
      body("language").optional().isString(),
      body("pages").optional().isString(),
      body("stakeholders")
        .isArray({ min: 1 })
        .withMessage("Stakeholders must be an array of integers with at least one ID."),
      this.errorHandler.validateRequest,
      (req: Request, res: Response, next: NextFunction) => {
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
          .then((response) => res.status(200).json(response))
          .catch((err: any) => {
            next(err);
          });
      }
    );

    // Retrieve all the documents
    this.router.get("/", (req: Request, res: Response, next: NextFunction) => {
      this.controller
        .getAllDocuments()
        .then((documents) => res.status(200).json(documents))
        .catch((err: any) => {
          next(err);
        });
    });

    // Get documents' names
    this.router.get("/names", (req: Request, res: Response, next: NextFunction) => {
      this.controller
        .getDocumentsNames()
        .then((documents) => res.status(200).json(documents))
        .catch((err: any) => {
          next(err);
        });
    });

    this.router.get("/location", (req: Request, res: Response, next: NextFunction) => {
      this.controller
        .getDocumentsLocation()
        .then((docsLocation) => res.status(200).json(docsLocation))
        .catch((err: any) => {
          next(err);
        });
    });

    this.router.get("/municipality", (req: Request, res: Response, next: NextFunction) => {
      this.controller
        .getMunicipalityDocuments()
        .then((docs) => res.status(200).json(docs))
        .catch((err: any) => {
          next(err);
        });
    });

    this.router.put(
      "/location",
      this.authService.isLoggedIn,
      this.authService.isUrbanPlanner,
      body("id")
        .notEmpty()
        .withMessage("Document id must not be empty.")
        .bail()
        .isInt({ gt: 0 })
        .withMessage("Document id must be a number greater than 0."),
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
                !isNaN(Number(coord.lat)) &&
                !isNaN(Number(coord.lng))
            )
          ) {
            throw new Error(
              "Each coordinate must be an object with numeric lat and lng properties."
            );
          }
          return true; // Indicates the validation passed
        }),
      this.errorHandler.validateRequest,
      (req: Request, res: Response, next: NextFunction) => {
        this.controller
          .updateDocumentLocation(req.body.id, req.body.location)
          .then(() => res.status(200).end())
          .catch((err: any) => {
            next(err);
          });
      }
    );

    this.router.get(
      "/card/:id",
      param("id")
        .notEmpty()
        .withMessage("Id must not be empty.")
        .bail()
        .isInt({ gt: 0 })
        .withMessage("Param id must be a number greater than 0."),
      this.errorHandler.validateRequest,
      (req: Request, res: Response, next: NextFunction) => {
        this.controller
          .getDocumentCard(Number(req.params.id))
          .then((document) => res.status(200).json(document))
          .catch((err: any) => {
            next(err);
          });
      }
    );

    this.router.get(
      "/:id",
      param("id")
        .notEmpty()
        .withMessage("Id must not be empty.")
        .bail()
        .isInt({ gt: 0 })
        .withMessage("Param id must be a number greater than 0."),
      this.errorHandler.validateRequest,
      (req: Request, res: Response, next: NextFunction) => {
        this.controller
          .getDocumentById(Number(req.params.id))
          .then((document) => res.status(200).json(document))
          .catch((err: any) => {
            next(err);
          });
      }
    );

    /**
     * Retrieves filtered documents based on query parameters (pagination and sorting) and request body filters
     */
    this.router.post(
      "/filtered",
      // Query params validation
      query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer."),
      query("size")
        .optional()
        .isInt({ min: 1, max: 20 })
        .withMessage("Size must be an integer between 1 and 20."),
      query("sort")
        .optional()
        .matches(/^(title|description|type_name|issue_date|scale|language|pages):(asc|desc)$/)
        .withMessage(
          'Sort must be in the format "attribute:order", where order is "asc" or "desc".'
        ),
      // Body params validation
      body("title").optional().isString().withMessage("Title must be a string."),
      body("description").optional().isString().withMessage("Description must be a string."),
      body("start_year")
        .optional()
        .isString()
        .matches(/^\d{4}$/)
        .withMessage("Start year must be a string in YYYY format."),
      body("end_year")
        .optional()
        .isString()
        .matches(/^\d{4}$/)
        .withMessage("End year must be a string in YYYY format."),
      body("scales")
        .optional()
        .isArray({ min: 1 })
        .withMessage("Scales must be an array of strings.")
        .bail()
        .custom((array) =>
          array.every(
            (item: any) =>
              ["Blueprints/material effects", "Text", "Concept"].includes(item) ||
              /^1:\d+$/.test(item)
          )
        )
        .withMessage("Scales must be one of the allowed values."),
      body("types")
        .optional()
        .isArray({ min: 1 })
        .withMessage("Type must be an array of numbers.")
        .bail()
        .custom((array) => array.every((item: any) => Number.isInteger(item)))
        .withMessage("All elements in type must be integers."),
      body("languages")
        .optional()
        .isArray({ min: 1 })
        .withMessage("Languages must be an array of strings.")
        .bail()
        .custom((array) => array.every((item: any) => ["English", "Swedish"].includes(item)))
        .withMessage("Language must be either 'English' or 'Swedish'."),
      body("stakeholders")
        .optional()
        .isArray({ min: 1 })
        .withMessage("Stakeholders must be an array of numbers.")
        .bail()
        .custom((array) => array.every((item: any) => Number.isInteger(item)))
        .withMessage("All elements in stakeholders must be integers."),
      body("municipality").optional().isBoolean().withMessage("Municipality must be a boolean."),
      this.errorHandler.validateRequest,
      (req: Request, res: Response, next: NextFunction) => {
        this.controller
          .getFilteredDocuments(
            req.query.page ? Number(req.query.page) : undefined,
            req.query.size ? Number(req.query.size) : undefined,
            req.query.sort as string,
            req.body.title,
            req.body.description,
            req.body.start_year,
            req.body.end_year,
            req.body.scales,
            req.body.types,
            req.body.languages,
            req.body.stakeholders,
            req.body.municipality
          )
          .then((documents) => res.status(200).json(documents))
          .catch((err: any) => {
            next(err);
          });
      }
    );
  }
}

export default DocumentRoutes;
