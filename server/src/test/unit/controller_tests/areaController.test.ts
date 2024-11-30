import AreaController from "../../../controllers/areaController";
import AreaDAO from "../../../dao/areaDAO";
import DocumentDAO from "../../../dao/documentDAO";
import Area from "../../../models/area";
import Coordinates from "../../../models/coordinates";
import { InvalidDocumentLocationError } from "../../../errors/documentErrors";

jest.mock("../../../dao/areaDAO");
jest.mock("../../../dao/documentDAO");

describe("AreaController", () => {
  let areaController: AreaController;
  let areaDAO: jest.Mocked<AreaDAO>;
  let documentDAO: jest.Mocked<DocumentDAO>;

  beforeEach(() => {
    areaDAO = new AreaDAO() as jest.Mocked<AreaDAO>;
    documentDAO = new DocumentDAO() as jest.Mocked<DocumentDAO>;
    areaController = new AreaController();
    (areaController as any).dao = areaDAO;
    (areaController as any).documentDAO = documentDAO;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAreas", () => {
    it("should retrieve all areas from the database", async () => {
      const mockAreas: Area[] = [
        new Area(1, "Area 1", [
          new Coordinates(67.5458, 19.8253),
          new Coordinates(67.5558, 19.8353),
        ]),
        new Area(2, "Area 2", [
          new Coordinates(67.5658, 19.8453),
          new Coordinates(67.5758, 19.8553),
        ]),
      ];
      areaDAO.getAreas.mockResolvedValue(mockAreas);

      const areas = await areaController.getAreas();

      expect(areas).toEqual(mockAreas);
      expect(areaDAO.getAreas).toHaveBeenCalledTimes(1);
    });
  });

  describe("createArea", () => {
    it("should create a new area with valid location", async () => {
      const mockArea = new Area(1, "New Area", [
        new Coordinates(67.5458, 19.8253),
        new Coordinates(67.5558, 19.8353),
      ]);
      const location = [
        new Coordinates(67.5458, 19.8253),
        new Coordinates(67.5558, 19.8353),
      ];
      documentDAO.validateDocumentLocation.mockResolvedValue(true);
      areaDAO.createArea.mockResolvedValue(mockArea);

      const area = await areaController.createArea("New Area", location);

      expect(area).toEqual(mockArea);
      expect(documentDAO.validateDocumentLocation).toHaveBeenCalledWith(
        location
      );
      expect(areaDAO.createArea).toHaveBeenCalledWith(
        "New Area",
        "67.5458 19.8253, 67.5558 19.8353"
      );
    });

    it("should throw an error if the location is invalid", async () => {
      const location = [
        new Coordinates(67.5458, 19.8253),
        new Coordinates(67.5558, 19.8353),
      ];
      documentDAO.validateDocumentLocation.mockResolvedValue(false);

      await expect(
        areaController.createArea("Invalid Area", location)
      ).rejects.toThrow(InvalidDocumentLocationError);
      expect(documentDAO.validateDocumentLocation).toHaveBeenCalledWith(
        location
      );
      expect(areaDAO.createArea).not.toHaveBeenCalled();
    });
  });
});
