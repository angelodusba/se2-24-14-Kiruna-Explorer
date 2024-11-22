import DocumentDAO from "../../dao/documentDAO";
import * as db from "../../db/db";
import FilteredDocumentsResponse from "../../response/filteredDocumentsResponse";
import Document from "../../models/document";
import Type from "../../models/type";

jest.mock("../../db/db");

describe("DocumentDAO", () => {
  let documentDAO: DocumentDAO;

  beforeEach(() => {
    documentDAO = new DocumentDAO();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should construct the correct SQL query with filters", async () => {
    const mockQuery = jest.spyOn(db, "query").mockResolvedValue({
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
      rows: [
        {
          id: 1,
          title: "Document Title 1",
          description: "Description 1",
          type_id: 1,
          type_name: "Type 1",
          issue_date: "2023-01-01",
          scale: "1:1000",
          language: "English",
          pages: 10,
          stakeholders: ["Stakeholder 1"],
          total_rows: 1,
        },
      ],
    });

    const filters = {
      title: "Test",
      description: "Description",
      start_year: "2020",
      end_year: "2023",
      scales: ["1:1000"],
      types: [1],
      languages: ["English"],
      stakeholders: [1],
    };

    const result = await documentDAO.getFilteredDocuments(
      1,
      10,
      "title:asc",
      filters.title,
      filters.description,
      filters.start_year,
      filters.end_year,
      filters.scales,
      filters.types,
      filters.languages,
      filters.stakeholders
    );

    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining(
        "SELECT D.id, D.title, D.description, D.type_id, T.name AS type_name"
      ),
      expect.arrayContaining([
        "Test",
        "Description",
        2020,
        "2023",
        ["1:1000"],
        [1],
        ["English"],
        [1],
        10,
      ])
    );

    expect(result.docs).toHaveLength(1);
    expect(result.docs[0].title).toBe("Document Title 1");
  });

  it("should handle empty results gracefully", async () => {
    const mockQuery = jest.spyOn(db, "query").mockResolvedValue({
      command: "SELECT",
      rowCount: 0,
      oid: 0,
      fields: [],
      rows: [],
    });

    const result = await documentDAO.getFilteredDocuments(1, 10, "title:asc");

    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(result.docs).toHaveLength(0);
  });
  it("should construct SQL with correct filters and pagination", async () => {
    const mockQuery = jest.spyOn(db, "query").mockResolvedValue({
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
      rows: [
        {
          id: 1,
          title: "Document Title 1",
          description: "Description 1",
          type_id: 1,
          type_name: "Type 1",
          issue_date: "2023-01-01",
          scale: "1:1000",
        },
      ],
    });
  });
  it("should return the correct response object", async () => {
    const mockQuery = jest.spyOn(db, "query").mockResolvedValue({
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
      rows: [
        {
          id: 1,
          title: "Document Title 1",
          description: "Description 1",
          type_id: 1,
          type_name: "Type 1",
          issue_date: "2023-01-01",
          scale: "1:1000",
        },
      ],
    });
    const result = await documentDAO.getFilteredDocuments(1, 10, "title:asc");
    expect(result).toBeInstanceOf(FilteredDocumentsResponse);
    expect(result.docs).toHaveLength(1);
    expect(result.docs[0]).toBeInstanceOf(Document);
  });
  it("should return the correct response object with empty results", async () => {
    const mockQuery = jest.spyOn(db, "query").mockResolvedValue({
      command: "SELECT",
      rowCount: 0,
      oid: 0,
      fields: [],
      rows: [],
    });
    const result = await documentDAO.getFilteredDocuments(1, 10, "title:asc");
    expect(result).toBeInstanceOf(FilteredDocumentsResponse);
    expect(result.docs).toHaveLength(0);
  });
  // add more test to reach 100% coverage
  it("should construct SQL with correct sorting", async () => {
    const mockQuery = jest.spyOn(db, "query").mockResolvedValue({
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
      rows: [
        {
          id: 1,
          title: "Document Title 1",
          description: "Description 1",
          type_id: 1,
          type_name: "Type 1",
          issue_date: "2023-01-01",
          scale: "1:1000",
        },
      ],
    });

    const result = await documentDAO.getFilteredDocuments(
      1,
      10,
      "issue_date:desc"
    );

    expect(result.docs).toHaveLength(1);
  });

  it("should throw an error if the query fails", async () => {
    const mockQuery = jest
      .spyOn(db, "query")
      .mockRejectedValue(new Error("Database error"));

    await expect(
      documentDAO.getFilteredDocuments(1, 10, "title:asc")
    ).rejects.toThrow("Database error");

    expect(mockQuery).toHaveBeenCalledTimes(1);
  });
  it("should handle multiple filters simultaneously", async () => {
    const mockQuery = jest.spyOn(db, "query").mockResolvedValue({
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
      rows: [
        {
          id: 1,
          title: "Document Title 1",
          description: "Description 1",
          type_id: 1,
          type_name: "Type 1",
          issue_date: "2023-01-01",
          scale: "1:1000",
          language: "English",
          pages: 10,
          stakeholders: ["Stakeholder 1"],
          total_rows: 1,
        },
      ],
    });

    const result = await documentDAO.getFilteredDocuments(
      1,
      10,
      "title:asc",
      "Test",
      "Description",
      "2020",
      "2023",
      ["1:1000"],
      [1],
      ["English"],
      [1]
    );

    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("AND D.title ILIKE"),
      expect.arrayContaining([
        "Test",
        "Description",
        2020,
        "2023",
        ["1:1000"],
        [1],
        ["English"],
        [1],
        10,
      ])
    );
    expect(result.docs).toHaveLength(1);
  });
  it("should calculate pagination offset correctly", async () => {
    const mockQuery = jest.spyOn(db, "query").mockResolvedValue({
      command: "SELECT",
      rowCount: 1,
      oid: 0,
      fields: [],
      rows: [
        {
          id: 1,
          title: "Document Title 1",
          description: "Description 1",
          type_id: 1,
          type_name: "Type 1",
          issue_date: "2023-01-01",
          scale: "1:1000",
        },
      ],
    });

    const result = await documentDAO.getFilteredDocuments(2, 10, "title:asc");

    const expectedOffset = 10; // page 2, size 10
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining(`OFFSET ${expectedOffset}`),
      expect.any(Array)
    );
  });
});
