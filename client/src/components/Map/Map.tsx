import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import "projektpro-leaflet-smoothwheelzoom";

function Map() {
  return (
    <>
      <MapContainer
        className="map"
        center={[67.8558, 20.2253]}
        minZoom={12}
        zoom={13}
        attributionControl={false}
        zoomControl={false}
        scrollWheelZoom={false} //Needed to enable smooth zoom
        style={{ height: "100vh" }}>
        <TileLayer
          keepBuffer={100}
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
    </>
  );
}

export default Map;
