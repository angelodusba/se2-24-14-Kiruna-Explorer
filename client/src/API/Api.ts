const baseURL = "http://localhost:3001/kirunaexplorer/";
import { Document } from "../dataModels/Document";

/** ------------------- Access APIs ------------------------ */

async function login(username: string, password: string) {
  let response = await fetch(baseURL + "sessions", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username, password: password }),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;

    throw new Error("Something went wrong");
  }
}

async function logOut() {
  await fetch(baseURL + "sessions/current", {
    method: "DELETE",
    credentials: "include",
  });
}

async function getUserInfo() {
  const response = await fetch(baseURL + "sessions/current", {
    credentials: "include",
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
    throw new Error("Error. Please reload the page");
  }
}

/** ------------------- Objects APIs ------------------------ */
async function sendDocument(document: Document) {
    let response = await fetch(baseURL + "documents", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
              title: document.title,
              description: document.description,
              type_id: document.type as number,
              issue_date: document.issueDate,
              scale: document.scale,
              location: [document.coordinates].map((point) => `${point.long} ${point.lat}`),
              language: document.language,
              pages: document.pages,
              stakeholders: document.stakeholder,
          }
      ),
    });
    if (response.ok) {
        return null;
    } else {
        const errDetail = await response.json();
        if (errDetail.error) throw errDetail.error;
        if (errDetail.message) throw errDetail.message;

        throw new Error("Something went wrong");
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

const API = { baseURL, login, logOut, getUserInfo, sendDocument, getAllDocumentsNames };
export default API;