import axios from "axios";

// ✅ Use Vite's environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
