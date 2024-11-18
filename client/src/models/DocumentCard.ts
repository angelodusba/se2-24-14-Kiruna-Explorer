import { Attachment } from "./Attachment";
import { Point } from "./Document";
import { Type } from "./Type";

export interface DocumentCard {
  id: number;
  title: string;
  description: string;
  type: Type;
  stakeholders: string[];
  pages: string;
  location: Point[];
  issue_date: string;
  scale: string;
  language: string;
  conn_count: number;
  attachments: Attachment[];
}
