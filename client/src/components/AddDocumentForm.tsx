import React, { useState } from 'react';
import { Container, Grid, TextField, Button, Typography, Box } from '@mui/material';
import { Document } from '../dataModels/Document';
import stakeholderApi from '../API/StakeHolderApi';
import typeApi from '../API/TypeApi';
import { useEffect } from 'react';
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
        /*
        fetchTypes();
        */
       //Mockup fetchStakeholders
         let temp = [
              new StakeHolder(1, "Stakeholder 1"),
              new StakeHolder(2, "Stakeholder 2"),
              new StakeHolder(3, "Stakeholder 3"),
              new StakeHolder(4, "Stakeholder 4"),
              new StakeHolder(5, "Stakeholder 5"),
         ];
        //setStakeholders(temp);
        //Mockup fetchTypes
        let temp2 = [
            new Type(1, "Type 1"),
            new Type(2, "Type 2"),
            new Type(3, "Type 3"),
            new Type(4, "Type 4"),
            new Type(5, "Type 5"),
        ];
        setTypes(temp2);

    }, []);

    // Add a new column
    const addColumn = () => {
        setColumns([...columns, { id: columns.length + 1, value: '' }]);
    };

    // Handle field value change
    const handleFieldChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newColumns = [...columns];
        newColumns[index].value = event.target.value;
        setColumns(newColumns);
        
        let temp = { ...document };
        temp.stakeholder = newColumns.map((column) => { return parseInt(column.value) });
        setDocument(temp);

    };


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        API.sendDocument(document);
        console.log(document);
    }

    const fetchStakeholders = async () => {
        try {
            const stakeholders = await stakeholderApi.getStakeholders();
            let temp = []
            for (let i = 0; i < stakeholders.length; i++) {
                temp.push(new StakeHolder(stakeholders[i].id, stakeholders[i].name));
            }
            setStakeholders(temp);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchTypes = async () => {
        try {
            const types = await typeApi.getTypes();
            let temp = []
            for (let i = 0; i < types.length; i++) {
                temp.push(new Type(types[i].id, types[i].name));
            }
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
                                        <option key={stakeholder.id} value={stakeholder.id}>
                                            {stakeholder.name}
                                        </option>
                                    ))}
                                </TextField>
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
                                select
                                fullWidth
                                label="Type"
                                variant="outlined"
                                value={document.type}
                                onChange={(event) => setDocument({...document, type: Number(event.target.value)})}
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
                                label="Issue Date (YYYY/MM/DD or YYYY/MM or YYYY)"
                                variant="outlined"
                                onChange={(event) => setDocument({...document, issueDate: event.target.value})}
                                placeholder="YYYY/MM/DD or YYYY/MM or YYYY"
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