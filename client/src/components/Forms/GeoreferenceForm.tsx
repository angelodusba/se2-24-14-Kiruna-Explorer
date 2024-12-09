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
  document,
  setDocument,
  handleSubmit = undefined,
  handleClose = undefined,
  handleChangeModality = undefined,
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
              const mode = Number(event.target.value);
              if (handleChangeModality) handleChangeModality(mode);
              setGeoreferenceModality(mode);
              if (mode === 0 || mode === 2) {
                // Municipality area / Specific area
                setDocument((prevDocument) => ({
                  ...prevDocument,
                  coordinates: [],
                }));
              } else if (mode === 1) {
                // Single point
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
            <FormControlLabel value={2} control={<Radio />} label="Area" />
          </RadioGroup>
        </FormControl>
      </Grid>

      {/* Single point mode */}
      {georeferenceModality === 1 && (
        <Grid
          container
          sx={{
            display: "flex",
            alignItems: "center",
          }}
          size={{ xs: 12, md: 6 }}>
          <Grid
            sx={{
              display: "flex",
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

                const regex = /^-?\d*\.?\d{0,8}$/;
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
                const regex = /^-?\d*\.?\d{0,8}$/;
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
      )}
      {/* Area mode */}
      {georeferenceModality === 2 && (
        <Grid
          container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          size={{ xs: 12, md: 6 }}>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            size={12}>
            <Button
              onClick={() => setDisabledInput("area")}
              variant="outlined"
              size="small"
              startIcon={<PlaceIcon />}>
              Pick on the map
            </Button>
            <Typography
              variant="body1"
              component="h1"
              style={{ marginTop: "10px" }}>
              {document.coordinates.length < 2
                ? "No area selected"
                : "An area has been selected"}
            </Typography>
          </Grid>
        </Grid>
      )}
      {/* Bottom actions when editing location */}
      {handleSubmit && (
        <Grid
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}>
          <Button color="error" onClick={handleClose}>
            Close
          </Button>
          <Button type={"submit"}>Save</Button>
        </Grid>
      )}
    </Grid>
  );
}

export default GeoreferenceForm;
