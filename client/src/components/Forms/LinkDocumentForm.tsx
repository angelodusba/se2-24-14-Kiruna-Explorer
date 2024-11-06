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
  Typography,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConnectionList, halfConnection } from "../../models/Connection.ts";
import ConnectionAPI from "../../API/ConnectionApi.ts";
import { AddCircleOutlined } from "@mui/icons-material";

export function LinkDocumentForm(props) {
  const [connectionList, setConnectionList] = useState<ConnectionList>(
    new ConnectionList(props.docId ? props.docId : undefined, [
      new halfConnection(undefined, []),
    ])
  );
  const [typeOfConnection, setTypeOfConnection] = useState<string[]>([]);
  const [documentList, setDocumentList] = useState<
    { id: number; title: string }[]
  >([]);

  const getTitleById = (id: number): string | undefined => {
    const document = documentList.find((doc) => doc.id === id);
    return document ? document.title : undefined;
  };

  const handleClose = () => {
    props.setOperation(undefined);
    return;
  };

  const handleLinkSubmit = async (event) => {
    event.preventDefault();
    await ConnectionAPI.sendConnections(connectionList);
    props.setOperation(undefined);
    return;
  };

  const handleExistingConnectionsUpdate = (event) => {
    ConnectionAPI.getConnectionsByDocumentId(Number(event.target.value)).then(
      (halfConnections: halfConnection[]) => {
        setConnectionList(() => ({
          starting_document_id: Number(event.target.value),
          connections: halfConnections,
        }));
      }
    );
  };

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
      component={props.docId === undefined ? "form" : "div"}
      onSubmit={handleLinkSubmit}
      sx={{
        width: "100%",
        display: "flex",
        pt: 2,
        px: props.docId ? 0 : 2,
      }}
      size={6}
      spacing={2}>
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
        size={12}>
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pb: 2,
          }}
          size={12}>
          <Typography display={"flex"} variant="h6">
            {props.docId
              ? `Document to link: ${getTitleById(props.docId)}`
              : "Manage Links"}
          </Typography>
        </Grid>
        {!props.docId && (
          <FormControl required>
            <InputLabel id="document1">Document to link</InputLabel>
            <Select
              labelId="document1"
              id="document1"
              value={connectionList.starting_document_id || ""}
              label="Document to link"
              onChange={handleExistingConnectionsUpdate}>
              {documentList.map((doc) => (
                <MenuItem key={doc.id} value={doc.id}>
                  {doc.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Grid>
      <Grid
        container
        sx={{ display: "flex", flexDirection: "column" }}
        size={12}
        spacing={1}>
        {connectionList.connections.map((connection, index) => (
          <Card key={index} variant="outlined">
            <CardActions>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">Link #{index + 1}</Typography>
              </Box>
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
                      value={connection.document_id || ""}
                      label="Document to link"
                      onChange={(event) => {
                        const newConnections = connectionList.connections;
                        newConnections[index].document_id = Number(
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
                            (conn) => conn.document_id === doc.id
                          ) &&
                            connection.document_id !== doc.id)
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
                      value={connection.connection_types}
                      onChange={(event) => {
                        const newConnections = connectionList.connections;
                        const value = event.target.value as string[];

                        newConnections[index].connection_types = value;
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
                            checked={connection.connection_types.includes(type)}
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

        <Grid
          sx={{
            width: "100%",
            display: "flex",
            py: 2,
          }}
          size="auto">
          <Button color="error" onClick={handleClose} sx={{ mr: 1 }}>
            Close
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          <Button type={"submit"}>Link</Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default LinkDocumentForm;
