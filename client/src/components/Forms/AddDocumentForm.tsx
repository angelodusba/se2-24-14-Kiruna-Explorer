import Grid from "@mui/material/Grid2";
import { Box, Button, Step, StepLabel, Stepper, Typography } from "@mui/material";
import React, { useState } from "react";
import GeneralInfoForm from "./GeneralInfoForm";
import GeoreferenceForm from "./GeoreferenceForm";
import LinkDocumentForm from "./LinkDocumentForm";
import AttachmentsForm from "./AttachmentsForm";

function AddDocumentForm({
  steps,
  activeStep,
  stakeholders,
  types,
  handleSubmit,
  handleBack,
  insertedDocumentId,
  connectionTypes,
  documentsList,
  handleClose,
  handleLinkSubmit,
  connectionsList,
  handleAddConnection,
  handleDeleteConnection,
  handleSelectLinkedDocument,
  handleSelectConnectionTypes,
  document,
  setDocument,
  handleRefreshData,
}) {
  const isStepOptional = (index: number): boolean => {
    return steps[index].optional;
  };
  const [georeferenceModality, setGeoreferenceModality] = useState<number>(0);

  const currentForm =
    activeStep === 0 ? (
      <GeneralInfoForm
        types={types}
        stakeholders={stakeholders}
        document={document}
        setDocument={setDocument}
        handleRefreshData={handleRefreshData}
      />
    ) : activeStep === 1 ? (
      <GeoreferenceForm
        document={document}
        setDocument={setDocument}
        handleChangeModality={(mode) => {
          setGeoreferenceModality(mode);
        }}
      />
    ) : activeStep === 2 ? (
      <AttachmentsForm docId={insertedDocumentId}></AttachmentsForm>
    ) : (
      <LinkDocumentForm
        docId={insertedDocumentId}
        connectionTypes={connectionTypes}
        documentsList={documentsList}
        handleClose={handleClose}
        handleLinkSubmit={handleLinkSubmit}
        handleSelectDocument={null}
        connectionsList={connectionsList}
        handleAddConnection={handleAddConnection}
        handleDeleteConnection={handleDeleteConnection}
        handleSelectLinkedDocument={handleSelectLinkedDocument}
        handleSelectConnectionTypes={handleSelectConnectionTypes}
      />
    );

  return (
    <Grid
      container
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        if (activeStep === steps.length - 1) {
          handleLinkSubmit();
        } else {
          handleSubmit(document);
        }
      }}
      spacing={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        pt: 0,
        px: 2,
        mt: 4,
      }}
    >
      <Grid sx={{ width: "100%" }} size="auto">
        <Stepper
          id="stepper"
          activeStep={activeStep}
          alternativeLabel
          sx={{
            width: "100%",
            top: "0px",
          }}
        >
          {steps.map((step, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            if (isStepOptional(index)) {
              labelProps.optional = <Typography variant="caption">Optional</Typography>;
            }
            return (
              <Step
                sx={{
                  ":first-of-type": { pl: 0 },
                  ":last-child": { pr: 0 },
                  "& .MuiStepConnector-root": { top: { xs: 12, sm: 12 } },
                }}
                key={index}
                {...stepProps}
              >
                <StepLabel
                  {...labelProps}
                  sx={{ ".MuiStepLabel-labelContainer": { maxWidth: "70px" } }}
                >
                  {step.label}
                </StepLabel>
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
        size={6}
        spacing={2}
      >
        {/* FORM CURRENTLY DISPLAYED */}
        {currentForm}
      </Grid>
      {activeStep !== steps.length - 1 && (
        <Grid
          sx={{
            width: "100%",
            display: activeStep === steps.length - 1 ? "none" : "flex",
            py: 2,
          }}
          size="auto"
        >
          {activeStep === 1 && (
            <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          <Box sx={{ flex: "1 1 auto" }} />
          <Button
            type={"submit"}
            disabled={
              activeStep === 1 &&
              ((georeferenceModality === 1 &&
                (document.coordinates.length !== 1 ||
                  document.coordinates[0].lat === "" ||
                  document.coordinates[0].lng === "")) ||
                (georeferenceModality === 2 && document.coordinates.length < 2))
            }
          >
            {activeStep === 1 ? "Create" : "Next"}
          </Button>
        </Grid>
      )}
    </Grid>
  );
}

export default AddDocumentForm;
