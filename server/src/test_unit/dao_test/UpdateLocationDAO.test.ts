import DocumentDAO from "../../dao/documentDAO";
import * as db from "../../db/db";
import { DocumentNotFoundError } from "../../errors/documentErrors";

jest.mock("../../db/db");

describe("DocumentDAO", () => {
  let documentDAO: DocumentDAO;

  beforeEach(() => {
    documentDAO = new DocumentDAO();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should update the document location to a single point", async () => {
    const mockQuery = jest.spyOn(db, "query").mockResolvedValue({
      rowCount: 1,
      rows: [],
      command: "UPDATE",
      oid: 0,
      fields: [],
    });

    const documentId = 1;
    const location = "40.7128 -74.0060";

    const result = await documentDAO.updateDocumentLocation(
      documentId,
      location
    );

    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledWith(expect.any(String), [documentId]);
    expect(result).toBe(true);
  });

  test("should update the document location to a polygon", async () => {
    const mockQuery = jest.spyOn(db, "query").mockResolvedValue({
      rowCount: 1,
      rows: [],
      command: "UPDATE",
      oid: 0,
      fields: [],
    });

    const documentId = 1;
    const location = "40.7128 -74.0060, 40.7138 -74.0070";

    const result = await documentDAO.updateDocumentLocation(
      documentId,
      location
    );

    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledWith(expect.any(String), [documentId]);
    expect(result).toBe(true);
  });

  test("should update the document location to NULL for entire municipality area", async () => {
    const mockQuery = jest.spyOn(db, "query").mockResolvedValue({
      rowCount: 1,
      rows: [],
      command: "UPDATE",
      oid: 0,
      fields: [],
    });

    const documentId = 1;
    const location = "";

    const result = await documentDAO.updateDocumentLocation(
      documentId,
      location
    );

    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledWith(expect.any(String), [documentId]);
    expect(result).toBe(true);
  });

  test("should throw DocumentNotFoundError if the document does not exist", async () => {
    const mockQuery = jest.spyOn(db, "query").mockResolvedValue({
      rowCount: 0, // Simulate document not found
      rows: [],
      command: "UPDATE",
      oid: 0,
      fields: [],
    });

    const documentId = 1;
    const location = "40.7128 -74.0060";

    await expect(
      documentDAO.updateDocumentLocation(documentId, location)
    ).rejects.toThrow(DocumentNotFoundError);

    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledWith(expect.any(String), [documentId]);
  });
});
