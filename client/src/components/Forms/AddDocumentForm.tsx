import { useEffect, useState, useRef } from "react";
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

const steps = ["General info", "Georeference", "Linking"];

const isStepOptional = (step: number) => {
  return step === 2;
};

function AddDocumentForm(props) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [types, setTypes] = useState<Type[]>([]);
  const [stakeholders, setStakeholders] = useState<StakeHolder[]>([]);
  const [document, setDocument] = useState<Document>(
    new Document("", "", [], 0, "", [], "", "Blueprints/material effects", "")
  );
  const [insertedDocumentId, setInsertedDocumentId] = useState(undefined);

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(document);
    return;
    event.preventDefault();
    if (formRef.current && !formRef.current.reportValidity()) {
      return;
    }
    if (activeStep === steps.length - 2) {
      //Insert DOC
      const id = await DocumentAPI.sendDocument(document);
      setInsertedDocumentId(id);
    }
    if (activeStep === steps.length - 1) {
      handleClose();
      //Link inserted document
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleClose = () => {
    props.setOperation(undefined);
    return;
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

  useEffect(() => {
    fetchStakeholders();
    fetchTypes();
  }, []);

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return (
          <GeneralInfoForm
            document={document}
            setDocument={setDocument}
            types={types}
            stakeholders={stakeholders}
          />
        );
      case 1:
        return (
          <GeoreferenceForm document={document} setDocument={setDocument} />
        );
      case 2:
        return (
          insertedDocumentId && <LinkDocumentForm docId={insertedDocumentId} />
        );

      default:
        throw new Error("Unknown step");
    }
  }

  return (
    <Grid
      container
      component="form"
      onSubmit={handleSubmit}
      ref={formRef}
      spacing={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        pt: 0,
        px: 0,
        mt: 4,
      }}>
      <Grid sx={{ width: "100%" }} size="auto">
        <Stepper
          id="mobile-stepper"
          activeStep={activeStep}
          alternativeLabel
          sx={{
            width: "100%",
            top: "0px",
            display: { sm: "flex", md: "none" },
          }}>
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
            return (
              <Step
                sx={{
                  ":first-child": { pl: 0 },
                  ":last-child": { pr: 0 },
                  "& .MuiStepConnector-root": { top: { xs: 12, sm: 12 } },
                }}
                key={label}
                {...stepProps}>
                <StepLabel
                  {...labelProps}
                  sx={{ ".MuiStepLabel-labelContainer": { maxWidth: "70px" } }}>
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
        <Stepper
          sx={{ display: { xs: "none", md: "flex" } }}
          activeStep={activeStep}
          alternativeLabel>
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
          <Button color="inherit" onClick={handleClose} sx={{ mr: 1 }}>
            Skip
          </Button>
        )}
        <Button type={"submit"}>
          {activeStep === steps.length - 1
            ? "Link"
            : activeStep === steps.length - 2
            ? "Create"
            : "Next"}
        </Button>
      </Grid>
    </Grid>
  );
}

export default AddDocumentForm;
