export interface Point {
  lat: number;
  lng: number;
}

export class Document {
  title: string;
  description: string;
  stakeholder: number[];
  type: number;
  pages: string;
  coordinates: Point[];
  issueDate: string;
  scale: string;
  language: string;

  constructor(
    title: string,
    description: string,
    stakeholder: number[],
    type: number,
    pages: string,
    coordinates: Point[],
    issueDate: string,
    scale: string,
    language: string
  ) {
    this.title = title;
    this.description = description;
    this.stakeholder = stakeholder;
    this.type = type;
    this.pages = pages;
    this.coordinates = coordinates;
    this.issueDate = issueDate;
    this.scale = scale;
    this.language = language;
  }
}
