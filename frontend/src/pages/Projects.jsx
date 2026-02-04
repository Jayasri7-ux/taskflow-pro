import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api/api";
import { Plus, Folder, Trash2, Users, Edit2 } from "lucide-react";

const Projects = () => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const [projects, setProjects] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const [projectForm, setProjectForm] = useState({
        name: "",
        description: "",
    });

    useEffect(() => {
        fetchProjects();
        if (currentUser?.role !== "User") {
            fetchUsers();
        }
    }, [currentUser]);

    const fetchProjects = async () => {
        try {
            const response = await api.get("/projects");
            setProjects(response.data.data);
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get("/users");
            setAllUsers(res.data.data);
        } catch (error) {
            console.error("Failed to load users", error);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/projects", projectForm);
            setProjects([...projects, response.data.data]);
            setShowCreateModal(false);
            setProjectForm({ name: "", description: "" });
            alert("Project created successfully");
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
            alert("Project updated successfully");
        } catch (error) {
            alert("Failed to update project");
        }
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

    if (isLoading) return <div className="text-white text-center mt-10">Loading Projects...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Project Management
                </h2>
                {(currentUser?.role === "Admin" || currentUser?.role === "Manager") && (
                    <button
                        onClick={() => { setShowCreateModal(true); setProjectForm({ name: "", description: "" }); }}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Plus size={20} /> New Project
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project._id} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-gray-700/50 rounded-xl text-blue-400 group-hover:text-white group-hover:bg-blue-600 transition-all">
                                <Folder size={24} />
                            </div>
                            {(currentUser?.role === "Admin" || (currentUser?.role === "Manager" && project.manager?._id === currentUser?.id)) && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedProject(project);
                                            setProjectForm({ name: project.name, description: project.description });
                                            setShowEditModal(true);
                                        }}
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
                            )}
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                        <p className="text-gray-400 text-sm mb-6 line-clamp-2">{project.description}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-700 mt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Users size={16} />
                                <span>{project.team?.length || 0} Members</span>
                            </div>
                            <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                                {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-gray-800/50 rounded-2xl border border-gray-700 border-dashed">
                        <p className="text-gray-500 text-lg">No projects found.</p>
                    </div>
                )}
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
        </div>
    );
};

export default Projects;
