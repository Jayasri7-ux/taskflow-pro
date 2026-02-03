const express = require("express");
const { getProjects, createProject, updateProject, deleteProject } = require("../controllers/projectController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect); // All routes protected

router.get("/", authorize("Admin", "Manager", "User"), getProjects);
router.post("/", authorize("Manager"), createProject);
router.put("/:id", authorize("Manager"), updateProject);
router.delete("/:id", authorize("Manager"), deleteProject);

module.exports = router;
