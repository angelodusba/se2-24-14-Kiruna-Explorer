import { useContext, useState } from "react";
import FormModal from "../components/Forms/FormModal";
import { Document } from "../models/Document";
import GeoreferenceForm from "../components/Forms/GeoreferenceForm";
import DocumentAPI from "../API/DocumentAPI";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { DisabledInputContext } from "../contexts/DisabledInputContext";
import MapPicker from "../components/Map/MapPicker";

interface OutletContext {
  location: { lat: number; lng: number }[];
  fetchCardInfo: (id: number) => void;
}

function GeoreferencePage({ fetchDocuments }) {
  const params = useParams();
  const navigate = useNavigate();
  const { location, fetchCardInfo } = useOutletContext<OutletContext>();

  const { disabledInput } = useContext(DisabledInputContext);

  const [document, setDocument] = useState<Document>({
    title: "",
    description: "",
    stakeholderIds: [],
    typeId: null,
    pages: "",
    coordinates: location,
    issueDate: "",
    scale: "Blueprints/ material effects",
    language: "",
  });

  const handleEditGeoreferenceSubmit = (event) => {
    event.preventDefault();
    DocumentAPI.changeDocumentLocation(Number(params.id), document.coordinates)
      .then(() => {
        fetchCardInfo(Number(params.id));
        fetchDocuments();
      })
      .catch()
      .finally(() => {
        navigate(-1);
      });
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <>
      <FormModal>
        <GeoreferenceForm
          document={document}
          setDocument={setDocument}
          handleSubmit={handleEditGeoreferenceSubmit}
          handleClose={handleClose}></GeoreferenceForm>
      </FormModal>
      {disabledInput && <MapPicker setDocument={setDocument}></MapPicker>}
    </>
  );
}

export default GeoreferencePage;
