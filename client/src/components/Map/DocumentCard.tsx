import {
  Avatar,
  Box,
  Divider,
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
  transform: "translate(-50%, -45%)",
  width: "500px",
  maxHeight: "80%",
  minHeight: "60%",
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 1,
  overflowY: "auto",
  maxWidth: {
    xs: "80%",
    sm: "600px",
  },
  minWidth: {
    xs: "80%",
    sm: "400px",
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
              {" "}
              <img
                src={KirunaLogo}
                width="40px"
                height="48px"
                alt="Kiruna Explorer"
                style={{ marginLeft: "8px" }}
              />
            </Grid>
            <Grid size={10} sx={{ display: "flex", justifyContent: "center" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Title
              </Typography>
            </Grid>
          </Grid>
          <Divider />
          <Grid container>
            <Grid
              size={{ sm: 12, md: 6 }}
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
                }}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <SupervisorAccountOutlined></SupervisorAccountOutlined>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Stakeholders"
                    primaryTypographyProps={{
                      sx: { fontWeight: "bold", color: "#003d8f" },
                    }}
                    secondary="LKAB"
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <AspectRatioOutlined></AspectRatioOutlined>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Scale"
                    primaryTypographyProps={{
                      sx: { fontWeight: "bold", color: "#003d8f" },
                    }}
                    secondary="1:1000"
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <TodayOutlined></TodayOutlined>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Issuance date"
                    primaryTypographyProps={{
                      sx: { fontWeight: "bold", color: "#003d8f" },
                    }}
                    secondary="12/12/2012"
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <TodayOutlined></TodayOutlined>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Type"
                    primaryTypographyProps={{
                      sx: { fontWeight: "bold", color: "#003d8f" },
                    }}
                    secondary="Material effect"
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <LinkOutlined></LinkOutlined>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Connections"
                    primaryTypographyProps={{
                      sx: { fontWeight: "bold", color: "#003d8f" },
                    }}
                    secondary="3"
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <TranslateOutlined></TranslateOutlined>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Language"
                    primaryTypographyProps={{
                      sx: { fontWeight: "bold", color: "#003d8f" },
                    }}
                    secondary="Italian"
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <AutoStoriesOutlined></AutoStoriesOutlined>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Pages"
                    primaryTypographyProps={{
                      sx: { fontWeight: "bold", color: "#003d8f" },
                    }}
                    secondary="100"
                  />
                </ListItem>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <LocationOnOutlined></LocationOnOutlined>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Location"
                    primaryTypographyProps={{
                      sx: { fontWeight: "bold", color: "#003d8f" },
                    }}
                    secondary="Affanculo"
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid
              size={{ sm: 12, md: 6 }}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                pl: 1,
                mt: 2,
              }}>
              <Typography color="#003d8f" fontWeight="bold">
                Description
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

export default DocumentCard;
