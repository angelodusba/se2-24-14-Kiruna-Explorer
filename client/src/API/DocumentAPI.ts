import { Document } from "../models/Document";
import { Type } from "../models/Type";
import { StakeHolder } from "../models/StakeHolders";
import { Point } from "../models/Document";
import { SearchFilter } from "../models/SearchFilter";
import { DocumentCard } from "../models/DocumentCard";
import { Attachment } from "../models/Attachment";

const baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/kirunaexplorer/";

/** ------------------- Documents APIs ------------------------ */
async function sendDocument(document: Document): Promise<number> {
  const response = await fetch(baseURL + "documents", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: document.title,
      description: document.description,
      type_id: document.typeId as number,
      issue_date: document.issueDate,
      scale: document.scale,
      location: document.coordinates,
      language: document.language,
      pages: document.pages,
      stakeholders: document.stakeholderIds,
    }),
  });
  if (response.ok) {
    const res = await response.json();
    return res.id;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;

    throw new Error("Something went wrong");
  }
}

async function getDocumentsLocation() {
  const response = await fetch(baseURL + "documents/location", {
    method: "GET",
    credentials: "include",
  });
  if (response.ok) {
    const documents = await response.json();
    return documents;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
    throw new Error("Error. Please reload the page");
  }
}

async function getTypes(): Promise<Type[]> {
  const response = await fetch(baseURL + "types", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const types: Type[] = await response.json();
    return types;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
  }
}

async function getStakeholders() {
  const response = await fetch(baseURL + "stakeholders", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const stakeholders: StakeHolder[] = await response.json();
    return stakeholders;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
  }
}

async function getAllDocumentsNames() {
  const response = await fetch(baseURL + "documents/names", {
    method: "GET",
    credentials: "include",
  });
  if (response.ok) {
    const documents = await response.json();
    return documents;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
    throw new Error("Error. Please reload the page");
  }
}

async function getMunicipalityDocuments() {
  const response = await fetch(baseURL + "documents/municipality", {
    method: "GET",
    credentials: "include",
  });
  if (response.ok) {
    const documents = await response.json();
    return documents;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
    throw new Error("Error. Please reload the page");
  }
}

async function changeDocumentLocation(id: number, location: Point[]) {
  const response = await fetch(baseURL + "documents/location", {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      location: location,
    }),
  });
  if (!response.ok) {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
    throw new Error("Something went wrong");
  }
}

async function getDocumentCard(id: number) {
  const response = await fetch(`${baseURL}documents/card/${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const documentCard: DocumentCard = await response.json();
    return documentCard;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
    throw new Error("Error. Please reload the page");
  }
}

/** ------------------- Filtered Documents APIs ------------------------ */
/** Get documents based on the filter:
 * @param {SearchFilter} params - parameters of the fiter to be applied
 * @returns {} - object with property docs that is an array of documents that match the filter
 * @throws {Error} - error message
 * @example
 * const documents = await getFilteredDocument(filter: Filter);
 *
 */

async function getFilteredDocuments(
  filter: SearchFilter,
  page?: number,
  size?: number,
  sort?: string
): Promise<{
  docs: {
    id: number;
    title: string;
    description: string;
    type: Type;
    issue_date: string;
    scale: string;
    location: Point[];
    language: string;
    pages: number;
  }[],
  totalRows: number,
  totalPages: number,
}> {
  const params = {
    page: page ? page.toString() : undefined,
    size: size ? size.toString() : undefined,
    sort: sort ? sort : undefined,
  };
  // Remove undefined values
  Object.keys(params).forEach(
    (key) => params[key] === undefined && delete params[key]
  );
  const url = baseURL + "documents/filtered";
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${url}?${query}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filter),
  });
  if (response.ok) {
    const documents = await response.json();
    return documents;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
    throw new Error("Error. Please reload the page");
  }
}

/** ------------------- Files APIs ------------------------ */

const getResourcesBaseURL = () => "http://localhost:3001/docs/";

async function uploadFile(id, file) {
  const response = await fetch(`${baseURL}attachments/${id}`, {
    method: "POST",
    credentials: "include",
    body: file,
  });
  if (response.ok) {
    const attachment: Attachment = await response.json();
    return attachment;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
    throw new Error("Error. Please reload the page");
  }
}

async function deleteFile(id) {
  const response = await fetch(`${baseURL}attachments/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (response.ok) {
    return;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
    throw new Error("Error. Please reload the page");
  }
}

const DocumentAPI = {
  sendDocument,
  getDocumentsLocation,
  getAllDocumentsNames,
  getTypes,
  getStakeholders,
  getMunicipalityDocuments,
  changeDocumentLocation,
  getDocumentCard,
  getFilteredDocuments,
  getResourcesBaseURL,
  uploadFile,
  deleteFile,
};
export default DocumentAPI;
