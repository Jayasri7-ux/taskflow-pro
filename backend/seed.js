const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Project = require("./models/Project");
const Task = require("./models/Task");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        await User.deleteMany();
        await Project.deleteMany();
        await Task.deleteMany();

        console.log("Creating Users...");

        const admin = await User.create({
            name: "Admin User",
            email: "admin@taskflow.com",
            password: "taskflow123",
            role: "Admin",
        });

        const manager = await User.create({
            name: "Manager User",
            email: "manager@taskflow.com",
            password: "manager123",
            role: "Manager",
        });

        const user = await User.create({
            name: "Regular User",
            email: "user@taskflow.com",
            password: "user123",
            role: "User",
        });

        console.log("Users Created ✅");
        console.log("------------------------");
        console.log("Admin: admin@taskflow.com / taskflow123");
        console.log("Manager: manager@taskflow.com / manager123");
        console.log("User: user@taskflow.com / user123");
        console.log("------------------------");

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
