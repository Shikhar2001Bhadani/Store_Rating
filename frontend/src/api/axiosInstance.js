import axios from "axios";

const base = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const instance = axios.create({
  baseURL: base,
  withCredentials: true
});

export default instance;
