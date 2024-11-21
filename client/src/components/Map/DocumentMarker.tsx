import { Marker, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import KirunaLogo from "../../assets/KirunaLogo.svg";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: KirunaLogo,
  iconSize: [26.4, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const highlitedIcon = new L.Icon({
  iconUrl: KirunaLogo,
  iconSize: [26.4 * 1.5, 32 * 1.5],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function DocumentMarker({ position, id }) {
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
      icon={window.location.pathname.includes(id) ? highlitedIcon : customIcon}
      position={position}
      eventHandlers={{ click: handleClick }}
    />
  );
}

export default DocumentMarker;
