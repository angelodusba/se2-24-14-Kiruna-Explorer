import Coordinates from "../models/coordinates";
import Type from "../models/type";

class DocumentLocationResponse {
  id: number;
  type: Type;
  title: string;
  location: Coordinates[];
  stakeholders: string[];

  constructor(
    id: number,
    type: Type,
    title: string,
    location: Coordinates[],
    stakeholders?: string[]
  ) {
    this.id = id;
    this.type = type;
    this.title = title;
    this.location = location;
    this.stakeholders = stakeholders ? stakeholders : [];
  }
}

export default DocumentLocationResponse;
