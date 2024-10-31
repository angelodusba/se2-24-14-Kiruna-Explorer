import express from 'express';
import { DocumentController } from '../controllers/DocumentController';
import { body } from 'express-validator';
import { ErrorHandler } from '../helper'; // Assuming you have a helper function for request validation
import { DocumentError } from '../errors/DocumentError';

function DocumentRoutes(authenticator) {
    this.router = express.Router();
    this.documentController = new DocumentController();
    this.authenticator = authenticator;

    this.getRouter = () => this.router;

    this.initRoutes = function () {
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
            validateRequest, // Custom validation middleware
            (req, res, next) => {
                const { title, description, type_id, issue_date, scale, location, language, pages, stakeholders } = req.body;

                // Create the document instance
                const document = new Document(title, description, type_id, issue_date, scale, location, language, pages);

                this.documentController.createDocument({ ...req, body: document })
                    .then(documentId => {
                        res.status(201).json({ message: 'Document created successfully', documentId });
                    })
                    .catch(error => {
                        if (error.code === '23505') { // Assuming PostgreSQL error code for duplicate title
                            res.status(409).json({ error: 'A document with this title already exists.' });
                        } else {
                            next(new DocumentError('An unexpected error occurred')); // Use your DocumentError class
                        }
                    });
            }
        );

        // Get all documents
        this.router.get('/', (req, res, next) => {
            this.documentController.getAllDocuments()
                .then(result => {
                    res.status(200).send(result);
                })
                .catch(err => next(err));
        });
    };

    this.initRoutes();
}

export default DocumentRoutes;
