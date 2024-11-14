import Coordinates from "../models/coordinates";
import Type from "../models/type";

class DocumentCardResponse {
  id: number;
  title: string;
  description: string;
  type: Type;
  issue_date: string;
  scale: string;
  location: Coordinates[];
  language?: string;
  pages?: string;
  conn_count: number;
  stakeholders: string[];

  constructor(
    id: number,
    title: string,
    description: string,
    type: Type,
    issue_date: string,
    scale: string,
    location: Coordinates[],
    language: string,
    pages: string,
    conn_count: number,
    stakeholders: string[]
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.type = type;
    this.issue_date = issue_date;
    this.scale = scale;
    this.location = location;
    this.language = language;
    this.pages = pages;
    this.conn_count = conn_count;
    this.stakeholders = stakeholders;
  }
}

export default DocumentCardResponse;
