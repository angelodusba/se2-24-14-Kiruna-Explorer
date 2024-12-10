import { Box } from "@mui/material";
import { Viewport } from "reactflow";

type AxisProps = {
  baseWidth: number;
  baseHeight: number;
  offset?: number;
  type: "x" | "y";
  viewport: Viewport;
  data: {
    id: number;
    label: string;
  }[];
};

function Axis({ baseWidth, baseHeight, offset = 0, type, data, viewport }: AxisProps) {
  const zoom = viewport.zoom;
  const dim = {
    width: baseWidth * zoom,
    height: baseHeight * zoom,
  };

  return (
    <Box
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: type === "x" ? "row" : "column",
        fontSize: `${16 * zoom}px`,
        top: type === "x" ? 0 : viewport.y + offset * zoom,
        left: type === "y" ? 0 : viewport.x + offset * zoom,
        zIndex: type === "x" ? 10 : 5, // X axis above Y axis
        pointerEvents: "none", // Avoid interfering with the flow interactions
      }}
    >
      {data.map((item) => (
        <Box
          key={item.id}
          style={{
            boxSizing: "border-box",
            // border: "1px solid black",
            alignContent: "center",
            backgroundColor: "white",
            textAlign: "center",
            width: dim.width,
            height: dim.height,
          }}
        >
          {item.label}
        </Box>
      ))}
    </Box>
  );
}

export default Axis;
