import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useContext, useState } from "react";
import { DisabledInputContext } from "../../contexts/DisabledInputContext";
import DocumentAPI from "../../API/DocumentAPI";
import { useNavigate } from "react-router-dom";

function SaveAreaDialog({ polygon, open }) {
  const { disabledInput, setDisabledInput } = useContext(DisabledInputContext);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const navigate = useNavigate();

  const handleAreaSave = () => {
    DocumentAPI.saveArea(name, polygon.getLatLngs()[0])
      .then(() => {
        if (disabledInput.includes("save")) {
          navigate("/map");
        }
        setDisabledInput(undefined);
      })
      .catch(() => {
        setNameError("Already existing name");
      });
  };

  const handleClose = () => {
    if (disabledInput.includes("save")) {
      navigate("/map");
    }
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
          sx={{ m: 2 }}
          error={!!nameError}
          helperText={nameError && nameError}
        />
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleClose}>
          Don't save
        </Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default SaveAreaDialog;
