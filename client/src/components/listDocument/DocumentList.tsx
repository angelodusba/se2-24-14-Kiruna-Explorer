import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
} from "@mui/material";
import DocumentAPI from "../../API/DocumentAPI";
import FilterListIcon from "@mui/icons-material/FilterList";
import { MenuItem } from "@mui/material";
import { SearchFilter } from "../../models/SearchFilter";
import Pagination from "@mui/material/Pagination";

interface Document {
  id: number;
  title: string;
  description: string;
  type: string;
  issue_date: string;
  scale: string;
  language: string;
  pages: number;
}

function DocumentList({ open, onClose, currentFilter }: { open: boolean; onClose: () => void; currentFilter: SearchFilter }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  //this is for filtering options
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<"id" | "pages" >("id");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);

  const handleChangePage = async (event: React.ChangeEvent<unknown>, value: number) => {
    if (totalRows >= (value-1) * rowsPerPage) {
      setPage(value);
      const documentsList = await DocumentAPI.getFilteredDocuments(currentFilter, value, rowsPerPage);
      const formatted = documentsList.docs.map((doc) => {
        return {
          id: doc.id,
            title: doc.title,
            description: doc.description,
            type: doc.type.name,
            issue_date: doc.issue_date,
            scale: doc.scale,
            language: doc.language,
            pages: doc.pages,
        }});
      setDocuments(formatted);
    }
    else{
      return;
    }
  }

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        if (!currentFilter) {
          const documentsList = await DocumentAPI.getDocumentsLocation();
          const formatted = documentsList.map((doc) => {
            return {
              id: doc.id,
              title: doc.title,
              description: doc.description,
              type: doc.type.name,
              issue_date: doc.issue_date,
              scale: doc.scale,
            }});
          setDocuments(formatted);
          return;
        }
        const documentsList = await DocumentAPI.getFilteredDocuments(currentFilter, page, rowsPerPage);
        setTotalRows(documentsList.totalRows);
        setTotalPages(documentsList.totalPages);
        const formatted = documentsList.docs.map((doc) => {
          return {
            id: doc.id,
            title: doc.title,
            description: doc.description,
            type: doc.type.name,
            issue_date: doc.issue_date,
            scale: doc.scale,
            language: doc.language,
            pages: doc.pages,
          }});
        setDocuments(formatted);
      } catch (err) {
        setError("Error fetching documents");
        console.error("Error:", err);
      }
    };

    fetchDocuments();
  }, [currentFilter]);



  //this is for sorting the table
  const handleSort = (field: "id" | "pages") => {
     const sortedDocuments = [...documents].sort((a, b) => {
    if (sortOrder === "asc") {
      return a[field] > b[field] ? 1 : -1;
    }else{
      return a[field] < b[field] ? 1 : -1;
    }
  });
  setDocuments(sortedDocuments);
  setSortField(field);
  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  setAnchorEl(null);
  }

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }
  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Document List</DialogTitle>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingRight: "25px",
        }}
      >
        <IconButton
          aria-label="filter list"
          onClick={handleFilterClick}
          sx={{ float: "right" }}
        >
          <FilterListIcon />
        </IconButton>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleFilterClose}
      >
        <MenuItem onClick={() => handleSort("id")}>
          Sort by ID ({sortOrder === "asc" ? "Ascending" : "Descending"})
        </MenuItem>
        <MenuItem onClick={() => handleSort("pages")}>
          Sort by page number (
          {sortOrder === "asc" ? "Ascending" : "Descending"})
        </MenuItem>
      </Menu>
      <DialogContent>
        {error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table aria-label="document table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Issue Date</TableCell>
                  <TableCell>Scale</TableCell>
                  <TableCell>Language</TableCell>
                  <TableCell>Pages</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>{document.id}</TableCell>
                    <TableCell>{document.title}</TableCell>
                    <TableCell>{document.description}</TableCell>
                    <TableCell>{document.type}</TableCell>
                    <TableCell>{document.issue_date}</TableCell>
                    <TableCell>{document.scale}</TableCell>
                    <TableCell>{document.language}</TableCell>
                    <TableCell>{document.pages}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Pagination
          count={Math.ceil(totalRows / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
        />
        <Button onClick={onClose} color="error">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentList;
