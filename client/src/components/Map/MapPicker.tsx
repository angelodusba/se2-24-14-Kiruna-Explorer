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
import DocumentAPI from "../../API/DocumentAPI";

function MapPicker({ areas = undefined, setDocument = undefined }) {
  const [pointMarker, setPointMarker] = useState<L.Marker | null>(null);
  const [customPolygon, setCustomPolygon] = useState<L.Polygon | null>(null);
  const [predefinedAreaId, setPredefinedAreaId] = useState(null);
  const [saveDialog, setSaveDialog] = useState(false);
  const featureGroupRef = useRef<L.FeatureGroup>(null);
  const { disabledInput, setDisabledInput } = useContext(DisabledInputContext);
  const [alertError, setAlertError] = useState("");
  const mapBoundsRef = useRef<L.LatLngLiteral[] | null>(null);
  const navigate = useNavigate();
  const alertRef = useRef(null);
  const map = useMap();

  function isPointInPolygon(
    point: L.LatLngLiteral,
    polygon: L.LatLngLiteral[]
  ): boolean {
    let inside = false;
    const x = point.lat;
    const y = point.lng;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lat,
        yi = polygon[i].lng;
      const xj = polygon[j].lat,
        yj = polygon[j].lng;

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  }

  useEffect(() => {
    L.DomEvent.disableClickPropagation(alertRef.current);

    DocumentAPI.getMunicipalityArea()
      .then((area) => {
        mapBoundsRef.current = area.location;
      })
      .catch(() => {});
    if (disabledInput === "point") {
      map.on("click", (event) => {
        setAlertError("");
        if (
          mapBoundsRef.current &&
          !isPointInPolygon(event.latlng, mapBoundsRef.current)
        ) {
          setAlertError("Selected point is outside the allowed area.");
          return;
        }
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
    setAlertError("");

    featureGroupRef.current?.clearLayers();
    setPredefinedAreaId(null);

    // Create the new polygon
    const newPolygon = L.polygon(event.layer.getLatLngs()[0]);
    setCustomPolygon(newPolygon);

    featureGroupRef.current?.addLayer(newPolygon);
  };

  const handlePolygonEdited = (event) => {
    setAlertError("");

    featureGroupRef.current?.clearLayers();
    const area = L.polygon(event.layers.getLayers()[0].getLatLngs()[0]);
    setCustomPolygon(area);
    featureGroupRef.current?.addLayer(area);
  };

  const handlePolygonDelete = () => {
    setAlertError("");

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
      featureGroupRef.current?.clearLayers();
      setCustomPolygon(null);
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
      if (alertError) {
        setAlertError("");
      }
      if (mapBoundsRef.current && customPolygon) {
        const polygonPoints = customPolygon.getLatLngs()[0] as L.LatLng[];
        for (const point of polygonPoints) {
          if (!isPointInPolygon(point, mapBoundsRef.current)) {
            customPolygon.setStyle({ color: "red" });
            setAlertError("All vertexes must be in the allowed area");
            return;
          }
        }
      }
      if (!disabledInput.includes("save")) {
        setDocument((prevDocument) => ({
          ...prevDocument,
          coordinates: customPolygon.getLatLngs()[0],
        }));
      }
      featureGroupRef.current?.clearLayers();
      if (predefinedAreaId === null) {
        setSaveDialog(true);
      } else {
        setDisabledInput(undefined);
      }
    }
  };

  return (
    <>
      {(customPolygon || alertError) && (
        <Alert
          severity={alertError ? "error" : "warning"}
          sx={{
            top: 78,
            left: "50%",
            textAlign: "center",
            transform: "translateX(-50%)",
            position: "absolute",
            zIndex: 403,
          }}>
          {alertError
            ? alertError
            : `Drawing ${
                !disabledInput.includes("save") ? "or selecting" : ""
              } a new area will overwrite the previous one.`}
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
              //Remove the existing polygon
              featureGroupRef.current?.clearLayers();

              setCustomPolygon(null);
              if (newValue) {
                setPredefinedAreaId(newValue.id);
              } else {
                setPredefinedAreaId(null);
              }
              const area = newValue ? L.polygon(newValue.location) : null;
              setCustomPolygon(area);
              if (area !== null) {
                featureGroupRef.current?.addLayer(area);
              }
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
