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
  Chip,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleOutlined from "@mui/icons-material/AccountCircle";
import KirunaLogo from "../../assets/KirunaLogo.svg";
import Grid from "@mui/material/Grid2";
import UserContext from "../../contexts/UserContext";
import { styled, alpha } from "@mui/material/styles";
import { Logout, MailOutline } from "@mui/icons-material";
import { DisabledInputContext } from "../../contexts/DisabledInputContext";
import SearchBar from "./SearchBar";
import { SearchFilter } from "../../models/SearchFilter";
import { useContext, useEffect, useState } from "react";
import AdvancedSearchForm from "../Forms/AdvancedSearchForm";
import { StakeHolder } from "../../models/StakeHolders";
import { Type } from "../../models/Type";
import DocumentAPI from "../../API/DocumentAPI";
import NavDial from "./NavDial";
import { useLocation } from "react-router-dom";
import FilterChips from "./FilterChips";

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

function Navbar({ onSearch, handleLogout, filterNumber, handleResetFilters }) {

  const location = useLocation();
  const isMapPage = location.pathname === "/map";
  const isDiagramPage = location.pathname === "/diagram";

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
  const advancedSearchOpen = Boolean(advancedSearchAnchorEl);
  const advancedSearchId = advancedSearchOpen ? "advancedSearch" : undefined;
  /* Filters */
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
    keywords: [],
    municipality: false,
  });
  const [searchValue, setSearchValue] = useState<string>("");
  const [filterNames, setFilterNames] = useState<string[]>([]);

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAccountAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountAnchorEl(null);
  };

  const handleRemoveFilter = (key: string) => {
    setFilters((prevFilters) => {
      const defaultValue = Array.isArray(prevFilters[key])
        ? []
        : typeof prevFilters[key] === "boolean"
        ? false
        : "";
      const updatedFilters = { ...prevFilters, [key]: defaultValue };
      setFilters(updatedFilters);
      onSearch(updatedFilters);
      return updatedFilters;
    });
  };

  const handleSimpleSearch = () => {
    setFilters({
      title: searchValue || "",
      types: [],
      start_year: "",
      end_year: "",
      scales: [],
      languages: [],
      stakeholders: [],
      keywords: [],
      municipality: false,
    });
    onSearch({ title: searchValue });
    setFilterNames(searchValue !== "" ? ["title"] : []);
  };

  const handleReset = () => {
    setFilters({
      title: "",
      types: [],
      start_year: "",
      end_year: "",
      scales: [],
      languages: [],
      stakeholders: [],
      keywords: [],
      municipality: false,
    });
    setSearchValue("");
    handleResetFilters();
  };

  const handleAdvancedSearch = () => {
    const nonEmptyFilters = getNonEmptyFilters();
    setSearchValue(nonEmptyFilters.title || "");
    // Set non empty filters names
    const names = Object.entries(nonEmptyFilters).map(([filterName]) => filterName);
    setFilterNames(names);
    onSearch(nonEmptyFilters);
  };

  const handleAdvacedSearchPanelOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAdvancedSearchAnchorEl(event.currentTarget);
  };

  const handleAdvacedSearchPanelClose = () => {
    setAdvancedSearchAnchorEl(null);
  };

  const getNonEmptyFilters = () => {
    // Filter out empty or default values
    return Object.fromEntries(
      Object.entries(filters).filter(([, value]) => {
        if (Array.isArray(value)) {
          // Keep arrays only if they have at least one element
          return value.length > 0;
        } else if (typeof value === "boolean") {
          // Include boolean values unless they are undefined
          return value !== undefined && value !== false;
        } else {
          // Keep strings only if they are not empty
          return value !== "";
        }
      })
    );
  };

  const getNonEmptyFiltersLength = () => {
    return Object.entries(filters).filter(([, value]) => {
      if (Array.isArray(value)) {
        // Keep arrays only if they have at least one element
        return value.length > 0;
      } else if (typeof value === "boolean") {
        // Include boolean values unless they are undefined
        return value !== undefined && value !== false;
      } else {
        // Keep strings only if they are not empty
        return value !== "";
      }
    }).length;
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
    // Reset App filters
    handleResetFilters();
  }, []);

  useEffect(() => {
    const nonEmptyFilters = getNonEmptyFilters();
    // Set non empty filters names
    const names = Object.entries(nonEmptyFilters).map(([filterName]) => filterName);
    setFilterNames(names);
  }, [filters]);

  return (
    <>
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
                    marginTop: "8px",
                  }}
                >
                  <Link
                    to={"/"}
                    style={{
                      textDecoration: "none",
                      color: "white",
                      justifyContent: "start",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
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
                      sx={{
                        display: { sm: "block", xs: "none" },
                        fontWeight: 500,
                        letterSpacing: "0.5px", // Slight spacing
                        color: isMapPage
                          ? "white"
                          : isDiagramPage 
                          ? "#003d8f"
                          : "inherit", // Conditional color
                      }}
                    >
                      Kiruna Explorer
                    </Typography>
                  </Link>
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
                    filterNumber={filterNumber}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
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
                      handleReset={handleReset}
                      filters={filters}
                      setFilters={setFilters}
                      stakeholders={stakeholders}
                      documentTypes={documentTypes}
                    />
                  </Popover>
                </Grid>

                <Grid>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {Object.entries(filters).flatMap(([key, value]) => {
                      if (key === "types" && Array.isArray(value)) {
                        // Map type IDs to their names for the "types" filter
                        return value.map((typeId) => {
                          const type = documentTypes.find(
                            (t) => t.id === typeId
                          ); // Find the corresponding type
                          return (
                            <Chip
                              color="success"
                              key={`${key}-${typeId}`}
                              label={`${key}: ${type?.name || typeId}`} // Show name if available, fallback to ID
                              onDelete={() => handleRemoveFilter(key, typeId)}
                            />
                          );
                        });
                      }

                      if (key === "stakeholders" && Array.isArray(value)) {
                        // Map stakeholder IDs to their names for the "stakeholders" filter
                        return value.map((stakeholderId) => {
                          const stakeholder = stakeholders.find(
                            (s) => s.id === stakeholderId
                          ); // Find the corresponding stakeholder
                          return (
                            <Chip
                              color="success"
                              key={`${key}-${stakeholderId}`}
                              label={`${key}: ${
                                stakeholder?.name || stakeholderId
                              }`} // Show name if available, fallback to ID
                              onDelete={() =>
                                handleRemoveFilter(key, stakeholderId)
                              }
                            />
                          );
                        });
                      }

                      return Array.isArray(value)
                        ? value.map((item) => (
                            <Chip
                              color="success"
                              key={`${key}-${item}`}
                              label={`${key}: ${item}`}
                              onDelete={() => handleRemoveFilter(key, item)}
                            />
                          ))
                        : value && (
                            <Chip
                              color="success"
                              key={key}
                              label={`${key}: ${value}`}
                              onDelete={() => handleRemoveFilter(key, value)}
                            />
                          );
                    })}
                  </Box>
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
                      variant="extended"
                      onClick={() => navigate("/login")}
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        background:
                          "linear-gradient(to bottom,  #002961, #3670BD)",
                        "&:hover": {
                          background:
                            "linear-gradient(to bottom, #3670BD, #002961)",
                        },
                        width: 104,
                        height: 40,
                        borderRadius: "5px",
                        color: "#FFFFFF",
                      }}
                    >
                      <AccountCircleOutlined sx={{ mr: 1 }} />
                      LogIn
                    </Fab>
                  ) : (
                    <Fab
                      disabled={disabledInput}
                      size="medium"
                      id="accountMenu"
                      aria-controls={accountOpen ? "accountMenu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={accountOpen ? "true" : undefined}
                      onClick={
                        accountOpen
                          ? handleAccountMenuClose
                          : handleAccountMenuOpen
                      }
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
      </Box>
      {(getNonEmptyFiltersLength() > 1 || !filters.title) && (
        <FilterChips filterNames={filterNames} handleRemoveFilter={handleRemoveFilter} />
      )}
      <NavDial />
    </>
  );
}

export default Navbar;
