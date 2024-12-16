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
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DocumentAPI from "../../API/DocumentAPI";
import { ErrorContext } from "../../contexts/ErrorContext";
import React from "react";

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

function AttachmentsForm({
  attachments = [],
  fetchCardInfo = undefined,
  docId = undefined,
}) {
  const [originalResources, setOriginalResources] = useState([]);
  const [notOriginalAttachments, setNotOriginalAttachments] = useState([]);
  const navigate = useNavigate();
  const param = useParams();
  const { setError } = useContext(ErrorContext);

  useEffect(() => {
    if (attachments.length === 0) {
      return;
    }

    const original = [];
    const notOriginal = [];
    attachments.forEach((attachment) => {
      if (attachment.original) {
        original.push(attachment);
      } else {
        notOriginal.push(attachment);
      }
    });
    setOriginalResources(original);
    setNotOriginalAttachments(notOriginal);
  }, [attachments]);

  const handleClose = (event) => {
    event.preventDefault();
    fetchCardInfo(Number(param.id));
    navigate(-1);
  };

  const handleFileUpload = (event, original: boolean) => {
    const id = docId ? Number(docId) : Number(param.id);
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("original", original.toString());
    DocumentAPI.uploadFile(id, formData)
      .then((attachment) => {
        if (original) {
          setOriginalResources((prevResources) => [
            ...prevResources,
            attachment,
          ]);
        } else {
          setNotOriginalAttachments((prevResources) => [
            ...prevResources,
            attachment,
          ]);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const handleFileDelete = (id, original: boolean) => {
    DocumentAPI.deleteFile(id)
      .then(() => {
        if (original) {
          setOriginalResources((prevResources) =>
            prevResources.filter((resource) => resource.id !== id)
          );
        } else {
          setNotOriginalAttachments((prevResources) =>
            prevResources.filter((resource) => resource.id !== id)
          );
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <Grid
      container
      component={fetchCardInfo !== undefined ? "form" : "div"}
      onSubmit={handleClose}
      sx={{
        minWidth: "400px",
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
                      onChange={(e) => handleFileUpload(e, true)}
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
                        <React.Fragment key={attachment.id || index}>
                          <ListItem
                            secondaryAction={
                              <IconButton
                                edge="end"
                                color="error"
                                aria-label="delete"
                                onClick={() =>
                                  handleFileDelete(attachment.id, true)
                                }>
                                <DeleteIcon />
                              </IconButton>
                            }>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText
                              primary={attachment.path.split("/").pop()}
                            />
                          </ListItem>
                          <Divider />
                        </React.Fragment>
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
                      onChange={(e) => handleFileUpload(e, true)}
                    />
                    Upload
                  </Button>
                </>
              )}
            </Box>
          </Paper>
        </Grid>
        <Typography
          variant="h6"
          fontWeight={"bold"}
          style={{ textAlign: "center", marginBottom: 15, marginTop: 10 }}>
          Attachments
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
                notOriginalAttachments.length === 0 ? "center" : "start"
              }
              alignItems="center"
              height="100%"
              gap={2}
              sx={{ py: 2 }}>
              {notOriginalAttachments.length === 0 ? (
                <>
                  <Typography variant="subtitle1">
                    Add your first attachment
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
                      onChange={(e) => handleFileUpload(e, false)}
                    />
                    Upload
                  </Button>
                </>
              ) : (
                <>
                  <List dense={false} sx={{ width: "100%", pt: 0 }}>
                    {notOriginalAttachments.map((attachment, index) => {
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
                        <React.Fragment key={attachment.id || index}>
                          <ListItem
                            secondaryAction={
                              <IconButton
                                edge="end"
                                color="error"
                                aria-label="delete"
                                onClick={() =>
                                  handleFileDelete(attachment.id, false)
                                }>
                                <DeleteIcon />
                              </IconButton>
                            }>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText
                              primary={attachment.path.split("/").pop()}
                            />
                          </ListItem>
                          <Divider />
                        </React.Fragment>
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
                      onChange={(e) => handleFileUpload(e, false)}
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
            justifyContent: "end",
            py: 2,
          }}>
          <Button type={"submit"}>Close</Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default AttachmentsForm;
