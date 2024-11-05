import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid2";
import DocumentAPI from "../../API/DocumentAPI.ts";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardActions,
  CardContent,
  Box,
  IconButton,
  Tooltip,
  OutlinedInput,
  Chip,
  Checkbox,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConnectionList, halfConnection } from "../../models/Connection.ts";
import ConnectionAPI from "../../API/ConnectionAPI.ts";
import { AddCircleOutlined } from "@mui/icons-material";

export function LinkDocumentForm(props) {
  const [connectionList, setConnectionList] = useState<ConnectionList>(
    new ConnectionList(props.document ? props.document.id : undefined, [
      new halfConnection(undefined, []),
    ])
  );
  const [typeOfConnection, setTypeOfConnection] = useState<string[]>([]);
  const [documentList, setDocumentList] = useState<
    { id: number; title: string }[]
  >([]);

  // Get the type of connections
  useEffect(() => {
    ConnectionAPI.getTypeOfConnections().then((data) => {
      const temp: string[] = [];
      for (let i = 0; i < data.length; i++) {
        temp.push(data[i]);
      }
      setTypeOfConnection(temp);
    });

    DocumentAPI.getAllDocumentsNames().then((data) => {
      const temp: { id: number; title: string }[] = [];
      for (let i = 0; i < data.length; i++) {
        temp.push({ id: data[i].id, title: data[i].title.toString() });
      }
      setDocumentList(temp);
    });
  }, []);

  return (
    <Grid
      container
      sx={{
        width: "100%",
        display: "flex",
        py: 2,
      }}
      size={6}
      spacing={2}>
      <Grid sx={{ display: "flex", flexDirection: "column" }} size={12}>
        <FormControl required>
          <InputLabel id="document1">Document to link</InputLabel>
          <Select
            labelId="document1"
            id="document1"
            value={connectionList.starting_document_id || ""}
            label="Document to link"
            onChange={(event) => {
              setConnectionList((prevList) => ({
                ...prevList,
                starting_document_id: Number(event.target.value),
              }));
            }}>
            {documentList.map((doc) => (
              <MenuItem key={doc.id} value={doc.id}>
                {doc.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid
        container
        sx={{ display: "flex", flexDirection: "column" }}
        size={12}
        spacing={1}>
        {connectionList.connections.map((connection, index) => (
          <Card key={index} variant="outlined">
            <CardActions>
              <Box sx={{ flexGrow: 1 }}></Box>
              <Tooltip title="Delete">
                <IconButton
                  aria-label="delete"
                  color="error"
                  size="small"
                  onClick={() => {
                    const newConnections = connectionList.connections.filter(
                      (_, i) => i !== index
                    );
                    setConnectionList((prevList) => ({
                      ...prevList,
                      connections: newConnections,
                    }));
                  }}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </CardActions>
            <CardContent>
              <Grid container spacing={2}>
                <Grid
                  sx={{ display: "flex", flexDirection: "column" }}
                  size={{ xs: 12, md: 6 }}>
                  <FormControl
                    required
                    disabled={!connectionList.starting_document_id}>
                    <InputLabel id="document">Linked document</InputLabel>
                    <Select
                      labelId="document"
                      id="document"
                      value={connection.connected_document_id || ""}
                      label="Document to link"
                      onChange={(event) => {
                        const newConnections = connectionList.connections;
                        newConnections[index].connected_document_id = Number(
                          event.target.value
                        );
                        setConnectionList((prevList) => ({
                          ...prevList,
                          connections: newConnections,
                        }));
                      }}>
                      {documentList.map((doc) => {
                        if (
                          doc.id === connectionList.starting_document_id ||
                          (connectionList.connections.some(
                            (conn) => conn.connected_document_id === doc.id
                          ) &&
                            connection.connected_document_id !== doc.id)
                        ) {
                          return;
                        }
                        return (
                          <MenuItem key={doc.id} value={doc.id}>
                            {doc.title}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid
                  sx={{ display: "flex", flexDirection: "column" }}
                  size={{ xs: 12, md: 6 }}>
                  <FormControl
                    required
                    disabled={!connectionList.starting_document_id}>
                    <InputLabel id="connectionType">
                      Connection types
                    </InputLabel>
                    <Select
                      labelId="connectionType"
                      id="connectionType"
                      multiple
                      value={connection.connection_names}
                      onChange={(event) => {
                        const newConnections = connectionList.connections;
                        const value = event.target.value as string[];
                        console.log(value);

                        newConnections[index].connection_names = value;
                        console.log(newConnections);
                        setConnectionList((prevList) => ({
                          ...prevList,
                          connections: newConnections,
                        }));
                      }}
                      input={
                        <OutlinedInput
                          id="connectionType"
                          label="Connection Types"
                        />
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {selected.map((value, ind) => (
                            <Chip key={ind} label={value} />
                          ))}
                        </Box>
                      )}>
                      {typeOfConnection.map((type) => (
                        <MenuItem key={type} value={type}>
                          <Checkbox
                            checked={connection.connection_names.includes(type)}
                          />
                          <ListItemText primary={type} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Grid>

      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
        size={12}>
        <Tooltip title="Add new link">
          <IconButton
            aria-label="add"
            size="medium"
            color="success"
            onClick={() => {
              const newConnections = connectionList.connections;
              newConnections.push(new halfConnection(undefined, []));
              setConnectionList((prevList) => ({
                ...prevList,
                connections: newConnections,
              }));
            }}>
            <AddCircleOutlined />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
}

export default LinkDocumentForm;
