import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import * as db from "../../../db/db";
import ScaleDAO from "../../../dao/scaleDAO";
import Scale from "../../../models/scale";
import { ScaleAlreadyExistsError } from "../../../errors/scaleErrors";

jest.mock("../../../db/db");

describe("ScaleDAO", () => {
  let scaleDAO: ScaleDAO;

  beforeEach(() => {
    scaleDAO = new ScaleDAO();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getScales", () => {
    test("should fetch all saved scales", async () => {
      const mockRows = [
        { id: 1, name: "Scale 1" },
        { id: 2, name: "Scale 2" },
      ];
      (db.query as jest.Mock).mockResolvedValue({ rows: mockRows });

      const scales = await scaleDAO.getScales();

      expect(scales).toEqual([
        new Scale(1, "Scale 1"),
        new Scale(2, "Scale 2"),
      ]);
      expect(db.query).toHaveBeenCalled();
    });

    test("should throw an error if the database query fails", async () => {
      (db.query as jest.Mock).mockRejectedValue(new Error("Database error"));

      await expect(scaleDAO.getScales()).rejects.toThrow("Database error");
      expect(db.query).toHaveBeenCalled();
    });
  });

  describe("createScale", () => {
    test("should create a new scale with valid data", async () => {
      (db.query as jest.Mock).mockResolvedValue({ rows: [{ id: 1 }] });

      const result = await scaleDAO.createScale("New Scale");

      expect(result).toBe(true);
      expect(db.query).toHaveBeenCalled();
    });

    test("should throw a ScaleAlreadyExistsError if the scale name already exists", async () => {
      (db.query as jest.Mock).mockRejectedValue(
        new Error(
          'duplicate key value violates unique constraint "scales_name_key"'
        )
      );

      await expect(scaleDAO.createScale("Existing Scale")).rejects.toThrow(
        ScaleAlreadyExistsError
      );
      expect(db.query).toHaveBeenCalled();
    });

    test("should throw an error if the database query fails", async () => {
      (db.query as jest.Mock).mockRejectedValue(new Error("Database error"));

      await expect(scaleDAO.createScale("New Scale")).rejects.toThrow(
        "Database error"
      );
      expect(db.query).toHaveBeenCalled();
    });
  });
});
