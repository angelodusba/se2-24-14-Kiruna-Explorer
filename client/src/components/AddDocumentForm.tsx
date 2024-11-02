import React, { useState, useEffect } from 'react';
import { Container, Grid, TextField, Button, Typography, Box } from '@mui/material';
import { Document } from '../dataModels/Document';
import stakeholderApi from '../API/StakeHolderApi';
import typeApi from '../API/TypeApi';
import { StakeHolder } from '../dataModels/StakeHolders';
import { Type } from '../dataModels/Type';
import API from '../API/Api';

export function DynamicColumnForm() {
    const [columns, setColumns] = useState([{ id: 1, value: '' }]);
    const [document, setDocument] = useState<Document>(new Document('', '', [], 0, 0, { lat: 0, long: 0 }, '', '', ''));
    const [stakeholders, setStakeholders] = useState<StakeHolder[]>([]);
    const [types, setTypes] = useState<Type[]>([]);

    useEffect(() => {
        fetchStakeholders();
        fetchTypes();
    }, []);

    const addColumn = () => {
        if (columns.length === stakeholders.length) return;
        setColumns([...columns, { id: columns.length + 1, value: '' }]);
    };

    const handleFieldChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newColumns = [...columns];
        newColumns[index].value = event.target.value;
        setColumns(newColumns);

        let temp = { ...document };
        temp.stakeholder = newColumns.map((column) => parseInt(column.value));
        setDocument(temp);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        API.sendDocument(document);
        console.log(document);
    };

    const fetchStakeholders = async () => {
        try {
            const stakeholders = await stakeholderApi.getStakeholders();
            let temp = stakeholders.map((stakeholder: { id: number; name: string; }) => new StakeHolder(stakeholder.id, stakeholder.name));
            setStakeholders(temp);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchTypes = async () => {
        try {
            const types = await typeApi.getTypes();
            let temp = types.map((type: { id: number; name: string; }) => new Type(type.id, type.name));
            setTypes(temp);
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 5 }}>
                <Typography variant="h4" gutterBottom>
                    Add a document
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Title"
                                variant="outlined"
                                onChange={(event) => setDocument({ ...document, title: event.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                variant="outlined"
                                onChange={(event) => setDocument({ ...document, description: event.target.value })}
                                required
                            />
                        </Grid>
                        {columns.map((column, index) => (
                            <Grid item xs={12 / columns.length} key={column.id}>
                                <TextField
                                    select
                                    fullWidth
                                    label={`Stakeholder ${index + 1}`}
                                    variant="outlined"
                                    value={column.value}
                                    
                                    onChange={(event) => handleFieldChange(index, event)}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    
                                >
                                    <option value=""></option>
                                    {stakeholders.map((stakeholder) => (
                                        <option key={stakeholder.id} value={stakeholder.id} disabled={columns.some(col => col.value === stakeholder.id.toString())}>
                                            {stakeholder.name}
                                        </option>
                                    ))}
                                </TextField>
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={addColumn}>
                                Add New StakeHolder
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                select
                                fullWidth
                                label="Type"
                                variant="outlined"
                                value={document.type}
                                onChange={(event) => setDocument({ ...document, type: Number(event.target.value) })}
                                SelectProps={{
                                    native: true,
                                }}
                                required
                            >
                                <option value=""></option>
                                {types.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} container justifyContent="flex-end">
                            <TextField
                                fullWidth
                                label="Papers"
                                variant="outlined"
                                type="number"
                                InputLabelProps={{ shrink: true }}
                                onChange={(event) => setDocument({ ...document, pages: Number(event.target.value) })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="float"
                                label="Latitude"
                                variant="outlined"
                                onChange={(event) => setDocument({ ...document, coordinates: { lat: parseFloat(event.target.value), long: document.coordinates.long } })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="float"
                                label="Longitude"
                                variant="outlined"
                                onChange={(event) => setDocument({ ...document, coordinates: { lat: document.coordinates.lat, long: parseFloat(event.target.value) } })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Issue Date (YYYY/MM/DD or YYYY/MM or YYYY)"
                                variant="outlined"
                                onChange={(event) => setDocument({ ...document, issueDate: event.target.value })}
                                placeholder="YYYY/MM/DD or YYYY/MM or YYYY"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Scale"
                                variant="outlined"
                                onChange={(event) => setDocument({ ...document, scale: event.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Language"
                                variant="outlined"
                                onChange={(event) => setDocument({ ...document, language: event.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary">
                                Save
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Container>
    );
}

export default DynamicColumnForm;
