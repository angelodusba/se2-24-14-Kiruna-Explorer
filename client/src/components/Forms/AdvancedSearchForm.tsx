import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Autocomplete,
  Box,
  DialogActions,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

function AdvancedSearchForm({
  handleClose,
  handleSubmit,
  filters,
  setFilters,
  stakeholders,
  documentTypes,
  languages,
}) {
  return (
    <Dialog open={true} onClose={handleClose} fullWidth>
      <DialogTitle>Advanced Search</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Grid container spacing={2}>
          {/* Title */}
          <Grid size={12}>
            <TextField
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
          <Grid size={12}>
            <Autocomplete
              multiple
              options={documentTypes}
              getOptionLabel={(option) => option.name}
              value={documentTypes.filter((type) => filters.types?.includes(type.id)) || []}
              onChange={(e, newValue) =>
                setFilters({
                  ...filters,
                  types: newValue.map((option) => option.id),
                })
              }
              renderInput={(params) => <TextField {...params} label="Type" />}
            />
          </Grid>
          {/* Stakeholders */}
          <Grid size={12}>
            <Autocomplete
              multiple
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
          {/* Start Year */}
          <Grid size={6}>
            <TextField
              label="Start Date"
              value={filters.start_year || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  start_year: e.target.value,
                })
              }
              fullWidth
              // error={dateError !== ""}
              // helperText={dateError}
            />
          </Grid>
          {/* End Year */}
          <Grid size={6}>
            <TextField
              label="End Date"
              value={filters.end_year || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  end_year: e.target.value,
                })
              }
              fullWidth
              // error={dateError !== ""}
              // helperText={dateError}
            />
          </Grid>
          {/* Language */}
          <Grid size={12}>
            <Autocomplete
              options={languages}
              getOptionLabel={(option) => option.label}
              value={languages.find((lang) => lang.code === filters.language) || null}
              onChange={(_e, newValue) => setFilters({ ...filters, language: newValue.code })}
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
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            handleClose();
            handleSubmit();
          }}
        >
          Search
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AdvancedSearchForm;
