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
  Tooltip,
  Fab,
} from "@mui/material";
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
  Minimize,
} from "@mui/icons-material";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import type { DocumentCard } from "../../models/DocumentCard";
import { useContext, useEffect, useRef, useState } from "react";
import DocumentAPI from "../../API/DocumentAPI";
import { DisabledInputContext } from "../../contexts/DisabledInputContext";
import UserContext from "../../contexts/UserContext";
import L from "leaflet";
import { ErrorContext } from "../../contexts/ErrorContext";
import { createReactFlowIcon } from "../shared/Icons";
import ConnectionAPI from "../../API/ConnectionApi";
import ConnectionChips from "./ConnectionChips";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import MapDiagramSwitch from "../shared/MapDiagramSwitch";

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

const getAttachmentIcon = (type: string) => {
  if (type.includes("pdf")) {
    return <PictureAsPdfOutlined />;
  } else if (type.includes("doc")) {
    return <ArticleOutlined />;
  } else {
    return <PhotoOutlined />;
  }
};

function DocumentCard(props) {
  const navigate = useNavigate();
  const docId = useParams();
  const user = useContext(UserContext);
  const { disabledInput } = useContext(DisabledInputContext);
  const { setError } = useContext(ErrorContext);
  const cardRef = useRef(null);
  // Maximize button visible when card is minimized
  const [isCardMinimized, setIsCardMinimized] = useState<boolean>(false);
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
  const [originalResources, setOriginalResources] = useState([]);
  const [notOriginalAttachments, setNotOriginalAttachments] = useState([]);
  const [connections, setConnections] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const maxLength = 250;
  const isLongDescription = documentCard.description.length > maxLength;

  const truncateDescription = (description, maxLength) => {
    if (description.length <= maxLength) return description;
    const truncated = description.substring(0, maxLength);
    return truncated.substring(0, truncated.lastIndexOf(" ")) + "...";
  };

  const truncatedDescription = isLongDescription
    ? truncateDescription(documentCard.description, maxLength)
    : documentCard.description;

  const handleConnectionsOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const fetchCardInfo = async (id: number) => {
    try {
      const card = await DocumentAPI.getDocumentCard(id);
      setDocumentCard(card);
      //Connections
      const docNames = await DocumentAPI.getAllDocumentsNames();
      const conns = await ConnectionAPI.getConnectionsByDocumentId(id);
      const connectionsWithNames = conns.map((conn) => {
        const name = docNames.find((name) => name.id === conn.document_id)?.title || "Unknown";
        return { ...conn, name };
      });
      setConnections(connectionsWithNames);
      //Attachments
      if (card.attachments.length === 0) {
        return;
      }
      const original = [];
      const notOriginal = [];
      card.attachments.forEach((attachment) => {
        if (attachment.original) {
          original.push(attachment);
        } else {
          notOriginal.push(attachment);
        }
        setOriginalResources(original);
        setNotOriginalAttachments(notOriginal);
      });
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!disabledInput) {
      L.DomEvent.disableScrollPropagation(cardRef.current);
      L.DomEvent.disableClickPropagation(cardRef.current);
    }
    const fetchData = async () => {
      await fetchCardInfo(Number(docId.id));
    };
    fetchData();
    setIsCardMinimized(false);
  }, [docId, disabledInput]);

  const isDiagramPage = window.location.pathname.includes("/diagram");

  return (
    <>
      {!disabledInput && (
        <Paper variant="outlined" ref={cardRef}>
          {isCardMinimized && (
            <Tooltip title="Restore card" placement="right">
              <Fab
                sx={{
                  borderRadius: "0 50% 50% 0",
                  border: "none",
                  position: "fixed",
                  backgroundColor: "white",
                  top: "50%",
                  left: 0,
                }}
                className="legend"
                size="medium"
                id="layersControl"
                aria-haspopup="true"
                onClick={() => {
                  setIsCardMinimized(false);
                }}
              >
                <div style={{ width: "80%", height: "90%", marginRight: 5 }}>
                  {createReactFlowIcon(
                    documentCard.type.name,
                    documentCard.id,
                    documentCard.stakeholders
                  )}
                </div>
              </Fab>
            </Tooltip>
          )}
          <Box sx={style} hidden={isCardMinimized}>
            <Grid
              container
              width={"100%"}
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: "10px",
              }}
            >
              <Grid
                size={12}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                {/* Card icon */}
                <Grid size={1} style={{ marginRight: "15px" }}>
                  <Box
                    sx={{
                      height: {
                        xs: 32,
                        sm: 40,
                        md: 48,
                      },
                      width: {
                        xs: 32,
                        sm: 40,
                        md: 48,
                      },
                    }}
                  >
                    {createReactFlowIcon(
                      documentCard.type.name,
                      documentCard.id,
                      documentCard.stakeholders
                    )}
                  </Box>
                </Grid>
                {/* Card title */}
                <Grid size={7} sx={{ display: "flex", justifyContent: "start" }}>
                  <Tooltip title={documentCard.title}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        fontSize: {
                          xs: "18px",
                          sm: "20px",
                          md: "24px",
                        },
                      }}
                      style={{
                        width: "92%",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {documentCard.title}
                    </Typography>
                  </Tooltip>
                </Grid>
                <Grid size={4} sx={{ display: "flex", justifyContent: "end" }}>
                  {/* Map / Diagram visualization switch */}
                  <MapDiagramSwitch
                    checked={isDiagramPage}
                    handleChange={() => {
                      navigate(isDiagramPage ? `/map/${docId.id}` : `/diagram/${docId.id}`);
                    }}
                  />
                  {/* Minimize / Close card buttons */}
                  <Tooltip title={"Minimize card"}>
                    <IconButton size="small" onClick={() => setIsCardMinimized(true)}>
                      {<Minimize fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={"Close card"}>
                    <IconButton
                      size="small"
                      onClick={() => navigate(props.returnHere ? props.returnHere : "/map")}
                    >
                      {<CloseOutlined fontSize="small" />}
                    </IconButton>
                  </Tooltip>
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
                    <ListItem sx={{ alignItems: "start", maxWidth: "50%", pr: 0 }}>
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
                          <TypeSpecimenOutlined />
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
                          <LinkOutlined />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        disableTypography
                        primary={
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              color: "#003d8f",
                            }}
                            variant="subtitle2"
                          >
                            Connections
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="caption">{documentCard.conn_count}</Typography>
                            {/* Connections links */}
                            {connections.length > 0 && (
                              <>
                                <IconButton size="small" onClick={handleConnectionsOpen}>
                                  <ArrowDropDownOutlinedIcon color="primary"></ArrowDropDownOutlinedIcon>
                                </IconButton>
                                <ConnectionChips
                                  connections={connections}
                                  anchorEl={anchorEl}
                                  setAnchorEl={setAnchorEl}
                                />
                              </>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    <ListItem sx={{ alignItems: "start" }}>
                      <ListItemAvatar>
                        <Avatar>
                          <TranslateOutlined />
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
                          <AutoStoriesOutlined />
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
                          <LocationOnOutlined />
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
                            ? `${CoordstoDMS(documentCard.location[0].lat, true)}\n${CoordstoDMS(
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
                  <Box>
                    <Typography>
                      {showFullDescription || !isLongDescription
                        ? documentCard.description
                        : truncatedDescription}
                      {isLongDescription && (
                        <IconButton onClick={() => setShowFullDescription(!showFullDescription)}>
                          {showFullDescription ? (
                            <ExpandLessOutlinedIcon color="primary" />
                          ) : (
                            <ExpandMoreOutlinedIcon color="primary" />
                          )}
                        </IconButton>
                      )}
                    </Typography>
                  </Box>{" "}
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
                  {originalResources.length === 0 ? (
                    <Typography
                      variant="caption"
                      color="textDisabled"
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        minWidth: 0,
                      }}
                    >
                      No original resources available
                    </Typography>
                  ) : (
                    originalResources.map((attachment) => {
                      const icon = getAttachmentIcon(attachment.type);
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
                              href={`${DocumentAPI.getResourcesBaseURL()}${attachment.path}`}
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
                    }}
                  >
                    <Typography color="#003d8f" fontWeight="bold">
                      Attachments
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
                  {notOriginalAttachments.length === 0 ? (
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
                      No attachments available
                    </Typography>
                  ) : (
                    notOriginalAttachments.map((attachment) => {
                      const icon = getAttachmentIcon(attachment.type);
                      return (
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
                            href={`${DocumentAPI.getResourcesBaseURL()}${attachment.path}`}
                            target="_blank"
                            aria-label="download"
                            size="small"
                          >
                            <FileDownload fontSize="inherit" />
                          </IconButton>
                        </Box>
                      );
                    })
                  )}
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
                attachments: documentCard.attachments,
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
