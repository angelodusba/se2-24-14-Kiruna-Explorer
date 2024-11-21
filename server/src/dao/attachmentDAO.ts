import * as db from "../db/db";
import { AttachmentNotFoundError } from "../errors/attachmentErrors";
import Attachment from "../models/attachment";

class AttachmentDAO {
  /**
   * Add a new attachment to a document.
   * @param document_id Document id.
   * @param type Type of attachment.
   * @param original Boolean value that indicates if the attachment is original or not.
   * @param path Path where the attachment has been stored on disk.
   * @return A Promise that resolves to the attachment id if it has been successfully added.
   */
  async addAttachment(
    document_id: number,
    type: string,
    original: boolean,
    path: string
  ): Promise<Attachment> {
    try {
      const sql = `INSERT INTO attachments (document_id, type, original, path) VALUES ($1, $2, $3, $4) RETURNING id`;
      const res = await db.query(sql, [document_id, type, original, path]);
      //check for errors
      if (!res.rows || res.rows.length === 0)
        throw new Error("Unable to add the attachment right now, try again later");
      const attachment_id = res.rows[0].id;
      return new Attachment(Number(attachment_id), document_id, type, original, path);
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Get all attachments of a document.
   * @param document_id Document id.
   * @return A Promise that resolves to an array of attachments.
   */
  async getAttachments(document_id: number): Promise<Attachment[]> {
    try {
      const sql = `SELECT * FROM attachments WHERE document_id=$1`;
      const res = await db.query(sql, [document_id]);
      return res.rows.map(
        (row) => new Attachment(row.id, row.document_id, row.type, row.original, row.path)
      );
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Retrieve a specific attachment.
   * @param attachment_id Attachment id.
   * @return A Promise that resolves to an array of attachments.
   */
  async getAttachment(attachment_id: number): Promise<Attachment> {
    try {
      const sql = `SELECT * FROM attachments WHERE id=$1`;
      const res = await db.query(sql, [attachment_id]);
      if (res.rows.length === 0) {
        throw new AttachmentNotFoundError();
      }
      const attachment = res.rows[0];
      return new Attachment(
        attachment.id,
        attachment.document_id,
        attachment.type,
        attachment.original,
        attachment.path
      );
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Delete a single attachment related to a document.
   * @param attachment_id - The ID of the attachment to delete.
   * @returns A Promise that resolves to a boolean if the operation has been correctly completed.
   * */
  async deleteAttachment(attachment_id: number): Promise<boolean> {
    try {
      const sql = `DELETE FROM attachments WHERE id=$1`;
      const res = await db.query(sql, [attachment_id]);
      if (res.rowCount === 0) {
        throw new AttachmentNotFoundError();
      }
      return true;
    } catch (err: any) {
      throw err;
    }
  }
}

export default AttachmentDAO;
