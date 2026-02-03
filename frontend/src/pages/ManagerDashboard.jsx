import { useEffect, useState } from "react";
import api from "../api/api";
import { Plus, Folder, Trash2, Users, Edit2 } from "lucide-react";

const ManagerDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // Task Management State
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectTasks, setProjectTasks] = useState([]);
    const [showTaskModal, setShowTaskModal] = useState(false);

    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        assignedTo: "",
        priority: "Medium",
        deadline: "",
    });

    const [projectForm, setProjectForm] = useState({
        name: "",
        description: "",
    });

    useEffect(() => {
        fetchProjects();
        fetchUsers();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await api.get("/projects");
            setProjects(response.data.data);
        } catch (error) {
            console.error("Failed to fetch projects");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get("/users");
            setAllUsers(res.data.data);
        } catch (error) {
            console.error("Failed to load users");
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/projects", projectForm);
            setProjects([...projects, response.data.data]);
            setShowCreateModal(false);
            setProjectForm({ name: "", description: "" });
        } catch (error) {
            alert("Failed to create project");
        }
    };

    const handleUpdateProject = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put(`/projects/${selectedProject._id}`, projectForm);
            setProjects(projects.map(p => p._id === selectedProject._id ? res.data.data : p));
            setShowEditModal(false);
            setProjectForm({ name: "", description: "" });
            setSelectedProject(null);
        } catch (error) {
            alert("Failed to update project");
        }
    };

    const openEditModal = (project) => {
        setSelectedProject(project);
        setProjectForm({ name: project.name, description: project.description });
        setShowEditModal(true);
    };

    const handleDeleteProject = async (id) => {
        if (window.confirm("Delete this project? This will remove all associated tasks.")) {
            try {
                await api.delete(`/projects/${id}`);
                setProjects(projects.filter(p => p._id !== id));
            } catch (error) {
                alert("Failed to delete project");
            }
        }
    };

    const handleManageProject = async (project) => {
        setSelectedProject(project);
        try {
            const res = await api.get("/tasks");
            const tasks = res.data.data.filter(t =>
                (t.project._id === project?._id) || (t.project === project?._id)
            );
            setProjectTasks(tasks);
            setShowTaskModal(true);
        } catch (err) {
            alert("Failed to load project tasks");
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!newTask.assignedTo) return alert("Please assign a user");

        try {
            const payload = { ...newTask, project: selectedProject._id };
            const res = await api.post("/tasks", payload);
            // Optimistically update or fetch again. Using backend response.
            // Wait, the backend response might populate 'assignedTo' with just ID or Object.
            // Let's manually populate the name for immediate display if needed, or just push data.
            // Actually, the UI expects assignedTo.name.
            const createdTask = res.data.data;
            // Hack: Manually attach user name for display until refresh
            const assignee = allUsers.find(u => u._id === newTask.assignedTo);
            if (assignee) createdTask.assignedTo = assignee;

            setProjectTasks([...projectTasks, createdTask]);
            setNewTask({ title: "", description: "", assignedTo: "", priority: "Medium", deadline: "" });
            alert("Task created successfully!");
        } catch (err) {
            alert("Failed to create task");
        }
    };

    if (isLoading) return <div className="text-white text-center mt-10">Loading Projects...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    My Projects
                </h2>
                <button
                    onClick={() => { setShowCreateModal(true); setProjectForm({ name: "", description: "" }); }}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                >
                    <Plus size={20} /> New Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project._id} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-gray-700/50 rounded-xl text-blue-400 group-hover:text-white group-hover:bg-blue-600 transition-all">
                                <Folder size={24} />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(project)}
                                    className="text-gray-500 hover:text-blue-400 transition-colors"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDeleteProject(project._id)}
                                    className="text-gray-500 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                        <p className="text-gray-400 text-sm mb-6 line-clamp-2">{project.description}</p>

                        <button
                            onClick={() => handleManageProject(project)}
                            className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-medium transition-colors mt-auto"
                        >
                            Manage Tasks & Team
                        </button>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-700 mt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Users size={16} />
                                <span>{project.team.length} Members</span>
                            </div>
                            <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                                {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                        <h3 className="text-2xl font-bold mb-6">Create New Project</h3>
                        <form onSubmit={handleCreateProject} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Project Name</label>
                                <input
                                    type="text"
                                    required
                                    value={projectForm.name}
                                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <textarea
                                    required
                                    value={projectForm.description}
                                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium"
                                >
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                        <h3 className="text-2xl font-bold mb-6">Edit Project</h3>
                        <form onSubmit={handleUpdateProject} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Project Name</label>
                                <input
                                    type="text"
                                    required
                                    value={projectForm.name}
                                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <textarea
                                    required
                                    value={projectForm.description}
                                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Task Modal (Existing) */}
            {showTaskModal && selectedProject && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
                            <div>
                                <h3 className="text-2xl font-bold text-white">{selectedProject.name}</h3>
                                <p className="text-gray-400 text-sm">Task Management</p>
                            </div>
                            <button onClick={() => setShowTaskModal(false)} className="text-gray-400 hover:text-white">Close</button>
                        </div>

                        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                            <div className="flex-1 p-6 overflow-y-auto border-r border-gray-800 bg-gray-900/50">
                                <h4 className="font-bold text-gray-300 mb-4 flex items-center gap-2">
                                    <Folder size={18} /> Existing Tasks ({projectTasks.length})
                                </h4>
                                <div className="space-y-3">
                                    {projectTasks.map(task => (
                                        <div key={task._id} className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                                            <div className="flex justify-between mb-2">
                                                <h5 className="font-bold text-white">{task.title}</h5>
                                                <span className={`text-xs px-2 py-1 rounded bg-gray-700 text-gray-300`}>{task.status}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 mb-3">{task.description}</p>
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>Assignee: {task.assignedTo?.name || "Unassigned"}</span>
                                                <span className={`px-2 py-0.5 rounded border ${task.priority === 'High' ? 'text-red-400 border-red-500/20 bg-red-500/10' :
                                                        task.priority === 'Medium' ? 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10' :
                                                            'text-blue-400 border-blue-500/20 bg-blue-500/10'
                                                    }`}>{task.priority}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {projectTasks.length === 0 && <p className="text-gray-500 text-sm text-center">No tasks yet.</p>}
                                </div>
                            </div>

                            <div className="w-full md:w-96 p-6 bg-gray-800/30 overflow-y-auto">
                                <h4 className="font-bold text-blue-400 mb-4 flex items-center gap-2">
                                    <Plus size={18} /> Add New Task
                                </h4>
                                <form onSubmit={handleCreateTask} className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Task Title"
                                        required
                                        value={newTask.title}
                                        onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <textarea
                                        placeholder="Description"
                                        required
                                        value={newTask.description}
                                        onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                                    />

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Assign User</label>
                                        <select
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={newTask.assignedTo}
                                            onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}
                                            required
                                        >
                                            <option value="">Select User...</option>
                                            {allUsers.map(u => (
                                                <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Priority</label>
                                            <select
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={newTask.priority}
                                                onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                                            >
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1">Deadline</label>
                                            <input
                                                type="date"
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={newTask.deadline}
                                                onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all"
                                    >
                                        Add Task
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerDashboard;
