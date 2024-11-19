import { Description, Folder, ListAltOutlined } from "@mui/icons-material";
import { SpeedDial, SpeedDialAction } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DocumentDial() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  const actions = [
    {
      id: 1,
      icon: <Folder />,
      name: "Show municipal area documents",
      url: "/map/municipality",
    },
    {
      id: 2,
      icon: <ListAltOutlined />,
      name: "Documents List",
      url: "/list",
    },
  ];

  return (
    <SpeedDial
      ariaLabel="Dial"
      sx={{
        position: "absolute",
        bottom: 16,
        left: 16,
        "& .MuiFab-primary": {
          backgroundColor: "#003d8f",
          "&:hover": {
            backgroundColor: "#002a6b",
          },
        },
      }}
      icon={<Description />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.id}
          icon={action.icon}
          tooltipTitle={action.name}
          tooltipPlacement="right"
          tooltipOpen
          onClick={() => navigate(action.url)}
          sx={{
            "& .MuiSpeedDialAction-staticTooltipLabel": {
              whiteSpace: "nowrap",
              maxWidth: "100",
            },
          }}
        />
      ))}
    </SpeedDial>
  );
}

export default DocumentDial;
