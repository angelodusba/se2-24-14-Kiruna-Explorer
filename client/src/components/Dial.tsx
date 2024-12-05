import { AddLinkOutlined, NoteAddOutlined } from "@mui/icons-material";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DisabledInputContext } from "../contexts/DisabledInputContext";

function Dial() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { setDisabledInput } = useContext(DisabledInputContext);

  const actions = [
    {
      id: 1,
      icon: <NoteAddOutlined />,
      name: "Add document",
      url: "/map/add",
    },
    {
      id: 2,
      icon: <AddLinkOutlined />,
      name: "Link documents",
      url: "/map/link",
    },
    {
      id: 3,
      icon: <AddLocationAltOutlinedIcon />,
      name: "Add area",
      url: "/map/area",
    },
  ];

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
          key={action.id}
          icon={action.icon}
          tooltipTitle={action.name}
          tooltipOpen
          onClick={() => {
            if (action.url) {
              if (action.id === 3) {
                setDisabledInput("area save");
              }
              navigate(action.url);
            }
            handleClose();
          }}
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
