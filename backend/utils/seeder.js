const User = require("../models/User");

const seedOnStartup = async () => {
    try {
        const count = await User.countDocuments();
        if (count === 0) {
            console.log("Database is empty. Seeding default users... 🌱");
            await User.create([
                {
                    name: "Admin User",
                    email: "admin@taskflow.com",
                    password: "taskflow123",
                    role: "Admin",
                },
                {
                    name: "Manager User",
                    email: "manager@taskflow.com",
                    password: "manager123",
                    role: "Manager",
                },
                {
                    name: "Regular User",
                    email: "user@taskflow.com",
                    password: "user123",
                    role: "User",
                }
            ]);
            console.log("Default users seeded successfully! ✅");
        } else {
            console.log("Database already contains data, skipping auto-seed. 🚀");
        }
    } catch (err) {
        console.error("Auto-seeding failed ❌:", err.message);
    }
};

module.exports = seedOnStartup;
