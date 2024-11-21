import ConnectionDAO from "../../dao/connectionDAO";
import * as db from "../../db/db";
import {
  InvalidConnectionTypeError,
  ConnectionAlreadyExistsError,
} from "../../errors/connectionErrors";
import { DocumentNotFoundError } from "../../errors/documentErrors";

jest.mock("../../db/db");
jest.mock("../../dao/documentDAO", () => {
  return jest.fn().mockImplementation(() => {
    return {
      getDocumentById: jest.fn().mockImplementation((id: any) => {
        if (id === -1) {
          return Promise.resolve(null);
        }
        return Promise.resolve({ id });
      }),
    };
  });
});

describe("ConnectionDAO", () => {
  let connectionDAO: ConnectionDAO;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    connectionDAO = new ConnectionDAO();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("createConnection", () => {
    test("should create a new connection", async () => {
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const result = await connectionDAO.createConnection(1, 2, [
        "direct_conn",
      ]);

      expect(result).toBe(true);
      expect(db.query).toHaveBeenCalledWith(expect.any(String), [
        1,
        2,
        true,
        false,
        false,
        false,
      ]);
    });

    test("should throw error if documents do not exist", async () => {
      (db.query as jest.Mock).mockRejectedValueOnce(
        new Error(
          '"documents".insert or update on table "connections" violates foreign key constraint'
        )
      );
      await expect(
        connectionDAO.createConnection(1, -1, ["direct_conn"])
      ).rejects.toBeInstanceOf(DocumentNotFoundError);
    });

    test("should throw error if connection already exists", async () => {
      (db.query as jest.Mock).mockRejectedValueOnce(
        new Error("duplicate key value violates unique constraint")
      );

      await expect(
        connectionDAO.createConnection(1, 2, ["direct_conn"])
      ).rejects.toBeInstanceOf(ConnectionAlreadyExistsError);
    });
  });

  describe("getConnections", () => {
    test("should return all connections", async () => {
      const mockConnections = [
        {
          document_id_1: 1,
          document_id_2: 2,
          direct_conn: true,
          collateral_conn: false,
          prevision_conn: false,
          update_conn: false,
        },
      ];
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: mockConnections });

      const result = await connectionDAO.getConnections();

      expect(result).toEqual([
        {
          id_doc1: 1,
          id_doc2: 2,
          connection_types: ["direct_conn"],
        },
      ]);
    });
  });

  describe("getConnectionNames", () => {
    test("should return connection names", async () => {
      const mockColumns = [
        { column_name: "direct_conn" },
        { column_name: "collateral_conn" },
        { column_name: "prevision_conn" },
        { column_name: "update_conn" },
      ];
      (db.query as jest.Mock).mockResolvedValueOnce({ rows: mockColumns });

      const result = await connectionDAO.getConnectionNames();

      expect(result).toEqual([
        "direct_conn",
        "collateral_conn",
        "prevision_conn",
        "update_conn",
      ]);
    });
  });
});
