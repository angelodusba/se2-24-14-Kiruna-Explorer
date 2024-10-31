import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ConnectionList, Connection } from '../dataModels/Connection';

/* APIS */
import connectionApi from '../API/ConnectionApi';

export function LinkDocumentForm(props: any) {

    const [columns, setColumns] = useState([{ id: 1, value: '' }]);
    const [connectionList, setConnectionList] = useState<ConnectionList>
                                (new ConnectionList(-1, new Array<Connection>(new Connection(-1, ''))));

    // Add a new document to link
    const addColumn = () => {
        handleConnectionChange(columns.length+1, { target: { value: '' } });
        setColumns([...columns, { id: columns.length + 1, value: '' }]);
    };
    const handleConnectionChange = (index:number, event: { target: { value: React.SetStateAction<string>; }; }) => {
        const newSelectedValue = new ConnectionList(connectionList.starting_document_id, connectionList.connections);
        if ( newSelectedValue.connections.length <= index ) {
            newSelectedValue.connections.push(new Connection(-1, event.target.value as string));
        }
        else{
            newSelectedValue.connections[index].connection_name = event.target.value as string;
        }
        
        setConnectionList(newSelectedValue);
    };

    const handleLinkedDocumentChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let temp = new ConnectionList(connectionList.starting_document_id, connectionList.connections);
        if(temp.connections.length <= index){
            temp.connections.push(new Connection(Number(event.target.value), ''));
        }
        else{
            temp.connections[index] = new Connection(Number(event.target.value), temp.connections[index].connection_name);
        };
        setConnectionList(temp);
    };

      const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const temp = new ConnectionList(connectionList.starting_document_id, connectionList.connections.filter((conn) => conn.connected_document_id !== -1 || conn.connection_name !== ''));
        connectionApi.sendConnections(temp);
        console.log(connectionList);
    }

    return (
    <Container maxWidth="lg">
        <Box sx={{ mt: 5 }}>
                <Typography variant="h4" gutterBottom>
                    Add a document
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {/*Document 1 id Field*/}
                        <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Document1"
                            variant="outlined"
                            type='number'
                            onChange={(event) => setConnectionList(new ConnectionList(Number(event.target.value), connectionList.connections))}
                            required
                        />
                        </Grid>
                        {/* Linked Documents */}
                        {columns.map((column, index) => (
                            <React.Fragment key={column.id}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    type='number'
                                    label="Linked Document"
                                    variant="outlined"
                                    onChange={(event) => handleLinkedDocumentChange(index, event)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="connection-type">Connection Type</InputLabel>
                                    <Select
                                        labelId="connection-type"
                                        id="connection-type"
                                        label="Connection Type"
                                        value={connectionList.connections[index].connection_name}
                                        onChange={(event) => handleConnectionChange(index, event)}
                                    >
                                        <MenuItem value={10}>Reference</MenuItem>
                                        <MenuItem value={20}>Citation</MenuItem>
                                        <MenuItem value={30}>Influence</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            </React.Fragment>
                        ))}
                        {/*Add Linked Document button*/}
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={addColumn}>
                                Add Linked Document
                            </Button>
                        </Grid>
                        {/*Submit button*/}
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary">
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>


        </Box>
    </Container>
    );
}