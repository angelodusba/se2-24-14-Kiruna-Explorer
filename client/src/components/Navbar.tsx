import * as React from "react";
import {
  Box,
  Toolbar,
  IconButton,
  Typography,
  MenuItem,
  Menu,
  Chip,
  AppBar,
  Stack,
} from "@mui/material";
import MapOutlined from "@mui/icons-material/Map";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import AutoGraphOutlinedIcon from "@mui/icons-material/AutoGraphOutlined";
import KirunaLogo from "../assets/KirunaLogo.svg";

import Grid from "@mui/material/Grid2";

/*
This part is the search bar, not part of these stories

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

<Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>}*/

function Navbar() {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const mobileMenuId = "mobile-menu";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}>
      <MenuItem>
        <IconButton size="small" aria-label="Map" color="inherit">
          <MapOutlined />
        </IconButton>
        <p>Map</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="small" aria-label="Diagram" color="inherit">
          <AutoGraphOutlinedIcon />
        </IconButton>
        <p>Diagram</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="small" aria-label="Account" color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Account</p>
      </MenuItem>
    </Menu>
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
                  noWrap
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
                <Stack direction="row" spacing={1} sx={{ margin: "auto" }}>
                  <Chip
                    icon={<MapOutlined color="inherit" />}
                    label="Map"
                    clickable
                    className="customChip"
                  />
                  <Chip
                    icon={<AutoGraphOutlinedIcon color="inherit" />}
                    label="Diagram"
                    clickable
                    className="customChip"
                  />
                </Stack>
              </Grid>
              <Grid
                size="grow"
                sx={{
                  justifyContent: "end",
                  display: { xs: "none", sm: "flex" },
                }}>
                <Chip
                  icon={<AccountCircle color="inherit" />}
                  label="Login"
                  clickable
                  className="customChip"
                />
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ display: { xs: "flex", sm: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit">
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
    </Box>
  );
}

export default Navbar;
