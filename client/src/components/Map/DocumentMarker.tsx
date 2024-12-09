import { Marker, useMap } from "react-leaflet";
import { useNavigate, useParams } from "react-router-dom";
import { createCustomIcon } from "./Icons";

function DocumentMarker({
  position,
  docId,
  typeName,
  stakeholders,
  links,
  setHoveredDocument = undefined,
}) {
  const navigate = useNavigate();
  const map = useMap();
  const selectedDocId = Number(useParams().id);

  const handleClick = () => {
    const currentZoom = map.getZoom();
    const offsetLatLng = map.latLngToContainerPoint(position);
    offsetLatLng.x -= 300;

    const adjustedLatLng = map.containerPointToLatLng(offsetLatLng);
    map.flyTo(adjustedLatLng, currentZoom, {
      duration: 0.7,
      easeLinearity: 0.3,
    });
    navigate(`/map/${docId}`);
  };

  return (
    <Marker
      riseOnHover
      icon={createCustomIcon(
        typeName,
        docId,
        selectedDocId,
        stakeholders,
        links,
      )}
      position={position}
      eventHandlers={{
        click: handleClick,
        ...(setHoveredDocument && {
          mouseover: () => {
            setHoveredDocument(docId);
          },
          mouseout: () => {
            setHoveredDocument(null);
          },
        }),
      }}></Marker>
  );
}

export default DocumentMarker;
