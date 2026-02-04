import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.PROD
        ? "https://taskflow-backend-byl5.onrender.com/api"
        : "/api",
    withCredentials: true,
});

export default api;
