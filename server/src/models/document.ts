import Type from "./type";

class Document {
  id: number;
  title: string;
  description: string;
  type: Type;
  issue_date: string;
  scale: string;
  location?: string;
  language?: string;
  pages?: string;

  constructor(
    id: number,
    title: string,
    description: string,
    type: Type,
    issue_date: string,
    scale: string,
    location: string,
    language: string,
    pages: string
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
  }
}

export default Document;
