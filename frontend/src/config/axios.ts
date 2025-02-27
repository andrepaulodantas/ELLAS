import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token if exists
const token = localStorage.getItem("authToken");
if (token) {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default axiosInstance;
