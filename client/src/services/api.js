import axios from "axios";

/* Base URL for backend */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/* Axios global configuration */
axios.defaults.baseURL = BASE_URL;
axios.defaults.withCredentials = true;

/* Fetch helper function */
export const apiFetch = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: options.method || "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: options.body || null,
    });

    return res;
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
};

/* Axios helper (optional for other API calls) */
export const apiAxios = axios;