import React, { useEffect, useState } from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Container, Pagination, Menu, MenuItem, IconButton } from '@mui/material';
import DocumentAPI from '../../API/DocumentAPI';
import FilterListIcon from "@mui/icons-material/FilterList";
import FormModal from '../Forms/FormModal';
import { useNavigate } from 'react-router-dom';

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



function ListMunicipality({ open, onClose, currentFilter, docs, handleCardShow }) {
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<SortField>({ field: "title" });
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  //this is for filtering options
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const navigate = useNavigate();

  const fetchDocuments = async (sortField, sortOrder, pageImmediate=null) => {
    const sort = sortField.field + ":" + sortOrder;
    let filter = currentFilter;
    if (!currentFilter){
      filter = { title: ""}
    }
    let fetchPage = pageImmediate ? pageImmediate : page;
    const response = await DocumentAPI.getFilteredDocuments(filter, undefined, undefined, sort);
    // fiter for location = null
    const filtered = docs.filter(doc => doc.location.length === 0);
    // get the documents that are present both in filtered and in response.docs
    const final = response.docs.filter(doc => filtered.some(f => f.id === doc.id));
    // Clip results to the current page
    const start = (fetchPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    setTotalRows(final.length);
    final.splice(0, start);
    final.splice(end, final.length - end);
    const formatted = final.map((doc) => {
      return {
        id: doc.id,
        title: doc.title,
        description: doc.description,
        type_name: doc.type.name,
        issue_date: doc.issue_date,
        scale: doc.scale,
        language: doc.language,
        pages: doc.pages,
      }
    });
    setDocuments(formatted);
      if (response.docs.length === 0) {
          setError("No documents found");
      }
    };

    const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    }
    const handleFilterClose = () => {
      setAnchorEl(null);
    };
    //this is for sorting the table
    const handleSort = (field: SortField) => {
      setSortField(field);
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      fetchDocuments(field, sortOrder === "asc" ? "desc" : "asc");
      setAnchorEl(null);
      };

      const handleChangePage = async (event: React.ChangeEvent<unknown>, value: number) => {
        if (totalRows >= (value-1) * rowsPerPage) {
          setPage(value);
          await fetchDocuments(sortField, sortOrder, value);
        }
        else{
          return;
        }
      }

    useEffect(() => {
        fetchDocuments(sortField, sortOrder);
    }, [docs]);

    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth
        sx={
          {
            top: "5%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "90%",
            width: "100%",
            p: 1,
          }
        }
        >
        <DialogTitle>Municipality Related Documents</DialogTitle>
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
          <MenuItem onClick={() => handleSort({field: "title"})}>
            Sort by Title ({sortOrder === "asc" ? "asc" : "desc"})
          </MenuItem>
          <MenuItem onClick={() => handleSort({field: "pages"})}>
            Sort by page number (
              {sortOrder === "asc" ? "asc" : "desc"})
          </MenuItem>
          <MenuItem onClick={() => handleSort({field: "type_name"})}>
            Sort by type ({sortOrder === "asc" ? "asc" : "desc"})
          </MenuItem>
          <MenuItem onClick={() => handleSort({field: "issue_date"})}>
            Sort by issue date (
              {sortOrder === "asc" ? "asc" : "desc"})
          </MenuItem>
          <MenuItem onClick={() => handleSort({field: "language"})}>
            Sort by language ({sortOrder === "asc" ? "asc" : "desc"})
          </MenuItem>
          <MenuItem onClick={() => handleSort({field: "scale"})}>
            Sort by scale ({sortOrder === "asc" ? "asc" : "desc"})
          </MenuItem>
          <MenuItem onClick={() => handleSort({field: "description"})}>
            Sort by description (
              {sortOrder === "asc" ? "asc" : "desc"})
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
                  {documents && documents.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell>{document.title}</TableCell>
                      <TableCell>{document.description}</TableCell>
                      <TableCell>{document.type_name}</TableCell>
                      <TableCell>{document.issue_date}</TableCell>
                      <TableCell>{document.scale}</TableCell>
                      <TableCell>{document.language}</TableCell>
                      <TableCell>{document.pages}</TableCell>
                      <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          handleCardShow(document.id);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          </DialogContent>
          <DialogActions>
          <Typography variant="body2" color="textSecondary" style={{ marginRight: "auto" }}>
            Documents {documents.length + rowsPerPage * (page-1)} / {totalRows}
          </Typography>
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

export default ListMunicipality;


