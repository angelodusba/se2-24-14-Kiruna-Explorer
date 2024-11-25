import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { Badge } from "@mui/material";

function SearchBar({ onSearch, handleFilterPanelOpen, filterNumber }) {
  const [search, setSearch] = useState("");

  return (
    <Paper
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(search);
      }}
      sx={{
        p: "1px 4px",
        display: "flex",
        flexGrow: 1,
        alignItems: "center",
        minWidth: 200,
        maxWidth: 600,
        maxHeight: "50px",
        borderRadius: "50px",
      }}
    >
      <InputBase
        sx={{ ml: 2, flex: 1, mt: "5px", mb: 0 }}
        placeholder="Search documents"
        inputProps={{ "aria-label": "search documents" }}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton
        sx={{ p: "10px", marginRight: "5px" }}
        aria-label="directions"
        onClick={(event) => {
          handleFilterPanelOpen({
            ...event,
            currentTarget: event.currentTarget.closest("form") as HTMLElement,
          });
        }}
      >
        <Badge
          badgeContent={filterNumber}
          color="error"
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <FilterAltIcon />
        </Badge>
      </IconButton>
    </Paper>
  );
}

export default SearchBar;
