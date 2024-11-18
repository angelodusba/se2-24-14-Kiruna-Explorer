import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
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

  const { setDisabledInput } = useContext(DisabledInputContext);

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
      size={6}
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
        size={{ xs: 12, md: georeferenceModality === 1 ? 6 : 12 }}>
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
        container
        sx={{
          display: "flex",
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
            onChange={(event) =>
              setDocument((prevDocument) => ({
                ...prevDocument,
                coordinates: [
                  {
                    ...prevDocument.coordinates[0],
                    lat: event.target.value,
                  },
                ],
              }))
            }
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
            onChange={(event) =>
              setDocument((prevDocument) => ({
                ...prevDocument,
                coordinates: [
                  {
                    ...prevDocument.coordinates[0],
                    lng: event.target.value,
                  },
                ],
              }))
            }
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
            onClick={() => setDisabledInput(true)}
            variant="outlined"
            size="small"
            startIcon={<PlaceIcon />}>
            Pick on the map
          </Button>
        </Grid>
      </Grid>
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
