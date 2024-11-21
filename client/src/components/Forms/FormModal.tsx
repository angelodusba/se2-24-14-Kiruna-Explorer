import React, { useContext } from "react";
import { Box, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DisabledInputContext } from "../../contexts/DisabledInputContext";

const style = {
  display: "flex",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -45%)",
  maxHeight: "80%",
  minHeight: "60%",
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 1,
  overflowY: "auto",
  maxWidth: {
    xs: "80%",
    sm: "600px",
  },
  minWidth: {
    xs: "80%",
    sm: "500px",
  },
  //Hide scrollbar but allow scrolling
  "&::-webkit-scrollbar": {
    width: "0px",
    background: "transparent",
  },
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

function FormModal(props) {
  const navigate = useNavigate();
  const { disabledInput } = useContext(DisabledInputContext);

  return (
    <Modal
      sx={{ display: disabledInput ? "none" : "flex" }}
      open={true}
      onClose={() => {
        navigate("/map");
      }}
      aria-labelledby="FormModal"
      aria-describedby="FormModalDescription">
      <Box sx={style}>
        {React.Children.map(props.children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              ...props,
            });
          }
          return child;
        })}
      </Box>
    </Modal>
  );
}

export default FormModal;
