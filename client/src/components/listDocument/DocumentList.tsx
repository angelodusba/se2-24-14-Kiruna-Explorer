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
} from "@mui/material";
import DocumentAPI from "../../API/DocumentAPI";

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

const DocumentList: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const documentsList = await DocumentAPI.getAllDocuments();
        setDocuments(documentsList);
      } catch (err) {
        setError("Error fetching documents");
        console.error("Error:", err);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Document List</DialogTitle>
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
        <Button onClick={onClose} color="error">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentList;
