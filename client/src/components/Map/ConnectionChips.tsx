import { Chip, Popover, Stack, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

function ConnectionChips({ connections, anchorEl, setAnchorEl }) {
  const navigate = useNavigate();

  const handleChipClick = (id) => {
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
      <Stack spacing={2} padding={3}>
        {connections.map((conn) => {
          return (
            <Tooltip title={conn.name}>
              <Chip
                size="small"
                /*label={
                conn.name.length > 20
                ? `${conn.name.slice(0, 20)}...`
                : conn.name
                }*/
                label={conn.name}
                onClick={() => handleChipClick(conn.document_id)}></Chip>
            </Tooltip>
          );
        })}
      </Stack>
    </Popover>
  );
}

export default ConnectionChips;
