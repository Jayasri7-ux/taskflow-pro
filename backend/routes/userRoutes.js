const express = require("express");
const { getUsers, updateUser, deleteUser, createUser } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
// router.use(authorize("Admin")); // Removed blanket restriction

router.get("/", authorize("Admin", "Manager"), getUsers);
router.post("/", authorize("Admin"), createUser);
router.put("/:id", authorize("Admin"), updateUser);
router.delete("/:id", authorize("Admin"), deleteUser);

module.exports = router;
