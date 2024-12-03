import { Marker, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import KirunaLogo from "../../assets/KirunaLogo.svg";
import ActionIcon from "../../assets/type_icons/Action.tsx";
import AgreementIcon from "../../assets/type_icons/Agreement.tsx";
import ConflictIcon from "../../assets/type_icons/Conflict.tsx";
import ConsultationIcon from "../../assets/type_icons/Consultation.tsx";
import DesignIcon from "../../assets/type_icons/Design.tsx";
import InformativeIcon from "../../assets/type_icons/Informative.tsx";
import PrescriptiveIcon from "../../assets/type_icons/Prescriptive.tsx";
import TechnicalIcon from "../../assets/type_icons/Technical.tsx";
import L from "leaflet";
import { renderToString } from "react-dom/server";

const colors = ["orange", "blue", "green", "red"]; //Hard coded now for testing pruposes, will be replaced by stakeholders of each doc

const typeIcons = {
  "Action": renderToString(<ActionIcon colors={colors}/>),
  "Material Effect": renderToString(<ActionIcon colors={colors}/>), //Put again here ActionLogo because in the example UI pdf "Material Effect" does not have its icon, and in some example docs "Material Effect" has same icon as "Action"S
  "Agreement": renderToString(<AgreementIcon colors={colors}/>),
  "Conflict": renderToString(<ConflictIcon colors={colors}/>),
  "Consultation": renderToString(<ConsultationIcon colors={colors}/>),
  "Design": renderToString(<DesignIcon colors={colors}/>),
  "Informative": renderToString(<InformativeIcon colors={colors}/>),
  "Prescriptive": renderToString(<PrescriptiveIcon colors={colors}/>),
  "Technical": renderToString(<TechnicalIcon colors={colors}/>),
};

function createCustomIcon(typeName: string) {
  var customIcon: any;
  if (typeIcons[typeName]) {
    customIcon = L.divIcon({
      html: typeIcons[typeName], //If type not found, use as default the original KirunaLogo. Using operator: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#nullish-coalescing
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

function createHighlitedIcon(typeName: string) {
  var highlightedIcon: any;
  if (typeIcons[typeName]) {
    highlightedIcon = L.divIcon({
      html: typeIcons[typeName], //If type not found, use as default the original KirunaLogo. Using operator: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#nullish-coalescing
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
      icon={window.location.pathname.includes(id) ? createHighlitedIcon(typeName) : createCustomIcon(typeName)}
      position={position}
      eventHandlers={{ click: handleClick }}
    />
  );
}

export default DocumentMarker;
