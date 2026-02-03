import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate("/login");
    };

    return (
        <nav className="bg-gray-800 border-b border-gray-700 h-16 flex items-center justify-between px-6">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                TaskFlow-Pro
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <User size={20} className="text-blue-400" />
                    <span className="font-medium">{user?.name}</span>
                    <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300">
                        {user?.role}
                    </span>
                </div>
                <button
                    onClick={onLogout}
                    className="p-2 hover:bg-gray-700 rounded-full transition-colors text-red-400"
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
