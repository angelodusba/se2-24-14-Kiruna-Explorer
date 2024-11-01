import { DocumentDAO } from '../dao/DocumentDAO';
import { DocumentError } from '../errors/DocumentError';
import { Document } from '../models/Document';

/**
 * Represents a controller for managing documents.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */

class DocumentController {
  private dao: DocumentDAO;

  constructor() {
    this.dao = new DocumentDAO();
  }

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
        return this.dao.createDocument(title, description, type_id, issue_date, scale, location,language, pages);
    }
}

export { DocumentController };