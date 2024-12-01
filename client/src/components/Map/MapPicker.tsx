import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as LDraw from "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { Alert, Button } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import { DisabledInputContext } from "../../contexts/DisabledInputContext";
import PlaceIcon from "@mui/icons-material/Place";

function MapPicker({ setDocument }) {
  const [pointMarker, setPointMarker] = useState<L.Marker | null>(null);
  const { disabledInput, setDisabledInput } = useContext(DisabledInputContext);
  const [polygon, setPolygon] = useState(null);
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
    } else if (disabledInput === "area") {
      const drawControl = new LDraw.Draw.Polygon(map, {
        shapeOptions: {
          color: "#003d8f",
          weight: 4,
        },
        allowIntersection: false, // Prevent intersecting polygons
      });

      drawControl.enable();

      const handleDrawCreated = (e) => {
        const layer = e.layer;
        const latlngs = layer.getLatLngs()[0].map((latlng) => ({
          lat: latlng.lat,
          lng: latlng.lng,
        }));

        setPolygon(latlngs); // Save polygon data for rendering
      };

      map.on(LDraw.Draw.Event.CREATED, handleDrawCreated);

      return () => {
        // Cleanup event listener and disable draw control
        map.off(LDraw.Draw.Event.CREATED, handleDrawCreated);
        drawControl.disable();
      };
    }
  });

  const handleClose = (event) => {
    event.stopPropagation();
    setDocument((prevDocument) => ({
      ...prevDocument,
      coordinates: [],
    }));
    if (pointMarker) {
      map.removeLayer(pointMarker);
      setPointMarker(null);
    }
    setDisabledInput(undefined);
  };

  const handlePick = (event) => {
    event.stopPropagation();
    map.removeLayer(pointMarker);
    setPointMarker(null);
    setDisabledInput(undefined);
  };

  return (
    <>
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
          zIndex: 1000000,
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
        Select a point
        <Button
          disabled={!pointMarker}
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
          size="medium"
          startIcon={<PlaceIcon />}>
          Pick
        </Button>
      </Alert>
    </>
  );
}

export default MapPicker;
