import ConnectionDAO from "../dao/connectionDAO";

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
   * @param connections[i].connected_document_id - Number, The id of the document that the connection goes to.
   * @param connections[i].connection_name - String, The name of the connection.
   */

  async createConnections(
    starting_document_id: number,
    connections: { connected_document_id: number, connection_name: string }[]
  ): Promise<boolean> {
    try {
      for (let i = 0; i < connections.length; i++) {
        await this.dao.createConnection(starting_document_id, connections[i].connected_document_id, connections[i].connection_name);
      }
      return true;
    } catch (err: any) {
      throw err;
    }
  } 

  /**
   * Get all the connections
   * @returns A list of all the connections.
   * @example 
   * [
   * { document_id_1: 1, document_id_2 : 2, 
   * connection_name: "direct_conn"},
   * { document_id_1: 1, document_id_2 : 3,
   * connection_name: "collateral_conn" }
   * ]
   */

  async getConnections(): Promise<{ document_id_1: number, document_id_2: number, connection_name: string }[]> {
    try {
      return this.dao.getConnections();
    } catch (err: any) {
      throw err;
    }
  }

  /**
   * Get the connection names for a document.
   */
  async getConnectionNames(): Promise<string[]> {
    try {
      return this.dao.getConnectionNames();
    } catch (err: any) {
      throw new Error(err);
    }
  }
  
}

export default ConnectionController;