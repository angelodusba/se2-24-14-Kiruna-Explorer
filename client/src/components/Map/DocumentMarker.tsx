import { Marker, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { createCustomIcon } from "./Icons";

function DocumentMarker({
  position,
  id,
  typeName,
  stakeholders,
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
    navigate(`/map/${id}`);
  };

  return (
    <Marker
      riseOnHover
      icon={
        window.location.pathname.includes(id)
          ? createCustomIcon(typeName, id, stakeholders, 1.5)
          : createCustomIcon(typeName, id, stakeholders, 1)
      }
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
