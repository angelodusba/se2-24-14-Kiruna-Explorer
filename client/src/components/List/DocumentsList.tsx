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
  styled,
  tableCellClasses,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { useNavigate } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#002f6c",
    color: theme.palette.common.white,
  },
  [`& .MuiTableSortLabel-root:hover`]: {
    color: "#FFD700",
  },
  [`& .MuiTableSortLabel-root.Mui-active`]: {
    color: "#FFD700",
  },
  [`& .MuiTableSortLabel-root.Mui-active .MuiTableSortLabel-icon`]: {
    color: "#FFD700",
  },

  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

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
      }}>
      {/* Page title */}
      <CardHeader title="Documents List" style={{ paddingBlock: 5 }} />
      {/* Table */}
      <CardContent
        sx={{
          overflowY: "auto",
          display: "flex",
          flexGrow: 0,
          marginBottom: "auto",
        }}>
        <TableContainer component={Paper} elevation={5}>
          <Table stickyHeader aria-label="document table">
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => {
                  if (headCell.id === "pages") {
                    return null;
                  }
                  return (
                    <StyledTableCell
                      key={headCell.id}
                      align={"left"}
                      sortDirection={
                        orderBy.field === headCell.id ? order : false
                      }
                      style={{
                        minWidth:
                          headCell.id === "title" ||
                          headCell.id === "description"
                            ? "120px"
                            : headCell.id === "issue_date"
                            ? "95px"
                            : "auto",
                      }}>
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : "asc"}
                        onClick={() => {
                          handleSort(headCell.id);
                        }}>
                        {headCell.label}
                      </TableSortLabel>
                    </StyledTableCell>
                  );
                })}
                <StyledTableCell>Pages</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((document) => (
                <StyledTableRow key={document.id}>
                  <StyledTableCell
                    style={{
                      maxWidth: "200px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                    {document.title}
                  </StyledTableCell>
                  <StyledTableCell style={{ maxWidth: "350px" }}>
                    {expandedDescriptions[document.id] ||
                    document.description.length < 50
                      ? document.description
                      : `${document.description.substring(0, 50)}...`}
                    {document.description.length > 50 && (
                      <Button
                        size="small"
                        onClick={() => handleViewMoreClick(document.id)}>
                        {expandedDescriptions[document.id]
                          ? "View Less"
                          : "View More"}
                      </Button>
                    )}
                  </StyledTableCell>
                  <StyledTableCell>{document.type_name}</StyledTableCell>
                  <StyledTableCell>{document.issue_date}</StyledTableCell>
                  <StyledTableCell>{document.scale}</StyledTableCell>
                  <StyledTableCell>{document.language}</StyledTableCell>
                  <StyledTableCell>{document.pages}</StyledTableCell>
                  <StyledTableCell>
                    <Button
                      variant="outlined"
                      sx={{
                        backgroundColor: "#006bb3",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#002f6c",
                        },
                      }}
                      onClick={() => {
                        navigate(`/map/${document.id}`);
                      }}>
                      View
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
      <CardActions
        sx={{ marginBottom: 1, display: "flex", justifyContent: "flex-end" }}>
        <Typography variant="body2" color="textSecondary">
          Documents {documents.length + rowsPerPage * (page - 1)} / {totalRows}
        </Typography>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
        />
      </CardActions>
    </Card>
  );
}

export default DocumentsList;
