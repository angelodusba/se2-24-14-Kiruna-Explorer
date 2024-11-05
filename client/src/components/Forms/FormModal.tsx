import { Box, Modal } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -45%)",
  width: "500px",
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
    xs: "80&",
    sm: "400px",
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
  return (
    <Modal
      open={!!props.operation}
      onClose={() => props.setOperation(undefined)}
      aria-labelledby="FormModal"
      aria-describedby="FormModalDescription">
      <Box sx={style}>{props.children}</Box>
    </Modal>
  );
}

export default FormModal;
