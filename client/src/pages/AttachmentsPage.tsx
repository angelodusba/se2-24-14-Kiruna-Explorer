import FormModal from "../components/Forms/FormModal";
import { Attachment } from "../models/Attachment";
import AttachmentsForm from "../components/Forms/AttachmentsForm";
import { useOutletContext } from "react-router-dom";

interface OutletContext {
  OriginalResources: Attachment[];
  fetchCardInfo: (id: number) => void;
}

function AttachmentsPage() {
  const { originalResources, fetchCardInfo } =
    useOutletContext<OutletContext>();

  return (
    <>
      <FormModal>
        <AttachmentsForm
          originalResources={originalResources}
          fetchCardInfo={fetchCardInfo}></AttachmentsForm>
      </FormModal>
    </>
  );
}

export default AttachmentsPage;
