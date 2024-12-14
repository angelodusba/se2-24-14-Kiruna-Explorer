import User from "../models/User";

const baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/kirunaexplorer/";

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
    throw new Error(
      errDetail.message || "Something went wrong, please reload the page"
    );
  }
}

async function logOut() {
  const response = await fetch(baseURL + "sessions", {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const errDetail = await response.json();
    throw new Error(
      errDetail.message || "Something went wrong, please reload the page"
    );
  }
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
    throw new Error(
      errDetail.message || "Something went wrong, please reload the page"
    );
  }
}

const AccessAPI = {
  login,
  logOut,
  getUserInfo,
};
export default AccessAPI;
