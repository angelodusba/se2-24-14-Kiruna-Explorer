import { AddLinkOutlined, NoteAddOutlined } from "@mui/icons-material";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { useState } from "react";

const actions = [
  { icon: <NoteAddOutlined />, name: "Add document" },
  { icon: <AddLinkOutlined />, name: "Link documents" },
];

function Dial() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <SpeedDial
      ariaLabel="Dial"
      sx={{
        position: "absolute",
        bottom: 16,
        right: 16,
        "& .MuiFab-primary": {
          backgroundColor: "#003d8f",
          "&:hover": {
            backgroundColor: "#002a6b",
          },
        },
      }}
      icon={<SpeedDialIcon />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}>
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          tooltipOpen
          onClick={handleClose}
          sx={{
            "& .MuiSpeedDialAction-staticTooltipLabel": {
              whiteSpace: "nowrap",
              maxWidth: "none",
            },
          }}
        />
      ))}
    </SpeedDial>
  );
}

export default Dial;
