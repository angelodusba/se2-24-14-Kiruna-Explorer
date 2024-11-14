import Coordinates from "./coordinates";
import Type from "./type";
import Attachment from "./attachment";

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
  attachments?: Attachment[];

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
    attachments: Attachment[]

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
    this.attachments = attachments;
  }
}

export default Document;
