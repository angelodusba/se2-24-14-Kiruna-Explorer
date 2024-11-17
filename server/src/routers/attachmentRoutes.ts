import express, { Router } from "express";
import fs from "fs";
import multer from "multer";
import AttachmentController from "../controllers/attachmentController";
import {
  AttachmentAlreadyExistsError,
  AttachmentNotAllowedError,
} from "../errors/attachmentErrors";
import { body } from "express-validator";
import ErrorHandler from "../helper";
import Authenticator from "./auth";
import path from "path";

const handleFileUpload = (req: any, res: any, next: any) => {
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
      if (req.body.original == "true") {
        req.body.original = true;
      } else {
        req.body.original = false;
      }
      // Case if file already exists
      if (fs.existsSync(`${destDir}/${file.originalname}`)) {
        cb(new AttachmentAlreadyExistsError(), destDir);
      }
      // If the folder does not exist, create it
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir);
      }
      cb(null, destDir);
    },
    filename: function (req, file, cb) {
      // Check if the file's MIME type is allowed
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new AttachmentNotAllowedError(), destDir);
      }
      // Get the original file name and extension
      const originalName = file.originalname;
      const extension = path.extname(originalName); // Extract the file extension
      const baseName = path.basename(originalName, extension); // Get the name without extension

      // Sanitize the base name
      const sanitizedBaseName = baseName
        .trim() // Remove leading and trailing whitespace
        .replace(/[^a-zA-Z0-9-_]/g, "_") // Replace problematic characters with underscores
        .replace(/_+/g, "_") // Replace multiple underscores with a single underscore
        .replace(/\-+/g, "-"); // Replace multiple underscores with a single underscore

      // Generate the new file name
      const formattedFileName = `${sanitizedBaseName}${extension}`;
      cb(null, formattedFileName);
    },
  });
  // Upload the file
  const upload = multer({ storage: storage }).single("file");
  upload(req, res, (err: any) => {
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
      handleFileUpload,
      (req: any, res: any, next: any) => {
        console.log(req.file.originalname);
        this.controller
          .addAttachment(
            req.params.document_id,
            req.file.mimetype,
            req.body.original,
            `doc${req.params.document_id}/${req.file.originalname}`
          )
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
