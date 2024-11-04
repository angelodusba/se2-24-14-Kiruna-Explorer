import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import DocumentAPI from "../../API/DocumentAPI";
import { Type } from "../../models/Type";
import { StakeHolder } from "../../models/StakeHolders";
import { Document } from "../../models/Document";

const steps = ["Info", "Georeference", "Linking", "Review"];

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return <></>;
    case 1:
      return <></>;
    case 2:
      return <></>;
    default:
      throw new Error("Unknown step");
  }
}
const isStepOptional = (step: number) => {
  return step === 2;
};

function AddDocumentForm() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [types, setTypes] = useState<Type[]>([]);
  const [stakeholders, setStakeholders] = useState<StakeHolder[]>([]);
  const [document, setDocument] = useState<Document>(
    new Document("", "", [], 0, 0, { lat: 0, long: 0 }, "", "", "")
  );

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };
  const handleStakeholderChange = (event) => {
    console.log(event.target);
    const selectedStakeholders = event.target.value as number[];

    setDocument((prevDocument) => ({
      ...prevDocument,
      stakeholder: selectedStakeholders,
    }));
    console.log(document.stakeholder);
  };

  const fetchStakeholders = async () => {
    try {
      const stakeholders = await DocumentAPI.getStakeholders();
      setStakeholders(stakeholders);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTypes = async () => {
    try {
      const types = await DocumentAPI.getTypes();
      setTypes(types);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    DocumentAPI.sendDocument(document);
  };

  useEffect(() => {
    fetchStakeholders();
    fetchTypes();
  }, []);

  return (
    <Grid
      container
      component="form"
      onSubmit={handleSubmit}
      spacing={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        alignItems: "start",
        my: 4,
        pt: 0,
        px: 4,
      }}>
      <Grid sx={{ width: "100%" }} size="auto">
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption">Optional</Typography>
              );
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Grid>
      <Grid
        container
        sx={{
          width: "100%",
          display: "flex",
          py: 2,
        }}
        size={6}>
        <Grid sx={{ display: "flex", flexDirection: "column" }} size={12}>
          <TextField
            label="Title"
            variant="outlined"
            value={document.title}
            onChange={(event) =>
              setDocument((prevDocument) => ({
                ...prevDocument,
                title: event.target.value,
              }))
            }
            required
          />
        </Grid>
        <Grid
          sx={{ display: "flex", flexDirection: "column" }}
          size={{ xs: 12, md: 6 }}>
          <FormControl required>
            <InputLabel id="typeSelect">Type</InputLabel>
            <Select
              labelId="typeSelect"
              id="typeSelect"
              value={document.type || ""}
              label="Type"
              onChange={(event) => {
                setDocument((prevDocument) => ({
                  ...prevDocument,
                  type: Number(event.target.value),
                }));
              }}>
              {types.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid
          sx={{ display: "flex", flexDirection: "column" }}
          size={{ xs: 12, md: 6 }}>
          <FormControl required>
            <InputLabel id="typeSelect">Type</InputLabel>
            <Select
              labelId="typeSelect"
              id="typeSelect"
              value={document.type || ""}
              label="Type"
              onChange={(event) => {
                setDocument((prevDocument) => ({
                  ...prevDocument,
                  type: Number(event.target.value),
                }));
              }}>
              {types.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid sx={{ display: "flex", flexDirection: "column" }} size={12}>
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            minRows={3}
            multiline
            value={document.description}
            onChange={(event) =>
              setDocument((prevDocument) => ({
                ...prevDocument,
                description: event.target.value,
              }))
            }
            required
          />
        </Grid>
        <Grid sx={{ display: "flex", flexDirection: "column" }} size={12}>
          <FormControl required>
            <InputLabel id="stakeholders">Stakeholders</InputLabel>
            <Select
              labelId="stakeholders"
              id="stakeholders"
              multiple
              value={document.stakeholder}
              onChange={handleStakeholderChange}
              input={<OutlinedInput id="stakeholders" label="stakeholders" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {(selected as number[]).map((value) => {
                    const stakeholder = stakeholders.find(
                      (s) => s.id === value
                    );
                    return stakeholder ? (
                      <Chip key={stakeholder.id} label={stakeholder.name} />
                    ) : null;
                  })}
                </Box>
              )}>
              {stakeholders.map((stakeholder) => (
                <MenuItem key={stakeholder.id} value={stakeholder.id}>
                  <Checkbox
                    checked={document.stakeholder.includes(stakeholder.id)}
                  />
                  <ListItemText primary={stakeholder.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid
        sx={{
          width: "100%",
          display: "flex",
          py: 2,
        }}
        size="auto">
        <Button
          color="inherit"
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}>
          Back
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        {isStepOptional(activeStep) && (
          <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
            Skip
          </Button>
        )}
        <Button onClick={handleNext}>
          {activeStep === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </Grid>
    </Grid>
  );
}

export default AddDocumentForm;
