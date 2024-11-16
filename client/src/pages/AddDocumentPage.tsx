import { useContext, useEffect, useState } from "react";
import AddDocumentForm from "../components/Forms/AddDocumentForm";
import FormModal from "../components/Forms/FormModal";
import { StakeHolder } from "../models/StakeHolders";
import DocumentAPI from "../API/DocumentAPI";
import { Type } from "../models/Type";
import { Document } from "../models/Document";
import { useNavigate } from "react-router-dom";
import ConnectionAPI from "../API/ConnectionApi";
import { ConnectionList, HalfConnection } from "../models/Connection";
import MapPicker from "../components/Map/MapPicker";
import { DisabledInputContext } from "../contexts/DisabledInputContext";

const steps = [
  { label: "General info", optional: false },
  { label: "Georeference", optional: false },
  { label: "Original resources", optional: false },
  { label: "Linking", optional: true },
];

function AddDocumentPage({ fetchDocuments }) {
  const navigate = useNavigate();
  const { disabledInput } = useContext(DisabledInputContext);

  // AddDocumentForm data
  const [activeStep, setActiveStep] = useState<number>(0);
  const [stakeholders, setStakeholders] = useState<StakeHolder[]>([]);
  const [documentTypes, setDocumentTypes] = useState<Type[]>([]);
  const [document, setDocument] = useState<Document>({
    title: "",
    description: "",
    stakeholderIds: [],
    typeId: null,
    pages: "",
    coordinates: [],
    issueDate: "",
    scale: "Blueprints/ material effects",
    language: "",
  });
  // LinkDocumentForm data
  const [connectionsList, setConnectionsList] = useState<ConnectionList>({
    starting_document_id: undefined,
    connections: [],
  });
  const [connectionTypes, setConnectionTypes] = useState<string[]>([]);
  const [documentsList, setDocumentsList] = useState<
    { id: number; title: string }[]
  >([]);

  const handleSubmit = async (document: Document) => {
    if (activeStep === steps.length - 3) {
      //Insert DOC
      console.log(document);
      const id = await DocumentAPI.sendDocument(document);
      setConnectionsList({
        starting_document_id: id,
        connections: [{ document_id: undefined, connection_types: [] }],
      });
    }
    if (activeStep === steps.length - 1) {
      handleLinkSubmit();
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    fetchDocuments();
  };

  const handleLinkSubmit = async () => {
    await ConnectionAPI.sendConnections(connectionsList);
    handleClose();
  };

  const handleClose = () => {
    navigate("/map");
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleDeleteConnection = (document_id: number) => {
    setConnectionsList((prevList) => {
      const newConnections = prevList.connections.filter(
        (conn: HalfConnection) => conn.document_id !== document_id
      );
      return {
        starting_document_id: prevList.starting_document_id,
        connections: newConnections,
      };
    });
  };

  const handleAddConnection = () => {
    setConnectionsList((prevList) => ({
      starting_document_id: prevList.starting_document_id,
      connections: [
        ...prevList.connections,
        { document_id: undefined, connection_types: [] },
      ],
    }));
  };

  const handleSelectLinkedDocument = (
    connIndex: number,
    documentId: number
  ) => {
    setConnectionsList((prevList) => {
      const newConnections = prevList.connections;
      newConnections[connIndex].document_id = documentId;
      return {
        starting_document_id: prevList.starting_document_id,
        connections: newConnections,
      };
    });
  };

  const handleSelectConnectionTypes = (
    connIndex: number,
    connection_types: string[]
  ) => {
    setConnectionsList((prevList) => {
      const newConnections = prevList.connections;
      newConnections[connIndex].connection_types = connection_types;
      return {
        starting_document_id: prevList.starting_document_id,
        connections: newConnections,
      };
    });
  };

  useEffect(() => {
    if (activeStep === 0) {
      // Fetch document types
      DocumentAPI.getTypes()
        .then((types: Type[]) => {
          setDocumentTypes(types);
        })
        .catch((error) => {
          console.log(error);
        });
      // Fetch stakeholders
      DocumentAPI.getStakeholders()
        .then((stakeholders: StakeHolder[]) => {
          setStakeholders(stakeholders);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (activeStep === steps.length - 1) {
      // Fetch connections types
      ConnectionAPI.getTypeOfConnections()
        .then((connTypes: string[]) => {
          setConnectionTypes(connTypes);
        })
        .catch((error) => {
          console.log(error);
        });
      // Fetch documents names
      DocumentAPI.getAllDocumentsNames()
        .then((docs: { id: number; title: string }[]) => {
          setDocumentsList(docs);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [activeStep]);

  return (
    <>
      <FormModal>
        <AddDocumentForm
          steps={steps}
          activeStep={activeStep}
          stakeholders={stakeholders}
          types={documentTypes}
          handleSubmit={handleSubmit}
          handleBack={handleBack}
          insertedDocumentId={connectionsList.starting_document_id}
          connectionTypes={connectionTypes}
          documentsList={documentsList}
          handleClose={handleClose}
          handleLinkSubmit={handleLinkSubmit}
          connectionsList={connectionsList}
          handleAddConnection={handleAddConnection}
          handleDeleteConnection={handleDeleteConnection}
          handleSelectLinkedDocument={handleSelectLinkedDocument}
          handleSelectConnectionTypes={handleSelectConnectionTypes}
          document={document}
          setDocument={setDocument}
        />
      </FormModal>
      {disabledInput && <MapPicker setDocument={setDocument}></MapPicker>}
    </>
  );
}

export default AddDocumentPage;
