import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error("Login failed. Please check your credentials.");
  }
};

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error("Registration failed. Please try again.");
  }
};

// Create axios instance with auth header
export const authAxios = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
authAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
