import { useContext, useEffect, useState } from "react";
import FormModal from "../components/Forms/FormModal";
import { Document } from "../models/Document";
import GeoreferenceForm from "../components/Forms/GeoreferenceForm";
import DocumentAPI from "../API/DocumentAPI";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { DisabledInputContext } from "../contexts/DisabledInputContext";
import MapPicker from "../components/Map/MapPicker";
import { ErrorContext } from "../contexts/ErrorContext";
import { Area } from "../models/Area";

interface OutletContext {
  location: { lat: number; lng: number }[];
  fetchCardInfo: (id: number) => void;
}

function GeoreferencePage({ fetchDocuments }) {
  const params = useParams();
  const navigate = useNavigate();
  const { setError } = useContext(ErrorContext);
  const { disabledInput } = useContext(DisabledInputContext);
  const { location, fetchCardInfo } = useOutletContext<OutletContext>();

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
  const [areas, setAreas] = useState<Area[]>([]);

  useEffect(() => {
    DocumentAPI.getAllAreas()
      .then((areas) => {
        console.log(areas);
        setAreas(areas);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [setError]);

  const handleEditGeoreferenceSubmit = (event) => {
    event.preventDefault();
    DocumentAPI.changeDocumentLocation(Number(params.id), document.coordinates)
      .then(() => {
        fetchCardInfo(Number(params.id));
        fetchDocuments();
      })
      .catch((err) => {
        setError(err.message);
      })
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
      {disabledInput && (
        <MapPicker areas={areas} setDocument={setDocument}></MapPicker>
      )}
    </>
  );
}

export default GeoreferencePage;
