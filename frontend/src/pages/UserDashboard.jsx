import { useEffect, useState } from "react";
import api from "../api/api";
import { CheckCircle2, Clock, AlertCircle, Folder, Briefcase } from "lucide-react";

const UserDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [taskRes, projectRes] = await Promise.all([
                api.get("/tasks"),
                api.get("/projects")
            ]);
            setTasks(taskRes.data.data);
            setProjects(projectRes.data.data);
        } catch (error) {
            console.error("Failed to fetch user data");
        } finally {
            setIsLoading(false);
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

    const getStatusColor = (status) => {
        switch (status) {
            case "Done": return "text-green-400 bg-green-400/10 border-green-400/20";
            case "In Progress": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
            default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
        }
    };

    if (isLoading) return <div className="text-white text-center mt-10">Loading Tasks...</div>;

    return (
        <div className="space-y-10">

            {/* My Tasks Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        My Tasks
                    </h2>
                    <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-600/30">
                        {tasks.length} Assigned
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.length === 0 ? (
                        <div className="col-span-full text-center py-20 bg-gray-800/50 rounded-2xl border border-gray-700 border-dashed">
                            <p className="text-gray-500 text-lg">No tasks assigned to you yet.</p>
                        </div>
                    ) : (
                        tasks.map((task) => (
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
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className="font-semibold text-gray-400">Project:</span>
                                        {task.project?.name || "Unknown Project"}
                                    </div>

                                    <div className="flex gap-2">
                                        {task.status !== 'Todo' && (
                                            <button
                                                onClick={() => handleStatusUpdate(task._id, "Todo")}
                                                className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-xs font-bold text-gray-300 transition-colors"
                                            >
                                                Todo
                                            </button>
                                        )}
                                        {task.status !== 'In Progress' && (
                                            <button
                                                onClick={() => handleStatusUpdate(task._id, "In Progress")}
                                                className="flex-1 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-xs font-bold text-blue-400 transition-colors"
                                            >
                                                Start
                                            </button>
                                        )}
                                        {task.status !== 'Done' && (
                                            <button
                                                onClick={() => handleStatusUpdate(task._id, "Done")}
                                                className="flex-1 py-2 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-xs font-bold text-green-400 transition-colors"
                                            >
                                                Done
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* My Projects Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                        Assigned Projects
                    </h2>
                    <span className="bg-emerald-600/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium border border-emerald-600/30">
                        {projects.length} Active
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <div key={project._id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-emerald-500/50 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <Briefcase className="text-emerald-400" size={24} />
                                <span className="text-xs text-gray-500">{new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-white">{project.name}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="font-semibold text-gray-400">Manager:</span>
                                    {project.manager?.name || "Unknown"}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <Folder size={14} />
                                    <span>Details</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && (
                        <div className="col-span-full text-center py-10 bg-gray-800/30 rounded-xl border border-gray-800">
                            <p className="text-gray-500">You are not assigned to any projects yet.</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default UserDashboard;
