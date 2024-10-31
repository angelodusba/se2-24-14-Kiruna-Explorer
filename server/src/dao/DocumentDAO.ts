import { Pool } from 'pg';
import { Document } from '../models/Document';
import { DocumentError } from '../errors/DocumentError';

// Initialize your PostgreSQL pool connection
const pool = new Pool({
    // Configure your connection settings here
});

export class DocumentDAO {
    /**
     * Inserts a new document into the Documents table.
     * @param document - An instance of the Document model.
     * @returns Promise of the newly created document ID.
     */
    async createDocument(document: Document): Promise<number> {
        try {
            const result = await pool.query(
                `INSERT INTO public."Documents" (title, description, type_id, issue_date, scale, language, pages, location)
                VALUES ($1, $2, $3, $4, $5, $6, $7, ST_GeomFromText($8, 4326))
                RETURNING id`,
                [
                    document.title,
                    document.description,
                    document.type_id,
                    document.issue_date,
                    document.scale,
                    document.language || null,
                    document.pages || null,
                    document.location
                ]
            );
            return result.rows[0].id;
        } catch (error) {
            throw new DocumentError('Error creating document', error);
        }
    }
}
