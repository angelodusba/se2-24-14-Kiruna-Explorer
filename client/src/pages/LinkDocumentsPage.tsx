import { useNavigate } from "react-router-dom";
import FormModal from "../components/Forms/FormModal";
import LinkDocumentForm from "../components/Forms/LinkDocumentForm";
import ConnectionAPI from "../API/ConnectionApi";
import DocumentAPI from "../API/DocumentAPI";
import { useEffect, useState } from "react";
import { ConnectionList, HalfConnection } from "../models/Connection";

function LinkDocumentsPage() {
  const navigate = useNavigate();
  const [connectionTypes, setConnectionTypes] = useState<string[]>([]);
  const [documentsList, setDocumentsList] = useState<{ id: number; title: string }[]>([]);
  const [connectionsList, setConnectionsList] = useState<ConnectionList>({
    starting_document_id: undefined,
    connections: [],
  });

  const handleClose = () => {
    navigate("/map");
  };

  const handleLinkSubmit = async (connectionList) => {
    await ConnectionAPI.sendConnections(connectionList);
    handleClose();
  };

  const handleSelectDocument = (docId: number) => {
    ConnectionAPI.getConnectionsByDocumentId(docId).then((halfConnections: HalfConnection[]) => {
      setConnectionsList({
        starting_document_id: docId,
        connections: halfConnections,
      });
    });
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
      connections: [...prevList.connections, { document_id: undefined, connection_types: [] }],
    }));
  };

  const handleSelectLinkedDocument = (connIndex: number, documentId: number) => {
    setConnectionsList((prevList) => {
      const newConnections = prevList.connections;
      newConnections[connIndex].document_id = documentId;
      return {
        starting_document_id: prevList.starting_document_id,
        connections: newConnections,
      };
    });
  };

  const handleSelectConnectionTypes = (connIndex: number, connection_types: string[]) => {
    setConnectionsList((prevList) => {
      const newConnections = prevList.connections;
      newConnections[connIndex].connection_types = connection_types;
      return {
        starting_document_id: prevList.starting_document_id,
        connections: newConnections,
      };
    });
  };

  // Fetch initial data
  useEffect(() => {
    ConnectionAPI.getTypeOfConnections().then((connTypes: string[]) => {
      setConnectionTypes(connTypes);
    });
    DocumentAPI.getAllDocumentsNames().then((docs: { id: number; title: string }[]) => {
      setDocumentsList(docs);
    });
  }, []);

  return (
    <>
      <FormModal>
        <LinkDocumentForm
          connectionTypes={connectionTypes}
          documentsList={documentsList}
          connectionsList={connectionsList}
          handleClose={handleClose}
          handleLinkSubmit={handleLinkSubmit}
          handleSelectDocument={handleSelectDocument}
          handleAddConnection={handleAddConnection}
          handleDeleteConnection={handleDeleteConnection}
          handleSelectLinkedDocument={handleSelectLinkedDocument}
          handleSelectConnectionTypes={handleSelectConnectionTypes}
        />
      </FormModal>
    </>
  );
}

export default LinkDocumentsPage;
