import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import "projektpro-leaflet-smoothwheelzoom";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useContext } from "react";
import Dial from "../Dial";
import DocumentDial from "../DocumentDial";
import UserContext from "../../contexts/UserContext";
import { Role } from "../../models/User";
import { DisabledInputContext } from "../../contexts/DisabledInputContext";
import { Outlet } from "react-router-dom";
import DocumentMarker from "./DocumentMarker";

const bounds = L.latLngBounds(
  [67.5458, 19.8253], // Southwest coordinates
  [68.1658, 20.6253] // Northeast coordinates
);

function Map({ docs }) {
  const user = useContext(UserContext);
  const { disabledInput } = useContext(DisabledInputContext);

  return (
    <>
      {!disabledInput && user && user.role === Role.UrbanPlanner && (
        <>
          <Dial /> {/* Add documents and links button */}
          <DocumentDial /> {/* Municipality documents button */}
        </>
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
              // Single point documents
              if (doc.location.length === 1) {
                return (
                  <DocumentMarker
                    key={doc.id}
                    id={doc.id}
                    position={L.latLng(doc.location[0])}
                  />
                );
              }
              // Municipality documents
              if (doc.location.length === 0) {
                return (
                  <DocumentMarker
                    key={doc.id}
                    id={doc.id}
                    position={[67.85572, 20.22513]}
                  />
                );
              }
            })}
        </MarkerClusterGroup>
        <Outlet />
      </MapContainer>
    </>
  );
}
export default Map;
