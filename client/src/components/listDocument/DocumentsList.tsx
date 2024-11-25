import React, { useState } from "react";
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
  IconButton,
  Menu,
  Card,
  CardHeader,
  CardContent,
  CardActions,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { MenuItem } from "@mui/material";
import Pagination from "@mui/material/Pagination";

function DocumentsList({
  handleFilterClick,
  anchorEl,
  handleFilterClose,
  handleSort,
  sortOrder,
  error,
  documents,
  handleCardShow,
  rowsPerPage,
  page,
  totalRows,
  handleChangePage,
}) {
  const [expandedDescriptions, setExpandedDescriptions] = useState<{
    [key: number]: boolean;
  }>({});

  const handleViewMoreClick = (id: number) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  return (
    <Card
      sx={{
        width: "100%",
        maxHeight: "92vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader title="Document List" />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: 10,
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
        <MenuItem onClick={() => handleSort({ field: "title" })}>
          Sort by Title ({sortOrder === "asc" ? "Ascending" : "Descending"})
        </MenuItem>
        <MenuItem onClick={() => handleSort({ field: "pages" })}>
          Sort by page number (
          {sortOrder === "asc" ? "Ascending" : "Descending"})
        </MenuItem>
        <MenuItem onClick={() => handleSort({ field: "type_name" })}>
          Sort by type ({sortOrder === "asc" ? "asc" : "desc"})
        </MenuItem>
        <MenuItem onClick={() => handleSort({ field: "issue_date" })}>
          Sort by issue date ({sortOrder === "asc" ? "Ascending" : "Descending"}
          )
        </MenuItem>
        <MenuItem onClick={() => handleSort({ field: "language" })}>
          Sort by language ({sortOrder === "asc" ? "Ascending" : "Descending"})
        </MenuItem>
        <MenuItem onClick={() => handleSort({ field: "scale" })}>
          Sort by scale ({sortOrder === "asc" ? "Ascending" : "Descending"})
        </MenuItem>
        <MenuItem onClick={() => handleSort({ field: "description" })}>
          Sort by description (
          {sortOrder === "asc" ? "Ascending" : "Descending"})
        </MenuItem>
      </Menu>
      <CardContent sx={{ overflowY: "auto", display: "flex", flexGrow: 0 }}>
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
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>{document.title}</TableCell>
                    <TableCell>
                      {expandedDescriptions[document.id]
                        ? document.description
                        : `${document.description.substring(0, 50)}...`}
                      {document.description.length > 50 && (
                        <Button
                          size="small"
                          onClick={() => handleViewMoreClick(document.id)}
                        >
                          {expandedDescriptions[document.id]
                            ? "View Less"
                            : "View More"}
                        </Button>
                      )}
                    </TableCell>
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
                          // onClose();
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
      </CardContent>
      <CardActions sx={{ marginBottom: 2 }}>
        <Typography
          variant="body2"
          color="textSecondary"
          style={{ marginRight: "auto" }}
        >
          Documents {documents.length + rowsPerPage * (page - 1)} / {totalRows}
        </Typography>
        <Pagination
          count={Math.ceil(totalRows / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
        />
      </CardActions>
    </Card>
  );
}

export default DocumentsList;
