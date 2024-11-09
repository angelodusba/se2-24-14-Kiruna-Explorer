import Dial from "../components/Dial";
import AddDocumentForm from "../components/Forms/AddDocumentForm";
import FormModal from "../components/Forms/FormModal";
import LinkDocumentForm from "../components/Forms/LinkDocumentForm";
import DocumentCard from "../components/Map/DocumentCard";

function AddDocumentPage() {
  return (
    <>
      <FormModal>
        <AddDocumentForm></AddDocumentForm>
        {/* <LinkDocumentForm></LinkDocumentForm> */}
      </FormModal>
      {/* <DocumentCard /> */}
    </>
  );
}

export default AddDocumentPage;
