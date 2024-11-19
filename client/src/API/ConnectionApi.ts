import { ConnectionList, HalfConnection } from "../models/Connection";

const baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/kirunaexplorer/";

/** ------------------- Links APIs ------------------------ */

async function sendConnections(connectionsList: ConnectionList) {
  connectionsList.connections.forEach((conn) => {
    conn.connection_types = conn.connection_types.map((type) => {
      const decapitalized = type.charAt(0).toLowerCase() + type.slice(1);
      return `${decapitalized}_conn`;
    });
  });
  const response = await fetch(baseURL + "connections", {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(connectionsList),
  });
  if (response.ok) {
    return;
  } else {
    const errDetail = await response.json();
    throw new Error(
      errDetail.message || "Something went wrong, please reload the page"
    );
  }
}

/**
 *
 * @returns A Promise that resolves to an array of connections
 * FORMAT: [{document_id_1: number, document_id_2: number, connection_name: string}, {...}, ...]
 * @throws An error if the fetch request fails
 */

async function getConnections() {
  const response = await fetch(baseURL + "connections", {
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
    throw new Error(
      errDetail.message || "Something went wrong, please reload the page"
    );
  }
}

async function getConnectionsByDocumentId(id) {
  const response = await fetch(baseURL + `connections?document_id=${id}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const halfConnections: HalfConnection[] = await response.json();
    halfConnections.forEach((conn) => {
      conn.connection_types = conn.connection_types.map((type) => {
        const parts = type.split("_");
        return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      });
    });
    return halfConnections;
  } else {
    const errDetail = await response.json();
    throw new Error(
      errDetail.message || "Something went wrong, please reload the page"
    );
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
    return connections.map((conn) => {
      const parts = conn.split("_");
      const capitalized = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      return capitalized;
    });
  } else {
    const errDetail = await response.json();
    throw new Error(
      errDetail.message || "Something went wrong, please reload the page"
    );
  }
}

const ConnectionAPI = {
  sendConnections,
  getConnections,
  getConnectionsByDocumentId,
  getTypeOfConnections,
};

export default ConnectionAPI;
