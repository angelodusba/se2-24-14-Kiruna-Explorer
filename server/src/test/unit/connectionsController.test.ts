import ConnectionController from "../../controllers/connectionController";
import {
  InvalidConnectionTypeError,
  ConnectionAlreadyExistsError,
} from "../../errors/connectionErrors";
import { DocumentNotFoundError } from "../../errors/documentErrors";

jest.mock("../../dao/connectionDAO", () => {
  return jest.fn().mockImplementation(() => {
    return {
      createConnection: jest.fn().mockImplementation((id: any) => {
        if (id === -1) {
          return Promise.reject(new InvalidConnectionTypeError());
        } else if (id === -2) {
          return Promise.reject(new DocumentNotFoundError());
        } else if (id === -3) {
          return Promise.reject(new ConnectionAlreadyExistsError());
        }
        return Promise.resolve({ id });
      }),
      getConnections: jest.fn().mockImplementation(() => {
        return Promise.resolve([
          {
            document_id_1: 1,
            document_id_2: 2,
            connection_name: "direct_conn",
          },
        ]);
      }),
      getConnectionNames: jest.fn().mockImplementation(() => {
        return Promise.resolve(["direct_conn", "collateral_conn"]);
      }),
    };
  });
});

describe("ConnectionController", () => {
  let connectionController: ConnectionController;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    connectionController = new ConnectionController();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("createConnections", () => {
    test("should create a new connection", async () => {
      let starting_document_id = 1;
      let connections = [
        { connected_document_id: 2, connection_types: ["direct_conn"] },
        { connected_document_id: 3, connection_types: ["collateral_conn"] },
        { connected_document_id: 4, connection_types: ["indirect_conn"] },
      ];
      //mocking the case using starting_document_id = -1
      let result = connectionController.createConnections(
        starting_document_id,
        connections
      );
      expect(result).resolves.toBe(true);
    });

    test("should throw error if connection type is invalid", async () => {
      //mocking this case using a fake implementation of DAO
      let starting_document_id = -1;
      let connections = [
        { connected_document_id: 2, connection_types: ["direct_conn"] },
        { connected_document_id: 3, connection_types: ["collateral_conn"] },
        { connected_document_id: 4, connection_types: ["indirect_conn"] },
      ];
      let result = connectionController.createConnections(
        starting_document_id,
        connections
      );
      expect(result).rejects.toBeInstanceOf(InvalidConnectionTypeError);
    });

    test("should throw error if documents do not exist", async () => {
      //mocking this case using a fake implementation of DAO
      let connections = [
        { connected_document_id: 2, connection_types: ["direct_conn"] },
        { connected_document_id: 3, connection_types: ["collateral_conn"] },
        { connected_document_id: 4, connection_types: ["indirect_conn"] },
      ];
      let result = connectionController.createConnections(-2, connections);
      expect(result).rejects.toBeInstanceOf(DocumentNotFoundError);
    });

    test("should throw error if connection already exists", async () => {
      //mocking this case using a fake implementation of DAO
      let connections = [
        { connected_document_id: 2, connection_types: ["direct_conn"] },
        { connected_document_id: 3, connection_types: ["collateral_conn"] },
        { connected_document_id: 4, connection_types: ["indirect_conn"] },
      ];
      let result = connectionController.createConnections(-3, connections);
      expect(result).rejects.toBeInstanceOf(ConnectionAlreadyExistsError);
    });
  });

  describe("getConnections", () => {
    test("should return all connections", async () => {
      //mocking this case using a fake implementation of DAO
      let result = connectionController.getConnections();
      expect(result).resolves.toEqual([
        { document_id_1: 1, document_id_2: 2, connection_name: "direct_conn" },
      ]);
    });
  });

  describe("getConnectionNames", () => {
    test("should return all connection names", async () => {
      //mocking this case using a fake implementation of DAO
      let result = connectionController.getConnectionNames();
      expect(result).resolves.toEqual(["direct_conn", "collateral_conn"]);
    });
  });
});
