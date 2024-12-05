import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import * as db from "../../../db/db";
import AreaDAO from "../../../dao/areaDAO";
import Area from "../../../models/area";
import Coordinates from "../../../models/coordinates";
import { AreaAlreadyExistsError } from "../../../errors/areaErrors";

jest.mock("../../../db/db");

describe("AreaDAO", () => {
  let areaDAO: AreaDAO;

  beforeEach(() => {
    areaDAO = new AreaDAO();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createArea", () => {
    test("should create a new area with valid data", async () => {
      const mockResult = {
        rows: [{ id: 1 }],
      };
      (db.query as jest.Mock).mockResolvedValue(mockResult);

      const area = await areaDAO.createArea(
        "New Area",
        "67.5458 19.8253, 67.5558 19.8353"
      );

      expect(area).toEqual(
        new Area(1, "New Area", [
          new Coordinates(67.5458, 19.8253),
          new Coordinates(67.5558, 19.8353),
        ])
      );
      expect(db.query).toHaveBeenCalled();
    });

    test("should throw an AreaAlreadyExistsError if the area name already exists", async () => {
      (db.query as jest.Mock).mockRejectedValue(
        new Error(
          'duplicate key value violates unique constraint "areas_name_key"'
        )
      );

      await expect(
        areaDAO.createArea("Existing Area", "67.5458 19.8253, 67.5558 19.8353")
      ).rejects.toThrow(AreaAlreadyExistsError);
      expect(db.query).toHaveBeenCalled();
    });

    test("should throw an error if the database query fails", async () => {
      (db.query as jest.Mock).mockRejectedValue(new Error("Database error"));

      await expect(
        areaDAO.createArea("New Area", "67.5458 19.8253, 67.5558 19.8353")
      ).rejects.toThrow("Database error");
      expect(db.query).toHaveBeenCalled();
    });

    test("should throw an error if no rows are returned after insertion", async () => {
      const mockResult = {
        rows: [],
      };
      (db.query as jest.Mock).mockResolvedValue(mockResult);

      await expect(
        areaDAO.createArea("New Area", "67.5458 19.8253, 67.5558 19.8353")
      ).rejects.toThrow("An error occurred while creating the area");
      expect(db.query).toHaveBeenCalled();
    });

    test("should throw an error if the location format is invalid", async () => {
      const invalidLocation = "invalid location format";
      (db.query as jest.Mock).mockRejectedValue(new Error("Database error"));

      await expect(
        areaDAO.createArea("New Area", invalidLocation)
      ).rejects.toThrow("Database error");
      expect(db.query).toHaveBeenCalled();
    });
    describe("getAreas", () => {
      test("should fetch all saved areas", async () => {
        const mockRows = [
          {
            id: 1,
            name: "Area 1",
            location: "19.8253 67.5458, 19.8353 67.5558",
          },
          {
            id: 2,
            name: "Area 2",
            location: "19.8453 67.5658, 19.8553 67.5758",
          },
        ];
        (db.query as jest.Mock).mockResolvedValue({ rows: mockRows });

        const areas = await areaDAO.getAreas();

        expect(areas).toEqual([
          new Area(1, "Area 1", [
            new Coordinates(67.5458, 19.8253),
            new Coordinates(67.5558, 19.8353),
          ]),
          new Area(2, "Area 2", [
            new Coordinates(67.5658, 19.8453),
            new Coordinates(67.5758, 19.8553),
          ]),
        ]);
        expect(db.query).toHaveBeenCalled();
      });

      test("should throw an error if the database query fails", async () => {
        (db.query as jest.Mock).mockRejectedValue(new Error("Database error"));

        await expect(areaDAO.getAreas()).rejects.toThrow("Database error");
        expect(db.query).toHaveBeenCalled();
      });
    });
    });
    });