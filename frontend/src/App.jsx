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
                            <Route path="/admin/users" element={<div>User Management (TBD)</div>} />
                        </Route>

                        {/* Manager Routes */}
                        <Route element={<PrivateRoute roles={["Manager"]} />}>
                            <Route path="/manager" element={<ManagerDashboard />} />
                            <Route path="/projects" element={<div>Project Management (TBD)</div>} />
                        </Route>

                        {/* User Routes */}
                        <Route element={<PrivateRoute roles={["User"]} />}>
                            <Route path="/user" element={<UserDashboard />} />
                            <Route path="/tasks" element={<div>My Tasks (TBD)</div>} />
                        </Route>
                    </Route>
                </Route>

                <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
