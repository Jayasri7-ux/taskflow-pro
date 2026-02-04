const express = require("express");
const { getTasks, createTask, updateTaskStatus } = require("../controllers/taskController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect); // All routes protected

router.get("/", getTasks);
router.post("/", authorize("Admin", "Manager"), createTask);
router.put("/:id", updateTaskStatus);

module.exports = router;
