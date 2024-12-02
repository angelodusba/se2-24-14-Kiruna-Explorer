import L from "leaflet";
import "leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { Alert, Button } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { FeatureGroup, useMap } from "react-leaflet";
import { DisabledInputContext } from "../../contexts/DisabledInputContext";
import PlaceIcon from "@mui/icons-material/Place";
import { EditControl } from "react-leaflet-draw";
import SaveAreaDialog from "./SaveAreaDialog";

function MapPicker({ areas, setDocument }) {
  const [pointMarker, setPointMarker] = useState<L.Marker | null>(null);
  const [polygon, setPolygon] = useState<L.Polygon | null>(null);
  const [saveDialog, setSaveDialog] = useState(false);
  const featureGroupRef = useRef<L.FeatureGroup>(null);
  const { disabledInput, setDisabledInput } = useContext(DisabledInputContext);
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
    if (polygon) {
      featureGroupRef.current?.clearLayers();
    }
    // Create the new polygon
    const newPolygon = L.polygon(event.layer.getLatLngs()[0]);
    setPolygon(newPolygon);

    featureGroupRef.current?.addLayer(newPolygon);
  };

  const handlePolygonEdited = (event) => {
    featureGroupRef.current?.clearLayers();
    const area = L.polygon(event.layers.getLayers()[0].getLatLngs()[0]);
    setPolygon(area);
    featureGroupRef.current?.addLayer(area);
  };

  const handlePolygonDelete = () => {
    featureGroupRef.current?.clearLayers();
    setPolygon(null);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setDocument((prevDocument) => ({
      ...prevDocument,
      coordinates: [],
    }));
    if (disabledInput === "point") {
      if (pointMarker) {
        map.removeLayer(pointMarker);
        setPointMarker(null);
      }
    } else if (disabledInput === "area") {
      featureGroupRef.current?.clearLayers();
      setPolygon(null);
    }
    setDisabledInput(undefined);
  };

  const handlePick = (event) => {
    event.stopPropagation();
    if (disabledInput === "point") {
      map.removeLayer(pointMarker);
      setPointMarker(null);
      setDisabledInput(undefined);
    } else if (disabledInput === "area") {
      setDocument((prevDocument) => ({
        ...prevDocument,
        coordinates: polygon.getLatLngs()[0],
      }));
      featureGroupRef.current?.clearLayers();
      //setPolygon(null);
      setSaveDialog(true);
    }
  };

  return (
    <>
      {polygon && (
        <Alert
          severity="warning"
          sx={{
            top: 16,
            left: "50%",
            textAlign: "center",
            transform: "translateX(-50%)",
            position: "absolute",
            zIndex: 403,
          }}>
          Drawing a new polygon will overwrite the previous one.
        </Alert>
      )}
      {disabledInput === "area" && (
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
        Select{disabledInput.includes("area") ? "an area" : "a point"}
        <Button
          disabled={
            (disabledInput === "point" && !pointMarker) ||
            (disabledInput === "area" && !polygon)
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
          startIcon={<PlaceIcon />}>
          Pick
        </Button>
      </Alert>
      <SaveAreaDialog polygon={polygon} open={saveDialog}></SaveAreaDialog>
    </>
  );
}

export default MapPicker;
