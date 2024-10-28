import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";

function Map() {
  return (
    <MapContainer
      center={[67.8558, 20.2253]} // Coordinates for Kiruna, Sweden
      zoom={13}
      attributionControl={false}
      zoomControl={false}
      zoomSnap={0}
      zoomDelta={0}
      wheelPxPerZoomLevel={20}
      zoomAnimationThreshold={4}
      wheelDebounceTime={40}
      style={{ height: "100vh" }}>
      <TileLayer
        keepBuffer={250}
        attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a>'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
      <TileLayer
        attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a>'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
      />
      <Marker position={[67.8558, 20.2253]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default Map;
