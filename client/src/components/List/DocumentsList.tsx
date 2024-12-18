import { useState } from "react";
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
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TableSortLabel,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { useNavigate } from "react-router-dom";

// type Order = "asc" | "desc";

type HeadTypes = {
  title: string;
  description: string;
  type_name: string;
  issue_date: string;
  scale: string;
  language: string;
  pages: string;
};

const headCells: { id: keyof HeadTypes; label: string }[] = [
  {
    id: "title",
    label: "Title",
  },
  {
    id: "description",
    label: "Description",
  },
  {
    id: "type_name",
    label: "Type",
  },
  {
    id: "issue_date",
    label: "Issue date",
  },
  {
    id: "scale",
    label: "Scale",
  },
  {
    id: "language",
    label: "Language",
  },
  {
    id: "pages",
    label: "Pages",
  },
];

function DocumentsList({
  documents,
  rowsPerPage,
  page,
  totalRows,
  totalPages,
  handleChangePage,
  handleSort,
  order,
  orderBy,
}) {
  const [expandedDescriptions, setExpandedDescriptions] = useState<{
    [key: number]: boolean;
  }>({});
  const navigate = useNavigate();

  const handleViewMoreClick = (id: number) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  return (
    <Card
      sx={{
        paddingTop: "100px",
        width: "100%",
        height: "100%",
        maxHeight: "calc(100vh - 100px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Page title */}
      <CardHeader title="Documents List" style={{ paddingBlock: 5 }} />
      {/* Table */}
      <CardContent sx={{ overflowY: "auto", display: "flex", flexGrow: 0, marginBottom: "auto" }}>
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="document table">
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={"left"}
                    sortDirection={orderBy.field === headCell.id ? order : false}
                    style={{
                      minWidth:
                        headCell.id === "title" || headCell.id === "description"
                          ? "120px"
                          : headCell.id === "issue_date"
                          ? "95px"
                          : "auto",
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={() => {
                        handleSort(headCell.id);
                      }}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell style={{ maxWidth: "200px" }}>{document.title}</TableCell>
                  <TableCell style={{ maxWidth: "350px" }}>
                    {expandedDescriptions[document.id]
                      ? document.description
                      : `${document.description.substring(0, 50)}...`}
                    {document.description.length > 50 && (
                      <Button size="small" onClick={() => handleViewMoreClick(document.id)}>
                        {expandedDescriptions[document.id] ? "View Less" : "View More"}
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
                        navigate(`/map/${document.id}`);
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
      </CardContent>
      <CardActions sx={{ marginBottom: 1, display: "flex", justifyContent: "flex-end" }}>
        <Typography variant="body2" color="textSecondary">
          Documents {documents.length + rowsPerPage * (page - 1)} / {totalRows}
        </Typography>
        <Pagination count={totalPages} page={page} onChange={handleChangePage} />
      </CardActions>
    </Card>
  );
}

export default DocumentsList;
