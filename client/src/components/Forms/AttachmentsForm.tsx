import {
  ArticleOutlined,
  PhotoOutlined,
  PictureAsPdfOutlined,
  UploadFileOutlined,
} from "@mui/icons-material";
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
  ListItemIcon,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DocumentAPI from "../../API/DocumentAPI";

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

function AttachmentsForm({ originalRes = [], fetchCardInfo = undefined }) {
  const [originalResources, setOriginalResources] = useState(originalRes);
  const navigate = useNavigate();
  const param = useParams();

  /* Fetch initial data
  useEffect(() => {
    Fetch already existing attachments for docId
    Now made with outlet context but can be made taking data by the server
  }, []);*/

  const handleCloseOrSubmit = (event) => {
    event.preventDefault();
    fetchCardInfo(Number(param.id));
    navigate(-1);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("original", "true");
    DocumentAPI.uploadFile(Number(param.id), formData)
      .then((attachment) => {
        setOriginalResources((prevResources) => [...prevResources, attachment]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFileDelete = (id) => {
    DocumentAPI.deleteFile(id)
      .then(() => {
        setOriginalResources((prevResources) =>
          prevResources.filter((resource) => resource.id !== id)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Grid
      container
      component={fetchCardInfo !== undefined ? "form" : "div"}
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
              gap={2}
              sx={{ py: 2 }}>
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
                      onChange={handleFileUpload}
                    />
                    Upload
                  </Button>
                </>
              ) : (
                <>
                  <List dense={false} sx={{ width: "100%", pt: 0 }}>
                    {originalResources.map((attachment, index) => {
                      const icon = attachment.type.includes("pdf") ? (
                        <PictureAsPdfOutlined
                          sx={{ color: "black" }}></PictureAsPdfOutlined>
                      ) : attachment.type.includes("doc") ? (
                        <ArticleOutlined
                          sx={{ color: "black" }}></ArticleOutlined>
                      ) : (
                        <PhotoOutlined sx={{ color: "black" }}></PhotoOutlined>
                      );
                      return (
                        <>
                          <ListItem
                            key={index}
                            secondaryAction={
                              <IconButton
                                edge="end"
                                color="error"
                                aria-label="delete"
                                onClick={() => handleFileDelete(attachment.id)}>
                                <DeleteIcon />
                              </IconButton>
                            }>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText
                              primary={attachment.path.split("/").pop()}
                            />
                          </ListItem>
                          <Divider />
                        </>
                      );
                    })}
                  </List>
                  <Button
                    sx={{ mt: 2 }}
                    component="label"
                    variant="outlined"
                    color="success"
                    size="small"
                    startIcon={<UploadFileOutlined />}>
                    <VisuallyHiddenInput
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      type="file"
                      onChange={handleFileUpload}
                    />
                    Upload
                  </Button>
                </>
              )}
            </Box>
          </Paper>
        </Grid>
        <Grid
          sx={{
            width: "100%",
            display: fetchCardInfo !== undefined ? "flex" : "none",
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
