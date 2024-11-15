import Coordinates from "../models/coordinates";
import Type from "../models/type";

class DocumentLocationResponse {
  id: number;
  type: Type;
  title: string;
  location: Coordinates[];

  constructor(id: number, type: Type, title:string, location: Coordinates[]) {
    this.id = id;
    this.type = type;
    this.title = title;
    this.location = location;
  }
}

export default DocumentLocationResponse;
