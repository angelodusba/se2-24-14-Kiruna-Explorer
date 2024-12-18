import React, { useState, useRef, useEffect } from "react";
import { EdgeProps, getBezierPath } from "reactflow";
import { drag } from "d3-drag";
import { select } from "d3-selection";
import { BaseEdge, EdgeLabelRenderer, useStore } from "reactflow";
import { Role } from "../../models/User";

let zoom = 1;
const storeCirclePosX = {};
const storeCirclePosY = {};

const FloatingEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
  markerEnd,
}) => {
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const [circlePos, setCirclePos] = useState(
    data.pointPosition || {
      x: storeCirclePosX[id] || labelX,
      y:
        storeCirclePosY[id] ||
        labelY + Math.ceil((data.index || 0) / 2) * 100 * ((data.index || 0) % 2 === 0 ? 1 : -1),
    }
  );
  data.pointPosition = circlePos;
  const [refresh, setRefresh] = useState(0);

  useStore((state) => {
    zoom = state.transform[2];
  });
  const edgeRef = useRef(null);

  // On Drag
  useEffect(() => {
    if (edgeRef.current) {
      const d3Selection = select(edgeRef.current);
      d3Selection.call(
        drag().on("drag", (e) => {
          storeCirclePosY[id] = (storeCirclePosY[id] || labelY) + e.dy / zoom;
          storeCirclePosX[id] = (storeCirclePosX[id] || labelX) + e.dx / zoom;
          const circle_pos_current = { x: storeCirclePosX[id], y: storeCirclePosY[id] };
          setCirclePos(circle_pos_current);
          data.pointPosition = circle_pos_current;
          setRefresh(refresh + 1);
        })
      );
    }
  }, [edgeRef]);

  const [path1] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX: circlePos.x,
    targetY: circlePos.y,
    targetPosition,
  });
  const [path2] = getBezierPath({
    sourceX: circlePos.x,
    sourceY: circlePos.y,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleDelete = () => {
    if (data?.onDelete) {
      data.onDelete(); // Call the delete function passed via `data`
    }
  };

  const [removeX, removeY] = [circlePos.x - 30, circlePos.y - 30];

  return (
    <>
      <BaseEdge id={`${id}-1`} path={path1} style={style} />
      <BaseEdge id={`${id}-2`} path={path2} style={style} />
      <EdgeLabelRenderer>
        <button
          ref={edgeRef}
          style={{
            position: "absolute",
            left: `${circlePos.x}px`,
            top: `${circlePos.y}px`,
            zIndex: 10,
            opacity: 1,
            width: "20px",
            height: "20px",
            pointerEvents: "all",
            borderRadius: "50%",
            background: style.stroke,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "12px",
            border: "none",
          }}
          aria-label="Drag handle"
        ></button>
        {data.user && data.user.role === Role.UrbanPlanner && (
          <button 
            onClick={handleDelete}
            style={{
              position: "absolute",
              left: `${removeX}px`,
              top: `${removeY}px`,
              zIndex: 10,
              opacity: 1,
              width: "20px",
              height: "20px",
              pointerEvents: "all",
              borderRadius: "50%",
              background: "red",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "black",
              fontSize: "12px",
              border: "none",
          }}
            aria-label="Delete edge"
        >
            x
          </button>
        )}
      </EdgeLabelRenderer>
    </>
  );
};

export default FloatingEdge;
