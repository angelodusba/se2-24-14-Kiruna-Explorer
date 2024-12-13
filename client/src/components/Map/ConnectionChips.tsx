import { Box, Chip, Popover, Stack, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import connectionStyles from "../Diagram/ConnectionStyles.tsx";
import Grid from "@mui/material/Grid2";

function ConnectionChips({ connections, anchorEl, setAnchorEl }) {
  const navigate = useNavigate();

  const handleChipClick = (id) => {
    console.log(connections);
    const currentPath = window.location.pathname;
    setAnchorEl(null);
    const newPath = currentPath.includes("diagram")
      ? `/diagram/${id}`
      : `/map/${id}`;
    navigate(newPath);
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      onClose={() => setAnchorEl(null)}>
      <Grid
        container
        spacing={2}
        sx={{ p: 2, minHeight: "200px", minWidth: "200px" }}>
        <Grid size={6} sx={{ textAlign: "center" }}>
          <Typography
            sx={{ fontWeight: "bold", color: "#003d8f" }}
            variant="subtitle2">
            Document
          </Typography>
        </Grid>
        <Grid size={6} sx={{ textAlign: "center" }}>
          <Typography
            sx={{ fontWeight: "bold", color: "#003d8f" }}
            variant="subtitle2">
            Connection Types
          </Typography>
        </Grid>
        {connections.map((conn) => {
          return (
            <>
              <Grid size={6} sx={{ textAlign: "center" }}>
                <Tooltip title={conn.name}>
                  <Chip
                    size="small"
                    label={conn.name}
                    onClick={() => handleChipClick(conn.document_id)}></Chip>
                </Tooltip>
              </Grid>
              <Grid>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      marginRight: "8px",
                    }}>
                    <svg width="100%" height="100%">
                      <path
                        d="M0,12 L100,12"
                        style={connectionStyles["direct_conn"]}
                      />
                    </svg>
                  </div>
                  <Typography>Direct</Typography>
                </div>
              </Grid>
            </>
          );
        })}
      </Grid>
    </Popover>
  );
}

export default ConnectionChips;
