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
        fontSize: `${zoom >= 1 ? 16 * zoom : 40 * zoom}px`,
        top: type === "x" ? 0 : viewport.y + offset * zoom,
        left: type === "y" ? 0 : viewport.x + offset * zoom,
        zIndex: type === "x" ? 0 : -5, // X axis above Y axis
         // Avoid interfering with the flow interactions
          }}
            >
          {data.map((item) => (
            <Box
              key={item.id}
              style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            boxSizing: "border-box",
            border: "1px solid #aaa",
            backgroundColor: "transparent",
            fontWeight: "bold",
            borderRadius: 2,
            color: "#003d8f",
            width: dim.width,
            height: dim.height,
            cursor: "default",
            fontSize: `${Math.min(dim.width, dim.height) * 0.1}px`, // Dynamic font size based on box dimension
              }}
            >
              {item.label}
            </Box>
          ))}
    </Box>
  );
}

export default Axis;
