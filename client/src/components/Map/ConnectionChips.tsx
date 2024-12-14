import { Box, IconButton, Popover, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import connectionStyles from "../Diagram/ConnectionStyles.tsx";
import Grid from "@mui/material/Grid2";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";

function ConnectionChips({ connections, anchorEl, setAnchorEl }) {
  const navigate = useNavigate();

  const handleConnectionClick = (id) => {
    console.log(id);
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
        sx={{ p: 2, maxWidth: "400px", borderRadius: "50%", boxShadow: "2,2" }}>
        <Grid size={12} sx={{ textAlign: "center" }}>
          <Typography
            sx={{ fontWeight: "bold", color: "#003d8f" }}
            variant="subtitle2">
            Connected documents
          </Typography>
        </Grid>

        {connections.map((conn) => {
          return (
            <>
              <Grid
                size={12}
                sx={{
                  textAlign: "center",
                  justifyContent: "center",
                  direction: "row",
                }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    style={{
                      width: "32px",
                      height: "32px",
                      // border: "1px solid #003d8f",
                      borderRadius: "50%",
                      padding: "4px",
                      marginRight: "8px",
                      backgroundColor: "#f0f4f8",
                    }}>
                    <svg width="100%" height="100%">
                      {conn.connection_types.map((type, index) => {
                        const totalPaths = conn.connection_types.length;
                        const startY = (32 - (totalPaths - 1) * 10) / 2;
                        return (
                          <path
                            d={`M0,${startY + index * 10} L100,${
                              startY + index * 10
                            }`}
                            style={
                              connectionStyles[type.toLowerCase() + "_conn"]
                            }
                          />
                        );
                      })}
                    </svg>
                  </Box>
                  <Typography>{conn.name}</Typography>
                  <IconButton
                    size="small"
                    sx={{ marginLeft: "auto" }}
                    onClick={() => handleConnectionClick(conn.document_id)}>
                    <ArrowCircleRightOutlinedIcon color="primary"></ArrowCircleRightOutlinedIcon>
                  </IconButton>
                </Box>
              </Grid>
            </>
          );
        })}
      </Grid>
    </Popover>
  );
}

export default ConnectionChips;
