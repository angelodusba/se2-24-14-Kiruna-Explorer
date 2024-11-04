import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { ConnectionList, Connection } from "../../models/Connection";
import connectionApi from "../../API/ConnectionApi";

export function LinkDocumentForm(props: any) {
  const [columns, setColumns] = useState([{ id: 1, value: "" }]);
  const [connectionList, setConnectionList] = useState<ConnectionList>(
    new ConnectionList(-1, new Array<Connection>(new Connection(-1, "")))
  );
  const [typeOfConnection, setTypeOfConnection] = useState<string[]>([]);
  const [documentList, setDocumentList] = useState<
    { id: string; title: string }[]
  >([]);

  // Get the type of connections
  useEffect(() => {
    /*
        connectionApi.getTypeOfConnections().then((data) => {
            let temp: string[] = [];
            for (let i = 0; i < data.length; i++) {
                temp.push(data[i]);
            }
            setTypeOfConnection(temp);
        });

        API.getDocuments().then((data) => {
            let temp: string[] = [];
            for (let i = 0; i < data.length; i++) {
                temp.push({data[i].id,data[i].title.toString()});
            }
            setDocumentList(temp);
        });
        */
    // Hardcoded for now
    setTypeOfConnection(["Reference", "Citation", "Influence"]);
    setDocumentList([
      { id: "1", title: "Document 1" },
      { id: "2", title: "Document 2" },
      { id: "3", title: "Document 3" },
    ]);
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
      newSelectedValue.connections.push(
        new Connection(-1, event.target.value as string)
      );
    } else {
      newSelectedValue.connections[index].connection_name = event.target
        .value as string;
    }
    setConnectionList(newSelectedValue);
  };

  const handleLinkedDocumentChange = (
    index: number,
    event: { target: { value: React.SetStateAction<string> } }
  ) => {
    let temp = new ConnectionList(
      connectionList.starting_document_id,
      connectionList.connections
    );
    if (temp.connections.length <= index) {
      temp.connections.push(new Connection(Number(event.target.value), ""));
    } else {
      temp.connections[index] = new Connection(
        Number(event.target.value),
        temp.connections[index].connection_name
      );
    }
    setConnectionList(temp);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const temp = new ConnectionList(
      connectionList.starting_document_id,
      connectionList.connections.filter(
        (conn) =>
          conn.connected_document_id !== -1 || conn.connection_name !== ""
      )
    );
    connectionApi.sendConnections(temp);
    console.log(connectionList);
  };

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
              <FormControl fullWidth>
                <InputLabel id="document1-label">Document 1</InputLabel>
                <Select
                  labelId="document1-label"
                  id="document1"
                  label="Document 1"
                  value={connectionList.starting_document_id.toString()}
                  onChange={(event) =>
                    setConnectionList(
                      new ConnectionList(
                        Number(event.target.value),
                        connectionList.connections
                      )
                    )
                  }
                  required>
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
                    <InputLabel id={`linked-document-${index}`}>
                      Linked Document
                    </InputLabel>
                    <Select
                      labelId={`linked-document-${index}`}
                      id={`linked-document-${index}`}
                      label="Linked Document"
                      value={
                        connectionList.connections[
                          index
                        ]?.connected_document_id.toString() || ""
                      }
                      onChange={(event) =>
                        handleLinkedDocumentChange(index, event)
                      }
                      required>
                      {documentList.map((doc) => (
                        <MenuItem key={doc.id} value={doc.id}>
                          {doc.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id={`connection-type-${index}`}>
                      Connection Type
                    </InputLabel>
                    <Select
                      labelId={`connection-type-${index}`}
                      id={`connection-type-${index}`}
                      label="Connection Type"
                      value={
                        connectionList.connections[index]?.connection_name || ""
                      }
                      onChange={(event) =>
                        handleConnectionChange(index, event)
                      }>
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
