import React, { useEffect } from 'react';
import { List, ListItem, ListItemText, Container, Typography } from '@mui/material';
import FormModal from '../Forms/FormModal';

function ListMunicipality() {
  // Example list of document names
  const documents = [
    { id: 1, name: 'Document 1' },
    { id: 2, name: 'Document 2' },
    { id: 3, name: 'Document 3' },
    { id: 4, name: 'Document 4' },
  ];


  return (
    <>
    <FormModal>
        <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
            List of Documents
        </Typography>
        <List>
            {documents.map((doc) => (
            <ListItem key={doc.id}>
                <ListItemText primary={doc.name} />
            </ListItem>
            ))}
        </List>
        </Container>
    </FormModal>
    </>
  );
};

export default ListMunicipality;
