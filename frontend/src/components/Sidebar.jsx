import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { LayoutDashboard, Users, Briefcase, ListTodo } from "lucide-react";

const Sidebar = () => {
    const { user } = useSelector((state) => state.auth);
    const location = useLocation();

    const menuItems = [
        {
            title: "Dashboard",
            path: "/",
            icon: <LayoutDashboard size={20} />,
            roles: ["Admin", "Manager", "User"],
        },
        {
            title: "Users",
            path: "/admin/users",
            icon: <Users size={20} />,
            roles: ["Admin"],
        },
        {
            title: "Projects",
            path: "/projects",
            icon: <Briefcase size={20} />,
            roles: ["Admin", "Manager"],
        },
        {
            title: "My Tasks",
            path: "/tasks",
            icon: <ListTodo size={20} />,
            roles: ["Admin", "Manager", "User"],
        },
    ];

    const filteredMenu = menuItems.filter((item) => item.roles.includes(user?.role));

    return (
        <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col pt-6">
            <div className="px-6 mb-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
                Main Menu
            </div>
            <div className="flex-1 px-3 space-y-1">
                {filteredMenu.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${location.pathname === item.path
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                            : "text-gray-400 hover:bg-gray-700 hover:text-white"
                            }`}
                    >
                        {item.icon}
                        <span className="font-medium">{item.title}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
