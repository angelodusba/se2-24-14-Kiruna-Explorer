import React, { useState } from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';

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
    const [handlePosition, setHandlePosition] = useState({ x: 0, y: 0 });

    // Handle drag event
    const onDrag = (event: React.DragEvent<SVGCircleElement>) => {
        const newX = event.clientX;
        const newY = event.clientY;
        setHandlePosition({ x: newX + 50, y: newY -20 });
    };

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    let circle_pos = { x: labelX + handlePosition.x, y: labelY + handlePosition.y };

    const [edgePath1] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX: circle_pos.x,
        targetY: circle_pos.y,
        targetPosition,
    });
    
    const [edgePath2] = getBezierPath({
        sourceX: circle_pos.x,
        sourceY: circle_pos.y,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });
    
    return (
        <>
            <path
            id={`${id}-1`}
            style={style}
            className="react-flow__edge-path"
            d={edgePath1}
            markerEnd={markerEnd}
            />
            <path
            id={`${id}-2`}
            style={style}
            className="react-flow__edge-path"
            d={edgePath2}
            markerEnd={markerEnd}
            />
            <circle
            cx={circle_pos.x}
            cy={circle_pos.y}
            r={10}
            fill="red"
            onClick={onDrag}
            onDrag={onDrag}
            />
        </>
    );
};

export default FloatingEdge;
