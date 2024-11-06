import ConnectionDAO from "../dao/connectionDAO";
import Connection from "../models/connection";
import ConnectionByDocumentIdResponse from "../response/connectionsByDocumentIdResponse";

/**
 * Represents a controller for managing connections.
 * All methods of this class must interact with the corresponding DAO class to retrieve or store data.
 */

class ConnectionController {
  private dao: ConnectionDAO;

  constructor() {
    this.dao = new ConnectionDAO();
  }

  /**
   * Creates a number of new connections.
   * @param starting_document_id - The id of the document that the connections start from.
   * @param connections - The list of connections to create.
   */
  async createConnections(
    starting_document_id: number,
    connections: { connected_document_id: number; connection_types: string[] }[]
  ): Promise<boolean> {
    try {
      // Process all connections concurrently
      await Promise.all(
        connections.map(async (connection) => {
          await this.dao.createConnection(
            starting_document_id,
            connection.connected_document_id,
            connection.connection_types
          );
        })
      );
      return true; // Return true if all connections are successfully created
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Get all the connections.
   * @returns A list of all the connections.
   */
  async getConnections(): Promise<Connection[]> {
    return this.dao.getConnections();
  }

  /**
   * Get all the connections related to a certain document.
   * @param document_id - The id of the document used to filter the connections.
   * @returns A list of filtered connections.
   */
  async getConnectionsByDocumentId(document_id: number): Promise<ConnectionByDocumentIdResponse[]> {
    return this.dao.getConnectionsByDocumentId(document_id);
  }

  /**
   * Get the connection names for a document.
   */
  async getConnectionNames(): Promise<string[]> {
    return this.dao.getConnectionNames();
  }

  /**
   * Update the connections of an existing document.
   * @param starting_document_id - The id of the document the connections start from.
   * @param connections - The list of connections to create.
   */
  async updateConnections(
    starting_document_id: number,
    connections: { connected_document_id: number; connection_types: string[] }[]
  ): Promise<boolean> {
    try {
      // Delete previous connections of starting document
      const res = await this.dao.deleteConnectionsByDocumentId(starting_document_id);
      if (!res) throw new Error("An error occurred while updating the connections.");
      // Insert the new connections
      await Promise.all(
        connections.map(async (connection) => {
          await this.dao.createConnection(
            starting_document_id,
            connection.connected_document_id,
            connection.connection_types
          );
        })
      );
      return true; // Return true if all connections are successfully created
    } catch (err: any) {
      throw err;
    }
  }
}

export default ConnectionController;
