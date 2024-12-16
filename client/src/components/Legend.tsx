import { Box, Drawer, Fab, Tooltip, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import typeIconsData from "./../assets/typeIconsData.ts";
import stakeholdersColorsData from "./../assets/stakeholdersColorsData.ts";
import connectionStyles from "./Diagram/ConnectionStyles.tsx";
import LegendToggleOutlinedIcon from "@mui/icons-material/LegendToggleOutlined";
import L from "leaflet";

const createIcon = (inputWidth, inputHeight, d, id) => {
  return (
    <svg
      id={`LegendIcon${id}`}
      xmlns="http://www.w3.org/2000/svg"
      width={inputWidth}
      height={inputHeight}
      viewBox={`0 0 ${inputWidth} ${inputHeight}`}
      version="1.1"
      style={{ maxWidth: "100%", maxHeight: "100%" }}
    >
      <g key={`LegendIcon${id}`} clipPath={`url(#DocumentIconCut${id})`}>
        <path d={d} stroke="none" fill={"black"} fillRule="evenodd" />
      </g>
    </svg>
  );
};

function Legend() {
  const [drawerOpened, setDrawerOpened] = useState<boolean>(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!drawerOpened) {
      return;
    }
    L.DomEvent.disableClickPropagation(drawerRef.current);
    L.DomEvent.disableScrollPropagation(drawerRef.current);
  }, [drawerOpened]);

  return (
    <>
      <Tooltip title="Legend" placement="left">
        <Fab
          sx={{
            borderRadius: "50% 0 0 50%",
            border: "none",
            position: "fixed",
            transition: "right 0.3s, transform 0.3s",
            transform: drawerOpened ? "translateX(-250px)" : "translateX(0)",
            backgroundColor: "white",
            top: "50%",
            right: 0,
          }}
          className="legend"
          size="medium"
          id="layersControl"
          aria-haspopup="true"
          onClick={() => {
            setDrawerOpened((prevValue) => !prevValue);
          }}
        >
          {<LegendToggleOutlinedIcon />}
        </Fab>
      </Tooltip>
      <Drawer
        ref={drawerRef}
        anchor="right"
        variant="persistent"
        open={drawerOpened}
        PaperProps={{
          sx: {
            borderRadius: "3% 0 0 3%",
            border: "1px solid #003d8f",
            width: "250px",
            height: "50vh",
            top: "25vh",
            transition: "transform 0.3s",
            //Hide scrollbar but allow scrolling
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "0px",
              background: "transparent",
            },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          },
        }}
        onClose={() => setDrawerOpened(false)}
      >
        <Box sx={{ height: "100%", p: 2 }}>
          <Typography variant="h6" fontWeight="bold" color="#003d8f" sx={{ pb: 1 }}>
            Document types
          </Typography>
          {Object.entries(typeIconsData).map(([type, { d, width, height }]) => (
            <div
              key={type}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  marginRight: "8px",
                }}
              >
                {createIcon(width, height, d, type)}
              </div>
              <Typography>{type}</Typography>
            </div>
          ))}
          <div>
            <Typography variant="h6" fontWeight="bold" color="#003d8f" sx={{ pb: 1 }}>
              Stakeholders Colors
            </Typography>
            {Object.entries(stakeholdersColorsData).map(([stakeholder, color]) => (
              <div
                key={stakeholder}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: color,
                    marginRight: "8px",
                  }}
                />
                <Typography>{stakeholder}</Typography>
              </div>
            ))}
          </div>
          <div>
            <Typography variant="h6" fontWeight="bold" color="#003d8f" sx={{ pb: 1 }}>
              Connection types
            </Typography>
            {Object.entries(connectionStyles).map(([style, edgeStyle]) => (
              <div
                key={style}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    marginRight: "8px",
                  }}
                >
                  <svg width="100%" height="100%">
                    <path d="M0,12 L100,12" style={edgeStyle} />
                  </svg>
                </div>
                <Typography>
                  {style.split("_")[0].charAt(0).toUpperCase() + style.split("_")[0].slice(1)}
                </Typography>
              </div>
            ))}
          </div>
        </Box>
      </Drawer>
    </>
  );
}

export default Legend;
