import { useEffect, useState } from "react";
import DocumentAPI from "../API/DocumentAPI";
import DocumentsList from "../components/List/DocumentsList";

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

type SortField = keyof Document;

function DocumentsListPage({ currentFilter }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  //this is for filtering options
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<SortField>("title");

  const handleChangePage = async (_event: React.ChangeEvent<unknown>, value: number) => {
    if (totalRows >= (value - 1) * rowsPerPage) {
      setPage(value);
      await fetchDocuments(sortField, sortOrder, value);
    }
  };

  const fetchDocuments = async (sortField: SortField, sortOrder, pageImmediate = null) => {
    try {
      const sort = sortField + ":" + sortOrder;
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
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    fetchDocuments(sortField, sortOrder);
  }, [currentFilter, rowsPerPage]);

  const handleSort = (field: SortField) => {
    setSortField((oldField) => {
      let order;
      if (oldField !== field) {
        order = "asc";
      } else {
        order = sortOrder === "asc" ? "desc" : "asc";
      }
      setSortOrder(order);
      fetchDocuments(field, order);
      return field;
    });
  };

  return (
    <div style={{ height: "100vh" }}>
      <DocumentsList
        handleSort={handleSort}
        documents={documents}
        rowsPerPage={rowsPerPage}
        page={page}
        totalRows={totalRows}
        totalPages={totalPages}
        handleChangePage={handleChangePage}
        order={sortOrder}
        orderBy={sortField}
      />
    </div>
  );
}

export default DocumentsListPage;
