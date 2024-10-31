import { Request, Response } from 'express';
import { DocumentDAO } from '../dao/DocumentDAO';
import { DocumentError } from '../errors/DocumentError';
import { Document } from '../models/Document';

const documentDAO = new DocumentDAO();

export class DocumentController {
    /**
     * Handles the creation of a new document.
     * @param req - Express request object.
     * @param res - Express response object.
     */

    async createDocument(req: Request, res: Response) {
        try {
            const document = new Document(
                0,
                req.body.title,
                req.body.description,
                req.body.type_id,
                new Date(req.body.issue_date),
                req.body.scale,
                req.body.location,
                req.body.language,
                req.body.pages
            );
            const documentId = await documentDAO.createDocument(document);
            res.status(200).json({ id: documentId });
        } catch (error) {
            if (error instanceof DocumentError) {
                res.status(401).json({ error: error.message });
            } else {
                res.status(422).json({ error: 'Internal Server Error' });
            }
        }
    
    }

}