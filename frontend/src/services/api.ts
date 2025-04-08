import axios from "axios";

const BASE_URL = "http://200.17.60.189:7200/repositories/EllasV2";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/sparql-query",
    Accept: "application/sparql-results+json",
    Authorization: "Basic " + btoa("integracao:Ellas@integration"),
  },
  withCredentials: true,
});

export default api;

// Add an empty export to fix the module issue
export {};
