import React, { useState } from 'react';
import { Container, Grid, TextField, Button, Typography, Box } from '@mui/material';
import { Document } from '../dataModels/Document';

export function DynamicColumnForm(props: any) {

    const [columns, setColumns] = useState([{ id: 1, value: '' }]);
    const [document, setDocument] = useState<Document>(new Document('', '', [], 0, 0, { lat: 0, long: 0 }, '', '', ''));

    // Add a new column
    const addColumn = () => {
        setColumns([...columns, { id: columns.length + 1, value: '' }]);
    };

    // Handle field value change
    const handleFieldChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newColumns = [...columns];
        newColumns[index].value = event.target.value;
        setColumns(newColumns);
        let temp = {...document};
        temp.stakeholder = newColumns.map((column) => column.value);
        setDocument(temp);

    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        props.sendDocument(document);
        console.log(document);
    }
    

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 5 }}>
                <Typography variant="h4" gutterBottom>
                    Add a document
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/*Document Title Field*/}
                        <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Title"
                            variant="outlined"
                            onChange={(event) => setDocument({...document, title: event.target.value})}
                            required
                        />
                        </Grid>
                        {/*Document Description Field*/}
                        <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Description"
                            variant="outlined"
                            onChange={(event) => setDocument({...document, description: event.target.value})}
                            required
                        />
                        </Grid>
                        {/*Stakeholder Fields*/}
                        {columns.map((column, index) => (
                            <Grid item xs={12 / columns.length} key={column.id}>
                                <TextField
                                    fullWidth
                                    label={`Stakeholder ${index + 1}`}
                                    variant="outlined"
                                    value={column.value}
                                    onChange={(event) => handleFieldChange(index, event)}
                                />
                            </Grid>
                        ))}
                        {/*Add New Stakeholder Button*/}
                        <Grid item xs={12}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={addColumn}
                            >
                                Add New StakeHolder
                            </Button>
                        </Grid>
                        {/*Document Type Field*/}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Type"
                                variant="outlined"
                                onChange={(event: { target: { value: any; }; }) => setDocument({...document, type: event.target.value})}
                                required
                            />
                        </Grid>
                        {/*Pages Field*/}
                        <Grid item xs={12} container justifyContent="flex-end">
                            <TextField
                                fullWidth
                                label="Papers"
                                variant="outlined"
                                type= "number"
                                InputLabelProps={{ shrink: true }}
                                /*convert file to base64 and set it to document.paper*/
                                onChange={(event) => setDocument({...document, type: Number(event.target.value)})}
                                
                            />
                        </Grid>
                        {/*Coordinates Field*/}
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type='float'
                                label="Latitude"
                                variant="outlined"
                                onChange={(event) => setDocument({...document, coordinates: { lat: parseFloat(event.target.value), long: document.coordinates.long }})}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type='float'
                                label="Longitude"
                                variant="outlined"
                                onChange={(event) => setDocument({...document, coordinates: { lat: document.coordinates.lat, long: parseFloat(event.target.value) }})}
                            />
                        </Grid>
                        {/* Issue Date YYYY/MM/DD OR YYYY/MM OR YYYY*/}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Issue Date"
                                variant="outlined"
                                placeholder="YYYY/MM/DD or YYYY/MM or YYYY"
                                onChange={(event) => setDocument({...document, issueDate: event.target.value})}
                            />
                        </Grid>
                                                {/*Scale Field*/}
                                                <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Scale"
                                variant="outlined"
                                onChange={(event) => setDocument({...document, scale: event.target.value})}
                                required
                            />
                        </Grid>
                        {/*Language Field*/}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Language"
                                variant="outlined"
                                onChange={(event) => setDocument({...document, language: event.target.value})}
                            />
                        </Grid>
                        {/*Save Button*/}
                        <Grid item xs={12}>
                            <Button 
                                type="submit" 

                                variant="contained" 
                                color="primary"
                            >
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Container>
    );
};

export default DynamicColumnForm;