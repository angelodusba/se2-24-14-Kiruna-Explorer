import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";
import DocumentAPI from "../../API/DocumentAPI";

function AddResourceDialog({ title, label, handleClose, handleRefreshData }) {
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSave = () => {
    console.log(`Saving... ${name}`);
    if (title.includes("stakeholder")) {
      DocumentAPI.addStakeholder(name)
        .then(() => {
          handleRefreshData();
          handleClose();
        })
        .catch((err) => {
          setError("A stakeholder with this name already exists");
          console.error(err);
        });
    } else {
      DocumentAPI.addDocumentType(name)
        .then(() => {
          handleRefreshData();
          handleClose();
        })
        .catch((err) => {
          setError("A type with this name already exists");
          console.error(err);
        });
    }
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        name: "resourceForm",
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          style={{ marginTop: "10px" }}
          autoFocus
          required
          id="name"
          name="name"
          label={label}
          variant="outlined"
          value={name}
          onChange={(event) => {
            if (error) {
              setError("");
            }
            setName(event.target.value);
          }}
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddResourceDialog;
