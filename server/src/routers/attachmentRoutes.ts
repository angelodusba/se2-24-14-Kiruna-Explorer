import express, { Router } from "express";
import fs from "fs";
import multer from "multer";
import AttachmentController from "../controllers/attachmentController";
import {
  AttachmentAlreadyExistsError,
  AttachmentNotAllowedError,
} from "../errors/attachmentErrors";
import { body, param } from "express-validator";
import ErrorHandler from "../helper";
import Authenticator from "./auth";
import path from "path";

/**
 * Handles the file upload process for a document. This function sets up
 * the storage destination and file naming conventions for uploaded files,
 * ensuring file names are sanitized and only allowed MIME types are accepted.
 *
 * The uploaded file is stored in a directory specific to the document ID,
 * and errors are handled appropriately if the file already exists or if the
 * file type is not allowed.
 *
 * @param req - The request object containing file data and parameters.
 * @param res - The response object.
 * @param next - The next middleware function in the stack.
 */
const handleFileUpload = (req: any, res: any, next: any) => {
  const sanitizeName = (originalName: string): string => {
    // Get the original file name and extension
    const extension = path.extname(originalName); // Extract the file extension
    const baseName = path.basename(originalName, extension); // Get the name without extension

    // Sanitize the base name
    const sanitizedBaseName = baseName
      .trim() // Remove leading and trailing whitespace
      .replace(/[^a-zA-Z0-9-_]/g, "_") // Replace problematic characters with underscores
      .replace(/_+/g, "_") // Replace multiple underscores with a single underscore
      .replace(/\-+/g, "-"); // Replace multiple hyphens with a single hyphen

    return `${sanitizedBaseName}${extension}`;
  };

  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  ];
  const destDir = `./public/docs/doc${req.params.document_id}`;

  // Configuration to upload the file in the respective folder keeping the original name
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Check if file already exists by looking for the corresponding sanitized file name
      if (fs.existsSync(`${destDir}/${sanitizeName(file.originalname)}`)) {
        cb(new AttachmentAlreadyExistsError(), destDir);
      }
      // Check if the file's MIME type is allowed
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new AttachmentNotAllowedError(), destDir);
      }
      // If the folder does not exist, create it
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir);
      }
      cb(null, destDir);
    },
    filename: function (req, file, cb) {
      // Generate the new sanitized file name
      const formattedFileName = sanitizeName(file.originalname);
      cb(null, formattedFileName);
    },
  });
  // Upload the file
  const upload = multer({ storage: storage }).single("file");
  upload(req, res, (err: any) => {
    // Validation and conversion to boolean of the "original" body field
    if (req.body.original == "true") {
      req.body.original = true;
    } else {
      req.body.original = false;
    }
    return next(err);
  });
};

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
      param("document_id")
        .notEmpty()
        .withMessage("Param document_id must not be empty.")
        .bail()
        .isInt({ gt: 0 })
        .withMessage("Param document_id must be a number greater than 0."),
      this.errorHandler.validateRequest,
      handleFileUpload,
      (req: any, res: any, next: any) => {
        this.controller
          .addAttachment(
            Number(req.params.document_id),
            req.file.mimetype,
            req.body.original,
            `doc${req.params.document_id}/${req.file.filename}`
          )
          .then((response) => res.status(201).json(response))
          .catch((err: any) => {
            next(err);
          });
      }
    );

    // Get all attachments of a document
    this.router.get(
      "/:document_id",
      param("document_id").isInt({ gt: 0 }).withMessage("Document ID must be a positive integer."),
      this.errorHandler.validateRequest,
      (req: any, res: any, next: any) => {
        this.controller
          .getAttachments(Number(req.params.document_id))
          .then((response) => res.status(200).json(response))
          .catch((err: any) => {
            next(err);
          });
      }
    );

    // Get all attachments of a document
    this.router.delete(
      "/:attachment_id",
      this.authService.isLoggedIn,
      this.authService.isUrbanPlanner,
      param("attachment_id")
        .isInt({ gt: 0 })
        .withMessage("Attachment ID must be a positive integer."),
      this.errorHandler.validateRequest,
      (req: any, res: any, next: any) => {
        this.controller
          .deleteAttachment(req.params.attachment_id)
          .then(() => res.status(200).end())
          .catch((err: any) => {
            next(err);
          });
      }
    );
  }
}
export default AttachmentRoutes;
