import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Connection, ConnectionList, halfConnection } from "../../models/Connection.ts";
import connectionApi from "../../API/ConnectionApi";
// import API from '../../API/Api';

export function LinkDocumentForm(props: any) {
  const [columns, setColumns] = useState([{ id: 1, value: "" }]);
  const [connectionList, setConnectionList] = useState<ConnectionList>(
    new ConnectionList(0, new Array<halfConnection>(new halfConnection(0, "")))
  );
  const [typeOfConnection, setTypeOfConnection] = useState<string[]>([]);
  const [documentList, setDocumentList] = useState<{ id: string; title: string }[]>([]);
  const [allConnections, setAllConnections] = useState<Connection[]>([]);
  const [filteredDocumentList, setFilteredDocumentList] = useState<{ id: string; title: string }[]>(
    []
  );

  // Get the type of connections
  useEffect(() => {
    connectionApi.getTypeOfConnections().then((data) => {
      let temp: string[] = [];
      for (let i = 0; i < data.length; i++) {
        temp.push(data[i]);
      }
      setTypeOfConnection(temp);
    });

    API.getAllDocumentsNames().then((data) => {
      let temp: { id: string; title: string }[] = [];
      for (let i = 0; i < data.length; i++) {
        temp.push({ id: data[i].id, title: data[i].title.toString() });
      }
      setDocumentList(temp);
    });

    connectionApi.getConnections().then((data) => {
      let temp: Connection[] = [];
      for (let i = 0; i < data.length; i++) {
        temp.push(
          new Connection(data[i].document_id_1, data[i].document_id_2, data[i].connection_name)
        );
      }
      setAllConnections(temp);
    });
  }, []);

  // Add a new document to link
  const addColumn = () => {
    handleConnectionChange(columns.length + 1, { target: { value: "" } });
    setColumns([...columns, { id: columns.length + 1, value: "" }]);
  };

  const handleConnectionChange = (
    index: number,
    event: { target: { value: React.SetStateAction<string> } }
  ) => {
    const newSelectedValue = new ConnectionList(
      connectionList.starting_document_id,
      connectionList.connections
    );
    if (newSelectedValue.connections.length <= index) {
      newSelectedValue.connections.push(new halfConnection(-1, event.target.value as string));
    } else {
      newSelectedValue.connections[index].connection_name = event.target.value as string;
    }
    setConnectionList(newSelectedValue);
    updateFilteredDocuments();
  };

  const handleLinkedDocumentChange = (
    index: number,
    event: { target: { value: React.SetStateAction<string> } }
  ) => {
    let temp = new ConnectionList(connectionList.starting_document_id, connectionList.connections);
    if (temp.connections.length <= index) {
      temp.connections.push(new halfConnection(Number(event.target.value), ""));
    } else {
      temp.connections[index] = new halfConnection(
        Number(event.target.value),
        temp.connections[index].connection_name
      );
    }
    setConnectionList(temp);
    updateFilteredDocuments();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const temp = new ConnectionList(
      connectionList.starting_document_id,
      connectionList.connections.filter(
        (conn) => conn.connected_document_id !== -1 || conn.connection_name !== ""
      )
    );
    connectionApi.sendConnections(temp);
    console.log(connectionList);
  };

  const updateFilteredDocuments = () => {
    const startingDocumentId = connectionList.starting_document_id;
    const existingConnections = allConnections
      .filter((conn) => conn.document_id_1 === startingDocumentId)
      .map((conn) => conn.document_id_2);
    const temp = allConnections
      .filter((conn) => conn.document_id_2 === startingDocumentId)
      .map((conn) => conn.document_id_1);
    existingConnections.push(...temp);
    let i = documentList.filter(
      (doc) =>
        !existingConnections.includes(Number(doc.id)) &&
        !connectionList.connections
          .map((conn) => conn.connected_document_id)
          .includes(Number(doc.id))
    );
    setFilteredDocumentList(i);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Add a link
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/*Document 1 id Field*/}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="document1-label">Document 1</InputLabel>
                <Select
                  labelId="document1-label"
                  id="document1"
                  label="Document 1"
                  value={connectionList.starting_document_id.toString()}
                  onChange={(event) => {
                    setConnectionList(
                      new ConnectionList(Number(event.target.value), connectionList.connections)
                    );
                    updateFilteredDocuments();
                  }}
                  required
                >
                  {documentList.map((doc) => (
                    <MenuItem key={doc.id} value={doc.id}>
                      {doc.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* Linked Documents */}
            {columns.map((column, index) => (
              <React.Fragment key={column.id}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id={`linked-document-${index}`}>Linked Document</InputLabel>
                    <Select
                      labelId={`linked-document-${index}`}
                      id={`linked-document-${index}`}
                      label="Linked Document"
                      value={filteredDocumentList[index]?.id || ""}
                      onChange={(event) => handleLinkedDocumentChange(index, event)}
                      required
                    >
                      {filteredDocumentList.map((doc) => (
                        <MenuItem key={doc.id} value={doc.id}>
                          {doc.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id={`connection-type-${index}`}>Connection Type</InputLabel>
                    <Select
                      labelId={`connection-type-${index}`}
                      id={`connection-type-${index}`}
                      label="Connection Type"
                      value={connectionList.connections[index]?.connection_name || ""}
                      onChange={(event) => handleConnectionChange(index, event)}
                    >
                      {typeOfConnection.map((type, idx) => (
                        <MenuItem key={idx} value={type}>
                          {type}
                        </MenuItem>
                      ))}
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

export default LinkDocumentForm;
