import {
  Autocomplete,
  Badge,
  Box,
  Button,
  Checkbox,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Document } from "../../models/Document";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { StakeHolder } from "../../models/StakeHolders";
import { useMemo, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { AddCircleOutlined } from "@mui/icons-material";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const datePattern =
  /^([0-9]{4})(\/(0[1-9]|1[0-2])(\/(0[1-9]|[12][0-9]|3[01]))?)?$/;
const languages = [
  { code: "GB", label: "English" },
  {
    code: "SE",
    label: "Sweden",
  },
];

function GeneralInfoForm({ types, stakeholders, document, setDocument }) {
  const [dateError, setDateError] = useState("");
  const [scaleError, setScaleError] = useState("");
  const [scaleModality, setScaleModality] = useState<number>(0);
  const [sourcesPages, setSourcesPages] = useState<string[]>([""]);

  const scaleLabels = [
    "Blueprints/material effects",
    "Text",
    "Concept",
    "Architectural scale",
  ];

  const selectedStakeholders = useMemo(
    () =>
      stakeholders.filter((stakeholder) =>
        document.stakeholderIds.includes(stakeholder.id)
      ),
    [document.stakeholderIds, stakeholders]
  );

  const handleStakeholderChange = (_event, newValue) => {
    const updatedStakeholdersIDs = newValue.map((stakeholder) =>
      Number(stakeholder.id)
    );

    setDocument((prevDocument) => ({
      ...prevDocument,
      stakeholderIds: updatedStakeholdersIDs,
    }));
    console.log(stakeholders);
    console.log(selectedStakeholders);
  };

  const handleIssueDateChange = (issueDate: string) => {
    setDateError("");
    const validChars = /^[0-9/]*$/;
    if (issueDate.length > 10) return;
    if (!validChars.test(issueDate)) {
      setDateError("You can only enter numbers");
      return;
    }
    setDocument((prevDocument: Document) => {
      const prevLen = prevDocument.issueDate.length;
      const currLen = issueDate.length;
      if (
        (prevLen === 4 && currLen === 5) ||
        (prevLen === 7 && currLen === 8)
      ) {
        // YYYY or YYYY/MM inserted
        issueDate = `${prevDocument.issueDate}/${issueDate.slice(-1)}`;
      }
      return { ...prevDocument, issueDate: issueDate };
    });
    if (!datePattern.test(issueDate)) {
      setDateError("Invalid date format. Use YYYY/MM/DD, YYYY/MM, or YYYY");
      return;
    }
  };

  const handleScaleChange = (scale: string) => {
    setScaleError("");
    const validChars = /^[0-9]*$/;
    if (!validChars.test(scale)) {
      setScaleError("You can only enter numbers");
      return;
    }
    setDocument((prevDocument) => ({
      ...prevDocument,
      scale: scale,
    }));
  };

  return (
    <>
      <Grid sx={{ display: "flex", flexDirection: "column" }} size={12}>
        <TextField
          size="small"
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
      <Grid sx={{ display: "flex", flexDirection: "column" }} size={12}>
        <TextField
          fullWidth
          size="small"
          label="Description"
          variant="outlined"
          minRows={2}
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
      <Grid
        sx={{ display: "flex", flexDirection: "column" }}
        size={{ xs: 12, md: 6 }}>
        <Autocomplete
          size="small"
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
      <Grid
        sx={{ display: "flex", flexDirection: "column" }}
        size={{ xs: 12, md: 6 }}>
        <Autocomplete
          size="small"
          fullWidth
          id="languages"
          options={languages}
          autoHighlight
          value={
            languages.find((language) => language.label == document.language) ||
            null
          }
          onChange={(_event, newValue) => {
            setDocument((prevDocument) => ({
              ...prevDocument,
              language: newValue ? newValue.label : "",
            }));
          }}
          getOptionLabel={(option) => option.label}
          renderOption={(props, option) => {
            const { key, ...optionProps } = props;
            return (
              <Box
                key={key}
                component="li"
                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                {...optionProps}>
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
      <Grid
        sx={{ display: "flex", flexDirection: "column" }}
        size={{ xs: 12, md: 6 }}>
        <Autocomplete
          size="small"
          multiple
          id="stakeholdersSelect"
          options={stakeholders}
          limitTags={1}
          disableCloseOnSelect
          isOptionEqualToValue={(option, value) => option.id == value.id}
          getOptionLabel={(option: StakeHolder) => option.name}
          renderOption={(props, option, { selected }) => {
            const { key, ...optionProps } = props;
            return (
              <li key={key} {...optionProps}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.name}
              </li>
            );
          }}
          value={selectedStakeholders || null}
          onChange={handleStakeholderChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Stakeholders"
              slotProps={{
                htmlInput: {
                  ...params.inputProps,
                  required: selectedStakeholders.length === 0,
                },
              }}
              required
            />
          )}
        />
      </Grid>
      <Grid
        sx={{ display: "flex", flexDirection: "column" }}
        size={{ xs: 12, md: 6 }}>
        <TextField
          size="small"
          fullWidth
          label="Issue Date"
          variant="outlined"
          value={document.issueDate}
          onChange={(event) => {
            handleIssueDateChange(event.target.value);
          }}
          error={!!dateError}
          helperText={dateError ? dateError : "YYYY/MM/DD or YYYY/MM or YYYY"}
          onBlur={() => setDateError("")}
          required
          slotProps={{
            htmlInput: {
              inputMode: "numeric",
              pattern: datePattern.source,
            },
          }}
        />
      </Grid>

      <Grid
        sx={{ display: "flex", flexDirection: "column" }}
        size={{ xs: 12, md: scaleModality !== 3 ? 12 : 6 }}>
        <FormControl required>
          <InputLabel id="scaleModality">Scale type</InputLabel>
          <Select
            size="small"
            required
            variant="outlined"
            labelId="scaleModality"
            id="scaleModality"
            value={scaleModality}
            label="Scale type"
            onChange={(event) => {
              const newMod = Number(event.target.value);
              setScaleModality(newMod);
              setDocument((prevDocument) => ({
                ...prevDocument,
                scale: newMod !== 3 ? scaleLabels[newMod] : "",
              }));
            }}>
            {scaleLabels.map((mod, index) => {
              return (
                <MenuItem key={index} value={index}>
                  {mod}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>
      <Grid
        sx={{
          display: scaleModality !== 3 ? "none" : "flex",
          flexDirection: "column",
        }}
        size={{ xs: 12, md: 6 }}>
        <TextField
          size="small"
          fullWidth
          label="Architectural scale"
          variant="outlined"
          error={!!scaleError}
          helperText={scaleError && scaleError}
          onBlur={() => setScaleError("")}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">1 :</InputAdornment>
              ),
            },
          }}
          value={scaleModality !== 3 ? "" : document.scale}
          onChange={(event) => {
            handleScaleChange(event.target.value);
          }}
          placeholder="1000"
          required={scaleModality === 3}
          disabled={scaleModality !== 3}
        />
      </Grid>
      <Grid size={12} sx={{ textAlign: "center" }}>
        <Typography variant="h6">Pages</Typography>
      </Grid>
      {sourcesPages.map((source, index) => {
        return (
          <Grid
            sx={{ textAlign: "center" }}
            size={{ xs: 6, md: 3 }}
            key={index}>
            <Badge
              sx={{
                "& .MuiBadge-badge": {
                  right: 4,
                  top: 8,
                  padding: "0 4px",
                },
              }}
              badgeContent={
                index >= 1 ? (
                  <IconButton
                    size="small"
                    sx={{ mt: -2 }}
                    color="error"
                    onClick={() => {
                      const newSourcesPages = sourcesPages.filter(
                        (_, i) => i !== index
                      );
                      setSourcesPages(newSourcesPages);
                      setDocument((prevDocument) => ({
                        ...prevDocument,
                        pages: newSourcesPages.join("-"),
                      }));
                    }}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseUp={(event) => event.preventDefault()}
                    edge="end">
                    {<DeleteIcon fontSize="small" />}
                  </IconButton>
                ) : (
                  0
                )
              }>
              <TextField
                size="small"
                label={`Source ${index + 1}`}
                variant="outlined"
                value={source}
                onChange={(event) => {
                  event.preventDefault();
                  const validChars = /^[0-9]*$/;
                  if (!validChars.test(event.target.value)) {
                    return;
                  }
                  const newSourcesPages = [...sourcesPages];
                  newSourcesPages[index] = event.target.value;
                  setSourcesPages(newSourcesPages);
                  setDocument((prevDocument) => ({
                    ...prevDocument,
                    pages: newSourcesPages.join("-"),
                  }));
                }}
              />
            </Badge>
          </Grid>
        );
      })}
      <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          disabled={sourcesPages[sourcesPages.length - 1] === ""}
          variant="outlined"
          color="success"
          size="small"
          startIcon={<AddCircleOutlined />}
          onClick={() => {
            const newSourcesPages = [...sourcesPages, ""];
            setSourcesPages(newSourcesPages);
          }}>
          Add source
        </Button>
      </Grid>
    </>
  );
}

export default GeneralInfoForm;
