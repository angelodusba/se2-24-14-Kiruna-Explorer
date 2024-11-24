import DocumentController from "../../../controllers/documentController";
import DocumentDAO from "../../../dao/documentDAO";
import { DocumentNotFoundError } from "../../../errors/documentErrors";

jest.mock("../../../dao/documentDAO");

describe("DocumentController", () => {
  let documentController: DocumentController;
  let documentDAO: DocumentDAO;

  beforeEach(() => {
    documentDAO = new DocumentDAO();
    documentController = new DocumentController();
    (documentController as any).dao = documentDAO; // Inject the mocked DAO
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update the document location", async () => {
    const mockUpdateDocumentLocation = jest
      .spyOn(documentDAO, "updateDocumentLocation")
      .mockResolvedValue(true);

    const id = 1;
    const location = [
      { lat: 40.7128, lng: -74.006 },
      { lat: 40.7138, lng: -74.007 },
    ];

    const result = await documentController.updateDocumentLocation(
      id,
      location
    );

    expect(mockUpdateDocumentLocation).toHaveBeenCalledTimes(1);
    expect(mockUpdateDocumentLocation).toHaveBeenCalledWith(
      id,
      "-74.006 40.7128, -74.007 40.7138"
    );
    expect(result).toBe(true);
  });

  it("should throw DocumentNotFoundError if the document does not exist", async () => {
    const mockUpdateDocumentLocation = jest
      .spyOn(documentDAO, "updateDocumentLocation")
      .mockRejectedValue(new DocumentNotFoundError());

    const id = 1;
    const location = [
      { lat: 40.7128, lng: -74.006 },
      { lat: 40.7138, lng: -74.007 },
    ];

    await expect(
      documentController.updateDocumentLocation(id, location)
    ).rejects.toThrow(DocumentNotFoundError);

    expect(mockUpdateDocumentLocation).toHaveBeenCalledTimes(1);
    expect(mockUpdateDocumentLocation).toHaveBeenCalledWith(
      id,
      "-74.006 40.7128, -74.007 40.7138"
    );
  });
  it("should handle invalid Location data gracefully", async () => {
    const mockUpdateDocumentLocation = jest
      .spyOn(documentDAO, "updateDocumentLocation")
      .mockResolvedValue(true);

    const id = 1;
    const location = [
      { lat: NaN, lng: NaN },
      { lat: 40.7138, lng: -74.007 },
    ];

    const result = await documentController.updateDocumentLocation(
      id,
      location
    );

    expect(mockUpdateDocumentLocation).toHaveBeenCalledTimes(1);
    expect(mockUpdateDocumentLocation).toHaveBeenCalledWith(
      id,
      "NaN NaN, -74.007 40.7138"
    );
    expect(result).toBe(true);
  });
  it("should update the document location with an empty array", async () => {
    const mockUpdateDocumentLocation = jest
      .spyOn(documentDAO, "updateDocumentLocation")
      .mockResolvedValue(true);

    const id = 1;
    const location: { lat: number; lng: number }[] = [];

    const result = await documentController.updateDocumentLocation(
      id,
      location
    );

    expect(mockUpdateDocumentLocation).toHaveBeenCalledTimes(1);
    expect(mockUpdateDocumentLocation).toHaveBeenCalledWith(id, "");
    expect(result).toBe(true);
  });
});
