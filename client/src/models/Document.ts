interface Point {
  lat: number;
  lng: number;
}

interface Document {
  title: string;
  description: string;
  stakeholderIds: number[];
  typeId: number;
  pages: string;
  coordinates: Point[];
  issueDate: string;
  scale: string;
  language: string;
}

export type { Document, Point };
