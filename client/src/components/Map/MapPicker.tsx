import L from "leaflet";
import "leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { Alert, Autocomplete, Button, Paper, TextField } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { FeatureGroup, useMap } from "react-leaflet";
import { DisabledInputContext } from "../../contexts/DisabledInputContext";
import PlaceIcon from "@mui/icons-material/Place";
import { EditControl } from "react-leaflet-draw";
import SaveAreaDialog from "./SaveAreaDialog";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { useNavigate } from "react-router-dom";

function MapPicker({ areas = undefined, setDocument = undefined }) {
  const [pointMarker, setPointMarker] = useState<L.Marker | null>(null);
  const [customPolygon, setCustomPolygon] = useState<L.Polygon | null>(null);
  const [predefinedAreaId, setPredefinedAreaId] = useState(null);
  const [saveDialog, setSaveDialog] = useState(false);
  const featureGroupRef = useRef<L.FeatureGroup>(null);
  const { disabledInput, setDisabledInput } = useContext(DisabledInputContext);
  const navigate = useNavigate();
  const alertRef = useRef(null);
  const map = useMap();

  useEffect(() => {
    L.DomEvent.disableClickPropagation(alertRef.current);
    if (disabledInput === "point") {
      map.on("click", (event) => {
        if (pointMarker) {
          map.removeLayer(pointMarker);
        }
        const m = L.marker(event.latlng).addTo(map);
        setPointMarker(m);
        setDocument((prevDocument) => ({
          ...prevDocument,
          coordinates: [event.latlng],
        }));
      });
      return () => {
        // Cleanup event listener
        map.off("click");
      };
    }
  }, [disabledInput, map, pointMarker, setDocument]);

  const handlePolygonCreate = (event) => {
    if (customPolygon) {
      if (predefinedAreaId !== null) {
        map.removeLayer(customPolygon);
      } else {
        featureGroupRef.current?.clearLayers();
      }
    }

    // Create the new polygon
    const newPolygon = L.polygon(event.layer.getLatLngs()[0]);
    setCustomPolygon(newPolygon);

    featureGroupRef.current?.addLayer(newPolygon);
  };

  const handlePolygonEdited = (event) => {
    featureGroupRef.current?.clearLayers();
    const area = L.polygon(event.layers.getLayers()[0].getLatLngs()[0]);
    setCustomPolygon(area);
    featureGroupRef.current?.addLayer(area);
  };

  const handlePolygonDelete = () => {
    featureGroupRef.current?.clearLayers();
    setCustomPolygon(null);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    if (!disabledInput.includes("save")) {
      setDocument((prevDocument) => ({
        ...prevDocument,
        coordinates: [],
      }));
    }
    if (disabledInput === "point") {
      if (pointMarker) {
        map.removeLayer(pointMarker);
        setPointMarker(null);
      }
    } else if (disabledInput.includes("area")) {
      if (predefinedAreaId === null) {
        featureGroupRef.current?.clearLayers();
        setCustomPolygon(null);
      } else {
        map.removeLayer(customPolygon);
        setCustomPolygon(null);
      }
    }
    if (disabledInput.includes("save")) {
      navigate("/map");
    }
    setDisabledInput(undefined);
  };

  const handlePick = (event) => {
    event.stopPropagation();
    if (disabledInput === "point") {
      map.removeLayer(pointMarker);
      setPointMarker(null);
      setDisabledInput(undefined);
    } else if (disabledInput.includes("area")) {
      if (!disabledInput.includes("save")) {
        setDocument((prevDocument) => ({
          ...prevDocument,
          coordinates: customPolygon.getLatLngs()[0],
        }));
      }
      if (predefinedAreaId === null) {
        featureGroupRef.current?.clearLayers();
        setSaveDialog(true);
      } else {
        map.removeLayer(customPolygon);
        setDisabledInput(undefined);
      }
    }
  };

  return (
    <>
      {customPolygon && (
        <Alert
          icon={false}
          severity="warning"
          sx={{
            top: 78,
            left: "50%",
            textAlign: "center",
            transform: "translateX(-50%)",
            position: "absolute",
            zIndex: 403,
          }}>
          Drawing {!disabledInput.includes("save") && " or selecting"} a new
          area will overwrite the previous one.
        </Alert>
      )}
      {disabledInput === "area" && (
        <Paper
          sx={{
            backgroundColor: "white",
            border: "3px solid #003d8f",
            p: 1,
            width: { xs: "50%", md: "30%" },
            top: 16,
            left: "50%",
            textAlign: "center",
            transform: "translateX(-50%)",
            position: "absolute",
            zIndex: 403,
          }}>
          <Autocomplete
            size="small"
            options={areas}
            getOptionLabel={(option) => option.name}
            id="areaSelect"
            value={areas.find((area) => area.id === predefinedAreaId) || null}
            onChange={(_event, newValue) => {
              if (predefinedAreaId === null) {
                //Remove the existing polygon
                featureGroupRef.current?.clearLayers();
              } else {
                map.removeLayer(customPolygon);
              }
              setPredefinedAreaId(newValue ? newValue.id : null);
              const area = newValue
                ? L.polygon(newValue.location).addTo(map)
                : null;
              setCustomPolygon(area);
            }}
            renderInput={(params) => (
              <TextField
                fullWidth
                {...params}
                label="Predefined Area"
                variant="outlined"
              />
            )}
          />
        </Paper>
      )}
      {disabledInput.includes("area") && (
        <FeatureGroup ref={featureGroupRef}>
          <EditControl
            position="topleft"
            draw={{
              polyline: false,
              polygon: {
                allowIntersection: false,
                drawError: {
                  color: "#e1e100",
                  message: "You can't intersect sides!",
                },
                shapeOptions: {
                  color: "#003d8f",
                  weight: 4,
                  clickable: false,
                },
              },
              circle: false,
              marker: false,
              circlemarker: false,
              rectangle: false,
            }}
            edit={
              predefinedAreaId !== null
                ? { edit: false, remove: false }
                : undefined
            }
            onCreated={handlePolygonCreate}
            onDeleted={handlePolygonDelete}
            onEdited={handlePolygonEdited}
          />
        </FeatureGroup>
      )}
      <Alert
        ref={alertRef}
        elevation={24}
        component="div"
        sx={{
          bottom: 16,
          left: "50%",
          textAlign: "center",
          transform: "translateX(-50%)",
          position: "absolute",
          zIndex: 403,
          "& .MuiAlert-icon": {
            alignSelf: "center",
          },
          "& .MuiAlert-message": {
            py: 0,
          },
        }}
        severity="info"
        onClick={(event: React.MouseEvent<HTMLDivElement>) => {
          event.stopPropagation();
        }}
        onClose={handleClose}>
        {disabledInput.includes("area") ? "Select an area" : "Select a point"}
        <Button
          disabled={
            (disabledInput === "point" && !pointMarker) ||
            (disabledInput.includes("area") && !customPolygon)
          }
          sx={{
            ml: { xs: 2, md: 3 },
            mr: { xs: 2, md: 1 },
            mt: { xs: 2, md: 0 },
            backgroundColor: "#003d8f",
            color: "white",
            "&:hover": {
              backgroundColor: "#002a6b",
            },
          }}
          onClick={handlePick}
          variant="contained"
          size="small"
          startIcon={
            disabledInput.includes("save") ? (
              <SaveOutlinedIcon></SaveOutlinedIcon>
            ) : (
              <PlaceIcon />
            )
          }>
          {disabledInput.includes("save") ? "Save" : "Pick"}
        </Button>
      </Alert>
      <SaveAreaDialog
        polygon={customPolygon}
        open={saveDialog}></SaveAreaDialog>
    </>
  );
}

export default MapPicker;
