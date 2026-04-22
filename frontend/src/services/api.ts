import axios from "axios";

// Todas as consultas SPARQL passam pelo backend — credenciais ficam apenas no servidor
const BACKEND_API =
  process.env.NODE_ENV === "production"
    ? "https://app.ellas.ufmt.br/api"
    : "http://localhost:8082/api";

const api = axios.create({
  baseURL: `${BACKEND_API}/sparql`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/sparql-results+json",
  },
});

export default api;

// Add an empty export to fix the module issue
export {};
