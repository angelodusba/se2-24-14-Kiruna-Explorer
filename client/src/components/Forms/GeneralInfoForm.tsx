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
import { Document } from "../../models/Document";

function GeneralInfoForm({ types, stakeholders, document, setDocument }) {
  const handleStakeholderChange = (event) => {
    const selectedStakeholders = event.target.value as number[];
    setDocument((prevDocument) => ({
      ...prevDocument,
      stakeholderIds: selectedStakeholders,
    }));
  };

  const handleIssueDateChange = (issueDate: string) => {
    if (issueDate.length > 10) return;
    setDocument((prevDocument: Document) => {
      const prevLen = prevDocument.issueDate.length;
      const currLen = issueDate.length;
      if ((prevLen === 4 && currLen === 5) || (prevLen === 7 && currLen === 8)) {
        // YYYY or YYYY/MM inserted
        issueDate = `${prevDocument.issueDate}/${issueDate.slice(-1)}`;
      }
      return { ...prevDocument, issueDate: issueDate };
    });
  };

  return (
    <>
      <Grid sx={{ display: "flex", flexDirection: "column" }} size={12}>
        <TextField
          label="Title"
          variant="outlined"
          value={document.title}
          onChange={(event) =>
            setDocument((prevDocument) => ({
              ...prevDocument,
              title: event.target.value,
            }))
          }
          required
        />
      </Grid>
      <Grid sx={{ display: "flex", flexDirection: "column" }} size={{ xs: 12, md: 6 }}>
        <Autocomplete
          options={types}
          getOptionLabel={(option) => option.name}
          id="typeSelect"
          value={types.find((type) => type.id === document.typeId) || null}
          onChange={(_event, newValue) => {
            setDocument((prevDocument) => ({
              ...prevDocument,
              typeId: newValue ? Number(newValue.id) : 0,
            }));
          }}
          renderInput={(params) => (
            <TextField {...params} label="Type" variant="outlined" required />
          )}
        />
      </Grid>
      <Grid sx={{ display: "flex", flexDirection: "column" }} size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Issue Date"
          variant="outlined"
          value={document.issueDate}
          onChange={(event) => {
            handleIssueDateChange(event.target.value);
          }}
          helperText="YYYY/MM/DD or YYYY/MM or YYYY"
          required
        />
      </Grid>
      <Grid sx={{ display: "flex", flexDirection: "column" }} size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Pages"
          variant="outlined"
          value={document.pages}
          onChange={(event) =>
            setDocument((prevDocument) => ({
              ...prevDocument,
              pages: event.target.value,
            }))
          }
        />
      </Grid>
      <Grid sx={{ display: "flex", flexDirection: "column" }} size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Language"
          variant="outlined"
          value={document.language}
          onChange={(event) =>
            setDocument((prevDocument) => ({
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
            value={document.stakeholderIds}
            onChange={handleStakeholderChange}
            input={<OutlinedInput id="stakeholders" label="stakeholders" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {(selected as number[]).map((value) => {
                  const stakeholder = stakeholders.find((s) => s.id === value);
                  return stakeholder ? (
                    <Chip key={stakeholder.id} label={stakeholder.name} />
                  ) : null;
                })}
              </Box>
            )}
          >
            {stakeholders.map((stakeholder) => (
              <MenuItem key={stakeholder.id} value={stakeholder.id}>
                <Checkbox checked={document.stakeholderIds.includes(stakeholder.id)} />
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
          value={document.description}
          onChange={(event) =>
            setDocument((prevDocument) => ({
              ...prevDocument,
              description: event.target.value,
            }))
          }
          required
        />
      </Grid>
    </>
  );
}

export default GeneralInfoForm;
