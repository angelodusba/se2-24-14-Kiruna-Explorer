import L from "leaflet";
import "@elfalem/leaflet-curve";
import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLeafletContext } from "@react-leaflet/core";
import { CurvePathData } from "@elfalem/leaflet-curve";
import { Point } from "../../models/Document";

const linkStyles = {
  Collateral: { color: "blue", dashArray: "5, 5" },
  Direct: { color: "black" },
  Update: { color: "green", dashArray: "10, 10" },
  Prevision: { color: "orange", dashArray: "15, 10" },
};

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

function Link({ id_doc1, id_doc2, positions, type, offset }) {
  const context = useLeafletContext();
  const navigate = useNavigate();
  const linkRef = useRef<L.Curve | null>(null);
  const propsRef = useRef({ positions, type, offset });

  useEffect(() => {
    const container = context.layerContainer || context.map;

    const start = positions.doc1;
    const end = positions.doc2;
    if (!start || !end) return;

    linkRef.current = L.curve(createCurvePath(start, end, offset), {
      ...linkStyles[type],
      weight: 3,
      className: "link",
    });

    //Add tooltip
    linkRef.current.bindTooltip(`${type}`, {
      permanent: false,
      direction: "auto",
      sticky: true,
      offset: L.point(10, 0),
    });

    // Add click event for navigation
    linkRef.current.on("click", () => {
      if (window.location.pathname.includes(id_doc1)) {
        navigate(`/map/${id_doc2}`);
      } else if (window.location.pathname.includes(id_doc2)) {
        navigate(`/map/${id_doc1}`);
      }
    });

    container.addLayer(linkRef.current);
    return () => {
      container.removeLayer(linkRef.current);
    };
  }, []);

  useEffect(() => {
    if (
      positions !== propsRef.current.positions ||
      type !== propsRef.current.type ||
      offset !== propsRef.current.offset
    ) {
      if (linkRef.current) {
        linkRef.current.setPath(
          createCurvePath(positions.doc1, positions.doc2, offset)
        );
      }
    }
    propsRef.current = { positions, type, offset };
  }, [positions, type, offset]);
  return null;
}

export default Link;
