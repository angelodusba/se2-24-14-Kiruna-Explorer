import { Marker, Tooltip, useMap } from "react-leaflet";
import { useNavigate, useParams } from "react-router-dom";
import { createCustomIcon } from "./Icons";
import { useEffect } from "react";

function DocumentMarker({
  position,
  docId,
  typeName,
  docTitle,
  stakeholders,
  links,
  setHoveredDocument = undefined,
}) {
  const navigate = useNavigate();
  const map = useMap();
  const selectedDocId = Number(useParams().id);

  const handleClick = () => {
    /* const currentZoom = map.getZoom();
    const offsetLatLng = map.latLngToContainerPoint(position);
    offsetLatLng.x -= 300;

    const adjustedLatLng = map.containerPointToLatLng(offsetLatLng);
    map.flyTo(adjustedLatLng, currentZoom, {
      duration: 0.7,
      easeLinearity: 0.3,
    });*/
    navigate(`/map/${docId}`);
  };

  useEffect(() => {
    if (selectedDocId !== docId) {
      return;
    }

    const currentZoom = map.getZoom();
    const offsetLatLng = map.latLngToContainerPoint(position);
    offsetLatLng.x -= 300;

    const adjustedLatLng = map.containerPointToLatLng(offsetLatLng);
    map.flyTo(adjustedLatLng, currentZoom, {
      duration: 0.7,
      easeLinearity: 0.3,
    });
  }, [docId, map, position, selectedDocId]);

  return (
    <Marker
      riseOnHover
      icon={createCustomIcon(
        typeName,
        docId,
        selectedDocId,
        stakeholders,
        links
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
      }}>
      {selectedDocId !== docId && (
        <Tooltip direction="top" offset={[3, -32]}>
          {docTitle}
        </Tooltip>
      )}
    </Marker>
  );
}

export default DocumentMarker;
