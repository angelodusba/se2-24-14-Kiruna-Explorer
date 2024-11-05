import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import React from "react";
import DocumentAPI from "../../API/DocumentAPI";
import { Type } from "../../models/Type";
import { StakeHolder } from "../../models/StakeHolders";
import { Document } from "../../models/Document";
import GeneralInfoForm from "./GeneralInfoForm";
import LinkDocumentForm from "./LinkDocumentForm";
import GeoreferenceForm from "./GeoreferenceForm";

const steps = ["General info", "Georeference and scale", "Linking"];

const isStepOptional = (step: number) => {
  return step === 2;
};

function AddDocumentForm() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [types, setTypes] = useState<Type[]>([]);
  const [stakeholders, setStakeholders] = useState<StakeHolder[]>([]);
  const [document, setDocument] = useState<Document>(
    new Document("", "", [], 0, 0, [], "", "", "")
  );

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return (
          <GeneralInfoForm
            document={document}
            setDocument={setDocument}
            types={types}
            stakeholders={stakeholders}></GeneralInfoForm>
        );
      case 1:
        return (
          <GeoreferenceForm
            document={document}
            setDocument={setDocument}></GeoreferenceForm>
        );
      case 2:
        return <LinkDocumentForm></LinkDocumentForm>;
      default:
        throw new Error("Unknown step");
    }
  }

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
        pt: 0,
        px: 4,
        mt: 4,
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
      {getStepContent(activeStep)}
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
