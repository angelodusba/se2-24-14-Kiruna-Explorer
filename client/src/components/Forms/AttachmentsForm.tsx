import { Typography, Button, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";

function AttachmentsForm({ docId = undefined }) {
  return (
    <Grid
      container
      component={docId === undefined ? "div" : "form"}
      onSubmit={(event) => {
        event.preventDefault();
        //Handle attachments when form is called standalone, not at insertion time,AttachmentsEditPage needed
      }}
      sx={{
        width: "100%",
        pt: 2,
        px: 2,
      }}
      size={12}
      spacing={2}>
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
        size={12}>
        <Typography
          variant="h6"
          style={{ textAlign: "center", marginBottom: 15 }}>
          Attachments
        </Typography>
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
          size={12}>
          <Paper sx={{ minHeight: "100%" }} variant="outlined"></Paper>
        </Grid>
        <Grid
          sx={{
            width: "100%",
            display: docId ? "flex" : "none",
            justifyContent: "space-between",
            py: 2,
          }}>
          <Button color="error">Close</Button>
          <Button type={"submit"}>Save</Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default AttachmentsForm;
