import * as React from "react";
import {
  Box,
  Toolbar,
  Typography,
  MenuItem,
  Menu,
  AppBar,
  Stack,
  Divider,
  MenuProps,
  Fab,
  Avatar,
  ListItemIcon,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccountCircleOutlined from "@mui/icons-material/AccountCircle";
import KirunaLogo from "../assets/KirunaLogo.svg";
import Grid from "@mui/material/Grid2";
import UserContext from "../contexts/UserContext";
import { styled, alpha } from "@mui/material/styles";
import { Logout, MailOutline } from "@mui/icons-material";

function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function stringAvatar(name: string) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("");

  return {
    sx: {
      height: "100%",
      width: "100%",
      bgcolor: stringToColor(name),
    },
    children: initials || name[0],
  };
}

const AccountMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: "rgb(55, 65, 81)",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.grey[300],
    }),
  },
}));

function Navbar(props) {
  const user = React.useContext(UserContext);
  const navigate = useNavigate();

  const [accountAnchorEl, setAccountAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const accountOpen = Boolean(accountAnchorEl);

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAccountAnchorEl(event.currentTarget);
  };
  const handleAccountMenuClose = () => {
    setAccountAnchorEl(null);
  };

  const renderAccountMenu = (
    <AccountMenu
      id="accountMenu"
      MenuListProps={{
        "aria-labelledby": "accountMenu",
      }}
      anchorEl={accountAnchorEl}
      open={accountOpen}
      onClose={handleAccountMenuClose}>
      <Typography variant="h5" fontWeight="bold" align="center">
        Hi Stocazzo
      </Typography>
      <MenuItem onClick={handleAccountMenuClose} disableRipple>
        <ListItemIcon sx={{ color: "#003d8f" }}>
          <MailOutline fontSize="small" color="inherit" />
        </ListItemIcon>
        MailStocazzo@gmail.com
      </MenuItem>
      <Divider sx={{ my: 0.5 }} />
      <MenuItem
        onClick={() => {
          handleAccountMenuClose();
          props.logout();
        }}
        disableRipple
        sx={{ color: "error.main" }}>
        <ListItemIcon>
          <Logout fontSize="small" color="error" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </AccountMenu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        color="transparent"
        sx={{
          boxShadow: "none",
          border: "none",
          zIndex: 1000000,
          color: "white",
        }}>
        <Toolbar sx={{ flexGrow: 1 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container>
              <Grid
                size="grow"
                sx={{
                  justifyContent: "start",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: "8px",
                }}>
                <img
                  src={KirunaLogo}
                  width="40px"
                  height="48px"
                  alt="Kiruna Explorer"
                  style={{ marginRight: "8px" }}
                />
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ display: { sm: "block", xs: "none" } }}>
                  Kiruna Explorer
                </Typography>
              </Grid>
              <Grid
                size={6}
                sx={{
                  justifyContent: "center",
                  display: { xs: "none", sm: "flex" },
                }}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ margin: "auto" }}></Stack>
              </Grid>
              <Grid
                size="grow"
                sx={{
                  justifyContent: "end",
                  alignItems: "center",
                  display: { xs: "flex", sm: "flex" },
                }}>
                {user ? (
                  <Fab
                    variant="extended"
                    size="medium"
                    className="customButton"
                    onClick={() => navigate("/auth")}>
                    <AccountCircleOutlined sx={{ mr: 1 }} />
                    Login
                  </Fab>
                ) : (
                  <Fab
                    size="medium"
                    id="accountMenu"
                    aria-controls={accountOpen ? "accountMenu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={accountOpen ? "true" : undefined}
                    onClick={
                      accountOpen
                        ? handleAccountMenuClose
                        : handleAccountMenuOpen
                    }>
                    <Avatar {...stringAvatar("JedWatson")} />
                  </Fab>
                )}
              </Grid>
            </Grid>
          </Box>
        </Toolbar>
      </AppBar>
      {renderAccountMenu}
    </Box>
  );
}

export default Navbar;
