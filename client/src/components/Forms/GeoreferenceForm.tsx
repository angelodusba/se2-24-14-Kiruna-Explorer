import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Grid from "@mui/material/Grid2";

function GeoreferenceForm(props) {
  const [georeferenceModality, setGeoreferenceModality] = useState(0);
  const [scaleModality, setScaleModality] = useState(0);

  const scaleLabels = {
    0: "Blueprints/material effects",
    1: "Text",
    2: "Concept",
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
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        size={12}>
        <Typography variant="h6">Georeference Modality</Typography>
      </Grid>
      <Grid
        sx={{ display: "flex", flexDirection: "column" }}
        size={{ xs: 12, md: 6 }}>
        <FormControl>
          <RadioGroup
            aria-labelledby="georeferenceModality"
            name="georeferenceModality"
            value={georeferenceModality}
            onChange={(event) => {
              setGeoreferenceModality(Number(event.target.value));
              if (Number(event.target.value) === 0) {
                props.setDocument((prevDocument) => ({
                  ...prevDocument,
                  coordinates: [],
                }));
              } else if (Number(event.target.value) === 1) {
                props.setDocument((prevDocument) => ({
                  ...prevDocument,
                  coordinates: [{ lat: 0, lng: 0 }],
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
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        size={{ xs: 6, md: 3 }}>
        <TextField
          fullWidth
          label="Lat"
          variant="outlined"
          value={
            props.document.coordinates[0]
              ? props.document.coordinates[0].lat
              : ""
          }
          onChange={(event) =>
            props.setDocument((prevDocument) => ({
              ...prevDocument,
              coordinates: [
                {
                  ...prevDocument.coordinates,
                  lat: event.target.value,
                },
              ],
            }))
          }
          required={georeferenceModality === 1}
          disabled={georeferenceModality !== 1}
        />
      </Grid>
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        size={{ xs: 6, md: 3 }}>
        <TextField
          fullWidth
          label="Lng"
          variant="outlined"
          value={
            props.document.coordinates[0]
              ? props.document.coordinates[0].lng
              : ""
          }
          onChange={(event) =>
            props.setDocument((prevDocument) => ({
              ...prevDocument,
              coordinates: [
                {
                  ...prevDocument.coordinates,
                  lng: event.target.value,
                },
              ],
            }))
          }
          required={georeferenceModality === 1}
          disabled={georeferenceModality !== 1}
        />
      </Grid>

      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        size={12}>
        <Typography variant="h6">Scale</Typography>
      </Grid>
      <Grid
        sx={{ display: "flex", flexDirection: "column" }}
        size={{ xs: 12, md: 6 }}>
        <FormControl>
          <RadioGroup
            aria-labelledby="scaleModality"
            name="scaleModality"
            value={scaleModality}
            onChange={(event) => {
              setScaleModality(Number(event.target.value));
              if (Number(event.target.value) !== 3) {
                props.setDocument((prevDocument) => ({
                  ...prevDocument,
                  scale: scaleLabels[Number(event.target.value)],
                }));
              } else {
                props.setDocument((prevDocument) => ({
                  ...prevDocument,
                  scale: "",
                }));
              }
            }}>
            <FormControlLabel
              value={0}
              control={<Radio />}
              label="Blueprints/material effects"
            />
            <FormControlLabel value={1} control={<Radio />} label="Text" />
            <FormControlLabel value={2} control={<Radio />} label="Concept" />
            <FormControlLabel
              value={3}
              control={<Radio />}
              label="Architectural scale"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Architectural scale"
          variant="outlined"
          value={scaleModality !== 3 ? "" : props.document.scale}
          onChange={(event) =>
            props.setDocument((prevDocument) => ({
              ...prevDocument,
              scale: event.target.value,
            }))
          }
          placeholder="1:1000"
          required={scaleModality === 3}
          disabled={scaleModality !== 3}
        />
      </Grid>
    </Grid>
  );
}

export default GeoreferenceForm;
