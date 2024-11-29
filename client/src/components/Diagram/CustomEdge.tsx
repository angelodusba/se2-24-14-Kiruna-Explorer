import { useEffect, useRef, useState } from "react";
import { BaseEdge, EdgeLabelRenderer, EdgeProps, useReactFlow } from "reactflow";
import { drag } from "d3-drag";
import { select } from "d3-selection";

interface EdgeCenter {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
}

function getEdgeCenter({ sourceX, sourceY, targetX, targetY }: EdgeCenter) {
    const xOffset = Math.abs(targetX - sourceX) / 2;
    const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;

    const yOffset = Math.abs(targetY - sourceY) / 2;
    const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;

    return { centerX, centerY, xOffset, yOffset };
}

let storeYVal: { [key: string]: number } = {};
let storeXValBottom: { [key: string]: number } = {};
let storeXValTop: { [key: string]: number } = {};
let extraPoints: { [key: string]: any } = {};

const CustomEdge: React.FC<EdgeProps> = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerEnd,
    style = {},
    label,
    ...rest
}) => {
    const { centerX, centerY, yOffset } = getEdgeCenter({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });
    const [labelPointY, setLabelPointY] = useState(storeYVal?.[id] || 0);
    const [labelPointX, setLabelPointX] = useState(storeXValBottom[id] || 0);
    const [labelPointXTop, setLabelPointXTop] = useState(storeXValTop[id] || 0);
    const [extraPointsPosState, setExtraPointsPosState] = useState({});
    let zoom = 0;

    const { getZoom, getEdges, setEdges } = useReactFlow();
    let isSelected = true; //edges.find((edge) => edge.id === id && edge.selected);

    zoom = getZoom();

    const edgeRef = useRef<HTMLDivElement>(null);
    const edgeRefBottom = useRef<HTMLDivElement>(null);
    const edgeRefTop = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (edgeRef.current) {
            const d3Selection = select(edgeRef.current);
            d3Selection.call(
                drag().on("drag", (e) => {
                    setEdges((prev) => {
                        return prev.map((edge) =>
                            edge.id === id
                                ? { ...edge, selected: true }
                                : { ...edge, selected: false }
                        );
                    });
                    setLabelPointY((prev) => prev - e.dy / zoom);
                    storeYVal[id] = (storeYVal[id] || 0) - e.dy / zoom;
                })
            );
        }
        if (edgeRefBottom.current) {
            const d3Selection = select(edgeRefBottom.current);
            d3Selection.call(
                drag().on("drag", (e) => {
                    setEdges((prev) => {
                        return prev.map((edge) =>
                            edge.id === id
                                ? { ...edge, selected: true }
                                : { ...edge, selected: false }
                        );
                    });
                    setLabelPointX((prev) => prev + e.dx / zoom);
                    storeXValBottom[id] = (storeXValBottom[id] || 0) + e.dx / zoom;
                })
            );
        }
        if (edgeRefTop.current) {
            const d3Selection = select(edgeRefTop.current);
            d3Selection.call(
                drag().on("drag", (e) => {
                    setEdges((prev) => {
                        return prev.map((edge) =>
                            edge.id === id
                                ? { ...edge, selected: true }
                                : { ...edge, selected: false }
                        );
                    });
                    setLabelPointXTop((prev) => prev + e.dx / zoom);
                    storeXValTop[id] = (storeXValTop[id] || 0) + e.dx / zoom;
                })
            );
        }
    }, []);

    let isFirstExtraPoint: { [key: string]: boolean } = {};
    useEffect(() => {
        if (labelPointX !== 0 || labelPointXTop !== 0) {
            Object.keys(extraPoints).forEach((XtraPoint) => {
                if (!isFirstExtraPoint[XtraPoint]) {
                    const d3Selection = select(document.getElementById(XtraPoint)!);
                    d3Selection.call(
                        drag().on("drag", (e) => {
                            setEdges((prev) => {
                                return prev.map((edge) =>
                                    edge.id === id
                                        ? { ...edge, selected: true }
                                        : { ...edge, selected: false }
                                );
                            });
                            setExtraPointsPosState((prev) => ({
                                ...prev,
                                [XtraPoint]: {
                                    ...prev?.[XtraPoint],
                                    y: (prev?.[XtraPoint]?.y || 0) + e.dy / zoom,
                                },
                            }));
                            extraPoints[XtraPoint] = {
                                ...extraPoints?.[XtraPoint],
                                y: (extraPoints?.[XtraPoint]?.y || 0) + e.dy / zoom,
                            };
                        })
                    );
                } else {
                    isFirstExtraPoint[XtraPoint] = true;
                }
            });
        }
    }, [labelPointX, labelPointXTop]);

    function generateOrthogonalEdgePath(
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        padding: number,
        Hoffset = 0,
        Voffset = 0,
        VToffset = 0
    ) {
        var dx = endX - startX;
        var dy = endY - startY;
        var horizontalY = startY + dy / 2 - Hoffset;
        var verticalX = endX - padding + Voffset;
        var verticalXT = startX - padding + VToffset;
        var path =
            "M" +
            verticalXT +
            "," +
            (startY + (extraPoints?.[`topCenter-${id}`]?.y || 0)) +
            " ";
        path += "V" + horizontalY + " ";
        path += "H" + verticalXT + " ";
        path += "H" + verticalX + " ";
        path += "V" + (endY + (extraPoints?.[`bottomCenter-${id}`]?.y || 0)) + "";
        if (VToffset !== 0) {
            extraPoints[`topCenter-${id}`] = {
                ...extraPoints?.[`topCenter-${id}`],
                pos: {
                    left: `${(sourceX + verticalXT) / 2}px`,
                    top: `${startY + (extraPoints?.[`topCenter-${id}`]?.y || 0)}px`,
                    transform: isSelected ? "translateY(-5px)" : "translateY(-2.5px)",
                },
            };
            path += "M" + startX + "," + startY + " ";
            path += "V" + (startY + (extraPoints?.[`topCenter-${id}`]?.y || 0)) + " ";
            path += "H" + verticalXT;
        }
        if (Voffset !== 0) {
            extraPoints[`bottomCenter-${id}`] = {
                ...extraPoints?.[`bottomCenter-${id}`],
                pos: {
                    left: `${(targetX + verticalX) / 2}px`,
                    top: `${endY + (extraPoints?.[`bottomCenter-${id}`]?.y || 0)}px`,
                    transform: isSelected ? "translateY(-5px)" : "translateY(-2.5px)",
                },
            };
            path += "M" + endX + "," + endY + " ";
            path +=
                "V" + (endY + (extraPoints?.[`bottomCenter-${id}`]?.y || 0)) + " ";
            path += "H" + verticalX + " ";
        }
        return path;
    }

    var path = generateOrthogonalEdgePath(
        sourceX,
        sourceY,
        targetX,
        targetY,
        0,
        labelPointY,
        labelPointX,
        labelPointXTop
    );

    const getTopBottomPointsY = (top: boolean) => {
        if (targetY < sourceY) {
            if (top) {
                return (
                    centerY -
                    labelPointY +
                    (yOffset + labelPointY + (extraPoints?.[`topCenter-${id}`]?.y || 0)) /
                        2
                );
            } else {
                return (
                    centerY -
                    labelPointY -
                    (yOffset -
                        labelPointY -
                        (extraPoints?.[`bottomCenter-${id}`]?.y || 0)) /
                        2
                );
            }
        } else {
            if (top) {
                return (
                    centerY -
                    labelPointY -
                    (yOffset - labelPointY - (extraPoints?.[`topCenter-${id}`]?.y || 0)) /
                        2
                );
            } else {
                return (
                    centerY -
                    labelPointY +
                    (yOffset +
                        labelPointY +
                        (extraPoints?.[`bottomCenter-${id}`]?.y || 0)) /
                        2
                );
            }
        }
    };

    return (
        <>
            <BaseEdge key={id} path={path} style={style} />
            <EdgeLabelRenderer>
                <div
                    ref={edgeRef}
                    className="custom_point"
                    style={{
                        position: "absolute",
                        left: `${centerX + (labelPointX + labelPointXTop) / 2}px`,
                        top: `${centerY - labelPointY}px`,
                        transform: isSelected ? "translateY(-5px)" : "translateY(-3.5px)",
                        opacity: isSelected ? 1 : 0.3,
                        width: isSelected ? "10px" : "5px",
                        height: isSelected ? "10px" : "5px",
                        pointerEvents: "all",
                        borderRadius: "50%",
                        background: "black",
                        cursor: "row-resize",
                    }}
                >
                                        <div
                        style={{
                            position: "absolute",
                            left: "30px",
                            background: "white",
                            padding: "5px",
                            border: "1px solid black",
                            borderRadius: "3px",
                            pointerEvents: "none",
                        }}
                    >
                        {label}
                    </div>
                </div>
                <div
                    ref={edgeRefBottom}
                    className="custom_point"
                    style={{
                        position: "absolute",
                        left: `${targetX + labelPointX}px`,
                        top: `${getTopBottomPointsY(false)}px`,
                        transform: isSelected ? "translateX(-5px)" : "translateX(-2.5px)",
                        opacity: isSelected ? 1 : 0.3,
                        width: isSelected ? "10px" : "5px",
                        height: isSelected ? "10px" : "5px",
                        pointerEvents: "all",
                        borderRadius: "50%",
                        background: "black",
                        cursor: "col-resize",
                    }}
                    />
                <div
                    ref={edgeRefTop}
                    className="custom_point"
                    style={{
                        position: "absolute",
                        left: `${sourceX + labelPointXTop}px`,
                        top: `${getTopBottomPointsY(true)}px`,
                        transform: isSelected ? "translateX(-5px)" : "translateX(-2.5px)",
                        opacity: isSelected ? 1 : 0.3,
                        width: isSelected ? "10px" : "5px",
                        height: isSelected ? "10px" : "5px",
                        pointerEvents: "all",
                        borderRadius: "50%",
                        background: "black",
                        cursor: "col-resize",
                    }}
                />
                {Object.keys(extraPoints).length > 0 &&
                    Object.keys(extraPoints).map((pointKey, index) => {
                        if (
                            pointKey === `bottomCenter-${id}` ||
                            pointKey === `topCenter-${id}`
                        ) {
                            return (
                                <div
                                    id={pointKey}
                                    key={index}
                                    className="custom_point"
                                    style={{
                                        position: "absolute",
                                        left: extraPoints[pointKey]?.pos?.left,
                                        top: extraPoints[pointKey]?.pos?.top,
                                        transform: extraPoints[pointKey]?.pos?.transform,
                                        opacity: isSelected ? 1 : 0.3,
                                        width: isSelected ? "10px" : "5px",
                                        height: isSelected ? "10px" : "5px",
                                        pointerEvents: "all",
                                        borderRadius: "50%",
                                        background: "black",
                                        cursor: "row-resize",
                                    }}
                                />
                            );
                        }
                    })}
            </EdgeLabelRenderer>
        </>
    );
};

export default CustomEdge;
