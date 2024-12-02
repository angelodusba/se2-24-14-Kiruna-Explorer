import { Marker, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import KirunaLogo from "../../assets/KirunaLogo.svg";
import ActionLogo from "../../assets/type_icons/Action.svg";
import AgreementLogo from "../../assets/type_icons/Agreement.svg";
import ConflictLogo from "../../assets/type_icons/Conflict.svg";
import ConsultationLogo from "../../assets/type_icons/Consultation.svg";
import DesignLogo from "../../assets/type_icons/Design.svg";
import InformativeLogo from "../../assets/type_icons/Informative.svg";
import PrescriptiveLogo from "../../assets/type_icons/Prescriptive.svg";
import TechnicalLogo from "../../assets/type_icons/Technical.svg";
import L from "leaflet";

const typeIcons = {
  "Action": ActionLogo,
  "Material Effect": ActionLogo, //Put again here ActionLogo because in the example UI pdf "Material Effect" does not have its icon, and in some example docs "Material Effect" has same icon as "Action"S
  "Agreement": AgreementLogo,
  "Conflict": ConflictLogo,
  "Consultation": ConsultationLogo,
  "Design": DesignLogo,
  "Informative": InformativeLogo,
  "Prescriptive": PrescriptiveLogo,
  "Technical": TechnicalLogo
};

function createCustomIcon(typeName: string) {
  const customIcon = new L.Icon({
    iconUrl: typeIcons[typeName] ?? KirunaLogo, //If type not found, use as default the original KirunaLogo. Using operator: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#nullish-coalescing
    iconSize: [26.4, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
  return customIcon;
};

function createHighlitedIcon(typeName: string) {
  const highlitedIcon = new L.Icon({
    iconUrl: typeIcons[typeName] ?? KirunaLogo,
    iconSize: [26.4 * 1.5, 32 * 1.5],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
  return highlitedIcon;
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
