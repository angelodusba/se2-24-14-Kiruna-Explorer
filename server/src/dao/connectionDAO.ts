import * as db from "../db/db";
import DocumentDAO from "./documentDAO";
import { ConnectionAlreadyExistsError } from "../errors/connectionErrors";

class ConnectionDAO {
    /**
     * Creates a new connection.
     * @param document_id_1 - The id of the first document. It must not be null.
     * @param document_id_2 - The id of the second document. It must not be null.
     * @param direct_conn - boolean that indicates if the connection is direct or not.
     * @param collateral_conn - boolean that indicates if the connection is collateral or not.
     * @param prevision_conn - boolean that indicates if the connection is prevision or not.
     * @param update_conn - boolean that indicates if the connection is update or not.
     * 1 HOT encoding for the connection type.
     */

    async createConnection(
        document_id_1: number,
        document_id_2: number,
        connection_type: string
    ): Promise<boolean> {
        try {
            // encode the connection type
            let direct_conn, collateral_conn, prevision_conn, update_conn;
            direct_conn = collateral_conn = prevision_conn = update_conn = false;
            switch (connection_type) {
                case "direct_conn":
                    direct_conn = true;
                    break;
                case "collateral_conn":
                    collateral_conn = true;
                    break;
                case "prevision_conn":
                    prevision_conn = true;
                    break;
                case "update_conn":
                    update_conn = true;
                    break;
                default:
                    throw new Error("Invalid connection type");
            }
            //Check that document_id_1 and document_id_2 are not the same
            // and they exists in the database
            const docDAO = new DocumentDAO();
            const doc1 = await docDAO.getDocumentById(document_id_1);
            const doc2 = await docDAO.getDocumentById(document_id_2);
            if (!doc1 || !doc2) {
                throw new Error("Invalid document id");
            }
            // Sort document_id_1 and document_id_2
            if (document_id_1 > document_id_2) {
                const temp = document_id_1;
                document_id_1 = document_id_2;
                document_id_2 = temp;
            }
            //Insert the connection in the database
            await db.query("BEGIN", []);
            const sql = `INSERT INTO connections (document_id_1, document_id_2, direct_conn, collateral_conn, prevision_conn, update_conn) VALUES ($1, $2, $3, $4, $5, $6)`;
            await db.query(sql, [document_id_1, document_id_2, direct_conn, collateral_conn, prevision_conn, update_conn]);
            await db.query("COMMIT", []);
            return true;
        } catch (err: any) {
            await db.query("ROLLBACK", []);
            if(err.message.includes("duplicate key value violates unique constraint")) {
                throw new Error("Connection already exists between: " + document_id_1 + " and " + document_id_2 );
            }
            throw new Error(err);
        }
    }

    /**
     * Get all connections from the database.
     * @param no params
     * @returns A Promise that resolves to an array of connections.
     * Connection is reformatted as string
     */
    async getConnections(): Promise<any[]> {
        try {
            const sql = `SELECT * FROM connections`;
            const result = await db.query(sql, []);
            return result.rows.map((row: any) => {
                return {
                    document_id_1: row.document_id_1,
                    document_id_2: row.document_id_2,
                    connection_type: row.direct_conn ? "direct_conn" : row.collateral_conn ? "collateral_conn" : row.prevision_conn ? "prevision_conn" : "update_conn"
                };
            });
            return result.rows;
        } catch (err: any) {
            throw new Error(err);
        }
    }

    /**
     * From the header of connection table, 
     * get the connection names for a document.
     * @param no params
     */
    async getConnectionNames(): Promise<string[]> {
        try {
            const sql = `SELECT column_name FROM information_schema.columns WHERE table_name = 'connections' AND column_name NOT IN ('document_id_1', 'document_id_2')`;
            const result = await db.query(sql, []);
            return result.rows.map((row: { column_name: string }) => row.column_name);
        } catch (err: any) {
            throw new Error(err);
        }
    }

}

export default ConnectionDAO;
