import L from "leaflet";
import KirunaLogo from "../../assets/KirunaLogo.svg";
import { renderToString } from "react-dom/server";
import typeIconsData from "../../assets/typeIconsData.ts";
import stakeholdersColorsData from "../../assets/stakeholdersColorsData.ts";

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

function createCustomIcon(
  typeName: string,
  docId: number,
  selectedDocId: any,
  stakeholders: string[],
  links: any
) {
  const classes =
    selectedDocId &&
    selectedDocId !== docId &&
    !links.some(
      (link) =>
        (link.id_doc1 === selectedDocId && link.id_doc2 === docId) ||
        (link.id_doc1 === docId && link.id_doc2 === selectedDocId)
    )
      ? "leaflet-div-icon doc-not-connected"
      : "leaflet-div-icon";
  const enlargement = selectedDocId === docId ? 2 : 1;
  return typeIconsData[typeName]
    ? L.divIcon({
        html: renderToString(
          <DocumentIcon
            id={docId}
            d={typeIconsData[typeName].d}
            inputWidth={typeIconsData[typeName].width}
            inputHeight={typeIconsData[typeName].height}
            colors={
              stakeholders.length
                ? stakeholders.map(
                    (stakeholder) => stakeholdersColorsData[stakeholder] ?? "#003d8f"
                  )
                : ["#003d8f"]
            }
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
        className: classes,
      });
}

function createReactFlowIcon(typeName: string, id: number, stakeholders: string[]) {
  return typeIconsData[typeName] ? (
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
    />
  ) : (
    <img
      src={KirunaLogo}
      alt="Fallback Icon"
      width="75%"
      height="75%"
      style={{ display: "block" }}
    />
  );
}

export { createCustomIcon, createReactFlowIcon };
