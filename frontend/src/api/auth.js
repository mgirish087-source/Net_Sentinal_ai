import axios from "axios";

/* =========================================================
   API INSTANCE
========================================================= */

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================================================
   LOGIN
========================================================= */

export const loginUser = async (data) => {

  return API.post("/login", data);
};

/* =========================================================
   AUTH HEADERS
========================================================= */

export const getAuthHeaders = () => {

  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export default API;