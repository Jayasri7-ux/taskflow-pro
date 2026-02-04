import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api/api";
import { CheckCircle2, Clock, AlertCircle, Plus } from "lucide-react";

const Tasks = () => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const [tasks, setTasks] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        assignedTo: "",
        project: "",
        priority: "Medium",
        deadline: "",
    });

    useEffect(() => {
        fetchData();
        if (currentUser?.role !== "User") {
            fetchExtraData();
        }
    }, [currentUser]);

    const fetchData = async () => {
        try {
            const res = await api.get("/tasks");
            setTasks(res.data.data);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchExtraData = async () => {
        try {
            const [usersRes, projectsRes] = await Promise.all([
                api.get("/users"),
                api.get("/projects")
            ]);
            setAllUsers(usersRes.data.data);
            setProjects(projectsRes.data.data);
        } catch (error) {
            console.error("Failed to load extra task data", error);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.put(`/tasks/${id}`, { status: newStatus });
            setTasks(tasks.map((task) => (task._id === id ? { ...task, status: newStatus } : task)));
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/tasks", newTask);
            setTasks([...tasks, res.data.data]);
            setShowCreateModal(false);
            setNewTask({ title: "", description: "", assignedTo: "", project: "", priority: "Medium", deadline: "" });
            alert("Task created successfully");
        } catch (error) {
            alert("Failed to create task");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Done": return "text-green-400 bg-green-400/10 border-green-400/20";
            case "In Progress": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
            default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
        }
    };

    if (isLoading) return <div className="text-white text-center mt-10">Loading Tasks...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Task Management
                </h2>
                {(currentUser?.role === "Admin" || currentUser?.role === "Manager") && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Plus size={20} /> New Task
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map((task) => (
                    <div key={task._id} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(task.status)}`}>
                                {task.status}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded border ${task.priority === 'High' ? 'text-red-400 border-red-500/20 bg-red-500/10' :
                                task.priority === 'Medium' ? 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10' :
                                    'text-blue-400 border-blue-500/20 bg-blue-500/10'
                                }`}>
                                {task.priority || 'Medium'}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">{task.title}</h3>
                        <p className="text-gray-400 text-sm mb-6 flex-1">{task.description}</p>

                        <div className="pt-4 border-t border-gray-700 space-y-4">
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span><span className="font-semibold text-gray-400">Project:</span> {task.project?.name || "None"}</span>
                                <span><span className="font-semibold text-gray-400">Assignee:</span> {task.assignedTo?.name || "Unassigned"}</span>
                            </div>

                            <div className="flex gap-2">
                                {task.status !== 'Todo' && (
                                    <button onClick={() => handleStatusUpdate(task._id, "Todo")} className="flex-1 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-[10px] font-bold text-gray-300 transition-colors">Todo</button>
                                )}
                                {task.status !== 'In Progress' && (
                                    <button onClick={() => handleStatusUpdate(task._id, "In Progress")} className="flex-1 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-[10px] font-bold text-blue-400 transition-colors">Start</button>
                                )}
                                {task.status !== 'Done' && (
                                    <button onClick={() => handleStatusUpdate(task._id, "Done")} className="flex-1 py-1.5 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-[10px] font-bold text-green-400 transition-colors">Done</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                        <h3 className="text-2xl font-bold mb-6">Create New Task</h3>
                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Task Title"
                                required
                                value={newTask.title}
                                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <textarea
                                placeholder="Description"
                                required
                                value={newTask.description}
                                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Project</label>
                                    <select
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={newTask.project}
                                        onChange={e => setNewTask({ ...newTask, project: e.target.value })}
                                        required
                                    >
                                        <option value="">Select...</option>
                                        {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Assign User</label>
                                    <select
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={newTask.assignedTo}
                                        onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}
                                        required
                                    >
                                        <option value="">Select...</option>
                                        {allUsers.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Priority</label>
                                    <select
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
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
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={newTask.deadline}
                                        onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium">Create Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tasks;
