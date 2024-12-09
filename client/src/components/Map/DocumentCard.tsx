import {
    Avatar,
    Box,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Typography,
    Button,
  } from "@mui/material";
  import KirunaLogo from "../../assets/KirunaLogo.svg";
  import Grid from "@mui/material/Grid2";
  import {
    ArticleOutlined,
    AspectRatioOutlined,
    AutoStoriesOutlined,
    CloseOutlined,
    EditOutlined,
    FileDownload,
    LinkOutlined,
    LocationOnOutlined,
    PhotoOutlined,
    PictureAsPdfOutlined,
    SupervisorAccountOutlined,
    TodayOutlined,
    TranslateOutlined,
    TypeSpecimenOutlined,
  } from "@mui/icons-material";
  import { Outlet, useNavigate, useParams } from "react-router-dom";
  import type { DocumentCard } from "../../models/DocumentCard";
  import { useContext, useEffect, useRef, useState } from "react";
  import DocumentAPI from "../../API/DocumentAPI";
  import { DisabledInputContext } from "../../contexts/DisabledInputContext";
  import UserContext from "../../contexts/UserContext";
  import L from "leaflet";
  import { ErrorContext } from "../../contexts/ErrorContext";
  
  const style = {
    position: "absolute",
    zIndex: 1000,
    top: "50%",
    left: "50%",
    transform: { xs: "translate(-50%, -50%)", lg: "translate(-100%, -50%)" },
    width: "90%",
    maxWidth: "700px",
    maxHeight: "80%",
    bgcolor: "background.paper",
    borderRadius: "8px",
    boxShadow: 24,
    p: 1,
    overflowY: "auto",
    // Hide scrollbar but allow scrolling
    "&::-webkit-scrollbar": {
      width: "0px",
      background: "transparent",
    },
    msOverflowStyle: "none",
    scrollbarWidth: "none",
  };
  
  function CoordstoDMS(coordinate: number, isLat: boolean): string {
    const absolute = Math.abs(coordinate);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.floor((minutesNotTruncated - minutes) * 60);
  
    const direction = coordinate >= 0 ? (isLat ? "N" : "E") : isLat ? "S" : "W";
  
    return `${degrees}°${minutes}'${seconds}" ${direction}`;
  }
  
  function DocumentCard(props) {
    const navigate = useNavigate();
    const docId = useParams();
    const user = useContext(UserContext);
    const { disabledInput } = useContext(DisabledInputContext);
    const { setError } = useContext(ErrorContext);
    const cardRef = useRef(null);
  
    const [documentCard, setDocumentCard] = useState<DocumentCard | null>({
      id: 0,
      title: "",
      description: "",
      type: { id: 0, name: "" },
      stakeholders: [""],
      pages: "",
      location: [],
      issue_date: "",
      scale: "",
      language: "",
      conn_count: 0,
      attachments: [],
    });
  
    const fetchCardInfo = (id: number) => {
      DocumentAPI.getDocumentCard(id)
        .then((card) => {
          setDocumentCard(card);
        })
        .catch((err) => {
          setError(err.message);
        });
    };
  
    useEffect(() => {
      if (!disabledInput) {
        L.DomEvent.disableScrollPropagation(cardRef.current);
        L.DomEvent.disableClickPropagation(cardRef.current);
      }
      fetchCardInfo(Number(docId.id));
    }, [docId, disabledInput]);
  
    const isDiagramPage = window.location.pathname.includes("/diagram");
  
    return (
      <>
        {!disabledInput && (
          <Paper variant="outlined" ref={cardRef} >
            <Box sx={style}>
              <Grid
                container
                width={"100%"}
                sx={{ display: "flex", flexDirection: "column", padding: "10px" }}
              >
                <Grid
                  size={12}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Grid size={2} sx={{ marginLeft: "8px", paddingLeft: 2 }}>
                    <img
                      src={KirunaLogo}
                      width="40px"
                      height="48px"
                      alt="Kiruna Explorer"
                    />
                  </Grid>
                  <Grid
                    size={9}
                    sx={{ display: "flex", justifyContent: "start" }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {documentCard.title}
                    </Typography>
                  </Grid>
                  <Grid size={1} sx={{ display: "flex", justifyContent: "end" }}>
                    <IconButton
                      size="small"
                      onClick={() =>
                        navigate(props.returnHere ? props.returnHere : "/map")
                      }
                    >
                      {<CloseOutlined fontSize="small" />}
                    </IconButton>
                  </Grid>
                </Grid>
                <Divider />
                <Grid container>
                  <Grid
                    size={{ sm: 12, md: 8 }}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                      pl: 1,
                      mt: 2,
                    }}
                  >
                    <List
                      sx={{
                        width: "100%",
                        bgcolor: "background.paper",
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                      }}
                    >
                      <ListItem sx={{ alignItems: "start" }}>
                        <ListItemAvatar>
                          <Avatar>
                            <SupervisorAccountOutlined></SupervisorAccountOutlined>
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Stakeholders"
                          primaryTypographyProps={{
                            sx: { fontWeight: "bold", color: "#003d8f" },
                            variant: "subtitle2",
                          }}
                          secondary={documentCard.stakeholders.join("\n")}
                          secondaryTypographyProps={{
                            variant: "caption",
                            sx: {
                              wordBreak: "break-word",
                              whiteSpace: "pre-wrap",
                              overflowWrap: "break-word",
                            },
                          }}
                        />
                      </ListItem>
                      <ListItem
                        sx={{ alignItems: "start", maxWidth: "50%", pr: 0 }}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <AspectRatioOutlined></AspectRatioOutlined>
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Scale"
                          primaryTypographyProps={{
                            sx: { fontWeight: "bold", color: "#003d8f" },
                            variant: "subtitle2",
                          }}
                          secondaryTypographyProps={{
                            variant: "caption",
                            sx: {
                              whiteSpace: "normal",
                            },
                          }}
                          secondary={documentCard.scale}
                        />
                      </ListItem>
                      <ListItem sx={{ alignItems: "start" }}>
                        <ListItemAvatar>
                          <Avatar>
                            <TodayOutlined></TodayOutlined>
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Issue date"
                          primaryTypographyProps={{
                            sx: {
                              fontWeight: "bold",
                              color: "#003d8f",
                            },
                            variant: "subtitle2",
                          }}
                          secondaryTypographyProps={{
                            variant: "caption",
                          }}
                          secondary={documentCard.issue_date}
                        />
                      </ListItem>
                      <ListItem sx={{ alignItems: "start" }}>
                        <ListItemAvatar>
                          <Avatar>
                            <TypeSpecimenOutlined></TypeSpecimenOutlined>
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Type"
                          primaryTypographyProps={{
                            sx: {
                              fontWeight: "bold",
                              color: "#003d8f",
                            },
                            variant: "subtitle2",
                          }}
                          secondaryTypographyProps={{
                            variant: "caption",
                          }}
                          secondary={documentCard.type.name}
                        />
                      </ListItem>
                      <ListItem sx={{ alignItems: "start" }}>
                        <ListItemAvatar>
                          <Avatar>
                            <LinkOutlined></LinkOutlined>
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Connections"
                          primaryTypographyProps={{
                            sx: {
                              fontWeight: "bold",
                              color: "#003d8f",
                            },
                            variant: "subtitle2",
                          }}
                          secondaryTypographyProps={{
                            variant: "caption",
                          }}
                          secondary={documentCard.conn_count}
                        />
                      </ListItem>
                      <ListItem sx={{ alignItems: "start" }}>
                        <ListItemAvatar>
                          <Avatar>
                            <TranslateOutlined></TranslateOutlined>
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Language"
                          primaryTypographyProps={{
                            sx: {
                              fontWeight: "bold",
                              color: "#003d8f",
                            },
                            variant: "subtitle2",
                          }}
                          secondaryTypographyProps={{
                            variant: "caption",
                          }}
                          secondary={documentCard.language || "-"}
                        />
                      </ListItem>
                      <ListItem sx={{ alignItems: "start" }}>
                        <ListItemAvatar>
                          <Avatar>
                            <AutoStoriesOutlined></AutoStoriesOutlined>
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Pages"
                          primaryTypographyProps={{
                            sx: {
                              fontWeight: "bold",
                              color: "#003d8f",
                            },
                            variant: "subtitle2",
                          }}
                          secondaryTypographyProps={{
                            variant: "caption",
                          }}
                          secondary={documentCard.pages || "-"}
                        />
                      </ListItem>
                      <ListItem sx={{ alignItems: "start" }}>
                        <ListItemAvatar>
                          <Avatar>
                            <LocationOnOutlined></LocationOnOutlined>
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Typography
                                sx={{ fontWeight: "bold", color: "#003d8f" }}
                                variant="subtitle2"
                              >
                                Location
                              </Typography>
                              {user && (
                                <IconButton
                                  aria-label="delete"
                                  size="small"
                                  onClick={() => {
                                    navigate(`/map/${docId.id}/georeference`);
                                  }}
                                >
                                  <EditOutlined fontSize="inherit" />
                                </IconButton>
                              )}
                            </Box>
                          }
                          secondaryTypographyProps={{
                            variant: "caption",
                            sx: {
                              wordBreak: "break-word",
                              whiteSpace: "pre-wrap",
                              overflowWrap: "break-word",
                            },
                          }}
                          secondary={
                            documentCard.location.length === 0
                              ? "Entire municipality"
                              : documentCard.location.length === 1
                              ? `${CoordstoDMS(
                                  documentCard.location[0].lat,
                                  true
                                )}\n${CoordstoDMS(
                                  documentCard.location[0].lng,
                                  false
                                )}`
                              : "Shown area"
                          }
                        />
                      </ListItem>
                    </List>
                  </Grid>
                  <Divider
                    sx={{ display: { xs: "none", md: "flex" }, marginRight: -1 }}
                    orientation="vertical"
                    flexItem
                  />
                  <Grid
                    size={{ sm: 12, md: 4 }}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mt: 2,
                      gap: 1,
                      pl: 2,
                    }}
                  >
                    <Typography color="#003d8f" fontWeight="bold">
                      Description
                    </Typography>
                    <Typography>{documentCard.description}</Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <Typography color="#003d8f" fontWeight="bold">
                        Original resources
                      </Typography>
                      {user && (
                        <IconButton
                          aria-label="delete"
                          size="small"
                          onClick={() => navigate(`/map/${docId.id}/resources`)}
                        >
                          <EditOutlined fontSize="inherit" />
                        </IconButton>
                      )}
                    </Box>
                    {documentCard.attachments.length === 0 ? (
                      <Typography
                        variant="caption"
                        color="textDisabled"
                        sx={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        No original resources available
                      </Typography>
                    ) : (
                      documentCard.attachments.map((attachment) => {
                        const icon = attachment.type.includes("pdf") ? (
                          <PictureAsPdfOutlined></PictureAsPdfOutlined>
                        ) : attachment.type.includes("doc") ? (
                          <ArticleOutlined></ArticleOutlined>
                        ) : (
                          <PhotoOutlined></PhotoOutlined>
                        );
  
                        return (
                          attachment.original && (
                            <Box
                              key={attachment.id}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  flex: 1,
                                  minWidth: 0,
                                }}
                              >
                                {icon}
                                <Typography
                                  variant="body2"
                                  sx={{
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    flex: 1,
                                    minWidth: 0,
                                  }}
                                >
                                  {attachment.path.split("/").pop()}
                                </Typography>
                              </Box>
                              <IconButton
                                download={attachment.path.split("/").pop()}
                                href={`${DocumentAPI.getResourcesBaseURL()}${
                                  attachment.path
                                }`}
                                target="_blank"
                                aria-label="download"
                                size="small"
                              >
                                <FileDownload fontSize="inherit" />
                              </IconButton>
                            </Box>
                          )
                        );
                      })
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        marginTop: 2,
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          navigate(isDiagramPage ? `/map/${docId.id}` : `/diagram/${docId.id}`)
                        }
                        sx={{
                          textTransform: "none",
                          padding: "12px 24px",
                          fontSize: "16px",
                          background:
                            "linear-gradient(to bottom,  #002961, #3670BD)",
                          "&:hover": {
                            background:
                              "linear-gradient(to bottom, #3670BD, #002961)",
                          },
                          width: 200,
                          height: 40,
                        }}
                      >
                        {isDiagramPage ? "Show in Map" : "View in Diagram"}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        )}
        <Outlet
          context={
            window.location.pathname.includes("/resources")
              ? {
                  originalRes: documentCard.attachments,
                  fetchCardInfo: fetchCardInfo,
                }
              : {
                  location: documentCard.location,
                  fetchCardInfo: fetchCardInfo,
                }
          }
        />
      </>
    );
  }
  
  export default DocumentCard;