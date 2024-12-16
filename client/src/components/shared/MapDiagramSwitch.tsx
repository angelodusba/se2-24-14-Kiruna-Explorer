import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { Tooltip } from "@mui/material";

const MaterialUISwitch = styled(Switch)(() => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        // Diagram icon when checked
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="20px" viewBox="0 0 24 24" width="20px"><g><rect fill="none" height="24" width="24"/></g><g><g><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M6.2,3.01C4.44,2.89,3,4.42,3,6.19L3,16c0,2.76,2.24,5,5,5h0c2.76,0,5-2.24,5-5V8c0-1.66,1.34-3,3-3h0c1.66,0,3,1.34,3,3 v7l-0.83,0c-1.61,0-3.06,1.18-3.17,2.79c-0.12,1.69,1.16,3.1,2.8,3.21c1.76,0.12,3.2-1.42,3.2-3.18L21,8c0-2.76-2.24-5-5-5h0 c-2.76,0-5,2.24-5,5v8c0,1.66-1.34,3-3,3l0,0c-1.66,0-3-1.34-3-3V9l0.83,0C7.44,9,8.89,7.82,9,6.21C9.11,4.53,7.83,3.11,6.2,3.01z"/></g></g></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#003d8f",
    width: 32,
    height: 32,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      // Map icon when not checked
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px"><path fill="none" d="M0 0h24v24H0z"/><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: "#aab4be",
    borderRadius: 10,
  },
}));

function MapDiagramSwitch({ checked, handleChange }) {
  return (
    <Tooltip title={`Switch to ${checked ? "map view" : "diagram view"}`}>
      <MaterialUISwitch checked={checked} onChange={handleChange} />
    </Tooltip>
  );
}

export default MapDiagramSwitch;
