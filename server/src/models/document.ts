import Coordinates from "./coordinates";
import Stakeholder from "./stakeholder";
import Type from "./type";

class Document {
  id: number;
  title: string;
  description: string;
  type: Type;
  issue_date: string;
  scale: string;
  location: Coordinates[];
  language?: string;
  pages?: string;
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
    stakeholders?: string[]
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
    this.stakeholders = stakeholders ? stakeholders : [];
  }
}

export default Document;
