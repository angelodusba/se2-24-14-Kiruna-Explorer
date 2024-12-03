import { Marker, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import KirunaLogo from "../../assets/KirunaLogo.svg";
import DocumentIcon from "./DocumentIcon.tsx";
import typeIconsData from "../../assets/typeIconsData.ts";
import L from "leaflet";
import { renderToString } from "react-dom/server";

const colors = ["orange", "blue", "red", "green", "black"]; //Hard coded now for testing pruposes, will be replaced by stakeholders of each doc

function createCustomIcon(typeName: string, id: number) {
  var customIcon: any;
  if (typeIconsData[typeName]) {
    customIcon = L.divIcon({
      html: renderToString(<DocumentIcon id={id} d={typeIconsData[typeName].d} inputWidth={typeIconsData[typeName].width} inputHeight={typeIconsData[typeName].height} colors={colors}/>),
      className: '',
      iconSize: [26, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  } else {
    customIcon = new L.Icon({
      iconUrl: KirunaLogo,
      iconSize: [26, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  }
  return customIcon;
};

function createHighlitedIcon(typeName: string, id: number) {
  var highlightedIcon: any;
  if (typeIconsData[typeName]) {
    highlightedIcon = L.divIcon({
      html: renderToString(<DocumentIcon id={id} d={typeIconsData[typeName].d} inputWidth={typeIconsData[typeName].width} inputHeight={typeIconsData[typeName].height} colors={colors}/>),
      className: '',
      iconSize: [26 * 1.5, 32 * 1.5],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  } else {
    highlightedIcon = new L.Icon({
      iconUrl: KirunaLogo,
      iconSize: [26 * 1.5, 32 * 1.5],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  }
  return highlightedIcon;
};

function DocumentMarker({ position, id, typeName }) {
  const navigate = useNavigate();

  const map = useMap();

  const handleClick = () => {
    const currentZoom = map.getZoom();
    const offsetLatLng = map.latLngToContainerPoint(position);
    offsetLatLng.x -= 300;

    const adjustedLatLng = map.containerPointToLatLng(offsetLatLng);
    map.flyTo(adjustedLatLng, currentZoom, {
      duration: 0.7,
      easeLinearity: 0.3,
    });
    navigate(`/map/${id}`);
  };

  return (
    <Marker
      riseOnHover
      icon={window.location.pathname.includes(id) ? createHighlitedIcon(typeName, id) : createCustomIcon(typeName, id)}
      position={position}
      eventHandlers={{ click: handleClick }}
    />
  );
}

export default DocumentMarker;
