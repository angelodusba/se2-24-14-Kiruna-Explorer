import { Alert, Button } from "@mui/material";
import L from "leaflet";
import { useContext, useEffect, useRef, useState } from "react";
import { useMapEvent } from "react-leaflet";
import { DisabledInputContext } from "../../contexts/DisabledInputContext";
import PlaceIcon from "@mui/icons-material/Place";

function MapPicker({ setDocument }) {
  const [pointMarker, setPointMarker] = useState<L.Marker | null>(null);
  const { setDisabledInput } = useContext(DisabledInputContext);
  const alertRef = useRef(null);

  useEffect(() => {
    L.DomEvent.disableClickPropagation(alertRef.current);
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
    setDisabledInput(false);
  };

  const handlePick = (event) => {
    event.stopPropagation();
    map.removeLayer(pointMarker);
    setPointMarker(null);
    setDisabledInput(false);
  };

  const map = useMapEvent("click", (event) => {
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
