import { ConnectionList } from "../models/Connection";

const baseURL = "http://localhost:3001/kirunaexplorer/";

/** ------------------- Links APIs ------------------------ */

async function sendConnections(connectionsList: ConnectionList) {
  const response = await fetch(baseURL + "connections", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(connectionsList),
  });
  if (response.ok) {
    const connections = await response.json();
    return connections;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
  }
}

async function getTypeOfConnections() {
  const response = await fetch(baseURL + "connections/names", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const connections = await response.json();
    return connections;
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
  }
}

const ConnectionAPI = {
  sendConnections,
  getTypeOfConnections,
};

export default ConnectionAPI;
