import { Box, Modal } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -45%)",
  width: "500px",
  maxHeight: "80%",
  bgcolor: "background.paper",
  // border: "2px solid #000",
  borderRadius: "8px",
  boxShadow: 24,
  p: 1,
  overflowY: "auto",
};

function FormModal(props) {
  return (
    <Modal
      open={!!props.operation}
      onClose={() => props.setOperation(undefined)}
      aria-labelledby="FormModal"
      aria-describedby="FormModalDescription"
    >
      <Box sx={style}>{props.children}</Box>
    </Modal>
  );
}

export default FormModal;
