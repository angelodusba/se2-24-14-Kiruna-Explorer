import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Modal,
  Typography,
} from "@mui/material";

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

function DocumentCard(props) {
  return (
    <Modal
      open={true}
      onClose={() => props.setOperation(undefined)}
      aria-labelledby="CardModal"
      aria-describedby="CardModal">
      <Box sx={style}>
        <Card variant="outlined">
          {" "}
          <CardContent>
            <Typography
              gutterBottom
              sx={{ color: "text.secondary", fontSize: 14 }}>
              Word of the Day
            </Typography>
            <Typography variant="h5" component="div"></Typography>
            <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
              adjective
            </Typography>
            <Typography variant="body2">
              well meaning and kindly.
              <br />
              {'"a benevolent smile"'}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      </Box>
    </Modal>
  );
}

export default DocumentCard;
