const Task = require("../models/Task");
const Project = require("../models/Project");

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
    try {
        let query;

        if (req.user.role === "Admin") {
            query = Task.find().populate("project", "name").populate("assignedTo", "name email");
        } else if (req.user.role === "Manager") {
            // Find projects managed by this manager first
            const projects = await Project.find({ manager: req.user.id });
            const projectIds = projects.map((p) => p._id);
            query = Task.find({ project: { $in: projectIds } })
                .populate("project", "name")
                .populate("assignedTo", "name email");
        } else {
            // Regular user sees only their tasks
            query = Task.find({ assignedTo: req.user.id }).populate("project", "name").populate("assignedTo", "name email");
        }

        const tasks = await query;
        res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private (Manager only)
exports.createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json({ success: true, data: task });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id
// @access  Private (Manager or Assigned User)
exports.updateTaskStatus = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        // Role check: Admin (can do anything), Manager (can update any task in their projects), User (can update their assigned tasks)
        if (
            req.user.role !== "Admin" &&
            req.user.id !== task.assignedTo.toString() &&
            req.user.role !== "Manager"
        ) {
            return res.status(403).json({ success: false, message: "Not authorized to update this task" });
        }

        task = await Task.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });

        res.status(200).json({ success: true, data: task });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
