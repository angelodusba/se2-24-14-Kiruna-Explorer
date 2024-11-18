import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "projektpro-leaflet-smoothwheelzoom";
import L from "leaflet";
import KirunaLogo from "../../assets/KirunaLogo.svg";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useContext, useState } from "react";
import Dial from "../Dial";
import DocumentDial from "../DocumentDial";
import UserContext from "../../contexts/UserContext";
import { Role } from "../../models/User";
import DocumentList from "../listDocument/DocumentList";
import { DisabledInputContext } from "../../contexts/DisabledInputContext";
import { Outlet, useNavigate } from "react-router-dom";

const customIcon = new L.Icon({
  iconUrl: KirunaLogo,
  iconSize: [26.4, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
const bounds = L.latLngBounds(
  [67.7458, 20.0253], // Southwest coordinates (adjust to set the limit)
  [67.9658, 20.4253] // Northeast coordinates (adjust to set the limit)
);

function Map({docs, currentFilter}) {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  // const [docCard, setDocCard] = useState(undefined);
  const [openDocuments, setOpenDocuments] = useState(false);

  const handleOpenDocuments = () => {
    setOpenDocuments(true);
  };

  const handleCloseDocuments = () => {
    setOpenDocuments(false);
  };

  const { disabledInput } = useContext(DisabledInputContext);

  const handleCardShow = (id) => {
    navigate(`/map/${id}`);
  };

  return (
    <>
      {!disabledInput && user && user.role === Role.UrbanPlanner && (
        <Dial onOpenDocuments={handleOpenDocuments} />
      )}
      {!disabledInput && user && user.role === Role.UrbanPlanner && (
        <DocumentDial />
      )}
      <MapContainer
        center={[67.85572, 20.22513]}
        minZoom={12}
        zoom={13}
        bounds={bounds}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        touchZoom
        doubleClickZoom
        attributionControl={true}
        zoomControl={false}
        scrollWheelZoom={false} // Needed to enable smooth zoom
        style={{
          height: "100vh",
          cursor: disabledInput ? "crosshair" : "auto",
        }}>
        <TileLayer
          keepBuffer={100}
          attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
        />
        <MarkerClusterGroup>
          {!disabledInput &&
            docs.map((doc) => {
              if (!doc) return null;
              if (doc.location.length === 1) {
                return (
                  <Marker
                    riseOnHover
                    key={doc.id}
                    eventHandlers={{
                      click: () => {
                        handleCardShow(doc.id);
                      },
                    }}
                    icon={customIcon}
                    position={L.latLng(doc.location[0])}></Marker>
                );
              }
              if (doc.location.length === 0) {
                return (
                  <Marker
                    riseOnHover
                    eventHandlers={{
                      click: () => {
                        handleCardShow(doc.id);
                      },
                    }}
                    key={doc.id}
                    icon={customIcon}
                    position={[67.85572, 20.22513]}></Marker>
                );
              }
            })}
        </MarkerClusterGroup>
        <Outlet></Outlet>
      </MapContainer>
      <DocumentList open={openDocuments} onClose={handleCloseDocuments} currentFilter={currentFilter} />
    </>
  );
}
export default Map;
