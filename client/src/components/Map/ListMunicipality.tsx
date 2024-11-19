import React, { useEffect, useState } from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Container } from '@mui/material';
import DocumentAPI from '../../API/DocumentAPI';
import FormModal from '../Forms/FormModal';

function ListMunicipality({ open, onClose, currentFilter, docs }) {
  
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDocuments = async () => {
        // Add to current filter location = null
        const newFilter = { ...currentFilter}
        const response = await DocumentAPI.getFilteredDocuments(newFilter);
        // fiter for location = null
        const filtered = docs.filter(doc => doc.location.length === 0);
        // get the documents that are present both in filtered and in response.docs
        const final = response.docs.filter(doc => filtered.some(f => f.id === doc.id));
        setDocuments(final);
          if (response.docs.length === 0) {
              setError("No documents found");
          }
        };
        fetchDocuments();
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
                  {documents && documents.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell>{document.id}</TableCell>
                      <TableCell>{document.title}</TableCell>
                      <TableCell>{document.description}</TableCell>
                      <TableCell>{document.type.name}</TableCell>
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

export default ListMunicipality;

