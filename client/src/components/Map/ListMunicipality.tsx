import React, { useEffect, useState } from 'react';

import { List, ListItem, ListItemText, Container, Typography, ListItemButton } from '@mui/material';
import FormModal from '../Forms/FormModal';
import DocumentAPI from '../../API/DocumentAPI';

function ListMunicipality() {
  
  const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchDocuments = async () => {
        const response = await DocumentAPI.getMunicipalityDocuments();
        console.log("Im here");
        setDocuments(response);
        };
        fetchDocuments();
    }, []);

  return (
    <>
    <FormModal>
        <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
            Municipality Related Documents
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
