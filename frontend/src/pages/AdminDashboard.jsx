import { useEffect, useState } from "react";
import api from "../api/api";
import { Trash2, Shield, Plus, Folder, UserPlus } from "lucide-react";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [showCreateUserModal, setShowCreateUserModal] = useState(false);
    const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "User" });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, projectsRes] = await Promise.all([
                api.get("/users"),
                api.get("/projects")
            ]);
            setUsers(usersRes.data.data);
            setProjects(projectsRes.data.data);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await api.delete(`/users/${id}`);
                setUsers(users.filter((user) => user._id !== id));
            } catch (error) {
                alert("Failed to delete user");
            }
        }
    };

    const handleRoleUpdate = async (id, currentRole) => {
        const newRole = prompt("Enter new role (Admin/Manager/User):", currentRole);
        if (newRole && ["Admin", "Manager", "User"].includes(newRole)) {
            try {
                const response = await api.put(`/users/${id}`, { role: newRole });
                setUsers(users.map((user) => (user._id === id ? response.data.data : user)));
            } catch (error) {
                alert("Failed to update role");
            }
        } else if (newRole) {
            alert("Invalid role. Must be 'Admin', 'Manager', or 'User'.");
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/users", newUser);
            setUsers([...users, res.data.data]);
            setShowCreateUserModal(false);
            setNewUser({ name: "", email: "", password: "", role: "User" });
            alert("User created successfully");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to create user");
        }
    };

    if (isLoading) return <div className="text-white text-center mt-10">Loading Admin Dashboard...</div>;

    return (
        <div className="space-y-10">
            {/* Users Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        User Management
                    </h2>
                    <div className="flex gap-4">
                        <span className="bg-blue-600/20 text-blue-400 px-3 py-2 rounded-lg text-sm font-medium border border-blue-600/30">
                            Total Users: {users.length}
                        </span>
                        <button
                            onClick={() => setShowCreateUserModal(true)}
                            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-green-500/20"
                        >
                            <UserPlus size={18} /> Create User
                        </button>
                    </div>
                </div>

                <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-700/50 text-gray-300 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">User</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Role</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-700/30 transition-colors">
                                    <td className="p-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                                            {user.name.charAt(0)}
                                        </div>
                                        <span className="font-medium">{user.name}</span>
                                    </td>
                                    <td className="p-4 text-gray-400">{user.email}</td>
                                    <td className="p-4">
                                        <span
                                            className={`px-2 py-1 rounded-md text-xs font-bold border ${user.role === "Admin"
                                                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                                                    : user.role === "Manager"
                                                        ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                                        : "bg-green-500/10 text-green-400 border-green-500/20"
                                                }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleRoleUpdate(user._id, user.role)}
                                            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                            title="Change Role"
                                        >
                                            <Shield size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user._id)}
                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Delete User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Projects Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        System Projects
                    </h2>
                    <span className="bg-purple-600/20 text-purple-400 px-3 py-2 rounded-lg text-sm font-medium border border-purple-600/30">
                        Total Projects: {projects.length}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <div key={project._id} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                            <div className="flex items-start justify-between mb-4">
                                <Folder className="text-purple-400" size={24} />
                                <span className="text-xs text-gray-500">{new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2">{project.name}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 border-t border-gray-700 pt-3">
                                <span className="font-semibold text-gray-400">Manager:</span>
                                {project.manager?.name || "Unknown"}
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && <p className="text-gray-500">No projects found.</p>}
                </div>
            </div>

            {/* Create User Modal */}
            {showCreateUserModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                        <h3 className="text-2xl font-bold mb-6">Create New User</h3>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="User">User</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateUserModal(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium"
                                >
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
