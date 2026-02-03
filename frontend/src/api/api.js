import axios from "axios";

const api = axios.create({
    baseURL: "https://taskflow-backend-by15.onrender.com/api",
    withCredentials: true,
});

export default api;
