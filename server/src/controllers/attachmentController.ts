import Attachment from "../models/attachment";
import AttachmentDAO from "../dao/attachmentDAO";
import { promises as fs } from "fs"; // File system operations with promises
import path from "path";
import { AttachmentNotFoundError } from "../errors/attachmentErrors";

const BASE_PATH = path.resolve(__dirname, "../../public/docs");

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
  async addAttachment(
    document_id: number,
    type: string,
    original: boolean,
    path: string
  ): Promise<Attachment> {
    //console.log(document_id, type, original, path);
    return this.dao.addAttachment(document_id, type, original, path);
  }

  /**
   * Retrieves all the attachments of a document.
   * @param document_id - The ID of the document, must not be null.
   * @returns A Promise that resolves to an array of attachments.
   * */
  async getAttachments(document_id: number): Promise<Attachment[]> {
    return this.dao.getAttachments(document_id);
  }

  /**
   * Delete a single attachment related to a document.
   * @param attachment_id - The ID of the attachment to delete, must not be null.
   * @returns A Promise that resolves to a boolean if the operation has been correctly completed.
   * */
  async deleteAttachment(attachment_id: number): Promise<boolean> {
    try {
      // Retrieve file path information
      const attachment = await this.dao.getAttachment(attachment_id);
      // Attempt to delete the attachment in the database
      await this.dao.deleteAttachment(attachment_id);
      // Delete the file from disk
      const fullPath = path.join(BASE_PATH, attachment.path);
      await fs.unlink(fullPath);
      return true;
    } catch (err: any) {
      if (err.message.includes("ENOENT: no such file or directory")) {
        throw new AttachmentNotFoundError();
      }
      throw err;
    }
  }
}

export default AttachmentController;
