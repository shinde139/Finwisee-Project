import axios from "axios";

const aiAPI = axios.create({
  baseURL: "http://localhost:9090",
});

// 🔥 AUTO ADD TOKEN
aiAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default aiAPI;