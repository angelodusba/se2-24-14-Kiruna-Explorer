import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useContext, useState } from "react";
import { DisabledInputContext } from "../../contexts/DisabledInputContext";
import DocumentAPI from "../../API/DocumentAPI";

function SaveAreaDialog({ polygon, open }) {
  const { setDisabledInput } = useContext(DisabledInputContext);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const handleAreaSave = () => {
    DocumentAPI.saveArea(name, polygon.getLatLngs()[0])
      .then(() => {
        setDisabledInput(undefined);
      })
      .catch(() => {
        setNameError("Already existing name");
      });
  };

  const handleClose = () => {
    setDisabledInput(undefined);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: (event) => {
          event.preventDefault();
          handleAreaSave();
        },
      }}>
      <DialogTitle>Do you want to save the area?</DialogTitle>
      <DialogContent>
        <DialogContentText></DialogContentText>
        <TextField
          autoFocus
          required
          id="name"
          name="name"
          label="Area Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(event) => {
            if (nameError) {
              setNameError("");
            }
            setName(event.target.value);
          }}
          error={!!nameError}
          helperText={nameError && nameError}
        />
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleClose}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default SaveAreaDialog;
