import React, { useState } from 'react';
import { Container, Grid, TextField, Button, Typography, Box } from '@mui/material';

const DynamicColumnForm = () => {
    const [columns, setColumns] = useState([{ id: 1, value: '' }]);

    // Add a new column
    const addColumn = () => {
        setColumns([...columns, { id: columns.length + 1, value: '' }]);
    };

    // Handle field value change
    const handleFieldChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newColumns = [...columns];
        newColumns[index].value = event.target.value;
        setColumns(newColumns);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 5 }}>
                <Typography variant="h4" gutterBottom>
                    Add a document
                </Typography>
                <form>
                    <Grid container spacing={3}>
                        {/*Document Title Field*/}
                        <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Title"
                            variant="outlined"
                            required
                        />
                        </Grid>
                        {/*Document Description Field*/}
                        <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Description"
                            variant="outlined"
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
                                required
                            />
                        </Grid>
                        {/*Papers Field*/}
                        <Grid item xs={12} container justifyContent="flex-end">
                            <TextField
                                fullWidth
                                label="Papers"
                                variant="outlined"
                                type="file"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        {/*Coordinates Field*/}
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Latitude"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Longitude"
                                variant="outlined"
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
