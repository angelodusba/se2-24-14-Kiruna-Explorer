import * as db from "../db/db";
import { Document } from '../models/Document';
import { DocumentError } from '../errors/DocumentError';

export class DocumentDAO {
    /**
     * Creates a new document.
     * @param title - The title of the new document. It must not be null.
     * @param description - The description of the new document. It must not be null.
     * @param type_id - The type of the new document. It must not be null.
     * @param issue_date - The issue date of the new document. It must not be null.
     * @param scale - The scale of the new document. It must not be null.
     * @param location - The location of the document.
     * @param language - The language of the document.
     * @param pages - .
     * @returns A Promise that resolves to true if the document has been created.
     */
    async createDocument(
        title: string,
        description: string,
        type_id: number,
        issue_date: Date,
        scale: string,
        location: string,
        language: string,
        pages: string


    ): Promise<boolean> {
        try {
            const sql = "INSERT INTO documents (title, description, type_id, issue_date, scale, location, language, pages) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
            await db.query(sql, [title, description, type_id, issue_date, scale, location, language, pages]);
            return true;
        } catch (err: any) {
            throw new DocumentError(err);
        }
    }
        
    
}

export default DocumentDAO;
