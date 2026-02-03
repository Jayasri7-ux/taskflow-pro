const express = require("express");
const { register, login, logout, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getMe);

// DEBUG ENDPOINT - Visit this in your browser to check DB status
router.get("/debug-db", async (req, res) => {
    const count = await User.countDocuments();
    res.json({
        message: "Database Debug Info",
        userCount: count,
        mongoUriPresent: !!process.env.MONGO_URI,
        nodeEnv: process.env.NODE_ENV
    });
});

module.exports = router;
