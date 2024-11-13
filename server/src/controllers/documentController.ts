import DocumentDAO from "../dao/documentDAO";
import Document from "../models/document";
import DocumentLocationResponse from "../response/documentLocationResponse";

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
   * @param location - An array of objects representing the coordinates of the document, can be a single point or a polygon. If empty it's intended as the whole municipality area.
   * @param language - The language of the document, can be empty.
   * @param pages - The number of pages of the document.
   * @param stakeholderIds - The stakeholders of the document.
   * @returns A Promise that resolves to true if the document has been successfully created.
   */
  async createDocument(
    title: string,
    description: string,
    type_id: number,
    issue_date: string,
    scale: string,
    location: { lat: number; lng: number }[],
    language: string,
    pages: string,
    stakeholderIds: number[]
  ): Promise<{ id: number }> {
    // Convert object array into a comma separated string of coordinates
    const locationStr = location.map((coord) => `${coord.lng} ${coord.lat}`).join(", ");
    return this.dao.createDocument(
      title,
      description,
      type_id,
      issue_date,
      scale,
      locationStr,
      language,
      pages,
      stakeholderIds
    );
  }

  /**
   * Retrieves all documents ids and titles.
   * @returns A Promise that resolves to an array of documents.
   * @throws Error if the documents cannot be retrieved.
   */
  async getDocumentsNames(): Promise<Document[]> {
    return this.dao.getDocumentsNames();
  }

  /**
   * Retrieves a document by its unique identifier.
   * @param id - The unique identifier of the document to retrieve.
   * @returns A promise that resolves to the Document object associated with the specified id.
   * @throws If no document is found, it throws an DocumentNotFoundError.
   */
  async getDocumentById(id: number): Promise<Document> {
    return this.dao.getDocumentById(id);
  }

  /**
   * Retrieves documents location information.
   * @returns A promise that resolves to an array of document location responses.
   */
  async getDocumentsLocation(): Promise<DocumentLocationResponse[]> {
    return this.dao.getDocumentsLocation();
  }

  /**
   * Updates the location of a document.
   * @param id - The unique identifier of the document to update.
   * @param location - An array of objects representing the new coordinates of the document,
   *                   can be a single point or a polygon. If empty, it represents the entire municipality area.
   * @returns A promise that resolves to true if the document's location has been successfully updated.
   * @throws DocumentNotFoundError if the document does not exist.
   */
  async updateDocumentLocation(
    id: number,
    location: { lat: number; lng: number }[]
  ): Promise<boolean> {
    // Convert object array into a comma separated string of coordinates
    const locationStr = location.map((coord) => `${coord.lng} ${coord.lat}`).join(", ");
    return this.dao.updateDocumentLocation(id, locationStr);
  }

}

export default DocumentController;
