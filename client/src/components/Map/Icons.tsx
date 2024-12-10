import L from "leaflet";
import KirunaLogo from "../../assets/KirunaLogo.svg";
import { renderToString } from "react-dom/server";
import typeIconsData from "../../assets/typeIconsData.ts";
import stakeholdersColorsData from "../../assets/stakeholdersColorsData.ts";

function DocumentIcon({ id, d, inputWidth, inputHeight, colors, selected }) {
  const gradientId = `gradient${id}`;
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
      {selected && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#3670BD", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#002961", stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
      )}
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
        <g
          key={`DocumentIcon${id}-${index}`}
          clipPath={`url(#DocumentIconCut${id}-${index})`}
        >
          <path
            d={d}
            stroke="none"
            fill={selected ? `url(#${gradientId})` : color}
            fillRule="evenodd"
          />
        </g>
      ))}
    </svg>
  );
}

function createCustomIcon(typeName: string, docId: number, selectedDocId: any, stakeholders: string[], links: any) {
   const isSelected = selectedDocId === docId;
  const classes = selectedDocId && selectedDocId !== docId && !links.some((link) => (link.id_doc1 === selectedDocId && link.id_doc2 === docId) || (link.id_doc1 === docId && link.id_doc2 === selectedDocId))
    ? "leaflet-div-icon doc-not-connected"
    : "leaflet-div-icon";
  const enlargement = isSelected ? 1.5 : 1;
  return typeIconsData[typeName]
    ? L.divIcon({
        html: renderToString(
          <DocumentIcon
            id={docId}
            d={typeIconsData[typeName].d}
            inputWidth={typeIconsData[typeName].width * enlargement}
            inputHeight={typeIconsData[typeName].height * enlargement}
            colors={stakeholders.length ? stakeholders.map((stakeholder) => stakeholdersColorsData[stakeholder] ?? "#003d8f") : ["#003d8f"]}
            selected={isSelected}
          />
        ),
        iconSize: [26 * enlargement, 32 * enlargement],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
        className: classes,
      })
    : new L.Icon({
        iconUrl: KirunaLogo,
        iconSize: [26 * enlargement, 32 * enlargement],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
        className: classes
      });
}

function createReactFlowIcon(typeName: string, id: number, stakeholders: string[]) {
  if (typeIconsData[typeName]) {
    return (
      <DocumentIcon
        id={id}
        d={typeIconsData[typeName].d}
        inputWidth={typeIconsData[typeName].width}
        inputHeight={typeIconsData[typeName].height}
        colors={
          stakeholders.length
            ? stakeholders.map((stakeholder) => stakeholdersColorsData[stakeholder] ?? "#003d8f")
            : ["#003d8f"]
        }
        selected={false}
      />
    );
  } else {
    return (
      <img
        src={KirunaLogo}
        alt="Fallback Icon"
        width="26"
        height="32"
        style={{ display: 'block' }}
      />
    );
  }
}

export { createCustomIcon, createReactFlowIcon };
