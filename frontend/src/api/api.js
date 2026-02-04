import axios from "axios";

const api = axios.create({
    baseURL:
        import.meta.env.MODE === "development"
            ? "http://localhost:5000/api"
            : "https://taskflow-backend-by15.onrender.com/api",
    withCredentials: true,
});

export default api;
