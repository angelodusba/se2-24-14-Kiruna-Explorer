import { useEffect, useState } from "react";
import { SearchFilter } from "../models/SearchFilter";
import DocumentAPI from "../API/DocumentAPI";
import DocumentsList from "../components/listDocument/DocumentsList";

interface Document {
  id: number;
  title: string;
  description: string;
  type_name: string;
  issue_date: string;
  scale: string;
  language: string;
  pages: number;
}

interface SortField {
  field: keyof Document;
}

function DocumentsListPage({ currentFilter, handleCardShow }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  //this is for filtering options
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<SortField>({ field: "title" });

  const handleChangePage = async (_event: React.ChangeEvent<unknown>, value: number) => {
    if (totalRows >= (value - 1) * rowsPerPage) {
      setPage(value);
      await fetchDocuments(sortField, sortOrder, value);
    }
  };

  const fetchDocuments = async (sortField, sortOrder, pageImmediate = null) => {
    try {
      const sort = sortField.field + ":" + sortOrder;
      let filter = currentFilter;
      if (!currentFilter) {
        filter = { title: "" };
      }
      const fetchPage = pageImmediate ? pageImmediate : page;
      const documentsList = await DocumentAPI.getFilteredDocuments(
        filter,
        fetchPage,
        rowsPerPage,
        sort
      );
      setTotalRows(documentsList.totalRows);
      setTotalPages(documentsList.totalPages);
      const formatted = documentsList.docs.map((doc) => {
        return {
          id: doc.id,
          title: doc.title,
          description: doc.description,
          type_name: doc.type.name,
          issue_date: doc.issue_date,
          scale: doc.scale,
          language: doc.language,
          pages: doc.pages,
        };
      });
      setDocuments(formatted);
    } catch (err) {
      setError("Error fetching documents");
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    fetchDocuments(sortField, sortOrder);
  }, [currentFilter]);

  //this is for sorting the table
  const handleSort = (field: SortField) => {
    setSortField(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    fetchDocuments(field, sortOrder === "asc" ? "desc" : "asc");
    setAnchorEl(null);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      style={{
        backgroundColor: "lightblue",
        display: "flex",
        flexGrow: 1,
        height: "100vh",
        paddingTop: "65px",
      }}
    >
      <DocumentsList
        handleFilterClick={handleFilterClick}
        anchorEl={anchorEl}
        handleFilterClose={handleFilterClose}
        handleSort={handleSort}
        sortOrder={sortOrder}
        error={error}
        documents={documents}
        handleCardShow={handleCardShow}
        rowsPerPage={rowsPerPage}
        page={page}
        totalRows={totalRows}
        handleChangePage={handleChangePage}
      />
    </div>
  );
}

export default DocumentsListPage;
