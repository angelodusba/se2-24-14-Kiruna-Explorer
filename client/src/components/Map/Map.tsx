import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Popup, Marker, Tooltip } from "react-leaflet";
import "projektpro-leaflet-smoothwheelzoom";
import L from "leaflet";
import KirunaLogo from "../../assets/KirunaLogo.svg";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useState } from "react";
import Dial from "../Dial";

const customIcon = new L.Icon({
  iconUrl: KirunaLogo,
  iconSize: [26.4, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const handleDocumentShow = (id) => {
  //FetchDocByID and set docCard to that
  return;
};

function Map(props) {
  const [docCard, setDocCard] = useState(undefined);

  return (
    <>
      <Dial />

      <MapContainer
        className="map"
        center={[67.85572, 20.22513]}
        minZoom={12}
        zoom={13}
        touchZoom
        doubleClickZoom
        attributionControl={true}
        zoomControl={true}
        scrollWheelZoom // Needed to enable smooth zoom
        style={{ height: "100vh", overflowY: "auto" }}
      >
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
          {props.docs.map((doc) => {
            if (!doc) return null;
            if (doc.location.length === 1) {
              return (
                <Marker
                  key={doc.id}
                  eventHandlers={{
                    click: () => {
                      handleDocumentShow(doc.id);
                    },
                  }}
                  icon={customIcon}
                  position={L.latLng(doc.location[0])}
                ></Marker>
              );
            }
            if (doc.location.length === 0) {
              return (
                <Marker
                  eventHandlers={{
                    click: () => {
                      handleDocumentShow(doc.id);
                    },
                  }}
                  key={doc.id}
                  icon={customIcon}
                  position={[67.85572, 20.22513]}
                ></Marker>
              );
              return null;
            }
          })}
        </MarkerClusterGroup>
      </MapContainer>
    </>
  );
}

export default Map;
