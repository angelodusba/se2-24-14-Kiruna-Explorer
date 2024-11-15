import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  Typography,
} from "@mui/material";
import KirunaLogo from "../../assets/KirunaLogo.svg";
import Grid from "@mui/material/Grid2";
import {
  AspectRatioOutlined,
  AutoStoriesOutlined,
  EditOutlined,
  LinkOutlined,
  LocationOnOutlined,
  SupervisorAccountOutlined,
  TodayOutlined,
  TranslateOutlined,
} from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "500px",
  maxHeight: "80%",
  minHeight: "60%",
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 1,
  overflowY: "auto",
  maxWidth: {
    xs: "90%",
    sm: "700px",
  },
  minWidth: {
    xs: "80%",
    sm: "700px",
  },
  //Hide scrollbar but allow scrolling
  "&::-webkit-scrollbar": {
    width: "0px",
    background: "transparent",
  },
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

function DocumentCard(props) {
  return (
    <Modal
      open={true}
      disableAutoFocus
      onClose={() => props.setOperation(undefined)}
      aria-labelledby="CardModal"
      aria-describedby="CardModal">
      <Box sx={style}>
        <Grid
          container
          width={"100%"}
          sx={{ display: "flex", flexDirection: "column" }}>
          <Grid
            size={12}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              mb: 1,
            }}>
            <Grid size={2}>
              <img
                src={KirunaLogo}
                width="40px"
                height="48px"
                alt="Kiruna Explorer"
                style={{ marginLeft: "8px" }}
              />
            </Grid>
            <Grid size={10} sx={{ display: "flex", justifyContent: "start" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Title
              </Typography>
            </Grid>
          </Grid>
          <Divider variant="middle" />
          <Grid container>
            <Grid
              size={{ sm: 12, md: 7 }}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                pl: 1,
                mt: 2,
              }}>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: "repeat(2, 1fr)",
                }}>
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
                    secondary="LKAB"
                    secondaryTypographyProps={{
                      variant: "caption",
                    }}
                  />
                </ListItem>
                <ListItem sx={{ alignItems: "start" }}>
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
                    }}
                    secondary="1:1000"
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
                    secondary="12/12/2012"
                  />
                </ListItem>
                <ListItem sx={{ alignItems: "start" }}>
                  <ListItemAvatar>
                    <Avatar>
                      <TodayOutlined></TodayOutlined>
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
                    secondary="Material effect"
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
                    secondary="3"
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
                    secondary="Italian"
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
                    secondary="100"
                  />
                </ListItem>
                <ListItem sx={{ alignItems: "start" }}>
                  <ListItemAvatar>
                    <Avatar>
                      <LocationOnOutlined></LocationOnOutlined>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Location"
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
                    secondary="Casa"
                  />
                </ListItem>
              </List>
            </Grid>
            <Divider orientation="vertical" flexItem sx={{ marginRight: -1 }} />
            <Grid
              size={{ sm: 12, md: 5 }}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mt: 2,
                gap: 1,
                pl: 2,
              }}>
              <Typography color="#003d8f" fontWeight="bold">
                Description
              </Typography>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipisci elit, sed do
                eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrum exercitationem ullamco
                laboriosam, nisi ut aliquid ex ea commodi consequatur. Duis aute
                irure reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non
                proident, sunt in culpa qui officia deserunt mollit anim id est
                laborum
              </Typography>
              <Typography
                color="#003d8f"
                fontWeight="bold"
                sx={{ mt: 1, mr: 2 }}>
                Original resources
                <IconButton aria-label="delete" size="small">
                  <EditOutlined fontSize="inherit" />
                </IconButton>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

export default DocumentCard;
