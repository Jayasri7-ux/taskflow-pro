import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "./features/auth/authSlice";

// Components
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import UserDashboard from "./pages/UserDashboard";
import Users from "./pages/Users";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";

function App() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route element={<PrivateRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={
                            user?.role === "Admin" ? <Navigate to="/admin" /> :
                                user?.role === "Manager" ? <Navigate to="/manager" /> :
                                    <Navigate to="/user" />
                        } />

                        {/* Admin Routes */}
                        <Route element={<PrivateRoute roles={["Admin"]} />}>
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/users" element={<Users />} />
                        </Route>

                        {/* General Management Routes (Admin & Manager) */}
                        <Route element={<PrivateRoute roles={["Admin", "Manager"]} />}>
                            <Route path="/manager" element={<ManagerDashboard />} />
                            <Route path="/projects" element={<Projects />} />
                        </Route>

                        {/* User Features (All roles can see their tasks) */}
                        <Route element={<PrivateRoute roles={["Admin", "Manager", "User"]} />}>
                            <Route path="/user" element={<UserDashboard />} />
                            <Route path="/tasks" element={<Tasks />} />
                        </Route>
                    </Route>
                </Route>

                <Route path="/unauthorized" element={<div className="min-h-screen flex items-center justify-center text-white text-2xl font-bold bg-gray-950">Unauthorized Access</div>} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
