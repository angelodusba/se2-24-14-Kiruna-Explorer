import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import { useContext, useState } from "react";
import Grid from "@mui/material/Grid2";
import { DisabledInputContext } from "../../contexts/DisabledInputContext";

function GeoreferenceForm({
  setDocument,
  document,
  handleSubmit = undefined,
  handleClose = undefined,
}) {
  const [georeferenceModality, setGeoreferenceModality] = useState(
    document.coordinates.length === 0 ? 0 : 1
  );

  const [selectedArea, setSelectedArea] = useState("");
  const { setDisabledInput } = useContext(DisabledInputContext);

  // Hardcoded sample areas which should replace the actual API call
  const areas = [
    {
      id: 1,
      name: "Area 1",
      coordinates: [
        { lat: 67.5458, lng: 19.8253 },
        { lat: 67.5558, lng: 19.8353 },
      ],
    },
    {
      id: 2,
      name: "Area 2",
      coordinates: [
        { lat: 67.5658, lng: 19.8453 },
        { lat: 67.5758, lng: 19.8553 },
      ],
    },
    {
      id: 3,
      name: "Area 3",
      coordinates: [
        { lat: 67.5858, lng: 19.8653 },
        { lat: 67.5958, lng: 19.8753 },
      ],
    },
  ];

  const handleAreaChange = (event) => {
    const areaId = event.target.value;
    setSelectedArea(areaId);
    const area = areas.find((a) => a.id === areaId);
    if (area) {
      setDocument((prevDocument) => ({
        ...prevDocument,
        coordinates: area.coordinates,
      }));
    }
  };

  return (
    <Grid
      container
      component={handleSubmit === undefined ? "div" : "form"}
      sx={{
        width: "100%",
        display: "flex",
        py: 2,
      }}
      onSubmit={handleSubmit}
      spacing={2}>
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        size={12}>
        <Typography variant="h6" fontWeight={"bold"}>
          Georeference Modality
        </Typography>
      </Grid>
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        size={{ xs: 12, md: georeferenceModality === 0 ? 12 : 6 }}>
        <FormControl>
          <RadioGroup
            aria-labelledby="georeferenceModality"
            name="georeferenceModality"
            value={georeferenceModality}
            onChange={(event) => {
              setGeoreferenceModality(Number(event.target.value));
              if (Number(event.target.value) === 0) {
                setDocument((prevDocument) => ({
                  ...prevDocument,
                  coordinates: [],
                }));
              } else if (Number(event.target.value) === 1) {
                setDocument((prevDocument) => ({
                  ...prevDocument,
                  coordinates: [{ lat: "", lng: "" }],
                }));
              } else if (Number(event.target.value) === 2) {
                setDocument((prevDocument) => ({
                  ...prevDocument,
                  coordinates: [],
                }));
              }
            }}>
            <FormControlLabel
              value={0}
              control={<Radio />}
              label="Municipality Area"
            />
            <FormControlLabel
              value={1}
              control={<Radio />}
              label="Single point"
            />
            <FormControlLabel value={2} control={<Radio />} label="Area" />
          </RadioGroup>
        </FormControl>
      </Grid>

      <Grid
        container
        sx={{
          display: georeferenceModality === 1 ? "flex" : "none",
          alignItems: "center",
        }}
        size={6}>
        <Grid
          sx={{
            display: georeferenceModality === 1 ? "flex" : "none",
            flexDirection: "column",
            justifyContent: "center",
          }}
          size={{ xs: 12, md: 6 }}>
          <TextField
            size="small"
            fullWidth
            label="Lat"
            variant="outlined"
            value={document.coordinates[0] ? document.coordinates[0].lat : ""}
            onChange={(event) => {
              event.preventDefault();
              const regex = /^-?\d*\.?\d*$/;
              if (!regex.test(event.target.value)) {
                return;
              }
              setDocument((prevDocument) => ({
                ...prevDocument,
                coordinates: [
                  {
                    ...prevDocument.coordinates[0],
                    lat: event.target.value,
                  },
                ],
              }));
            }}
            required={georeferenceModality === 1}
            disabled={georeferenceModality !== 1}
            slotProps={{
              htmlInput: {
                step: "any",
                pattern: "[0-9]*[.,]?[0-9]*",
              },
            }}
          />
        </Grid>
        <Grid
          sx={{
            display: georeferenceModality === 1 ? "flex" : "none",
            flexDirection: "column",
            justifyContent: "center",
          }}
          size={{ xs: 12, md: 6 }}>
          <TextField
            size="small"
            fullWidth
            label="Lng"
            variant="outlined"
            value={document.coordinates[0] ? document.coordinates[0].lng : ""}
            onChange={(event) => {
              event.preventDefault();
              const regex = /^-?\d*\.?\d*$/;
              if (!regex.test(event.target.value)) {
                return;
              }
              setDocument((prevDocument) => ({
                ...prevDocument,
                coordinates: [
                  {
                    ...prevDocument.coordinates[0],
                    lng: event.target.value,
                  },
                ],
              }));
            }}
            required={georeferenceModality === 1}
            disabled={georeferenceModality !== 1}
            slotProps={{
              htmlInput: {
                step: "any",
                pattern: "[0-9]*[.,]?[0-9]*",
              },
            }}
          />
        </Grid>
        <Grid
          sx={{
            display: georeferenceModality === 1 ? "flex" : "none",
            justifyContent: "center",
          }}
          size={12}>
          <Button
            onClick={() => setDisabledInput("point")}
            variant="outlined"
            size="small"
            startIcon={<PlaceIcon />}>
            Pick on the map
          </Button>
        </Grid>
      </Grid>
      <Grid
        container
        sx={{
          display: georeferenceModality === 2 ? "flex" : "none",
          alignItems: "center",
        }}
        size={6}>
        <Grid
          sx={{
            display: georeferenceModality === 2 ? "flex" : "none",
            flexDirection: "column",
            justifyContent: "center",
          }}
          size={{ xs: 12 }}>
          <FormControl fullWidth sx={{ maxWidth: 400 }}>
            <InputLabel id="select-area-label">Select Area</InputLabel>
            <Select
              labelId="select-area-label"
              value={selectedArea}
              onChange={handleAreaChange}
              label="Select Area">
              {areas.map((area) => (
                <MenuItem key={area.id} value={area.id}>
                  {area.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid
          sx={{
            display: georeferenceModality === 2 ? "flex" : "none",
            justifyContent: "center",
          }}
          size={12}>
          <Button
            onClick={() => setDisabledInput("area")}
            variant="outlined"
            size="small"
            startIcon={<PlaceIcon />}>
            Pick on the map
          </Button>
        </Grid>
      </Grid>
      {georeferenceModality === 10 && (
        <Grid
          container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          size={12}>
          <FormControl fullWidth sx={{ maxWidth: 400 }}>
            <InputLabel id="select-area-label">Select Area</InputLabel>
            <Select
              labelId="select-area-label"
              value={selectedArea}
              onChange={handleAreaChange}
              label="Select Area">
              {areas.map((area) => (
                <MenuItem key={area.id} value={area.id}>
                  {area.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}

      <Grid
        sx={{
          width: "100%",
          display: handleSubmit ? "flex" : "none",
          justifyContent: "space-between",
        }}>
        <Button color="error" onClick={handleClose}>
          Close
        </Button>
        <Button type={"submit"}>Save</Button>
      </Grid>
    </Grid>
  );
}

export default GeoreferenceForm;
