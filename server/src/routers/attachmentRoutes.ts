import express, { Router } from "express";
import fs from "fs";
import multer from "multer";
import AttachmentController from "../controllers/attachmentController";
import { AttachmentAlreadyExistsError } from "../errors/attachmentErrors";
import { body } from "express-validator";
import ErrorHandler from "../helper";
import Authenticator from "./auth";

const handleFileUpload = (req: any, res: any, next: any) => {
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
      cb(null, file.originalname);
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
