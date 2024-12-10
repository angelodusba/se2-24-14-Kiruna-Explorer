import FormModal from "../components/Forms/FormModal";
import { Attachment } from "../models/Attachment";
import AttachmentsForm from "../components/Forms/AttachmentsForm";
import { useOutletContext } from "react-router-dom";

interface OutletContext {
  attachments: Attachment[];
  fetchCardInfo: (id: number) => void;
}

function AttachmentsPage() {
  const { attachments, fetchCardInfo } = useOutletContext<OutletContext>();

  return (
    <>
      <FormModal>
        <AttachmentsForm
          attachments={attachments}
          fetchCardInfo={fetchCardInfo}></AttachmentsForm>
      </FormModal>
    </>
  );
}

export default AttachmentsPage;
