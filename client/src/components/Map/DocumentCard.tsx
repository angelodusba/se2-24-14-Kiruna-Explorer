import { Box, Modal, Typography } from "@mui/material";
import KirunaLogo from "../../assets/KirunaLogo.svg";
import Grid from "@mui/material/Grid2";

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
    xs: "80%",
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

function DocumentCard(props) {
  return (
    <Modal
      open={true}
      disableAutoFocus
      onClose={() => props.setOperation(undefined)}
      aria-labelledby="CardModal"
      aria-describedby="CardModal">
      <Box sx={style}>
        <Grid
          container
          width={"100%"}
          sx={{ display: "flex", flexDirection: "column" }}>
          <Grid
            size={12}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}>
            <Grid size={2}>
              {" "}
              <img
                src={KirunaLogo}
                width="40px"
                height="48px"
                alt="Kiruna Explorer"
                style={{ marginLeft: "8px" }}
              />
            </Grid>
            <Grid size={10} sx={{ display: "flex", justifyContent: "center" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Title
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Typography variant="h5" component="div"></Typography>
        <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
          adjective
        </Typography>
        <Typography variant="body2">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography>
      </Box>
    </Modal>
  );
}

export default DocumentCard;
