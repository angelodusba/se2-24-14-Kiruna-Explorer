import Coordinates from "../models/coordinates";
import Type from "../models/type";

class DocumentLocationResponse {
  id: number;
  type: Type;
  location: Coordinates[];

  constructor(id: number, type: Type, location: Coordinates[]) {
    this.id = id;
    this.type = type;
    this.location = location;
  }
}

export default DocumentLocationResponse;
