import { Close, Description, Earbuds, Map } from "@mui/icons-material";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function NavDial() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(
    location.pathname.includes("map") ? 0 : location.pathname.includes("list") ? 1 : 2
  );

  const actions = [
    {
      id: 1,
      icon: <Map />,
      name: "Map view",
      url: "/map",
    },
    {
      id: 2,
      icon: <Description />,
      name: "List view",
      url: "/list",
    },
    {
      id: 3,
      icon: <Earbuds />,
      name: "Diagram view",
      url: "/diagram",
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
      icon={<SpeedDialIcon icon={actions[currentIndex].icon} openIcon={<Close />} />}
      onClose={() => {
        setOpen(false);
      }}
      onOpen={() => {
        setOpen(true);
      }}
      open={open}
    >
      {actions.map((action, index) => (
        <SpeedDialAction
          key={action.id}
          icon={action.icon}
          tooltipTitle={action.name}
          tooltipPlacement="right"
          tooltipOpen
          onClick={() => {
            setCurrentIndex(index);
            navigate(action.url);
          }}
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

export default NavDial;
