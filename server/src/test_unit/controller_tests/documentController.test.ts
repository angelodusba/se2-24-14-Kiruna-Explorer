import DocumentController from "../../controllers/documentController";
import DocumentDAO from "../../dao/documentDAO";

// Mock the DocumentDAO class
jest.mock("../../dao/documentDAO");

describe("DocumentController", () => {
  let documentController: DocumentController;
  let mockDocumentDAO: jest.Mocked<DocumentDAO>;

  beforeEach(() => {
    // Create a new instance of the mocked DocumentDAO
    mockDocumentDAO = new DocumentDAO() as jest.Mocked<DocumentDAO>;
    // Create a new instance of DocumentController
    documentController = new DocumentController();
    // Replace the dao instance with the mocked one
    documentController["dao"] = mockDocumentDAO;
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  describe("createDocument", () => {
    it("should create a new document successfully", async () => {
      // Mock the createDocument method to resolve to true
      mockDocumentDAO.createDocument.mockResolvedValue(true);

      const documentData = {
        title: "Test Document",
        description: "This is a test document.",
        type_id: 1,
        issue_date: "2023",
        scale: "1:1000",
        location: [{ lat: 67.848556, lng: 20.300333 }],
        language: "English",
        pages: "10",
        stakeholders: [1, 2],
      };

      const result = await documentController.createDocument(
        documentData.title,
        documentData.description,
        documentData.type_id,
        documentData.issue_date,
        documentData.scale,
        documentData.location,
        documentData.language,
        documentData.pages,
        documentData.stakeholders
      );

      expect(result).toBe(true);
      expect(mockDocumentDAO.createDocument).toHaveBeenCalledWith(
        documentData.title,
        documentData.description,
        documentData.type_id,
        documentData.issue_date,
        documentData.scale,
        "20.300333 67.848556",
        documentData.language,
        documentData.pages,
        documentData.stakeholders
      );
    });

    it("should handle errors when creating a document", async () => {
      // Mock the createDocument method to reject with an error
      mockDocumentDAO.createDocument.mockRejectedValue(
        new Error("Failed to create document")
      );

      const documentData = {
        title: "Test Document",
        description: "This is a test document.",
        type_id: 1,
        issue_date: "2023",
        scale: "1:1000",
        location: [{ lat: 67.848556, lng: 20.300333 }],
        language: "English",
        pages: "10",
        stakeholders: [1, 2],
      };

      await expect(
        documentController.createDocument(
          documentData.title,
          documentData.description,
          documentData.type_id,
          documentData.issue_date,
          documentData.scale,
          documentData.location,
          documentData.language,
          documentData.pages,
          documentData.stakeholders
        )
      ).rejects.toThrow("Failed to create document");
    });
  });

  describe("getDocumentsNames", () => {
    it("should retrieve all document names successfully", async () => {
      const documents = [
        { id: 1, title: "Document 1" },
        { id: 2, title: "Document 2" },
      ];
      mockDocumentDAO.getDocumentsNames.mockResolvedValue(documents);

      const result = await documentController.getDocumentsNames();

      expect(result).toEqual(documents);
      expect(mockDocumentDAO.getDocumentsNames).toHaveBeenCalled();
    });

    it("should handle errors when retrieving document names", async () => {
      mockDocumentDAO.getDocumentsNames.mockRejectedValue(
        new Error("Failed to retrieve documents")
      );

      await expect(documentController.getDocumentsNames()).rejects.toThrow(
        "Failed to retrieve documents"
      );
    });
  });
});
