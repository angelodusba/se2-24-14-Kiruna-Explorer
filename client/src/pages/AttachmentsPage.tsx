import FormModal from "../components/Forms/FormModal";
import { Attachment } from "../models/Attachment";
import AttachmentsForm from "../components/Forms/AttachmentsForm";
import { useOutletContext } from "react-router-dom";

interface OutletContext {
  originalRes: Attachment[];
  fetchCardInfo: (id: number) => void;
}

function AttachmentsPage() {
  const { originalRes, fetchCardInfo } = useOutletContext<OutletContext>();

  return (
    <>
      <FormModal>
        <AttachmentsForm
          originalRes={originalRes}
          fetchCardInfo={fetchCardInfo}></AttachmentsForm>
      </FormModal>
    </>
  );
}

export default AttachmentsPage;
