import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import {
  LayerGroup,
  MapContainer,
  Polygon,
  Polyline,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import "projektpro-leaflet-smoothwheelzoom";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useContext, useEffect, useState } from "react";
import Dial from "../Dial";
import DocumentDial from "../DocumentDial";
import UserContext from "../../contexts/UserContext";
import { Role } from "../../models/User";
import { DisabledInputContext } from "../../contexts/DisabledInputContext";
import { Outlet } from "react-router-dom";
import DocumentMarker from "./DocumentMarker";
import MapLayersControl from "./MapLayersControl";
import ConnectionAPI from "../../API/ConnectionApi";
import { ErrorContext } from "../../contexts/ErrorContext";
import { Connection } from "../../models/Connection";
import KirunaLogo from "../../assets/KirunaLogo.svg";
import DocumentAPI from "../../API/DocumentAPI";
import React from "react";

const municipalityClusterIcon = function () {
  return new L.Icon({
    iconUrl: KirunaLogo,
    iconSize: [26.4, 32],
  });
};

function Map({ docs }) {
  const user = useContext(UserContext);
  const { disabledInput } = useContext(DisabledInputContext);
  const { setError } = useContext(ErrorContext);
  const [mapType, setMapType] = useState("satellite");
  const [layersVisibility, setLayersVisibility] = useState({
    links: false,
    areas: false,
  });
  const [links, setLinks] = useState<Connection[]>([]);
  const [bounds, setBounds] = useState<L.Polyline | null>(null);

  useEffect(() => {
    ConnectionAPI.getConnections()
      .then((links) => {
        setLinks(links);
      })
      .catch((err) => {
        setError(err.message);
      });

    DocumentAPI.getMunicipalityArea()
      .then((area) => {
        setBounds(L.polyline(area.location));
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [setError, docs]);

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
        minZoom={8}
        zoom={13}
        bounds={bounds?.getBounds()}
        maxBounds={bounds?.getBounds()}
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
        {user && user.role === Role.UrbanPlanner && !disabledInput && (
          <MapLayersControl
            mapType={mapType}
            setMapType={setMapType}
            layersVisibility={layersVisibility}
            setLayersVisibility={setLayersVisibility}
          />
        )}
        {/* Map Tiles */}
        {mapType == "satellite" ? (
          <LayerGroup>
            <TileLayer
              keepBuffer={100}
              attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/en-us/home">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            />
          </LayerGroup>
        ) : (
          <TileLayer
            keepBuffer={100}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}
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
                    typeName={doc.type.name}
                    stakeholders={doc.stakeholders}
                    position={L.latLng(doc.location[0])}
                  />
                );
              }
              // Area documents
              if (doc.location.length > 1) {
                const pos: L.LatLngExpression[] = doc.location
                  .slice(0, -1)
                  .map((point) => L.latLng(point));
                return (
                  <React.Fragment key={doc.id}>
                    <DocumentMarker
                      key={doc.id}
                      id={doc.id}
                      typeName={doc.type.name}
                      stakeholders={doc.stakeholders}
                      position={L.PolyUtil.polygonCenter(pos, L.CRS.EPSG3857)}
                    />
                    {layersVisibility.areas && (
                      <Polygon
                        positions={pos}
                        pathOptions={{
                          color: `hsl(${(doc.type.id * 30) % 360}, 100%, 50%)`,
                        }}></Polygon>
                    )}
                  </React.Fragment>
                );
              }
            })}
        </MarkerClusterGroup>
        <MarkerClusterGroup iconCreateFunction={municipalityClusterIcon}>
          {!disabledInput &&
            docs.map((doc) => {
              if (doc.location.length === 0) {
                return (
                  <DocumentMarker
                    key={doc.id}
                    id={doc.id}
                    typeName={doc.type.name}
                    stakeholders={doc.stakeholders}
                    position={[67.85572, 20.22513]}
                  />
                );
              }
            })}
        </MarkerClusterGroup>
        {bounds !== null && (
          <Polygon
            pathOptions={{ color: "red", fill: false }}
            positions={bounds.getLatLngs() as L.LatLngExpression[]}></Polygon>
        )}
        <Outlet />
      </MapContainer>
    </>
  );
}
export default Map;
