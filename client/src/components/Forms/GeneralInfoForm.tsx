import {
  Autocomplete,
  Box,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

function GeneralInfoForm(props) {
  const handleStakeholderChange = (event) => {
    const selectedStakeholders = event.target.value as number[];

    props.setDocument((prevDocument) => ({
      ...prevDocument,
      stakeholder: selectedStakeholders,
    }));
  };
  return (
    <Grid
      container
      sx={{
        width: "100%",
        display: "flex",
        py: 2,
      }}
      size={6}
      spacing={2}>
      <Grid sx={{ display: "flex", flexDirection: "column" }} size={12}>
        <TextField
          label="Title"
          variant="outlined"
          value={props.document.title}
          onChange={(event) =>
            props.setDocument((prevDocument) => ({
              ...prevDocument,
              title: event.target.value,
            }))
          }
          required
        />
      </Grid>
      <Grid
        sx={{ display: "flex", flexDirection: "column" }}
        size={{ xs: 12, md: 6 }}>
        <Autocomplete
          options={props.types}
          getOptionLabel={(option) => option.name}
          id="typeSelect"
          value={
            props.types.find((type) => type.id === props.document.type) || null
          }
          onChange={(event, newValue) => {
            props.setDocument((prevDocument) => ({
              ...prevDocument,
              type: newValue ? Number(newValue.id) : 0,
            }));
          }}
          renderInput={(params) => (
            <TextField {...params} label="Type" variant="outlined" required />
          )}
        />
      </Grid>
      <Grid
        sx={{ display: "flex", flexDirection: "column" }}
        size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Issue Date"
          variant="outlined"
          value={props.document.issueDate}
          onChange={(event) =>
            props.setDocument((prevDocument) => ({
              ...prevDocument,
              issueDate: event.target.value,
            }))
          }
          helperText="YYYY/MM/DD or YYYY/MM or YYYY"
          required
        />
      </Grid>
      <Grid
        sx={{ display: "flex", flexDirection: "column" }}
        size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Pages"
          variant="outlined"
          type="number"
          value={props.document.pages || ""}
          onChange={(event) =>
            props.setDocument((prevDocument) => ({
              ...prevDocument,
              pages: Number(event.target.value),
            }))
          }
        />
      </Grid>
      <Grid
        sx={{ display: "flex", flexDirection: "column" }}
        size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Language"
          variant="outlined"
          value={props.document.language}
          onChange={(event) =>
            props.setDocument((prevDocument) => ({
              ...prevDocument,
              language: event.target.value,
            }))
          }
        />
      </Grid>

      <Grid sx={{ display: "flex", flexDirection: "column" }} size={12}>
        <FormControl required>
          <InputLabel id="stakeholders">Stakeholders</InputLabel>
          <Select
            labelId="stakeholders"
            id="stakeholders"
            multiple
            value={props.document.stakeholder}
            onChange={handleStakeholderChange}
            input={<OutlinedInput id="stakeholders" label="stakeholders" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {(selected as number[]).map((value) => {
                  const stakeholder = props.stakeholders.find(
                    (s) => s.id === value
                  );
                  return stakeholder ? (
                    <Chip key={stakeholder.id} label={stakeholder.name} />
                  ) : null;
                })}
              </Box>
            )}>
            {props.stakeholders.map((stakeholder) => (
              <MenuItem key={stakeholder.id} value={stakeholder.id}>
                <Checkbox
                  checked={props.document.stakeholder.includes(stakeholder.id)}
                />
                <ListItemText primary={stakeholder.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid sx={{ display: "flex", flexDirection: "column" }} size={12}>
        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          minRows={3}
          multiline
          value={props.document.description}
          onChange={(event) =>
            props.setDocument((prevDocument) => ({
              ...prevDocument,
              description: event.target.value,
            }))
          }
          required
        />
      </Grid>
    </Grid>
  );
}

export default GeneralInfoForm;
