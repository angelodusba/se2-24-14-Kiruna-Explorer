import React, { useEffect, useState } from 'react';

import { List, ListItem, ListItemText, Container, Typography, ListItemButton } from '@mui/material';
import FormModal from '../Forms/FormModal';
import DocumentAPI from '../../API/DocumentAPI';

function ListMunicipality() {
  
  const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchDocuments = async () => {
        const response = await DocumentAPI.getAllDocumentsNames();
        // Get documents location and filter the ones with no location
        const response2 = await DocumentAPI.getDocumentsLocation();
        const idsWithNoLocation = response2.filter((doc) => doc.location.length === 0).map((doc) => doc.id);
        // Filter documents with location
        const temp = response.filter((doc) => idsWithNoLocation.includes(doc.id));
        setDocuments(temp);
        };
        fetchDocuments();
    }, []);

  return (
    <>
    <FormModal>
        <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
            List of Documents
        </Typography>
        <List>
            {documents.map((documents) => (
            <ListItem key={documents.id}>
                <ListItemButton>
                    <ListItemText primary={documents.title} />
                </ListItemButton>
            </ListItem>
            ))}
        </List>
        </Container>
    </FormModal>
    </>
  );
};

export default ListMunicipality;
