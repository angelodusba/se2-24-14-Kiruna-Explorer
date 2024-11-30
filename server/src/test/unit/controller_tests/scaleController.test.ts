import ScaleController from "../../../controllers/scaleController";
import ScaleDAO from "../../../dao/scaleDAO";
import Scale from "../../../models/scale";
import { ScaleAlreadyExistsError } from "../../../errors/scaleErrors";

jest.mock("../../../dao/scaleDAO");

describe("ScaleController", () => {
  let scaleController: ScaleController;
  let scaleDAO: jest.Mocked<ScaleDAO>;

  beforeEach(() => {
    scaleDAO = new ScaleDAO() as jest.Mocked<ScaleDAO>;
    scaleController = new ScaleController();
    (scaleController as any).dao = scaleDAO;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getScales", () => {
    it("should retrieve all scales from the database", async () => {
      const mockScales: Scale[] = [
        new Scale(1, "Scale 1"),
        new Scale(2, "Scale 2"),
      ];
      scaleDAO.getScales.mockResolvedValue(mockScales);

      const scales = await scaleController.getScales();

      expect(scales).toEqual(mockScales);
      expect(scaleDAO.getScales).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if the database query fails", async () => {
      scaleDAO.getScales.mockRejectedValue(new Error("Database error"));

      await expect(scaleController.getScales()).rejects.toThrow(
        "Database error"
      );
      expect(scaleDAO.getScales).toHaveBeenCalledTimes(1);
    });
  });

  describe("createScale", () => {
    it("should create a new scale with valid data", async () => {
      scaleDAO.createScale.mockResolvedValue(true);

      const result = await scaleController.createScale("New Scale");

      expect(result).toBe(true);
      expect(scaleDAO.createScale).toHaveBeenCalledWith("New Scale");
      expect(scaleDAO.createScale).toHaveBeenCalledTimes(1);
    });

    it("should throw a ScaleAlreadyExistsError if the scale name already exists", async () => {
      scaleDAO.createScale.mockRejectedValue(new ScaleAlreadyExistsError());

      await expect(
        scaleController.createScale("Existing Scale")
      ).rejects.toThrow(ScaleAlreadyExistsError);
      expect(scaleDAO.createScale).toHaveBeenCalledWith("Existing Scale");
      expect(scaleDAO.createScale).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if the database query fails", async () => {
      scaleDAO.createScale.mockRejectedValue(new Error("Database error"));

      await expect(scaleController.createScale("New Scale")).rejects.toThrow(
        "Database error"
      );
      expect(scaleDAO.createScale).toHaveBeenCalledWith("New Scale");
      expect(scaleDAO.createScale).toHaveBeenCalledTimes(1);
    });
  });
});
