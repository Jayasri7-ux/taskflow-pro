const Project = require("../models/Project");

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private (Admin / Manager)
exports.getProjects = async (req, res) => {
    try {
        let query;

        // If Admin, see all. If Manager, see their projects. If User, see assigned projects.
        if (req.user.role === "Admin") {
            query = Project.find().populate("manager", "name email");
        } else if (req.user.role === "Manager") {
            query = Project.find({ manager: req.user.id }).populate("manager", "name email");
        } else {
            query = Project.find({ team: req.user.id }).populate("manager", "name email");
        }

        const projects = await query;

        res.status(200).json({ success: true, count: projects.length, data: projects });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private (Manager only)
exports.createProject = async (req, res) => {
    try {
        req.body.manager = req.user.id;

        const project = await Project.create(req.body);

        res.status(201).json({ success: true, data: project });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Manager only)
exports.updateProject = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        // Ensure user is the project manager
        if (project.manager.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: "Not authorized to update this project" });
        }

        project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        res.status(200).json({ success: true, data: project });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Manager only)
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        // Ensure user is the project manager
        if (project.manager.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: "Not authorized to delete this project" });
        }

        await Project.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
