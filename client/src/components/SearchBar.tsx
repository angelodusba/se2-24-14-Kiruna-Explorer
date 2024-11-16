import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function SearchBar({ onSearch }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const showFilters = () => {
    navigate("/map/search");
  };

  return (
    <Paper
      component="form"
      onSubmit={() => {
        onSearch(search);
      }}
      sx={{
        p: "0px 4px",
        display: "flex",
        alignItems: "center",
        minWidth: 200,
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
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton sx={{ p: "10px" }} aria-label="directions" onClick={showFilters}>
        <FilterAltIcon />
      </IconButton>
    </Paper>
  );
}

export default SearchBar;
