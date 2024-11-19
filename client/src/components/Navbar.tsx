import * as React from "react";
import {
  Box,
  Toolbar,
  Typography,
  MenuItem,
  Menu,
  AppBar,
  Divider,
  MenuProps,
  Fab,
  Avatar,
  ListItemIcon,
  Popover,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AccountCircleOutlined from "@mui/icons-material/AccountCircle";
import KirunaLogo from "../assets/KirunaLogo.svg";
import Grid from "@mui/material/Grid2";
import UserContext from "../contexts/UserContext";
import { styled, alpha } from "@mui/material/styles";
import { Logout, MailOutline } from "@mui/icons-material";
import { DisabledInputContext } from "../contexts/DisabledInputContext";
import SearchBar from "./SearchBar";
import { SearchFilter } from "../models/SearchFilter";
import { useContext, useEffect, useState } from "react";
import AdvancedSearchForm from "./Forms/AdvancedSearchForm";
import { StakeHolder } from "../models/StakeHolders";
import { Type } from "../models/Type";
import DocumentAPI from "../API/DocumentAPI";

function stringToColor(string: string) {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i += 1) {
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
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.grey[300],
    }),
  },
}));

function Navbar({ onSearch, handleLogout }) {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const { disabledInput } = useContext(DisabledInputContext);
  /* User account panel */
  const [accountAnchorEl, setAccountAnchorEl] = useState<null | HTMLElement>(null);
  const accountOpen = Boolean(accountAnchorEl);
  /* Advanced search panel */
  const [advancedSearchAnchorEl, setAdvancedSearchAnchorEl] = useState<HTMLButtonElement | null>(
    null
  );
  const advancedSearchOpen = Boolean(advancedSearchAnchorEl); //
  const advancedSearchId = advancedSearchOpen ? "advancedSearch" : undefined;
  /*  */
  const [stakeholders, setStakeholders] = useState<StakeHolder[]>([]);
  const [documentTypes, setDocumentTypes] = useState<Type[]>([]);
  const [filters, setFilters] = useState<SearchFilter>({
    title: "",
    types: [],
    start_year: "",
    end_year: "",
    scales: [],
    languages: [],
    stakeholders: [],
  });

  const handleResetFilters = () => {
    setFilters({
      title: "",
      types: [],
      start_year: "",
      end_year: "",
      scales: [],
      languages: [],
      stakeholders: [],
    });
  };

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAccountAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountAnchorEl(null);
  };

  const handleSimpleSearch = (search: string) => {
    const filter: SearchFilter = { title: search };
    onSearch(filter);
  };

  const handleAdvancedSearch = () => {
    // Filter out empty or default values
    const nonEmptyFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => {
        if (Array.isArray(value)) {
          // Keep arrays only if they have at least one element
          return value.length > 0;
        } else {
          // Keep strings only if they are not empty
          return value !== "";
        }
      })
    );
    onSearch(nonEmptyFilters);
  };

  const handleAdvacedSearchPanelOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAdvancedSearchAnchorEl(event.currentTarget);
  };

  const handleAdvacedSearchPanelClose = () => {
    setAdvancedSearchAnchorEl(null);
  };

  const renderAccountMenu = (
    <AccountMenu
      id="accountMenu"
      MenuListProps={{
        "aria-labelledby": "accountMenu",
      }}
      anchorEl={accountAnchorEl}
      open={accountOpen}
      onClose={handleAccountMenuClose}
    >
      <Typography variant="h5" fontWeight="bold" align="center">
        Hi {user?.username}
      </Typography>
      <MenuItem disableRipple>
        <ListItemIcon sx={{ color: "#003d8f" }}>
          <MailOutline fontSize="small" color="inherit" />
        </ListItemIcon>
        {user?.email}
      </MenuItem>
      <Divider sx={{ my: 0.5 }} />
      <MenuItem
        onClick={() => {
          handleAccountMenuClose();
          handleLogout();
        }}
        disableRipple
        sx={{ color: "error.main" }}
      >
        <ListItemIcon>
          <Logout fontSize="small" color="error" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </AccountMenu>
  );

  useEffect(() => {
    // Fetch document types
    DocumentAPI.getTypes()
      .then((types: Type[]) => {
        setDocumentTypes(types);
      })
      .catch((error) => {
        console.log(error);
      });
    // Fetch stakeholders
    DocumentAPI.getStakeholders()
      .then((stakeholders: StakeHolder[]) => {
        setStakeholders(stakeholders);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        color="transparent"
        sx={{
          boxShadow: "none",
          border: "none",
          zIndex: 1000,
          color: "white",
        }}
      >
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
                }}
              >
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
                  sx={{ display: { sm: "block", xs: "none" } }}
                >
                  Kiruna Explorer
                </Typography>
              </Grid>
              <Grid
                size={6}
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <SearchBar
                  aria-describedby={advancedSearchId}
                  onSearch={handleSimpleSearch}
                  handleFilterPanelOpen={handleAdvacedSearchPanelOpen}
                />
                <Popover
                  id={advancedSearchId}
                  open={advancedSearchOpen}
                  anchorEl={advancedSearchAnchorEl}
                  onClose={handleAdvacedSearchPanelClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <AdvancedSearchForm
                    handleClose={handleAdvacedSearchPanelClose}
                    handleSubmit={handleAdvancedSearch}
                    handleReset={handleResetFilters}
                    filters={filters}
                    setFilters={setFilters}
                    stakeholders={stakeholders}
                    documentTypes={documentTypes}
                  />
                </Popover>
              </Grid>
              <Grid
                size="grow"
                sx={{
                  justifyContent: "end",
                  alignItems: "center",
                  display: { xs: "flex", sm: "flex" },
                }}
              >
                {!user ? (
                  <Fab
                    disabled={disabledInput}
                    variant="extended"
                    size="medium"
                    className="customButton"
                    onClick={() => navigate("/auth")}
                  >
                    <AccountCircleOutlined sx={{ mr: 1 }} />
                    Login
                  </Fab>
                ) : (
                  <Fab
                    disabled={disabledInput}
                    size="medium"
                    id="accountMenu"
                    aria-controls={accountOpen ? "accountMenu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={accountOpen ? "true" : undefined}
                    onClick={accountOpen ? handleAccountMenuClose : handleAccountMenuOpen}
                  >
                    <Avatar {...stringAvatar(user.username)} />
                  </Fab>
                )}
              </Grid>
            </Grid>
          </Box>
        </Toolbar>
      </AppBar>
      {user && renderAccountMenu}
      {/* <DocumentList open={openDocuments} onClose={handleCloseDocuments} /> */}
    </Box>
  );
}

export default Navbar;
