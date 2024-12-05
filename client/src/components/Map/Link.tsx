import L from "leaflet";
import "@elfalem/leaflet-curve";
import { useRef, useEffect } from "react";
import { useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { CurvePathData } from "@elfalem/leaflet-curve";
import { Point } from "../../models/Document";

const linkStyles = {
  Collateral: { color: "blue", dashArray: "5, 5" },
  Direct: { color: "black" },
  Update: { color: "green", dashArray: "3, 3" },
  Prevision: { color: "orange", dashArray: "5, 5" },
};

function Link({ link, positions }) {
  const map = useMap();
  const navigate = useNavigate(); // React Router's hook for navigation
  const curvesRef = useRef([]); // Store curve layers

  // Helper to create unique curves
  const createCurvePath = (
    start: Point,
    end: Point,
    offsetFactor: number
  ): CurvePathData => {
    return [
      "M",
      [start.lat, start.lng],
      "C",
      [
        (start.lat + end.lat) / 2 + offsetFactor,
        (start.lng + end.lng) / 2 + offsetFactor,
      ],
      [
        (start.lat + end.lat) / 2 + offsetFactor,
        (start.lng + end.lng) / 2 + offsetFactor,
      ],
      [end.lat, end.lng],
    ];
  };

  useEffect(() => {
    const clearCurves = () => {
      curvesRef.current.forEach((curve) => {
        map.removeLayer(curve); // Remove curve from map
      });
      curvesRef.current = []; // Clear reference array
    };

    const { id_doc1, id_doc2, connection_types } = link;

    const start = positions.doc1;
    const end = positions.doc2;

    if (!start || !end) return;

    // Create distinct curves based on connection_name
    connection_types.forEach((type, typeIndex) => {
      const offsetFactor =
        typeIndex % 2 === 0 ? -typeIndex * 0.001 : typeIndex * 0.001; // Adjust offset for each type
      const formattedType =
        type.split("_")[0].charAt(0).toUpperCase() +
        type.split("_")[0].slice(1);
      const curvePath = createCurvePath(start, end, offsetFactor);

      const curve = L.curve(curvePath, {
        ...linkStyles[formattedType],
        weight: 3,
      });

      //Add tooltip
      curve.bindTooltip(`${formattedType}`, {
        permanent: false,
        direction: "auto",
        sticky: true,
        offset: L.point(10, 0),
      });

      // Add click event for navigation
      /* curve.on("click", () => {
        if (window.location.pathname.includes(`${id_doc1}`)) {
          navigate(`/map/${id_doc2}`);
        } else {
          navigate(`/map/${id_doc1}`);
        }
      });*/

      curve.addTo(map);
      curvesRef.current.push(curve); // Store reference for cleanup
    });
    return () => {
      clearCurves();
    };
  }, [map, link, navigate, positions.doc1, positions.doc2]);

  return null;
}

export default Link;
