import DocumentController from "../../../controllers/documentController";
import DocumentDAO from "../../../dao/documentDAO";
import FilteredDocumentsResponse from "../../../response/filteredDocumentsResponse";
import Document from "../../../models/document";
import Type from "../../../models/type";

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

  test("should get filtered documents", async () => {
    const mockFilteredDocumentsResponse = new FilteredDocumentsResponse(
      [
        new Document(
          1,
          "Test Document",
          "Description",
          new Type(1, "Type 1"),
          "2023-01-01",
          "1:1000",
          [],
          "English",
          "10"
        ),
      ],
      1,
      1
    );

    const mockGetFilteredDocuments = jest
      .spyOn(documentDAO, "getFilteredDocuments")
      .mockResolvedValue(mockFilteredDocumentsResponse);

    const filters = {
      page: 1,
      size: 10,
      sort: "title:asc",
      title: "Test",
      keywords: ["Description"],
      start_year: "2020",
      end_year: "2023",
      scales: ["1:1000"],
      types: [1],
      languages: ["English"],
      stakeholders: [1],
    };

    const result = await documentController.getFilteredDocuments(
      filters.page,
      filters.size,
      filters.sort,
      filters.title,
      filters.start_year,
      filters.end_year,
      filters.scales,
      filters.types,
      filters.languages,
      filters.stakeholders,
      undefined,
      filters.keywords
    );

    expect(mockGetFilteredDocuments).toHaveBeenCalledTimes(1);

    expect(result).toEqual(mockFilteredDocumentsResponse);
  });

  test("should get filtered documents with no filters", async () => {
    const mockFilteredDocumentsResponse = new FilteredDocumentsResponse(
      [
        new Document(
          1,
          "Test Document",
          "Description",
          new Type(1, "Type 1"),
          "2023-01-01",
          "1:1000",
          [],
          "English",
          "10"
        ),
      ],
      1,
      1
    );

    const mockGetFilteredDocuments = jest
      .spyOn(documentDAO, "getFilteredDocuments")
      .mockResolvedValue(mockFilteredDocumentsResponse);

    const result = await documentController.getFilteredDocuments();
    expect(mockGetFilteredDocuments).toHaveBeenCalledTimes(1);

    expect(result).toEqual(mockFilteredDocumentsResponse);
  });
  test("should handle errors from DAO", async () => {
    const mockGetFilteredDocuments = jest
      .spyOn(documentDAO, "getFilteredDocuments")
      .mockRejectedValue(new Error("DAO Error"));

    const filters = {
      page: 1,
      size: 10,
      sort: "title:asc",
      title: "Test",
    };

    await expect(
      documentController.getFilteredDocuments(
        filters.page,
        filters.size,
        filters.sort,
        filters.title
      )
    ).rejects.toThrow("DAO Error");

    expect(mockGetFilteredDocuments).toHaveBeenCalledTimes(1);
  });
  test("should get filtered documents with partial filters", async () => {
    const mockFilteredDocumentsResponse = new FilteredDocumentsResponse(
      [
        new Document(
          1,
          "Test Document",
          "Description",
          new Type(1, "Type 1"),
          "2023-01-01",
          "1:1000",
          [],
          "English",
          "10"
        ),
      ],
      1,
      1
    );

    const mockGetFilteredDocuments = jest
      .spyOn(documentDAO, "getFilteredDocuments")
      .mockResolvedValue(mockFilteredDocumentsResponse);

    const filters = {
      page: 1,
      size: 10,
      sort: "title:asc",
      title: "Test",
    };

    const result = await documentController.getFilteredDocuments(
      filters.page,
      filters.size,
      filters.sort,
      filters.title
    );

    expect(mockGetFilteredDocuments).toHaveBeenCalledTimes(1);

    expect(result).toEqual(mockFilteredDocumentsResponse);
  });
});
