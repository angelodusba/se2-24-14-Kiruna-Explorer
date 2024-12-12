import {
  TextField,
  Autocomplete,
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  FormControlLabel,
  Checkbox,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";

const languages = [
  { code: "GB", label: "English" },
  {
    code: "SE",
    label: "Swedish",
  },
];

function AdvancedSearchForm({
  handleClose,
  handleSubmit,
  handleReset,
  filters,
  setFilters,
  stakeholders,
  documentTypes,
}) {
  const [keywordValue, setKeywordValue] = useState<string>("");

  return (
    <Card sx={{ padding: 1, maxWidth: "600px" }}>
      <CardHeader title="Advanced Search" />
      <CardContent>
        <Grid container spacing={2}>
          {/* Title */}
          <Grid size={12}>
            <TextField
              size="small"
              label="Title"
              value={filters.title || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  title: e.target.value,
                })
              }
              fullWidth
            />
          </Grid>
          {/* Type */}
          <Grid size={6}>
            <Autocomplete
              size="small"
              multiple
              disableCloseOnSelect
              options={documentTypes}
              getOptionLabel={(option) => option.name}
              value={documentTypes.filter((type) => filters.types?.includes(type.id)) || []}
              onChange={(_, newValue) =>
                setFilters({
                  ...filters,
                  types: newValue.map((option) => option.id),
                })
              }
              renderInput={(params) => <TextField {...params} label="Type" />}
            />
          </Grid>
          {/* Language */}
          <Grid size={6}>
            <Autocomplete
              size="small"
              multiple
              disableCloseOnSelect
              options={languages}
              getOptionLabel={(option) => option.label}
              value={languages.filter((lang) => filters.languages?.includes(lang.label)) || null}
              onChange={(_e, newValue) =>
                setFilters({
                  ...filters,
                  languages: newValue.map((option) => option.label),
                })
              }
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                  <Box
                    key={key}
                    component="li"
                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                    {...optionProps}
                  >
                    <img
                      loading="lazy"
                      width="20"
                      srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                      src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                      alt=""
                    />
                    {option.label}
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField
                  size="small"
                  {...params}
                  label="Language"
                  slotProps={{
                    htmlInput: {
                      ...params.inputProps,
                      autoComplete: "new-password", // disable autocomplete and autofill
                    },
                  }}
                />
              )}
            />
          </Grid>
          {/* Start Year */}
          <Grid size={6}>
            <TextField
              size="small"
              label="Start Year"
              value={filters.start_year || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  start_year: e.target.value,
                })
              }
              slotProps={{
                htmlInput: {
                  pattern: "\\d{4}", // Regex for exactly 4 digits
                  maxLength: 4,
                  onInput: (e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value.replace(".", "-");
                    if (isNaN(Number(value))) {
                      e.target.value = value.slice(0, -1);
                    }
                  },
                },
              }}
              fullWidth
            />
          </Grid>
          {/* End Year */}
          <Grid size={6}>
            <TextField
              size="small"
              label="End Year"
              value={filters.end_year || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  end_year: e.target.value,
                })
              }
              slotProps={{
                htmlInput: {
                  pattern: "\\d{4}", // Regex for exactly 4 digits
                  maxLength: 4,
                  onInput: (e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value.replace(".", "-");
                    if (isNaN(Number(value))) {
                      e.target.value = value.slice(0, -1);
                    }
                  },
                },
              }}
              fullWidth
            />
          </Grid>
          {/* Stakeholders */}
          <Grid size={12}>
            <Autocomplete
              size="small"
              multiple
              disableCloseOnSelect
              options={stakeholders}
              getOptionLabel={(option) => option.name}
              value={
                stakeholders.filter((stakeholder) =>
                  filters.stakeholders?.includes(stakeholder.id)
                ) || []
              }
              onChange={(_e, newValue) =>
                setFilters({
                  ...filters,
                  stakeholders: newValue.map((option) => option.id),
                })
              }
              renderInput={(params) => <TextField {...params} label="Stakeholders" />}
            />
          </Grid>
          {/* Keywords */}
          <Grid size={12}>
            <TextField
              size="small"
              placeholder="Separate keywords with a space"
              label="Keywords"
              value={keywordValue}
              onChange={(e) => {
                setKeywordValue(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.code === "Space") {
                  e.preventDefault();
                  const trimmedKeyword = keywordValue.trim();
                  // Avoid empty and duplicate entries
                  if (trimmedKeyword && !filters.keywords.includes(trimmedKeyword)) {
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      keywords: [...prevFilters.keywords, keywordValue.trim()],
                    }));
                  }
                  setKeywordValue("");
                }
              }}
              fullWidth
            />
          </Grid>
          {/* Chips list */}
          <Grid size={12}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                listStyle: "none",
                maxHeight: "80px",
                overflowY: "auto",
                gap: 1,
                p: 0,
                m: 0,
              }}
              component="ul"
            >
              {filters.keywords.map((label, index) => (
                <Chip
                  key={index}
                  label={label}
                  onDelete={() => {
                    setFilters({
                      ...filters,
                      keywords: filters.keywords.filter((keyword) => keyword !== label),
                    });
                  }}
                />
              ))}
            </Box>
          </Grid>
          {/* Municipality documents */}
          <Grid size={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!filters.municipality}
                  onChange={(event) => {
                    setFilters({
                      ...filters,
                      municipality: event.target.checked,
                    });
                  }}
                />
              }
              label="Show only municipality documents"
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between", paddingX: 2 }}>
        <Grid>
          <Button color="error" onClick={handleReset}>
            Reset
          </Button>
        </Grid>
        <Grid>
          <Button color="inherit" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            sx={{ backgroundColor: "#003d8f", ml: 2 }}
            variant="contained"
            onClick={() => {
              handleSubmit();
              handleClose();
            }}
          >
            Search
          </Button>
        </Grid>
      </CardActions>
    </Card>
  );
}

export default AdvancedSearchForm;
