import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, InputAdornment } from "@mui/material";
import Grid from "@mui/material/Grid2";

const DynamicColumnForm = () => {
  const [columns, setColumns] = useState([{ id: 1, value: "" }]);

  // Add a new column
  const addColumn = () => {
    setColumns([...columns, { id: columns.length + 1, value: "" }]);
  };

  // Handle field value change
  const handleFieldChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newColumns = [...columns];
    newColumns[index].value = event.target.value;
    setColumns(newColumns);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Add a document
        </Typography>
        <form>
          <Grid container spacing={3}>
            {/*Document Title Field*/}
            <Grid size={12}>
              <TextField fullWidth label="Title" variant="outlined" required />
            </Grid>
            {/*Document Description Field*/}
            <Grid size={12}>
              <TextField fullWidth label="Description" variant="outlined" required />
            </Grid>
            {/*Stakeholder Fields*/}
            {columns.map((column, index) => (
              <Grid size={12 / columns.length} key={column.id}>
                <TextField
                  fullWidth
                  label={`Stakeholder ${index + 1}`}
                  variant="outlined"
                  value={column.value}
                  onChange={(event) => handleFieldChange(index, event)}
                />
              </Grid>
            ))}
            {/*Add New Stakeholder Button*/}
            <Grid size={12}>
              <Button variant="contained" color="primary" onClick={addColumn}>
                Add New StakeHolder
              </Button>
            </Grid>
            {/*Document Type Field*/}
            <Grid size={12}>
              <TextField fullWidth label="Type" variant="outlined" required />
            </Grid>
            {/*Papers Field*/}
            <Grid size={12} container justifyContent="flex-end">
              <TextField
                fullWidth
                label="Papers"
                variant="outlined"
                type="file"
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start"></InputAdornment>,
                  },
                }}
              />
            </Grid>
            {/*Coordinates Field*/}
            <Grid size={6}>
              <TextField fullWidth label="Latitude" variant="outlined" />
            </Grid>
            <Grid size={6}>
              <TextField fullWidth label="Longitude" variant="outlined" />
            </Grid>
            {/*Save Button*/}
            <Grid size={12}>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default DynamicColumnForm;
