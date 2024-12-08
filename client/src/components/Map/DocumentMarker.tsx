import { Marker, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { createCustomIcon } from "./Icons";

function DocumentMarker({
  position,
  id,
  typeName,
  stakeholders,
  selectedDocId,
  setSelectedDocId,
  links,
  setHoveredDocument = undefined,
}) {
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
    setSelectedDocId(id);
    navigate(`/map/${id}`);
  };

  return (
    <Marker
      riseOnHover
      icon={createCustomIcon(
        typeName,
        id,
        stakeholders,
        window.location.pathname.includes(id) ? 2 : 1,
        links,
        selectedDocId
      )}
      position={position}
      eventHandlers={{
        click: handleClick,
        ...(setHoveredDocument && {
          mouseover: () => {
            setHoveredDocument(id);
          },
          mouseout: () => {
            setHoveredDocument(null);
          },
        }),
      }}></Marker>
  );
}

export default DocumentMarker;
