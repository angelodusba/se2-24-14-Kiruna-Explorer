import AttachmentDAO from "../dao/attachmentDAO";
import Attachment from "../models/attachment";

class AttachmentController {
  private dao: AttachmentDAO;

  constructor() {
    this.dao = new AttachmentDAO();
  }

  /**
   * Adds a new attachment to a document by delegating to the DAO layer.
   * @param document_id - The ID of the document, must not be null.
   * @param type - The ID of the type of the attachment, must not be null.
   * @param original - A boolean value to indicate if the attachment is original or not.
   * @param path - The path to the attachment, must not be null.
   * @returns A Promise that resolves to the ID of the attachment if it has been successfully added.
   */
  async addAttachment(document_id: number, type: string, original: boolean, path: string): Promise<{ id: number }> {
    return this.dao.addAttachment(document_id, type, original, path);
    }

    /**
     * retrieves all attachments of a document by delegating to the DAO layer.
     * @param document_id - The ID of the document, must not be null.
     * @returns A Promise that resolves to an array of attachments.
     * @throws Error if the attachments cannot be retrieved.
     * */
    async getAttachments(document_id: number): Promise<Attachment[]> {
      return this.dao.getAttachments(document_id);
    }
}

export default AttachmentController;