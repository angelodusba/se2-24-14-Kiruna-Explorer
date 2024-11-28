import React, { useState } from 'react';
import { BaseEdge, getSmoothStepPath, type EdgeProps } from 'reactflow';

export function AnimatedSVGEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    label,
}: EdgeProps) {
    const [edgePath] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const [showLabel, setShowLabel] = useState(false);

    const handleClick = () => {
        setShowLabel(!showLabel);
    };

    return (
        <g onClick={handleClick}>
            <BaseEdge id={id} path={edgePath} />
            <circle r="10" fill="#ff0073">
                <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
            </circle>
            {showLabel && label && (
                <text>
                    <textPath href={`#${id}`} startOffset="10%">
                        <tspan dy="1em">{label}</tspan>
                    </textPath>
                </text>
            )}
        </g>
    );
}