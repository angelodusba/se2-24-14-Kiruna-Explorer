import { useEffect } from "react";
import { useMap } from "react-leaflet";

function ZoomControl({ setZoom }) {
  const map = useMap();

  useEffect(() => {
    const handleZoomEnd = () => {
      const zoomLevel = map.getZoom();
      setZoom(zoomLevel);
    };

    map.on("zoomend", handleZoomEnd);

    return () => {
      map.off("zoomend", handleZoomEnd);
    };
  }, [map, setZoom]);

  return null;
}

export default ZoomControl;
