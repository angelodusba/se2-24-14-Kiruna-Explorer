import User from "../models/User";

let baseURL = "";
// Check environment
if (import.meta.env.MODE === "production") {
  baseURL = import.meta.env.VITE_API_URL;
  if (!baseURL) throw new Error("Error: environment variable 'VITE_API_URL' not set!");
} else {
  baseURL = "http://localhost:3001/kirunaexplorer/";
}

/** ------------------- Access APIs ------------------------ */

async function login(email: string, password: string) {
  const response = await fetch(baseURL + "sessions", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email, password: password }),
  });
  if (response.ok) {
    const user = await response.json();
    return new User(user.username, user.email, user.role);
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;

    throw new Error("Something went wrong");
  }
}

async function logOut() {
  await fetch(baseURL + "sessions", {
    method: "DELETE",
    credentials: "include",
  });
}

async function getUserInfo() {
  const response = await fetch(baseURL + "sessions", {
    credentials: "include",
  });
  if (response.ok) {
    const user = await response.json();
    return new User(user.username, user.email, user.role);
  } else {
    const errDetail = await response.json();
    if (errDetail.error) throw errDetail.error;
    if (errDetail.message) throw errDetail.message;
    throw new Error("Error. Please reload the page");
  }
}

const AccessAPI = {
  login,
  logOut,
  getUserInfo,
};
export default AccessAPI;
