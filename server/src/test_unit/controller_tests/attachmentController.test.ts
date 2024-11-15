import exp from "constants";
import AttachmentController from "../../controllers/attachmentController";
import AttachmentDAO from "../../dao/attachmentDAO";

// Mock the AttachmentDAO class
jest.mock("../../dao/attachmentDAO");

describe("AttachmentController", () => {
  let attachmentController: AttachmentController;
  let mockAttachmentDAO: jest.Mocked<AttachmentDAO>;

  beforeEach(() => {
    // Create a new instance of the mocked AttachmentDAO
    mockAttachmentDAO = new AttachmentDAO() as jest.Mocked<AttachmentDAO>;
    // Create a new instance of AttachmentController
    attachmentController = new AttachmentController();
    // Replace the dao instance with the mocked one
    attachmentController["dao"] = mockAttachmentDAO;
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  describe("addAttachment", () => {
    it("should add a new attachment successfully", async () => {
      // Mock the addAttachment method to resolve to an object with an ID
      mockAttachmentDAO.addAttachment.mockResolvedValue({ id: 1 });

      const attachmentData = {
        document_id: 1,
        type: 1,
        original: true,
        path: "/path/to/attachment", //! should i add a local folder inside the repo to store the attachments?
        };
        
        const result = await attachmentController.addAttachment(
            attachmentData.document_id,
            attachmentData.type,
            attachmentData.original,
            attachmentData.path
        );

        expect(result).toStrictEqual({ id: 1 });
        expect(mockAttachmentDAO.addAttachment).toHaveBeenCalledWith(
            attachmentData.document_id,
            attachmentData.type,
            attachmentData.original,
            attachmentData.path
        );
    });
});
});
