import { Document } from "../models/Document";
import { Type } from "../models/Type";
import { StakeHolder } from "../models/StakeHolders";
import { Point } from "../models/Document";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3001/kirunaexplorer/";

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

async function getMunicipalityDocuments(){
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

async function changeDocumentLocation(id: number, location: Point[]){
  const response = await fetch(baseURL + "documents/location", {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      location: location
    }),
  });
  if (response.ok) {
    const res = await response.json();
    return res;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;

    throw new Error("Something went wrong");
  }
}

const DocumentAPI = {
  sendDocument,
  getDocumentsLocation,
  getAllDocumentsNames,
  getTypes,
  getStakeholders,
  getMunicipalityDocuments,
  changeDocumentLocation
};
export default DocumentAPI;
