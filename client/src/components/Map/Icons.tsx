import L from "leaflet";
import KirunaLogo from "../../assets/KirunaLogo.svg";
import { renderToString } from "react-dom/server";
import typeIconsData from "../../assets/typeIconsData.ts";

const colors = ["orange", "blue", "red", "green", "black"]; //Hard coded now for testing pruposes, will be replaced by stakeholders of each doc

function DocumentIcon({ id, d, inputWidth, inputHeight, colors }) {
  return (
    <svg
      id={`DocumentIcon${id}`}
      xmlns="http://www.w3.org/2000/svg"
      width={inputWidth}
      height={inputHeight}
      viewBox={`0 0 ${inputWidth} ${inputHeight}`}
      version="1.1"
      style={{ maxWidth: "100%", maxHeight: "100%" }}
    >
      {colors.map((_, index: number) => (
        <defs key={`DocumentIcon${id}-${index}`}>
          <clipPath id={`DocumentIconCut${id}-${index}`}>
            <rect
              x={index * (inputWidth / colors.length)}
              y="0"
              width={inputWidth / colors.length}
              height={inputHeight}
            />
          </clipPath>
        </defs>
      ))}
      {colors.map((color: string, index: number) => (
        <g key={`DocumentIcon${id}-${index}`} clipPath={`url(#DocumentIconCut${id}-${index})`}>
          <path d={d} stroke="none" fill={color} fillRule="evenodd" />
        </g>
      ))}
    </svg>
  );
}

function createCustomIcon(typeName: string, id: number) {
  return typeIconsData[typeName]
    ? L.divIcon({
        html: renderToString(
          <DocumentIcon
            id={id}
            d={typeIconsData[typeName].d}
            inputWidth={typeIconsData[typeName].width}
            inputHeight={typeIconsData[typeName].height}
            colors={colors}
          />
        ),
        className: "",
        iconSize: [26, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      })
    : new L.Icon({
        iconUrl: KirunaLogo,
        iconSize: [26, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
}

function createHighlitedIcon(typeName: string, id: number) {
  return typeIconsData[typeName]
    ? L.divIcon({
        html: renderToString(
          <DocumentIcon
            id={id}
            d={typeIconsData[typeName].d}
            inputWidth={typeIconsData[typeName].width}
            inputHeight={typeIconsData[typeName].height}
            colors={colors}
          />
        ),
        className: "",
        iconSize: [26 * 1.5, 32 * 1.5],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      })
    : new L.Icon({
        iconUrl: KirunaLogo,
        iconSize: [26 * 1.5, 32 * 1.5],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
}

export { createCustomIcon, createHighlitedIcon };
