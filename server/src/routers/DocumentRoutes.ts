import express from 'express';
import { DocumentController } from '../controllers/DocumentController';
import { Document } from '../models/Document';
import { body } from 'express-validator';
import { DocumentError } from '../errors/DocumentError';

export class DocumentRoutes {
    static getRouter(): import("express-serve-static-core").RequestHandler<{}, any, any, import("qs").ParsedQs, Record<string, any>> {
      throw new Error("Method not implemented.");
    }
    private router: express.Router;
    private documentController: DocumentController;

    constructor() {
        this.router = express.Router();
        this.documentController = new DocumentController();
        this.initRoutes();
    }

    getRouter() {
        return this.router;
    }

    private initRoutes() {
        // Create a new document
        this.router.post(
            '/',
            // Validation
            body('title').notEmpty().withMessage('Title must not be empty.'),
            body('description').notEmpty().withMessage('Description must not be empty.'),
            body('type_id').isInt().withMessage('Type ID must be an integer.'),
            body('issue_date')
                .notEmpty()
                .withMessage('Issue date must not be empty.')
                .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$|^([0][1-9]|[1][0-2])\/(\d{4})$|^\d{4}$/)
                .withMessage('Issue date must be in the format DD/MM/YYYY or MM/YYYY or YYYY.'),
            body('scale').notEmpty().withMessage('Scale must not be empty.'),
            body('location').isArray({ min: 1 }).withMessage('Location must be an array of objects with at least one coordinate.'),
            body('language').optional().isString(),
            body('pages').optional().isObject().withMessage('Pages must be an object.'),
            body('stakeholders').isArray({ min: 1 }).withMessage('Stakeholders must be an array of integers with at least one ID.'),
            // Error handling
            (req: any, res: any, next: any) => {
                const { title, description, type_id, issue_date, scale, location, language, pages } = req.body;

                // Create the document instance
                const document = new Document(
                    0,
                    title,
                    description,
                    type_id,
                    new Date(issue_date),
                    scale,
                    location,
                    language,
                    String(pages),
                );

                this.documentController.createDocument({ ...req, body: document }, res)
                    .then((documentId: any) => {
                        res.status(201).json({ message: 'Document created successfully', documentId });
                    })
                    .catch((error: { code: string; }) => {
                        if (error.code === '23505') { // Assuming PostgreSQL error code for duplicate title
                            res.status(409).json({ error: 'A document with this title already exists.' });
                        } else {
                            next(new DocumentError('An unexpected error occurred')); // Use your DocumentError class
                        }
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
