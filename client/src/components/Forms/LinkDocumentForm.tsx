import Grid from "@mui/material/Grid2";
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
import { HalfConnection } from "../../models/Connection.ts";
import { AddCircleOutlined } from "@mui/icons-material";
import { useEffect } from "react";

export function LinkDocumentForm({
  connectionTypes,
  documentsList,
  handleClose,
  handleLinkSubmit,
  handleSelectDocument,
  connectionsList,
  handleAddConnection,
  handleDeleteConnection,
  handleSelectLinkedDocument,
  handleSelectConnectionTypes,
  docId = undefined,
}) {
  const getTitleById = (id: number): string | undefined => {
    const document = documentsList.find((doc) => doc.id === id);
    return document ? document.title : undefined;
  };

  return (
    <Grid
      container
      component={docId === undefined ? "form" : "div"}
      onSubmit={(event) => {
        event.preventDefault();
        handleLinkSubmit(connectionsList);
      }}
      sx={{
        width: "100%",
        pt: 2,
        px: docId ? 0 : 2,
      }}
      size={12}
      spacing={2}
    >
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
        size={12}
      >
        <Typography variant="h6" style={{ textAlign: "center", marginBottom: 15 }}>
          {docId ? `Document to link: ${getTitleById(docId)}` : "Manage Links"}
        </Typography>{" "}
        {!docId && (
          <FormControl required>
            <InputLabel id="document1">Document to link</InputLabel>
            <Select
              labelId="document1"
              id="document1"
              value={connectionsList.starting_document_id || ""}
              label="Document to link"
              onChange={(event) => {
                handleSelectDocument(Number(event.target.value));
              }}
            >
              {documentsList.map((doc) => (
                <MenuItem key={doc.id} value={doc.id}>
                  {doc.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Grid>
      {/* CONNECTIONS LIST */}
      <Grid sx={{ display: "flex", flexDirection: "column" }} size={12} gap={2}>
        {connectionsList.connections.map((connection: HalfConnection, index: number) => (
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
                    handleDeleteConnection(connection.document_id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </CardActions>
            <CardContent>
              {/* LINKED DOCUMENT */}
              <Grid container spacing={2}>
                <Grid sx={{ display: "flex", flexDirection: "column" }} size={{ xs: 12, md: 6 }}>
                  <FormControl required disabled={!connectionsList.starting_document_id}>
                    <InputLabel id="document">Linked document</InputLabel>
                    <Select
                      labelId="document"
                      id="document"
                      value={connection.document_id || ""}
                      label="Document to link"
                      onChange={(event) => {
                        const documentId = Number(event.target.value);
                        handleSelectLinkedDocument(index, documentId);
                      }}
                    >
                      {documentsList
                        .filter((doc) => doc.id !== connectionsList.starting_document_id)
                        .map((doc) => (
                          <MenuItem key={doc.id} value={doc.id}>
                            {doc.title}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                {/* CONNECTION TYPES */}
                <Grid sx={{ display: "flex", flexDirection: "column" }} size={{ xs: 12, md: 6 }}>
                  <FormControl required>
                    <InputLabel id="connectionType">Connection types</InputLabel>
                    <Select
                      labelId="connectionType"
                      id="connectionType"
                      multiple
                      value={connection.connection_types}
                      onChange={(event) => {
                        const connection_types = event.target.value as string[];
                        handleSelectConnectionTypes(index, connection_types);
                      }}
                      input={<OutlinedInput id="connectionType" label="Connection Types" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {selected.map((value, ind) => (
                            <Chip key={ind} label={value} />
                          ))}
                        </Box>
                      )}
                    >
                      {connectionTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          <Checkbox checked={connection.connection_types.includes(type)} />
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
      <Grid size={12} sx={{ display: "flex", alignItems: "center" }}>
        {/* ADD LINK BUTTON */}
        {connectionsList.connections.length > 0 &&
          connectionsList.connections.at(-1).document_id &&
          connectionsList.connections.at(-1).connection_types.length > 0 && (
            <Button
              variant="outlined"
              color="success"
              startIcon={<AddCircleOutlined />}
              onClick={handleAddConnection}
            >
              Add link
            </Button>
          )}
      </Grid>
      <Grid
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          py: 2,
        }}
      >
        <Button color="error" onClick={handleClose}>
          Close
        </Button>
        <Button type={"submit"}>Link</Button>
      </Grid>
    </Grid>
  );
}

export default LinkDocumentForm;