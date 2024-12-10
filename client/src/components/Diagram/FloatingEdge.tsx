import React, { useState, useRef, useEffect } from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';
import { drag } from "d3-drag";
import { select } from "d3-selection";
import { BaseEdge, EdgeLabelRenderer, useStore } from "reactflow";
import { circle } from 'leaflet';

let zoom = 1;
let storeCirclePosX = {};
let storeCirclePosY = {};

const FloatingEdge: React.FC<EdgeProps> = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
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
    const [circlePos, setCirclePos] = useState({x: storeCirclePosX[id] || labelX, y: storeCirclePosY[id] || labelY});
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
            let circle_pos_current = { x: storeCirclePosX[id], y: storeCirclePosY[id] };
            setCirclePos(circle_pos_current);
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

    return (
        <>  
            <BaseEdge id={`${id}-1`} path={path1} style={style} />
            <BaseEdge id={`${id}-2`} path={path2} style={style} />
            <EdgeLabelRenderer>
            <div
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
                    background: "black",
                    cursor: "pointer",
                }}
                />
            </EdgeLabelRenderer>
        </>
        
    );
};

export default FloatingEdge;
