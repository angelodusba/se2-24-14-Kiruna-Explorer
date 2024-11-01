import * as db from "../db/db";
import { Document } from '../models/Document';
import { DocumentError } from '../errors/DocumentError';

export class DocumentDAO {
    /**
     * Inserts a new document into the Documents table.
     * @param document - An instance of the Document model.
     * @returns Promise of the newly created document ID.
     */
    async createDocument(document: Document): Promise<number> {
        try {
            const result = await db.query(
                `INSERT INTO "documents" (title, description, type_id, issue_date, scale, language, pages, location)
                VALUES ($1, $2, $3, $4, $5, $6, $7, ST_SetSRID(ST_GeometryFromText('POINT(30.0 -90.0)'), 4326))
                RETURNING id`,
                [
                    document.title,
                    document.description,
                    2,
                    "2023",
                    document.scale,
                    document.language || null,
                    document.pages || null,
                ]
            );
            return result.rows[0].id;
        } catch (error) {
            throw new DocumentError('Error creating document', error);
        }
    }
}
