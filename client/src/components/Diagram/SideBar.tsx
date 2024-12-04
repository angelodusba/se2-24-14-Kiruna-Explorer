import React, { useState } from 'react';
import typeIconsData from "../../assets/typeIconsData.ts";
import stakeholdersColorsData from "../../assets/stakeholdersColorsData.ts";
import { Box, IconButton } from "@mui/material";
import connectionStyles from "./ConnectionStyles.tsx";
import { ExpandLess, ExpandMore } from '@mui/icons-material';
;

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
            <path d={d} stroke="none" fill={'grey'} fillRule="evenodd" />
            </g>
        </svg>
    )
}

function SideBar() {
    const [isMinimized, setIsMinimized] = useState(false);

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    return (
        <Box
        sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", 
                height: "auto", position: "absolute", left: '1%', top: '10%', zIndex: 1000, 
                backgroundColor: "white", border: "1px solid black", 
                padding: isMinimized? "": "32px 16px 32px 16px",
                maxHeight: "50vh", overflowY: isMinimized?"":"auto",
                borderRadius: "8px"
                }}>
            <h2>Legend{"     "}    
            {isMinimized ? (  
                    <IconButton onClick={toggleMinimize} sx={{":hover": {backgroundColor: "grey"}, 
                    flexDirection: "row", justifyContent:"center"}}>
                    <ExpandMore  />
                    </IconButton>  
                ) : (
                    <IconButton onClick={toggleMinimize} sx={{":hover": {backgroundColor: "grey"},
                    flexDirection: "row", justifyContent:"center"}}>
                        <ExpandLess/>
                    </IconButton>
                )}
            </h2>
            {!isMinimized && (
                <>
            <h3>Node types: </h3>  
            {Object.entries(typeIconsData).map(([type, { d, width, height }]) => (
            <div key={type} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
            <div style={{ width: "24px", height: "24px", marginRight: "8px" }}>
                {createIcon(width, height, d, type)}
            </div>
            <span>{type}</span>
            </div>
            ))}
            <div>
                <h3>Stakeholders Colors</h3>
                {Object.entries(stakeholdersColorsData).map(([stakeholder, color]) => (
                <div key={stakeholder} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                    <div style={{ width: "24px", height: "24px", backgroundColor: color, marginRight: "8px" }} />
                    <span>{stakeholder}</span>
                </div>
                ))}
            </div>
            <div>
                <h3>Edge Styles</h3>
                {Object.entries(connectionStyles).map(([style, edgeStyle]) => (
                <div key={style} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                <div style={{ width: "24px", height: "24px", marginRight: "8px" }}>
                    <svg width="100%" height="100%">
                    <path d="M0,12 L100,12" style={edgeStyle} />
                    </svg>
                </div>
                <span>{style}</span>
                </div>
                ))}
            </div>
            </>
            )}
        </Box>
    );
};

export default SideBar;