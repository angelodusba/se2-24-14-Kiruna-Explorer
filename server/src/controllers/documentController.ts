import DocumentDAO from "../dao/documentDAO";

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
   * Creates a new document by delegating to the DAO layer.
   * @param title - The title of the document, must not be null.
   * @param description - The description of the document, must not be null.
   * @param type_id - The type ID of the document, must not be null.
   * @param issue_date - The issue date of the document, in the format DD/MM/YYYY, MM/YYYY, or YYYY, must not be null.
   * @param scale - The scale of the document, must not be null.
   * @param location - An array of objects representing the coordinates of the document, can be a single point or a polygon. If null it's intended as the whole municipality area.
   * @param language - The language of the document, can be empty.
   * @param pages - The number of pages of the document.
   * @returns A Promise that resolves to true if the document has been successfully created.
   */
  async createDocument(
    title: string,
    description: string,
    type_id: number,
    issue_date: string,
    scale: string,
    location: { lat: number; long: number }[],
    language: string,
    pages: string
  ): Promise<boolean> {
    return this.dao.createDocument(
      title,
      description,
      type_id,
      issue_date,
      scale,
      location,
      language,
      pages
    );
  }
}

export default DocumentController;
