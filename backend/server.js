const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGO_URI PRESENT:", !!process.env.MONGO_URI);
console.log("JWT_SECRET PRESENT:", !!process.env.JWT_SECRET);

// Connect to database
connectDB().then(() => {
    const seedOnStartup = require("./utils/seeder");
    seedOnStartup();
});

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
        const logBody = { ...req.body };
        if (logBody.password) logBody.password = "****";
        console.log(`Body:`, logBody);
    }
    next();
});
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "https://taskflow-pro-coral.vercel.app"
        ],
        credentials: true,
    })
);

// Route files
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
    res.send("TaskFlow-Pro API is running...");
});

// Centralized Error Handler
app.use((err, req, res, next) => {
    console.error("!!!! SERVER ERROR !!!!");
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Server Error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT} 🚀`);
});
