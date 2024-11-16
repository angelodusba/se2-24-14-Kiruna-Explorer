import { UploadFileOutlined } from "@mui/icons-material";
import {
  Typography,
  Button,
  Paper,
  Box,
  styled,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function AttachmentsForm({ docId = undefined }) {
  // const [originalResources, setOriginalResources] = useState([]);
  const navigate = useNavigate();
  const param = useParams();

  // Fetch initial data
  useEffect(() => {
    //Fetch already existing attachments for docId
  }, []);

  const handleCloseOrSubmit = (event) => {
    event.preventDefault();
    navigate(`/map/${param.id}`);
  };

  return (
    <Grid
      container
      component={docId === undefined ? "form" : "div"}
      onSubmit={handleCloseOrSubmit}
      sx={{
        width: "100%",
        minHeight: "80%",
        pt: 2,
        px: 2,
      }}
      size={12}
      spacing={2}>
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
        size={12}>
        <Typography
          variant="h6"
          fontWeight={"bold"}
          style={{ textAlign: "center", marginBottom: 15 }}>
          Original Resources
        </Typography>
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
          size={12}>
          <Paper sx={{ minHeight: "100%" }} variant="outlined">
            <Box
              display="flex"
              flexDirection={"column"}
              justifyContent={
                originalResources.length === 0 ? "center" : "start"
              }
              alignItems="center"
              height="100%"
              gap={2}>
              {originalResources.length === 0 ? (
                <>
                  <Typography variant="subtitle1">
                    Add your first original resource
                  </Typography>
                  <Button
                    component="label"
                    variant="outlined"
                    color="success"
                    size="small"
                    startIcon={<UploadFileOutlined />}>
                    <VisuallyHiddenInput
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      type="file"
                      onChange={(event) => console.log(event.target.files)}
                    />
                    Upload
                  </Button>
                </>
              ) : (
                <List dense={false} sx={{ width: "100%", pt: 0 }}>
                  {originalResources.map((attachment, index) => {
                    return (
                      <>
                        <ListItem
                          key={index}
                          secondaryAction={
                            <IconButton
                              edge="end"
                              color="error"
                              aria-label="delete">
                              <DeleteIcon />
                            </IconButton>
                          }>
                          <ListItemText inset primary={attachment.name} />
                        </ListItem>
                        <Divider />
                      </>
                    );
                  })}
                  <ListItem>
                    <Button
                      component="label"
                      variant="outlined"
                      color="success"
                      size="small"
                      startIcon={<UploadFileOutlined />}>
                      <VisuallyHiddenInput
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        type="file"
                        onChange={(event) => console.log(event.target.files)}
                      />
                      Upload
                    </Button>
                  </ListItem>
                </List>
              )}
            </Box>
          </Paper>
        </Grid>
        <Grid
          sx={{
            width: "100%",
            display: !docId ? "flex" : "none",
            justifyContent: "space-between",
            py: 2,
          }}>
          <Button onClick={handleCloseOrSubmit} color="error">
            Close
          </Button>
          <Button type={"submit"}>Save</Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default AttachmentsForm;
