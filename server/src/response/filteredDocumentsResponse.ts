import Document from "../models/document";

class FilteredDocumentsResponse {
  docs: Document[];
  totalRows: number;
  totalPages: number;

  constructor(docs: Document[], totalRows: number, totalPages: number) {
    this.docs = docs;
    this.totalRows = totalRows;
    this.totalPages = totalPages;
  }
}

export default FilteredDocumentsResponse;
