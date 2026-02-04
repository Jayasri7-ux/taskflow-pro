const express = require("express");
const { getProjects, createProject, updateProject, deleteProject } = require("../controllers/projectController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect); // All routes protected

router.get("/", authorize("Admin", "Manager", "User"), getProjects);
router.post("/", authorize("Admin", "Manager"), createProject);
router.put("/:id", authorize("Admin", "Manager"), updateProject);
router.delete("/:id", authorize("Admin", "Manager"), deleteProject);

module.exports = router;
