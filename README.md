# TaskFlow-Pro – Role-Based Project & Task Management System

**Full Stack MERN Intern Assessment - Blackbucks**

TaskFlow-Pro is a production-ready Role-Based Project & Task Management System designed to streamline collaboration between Admins, Managers, and Users. It features secure authentication, role-based access control, and dynamic dashboards.

---

## 🚀 Recent Improvements & Fixes

This project underwent a comprehensive debugging and feature completion phase:

-   **Authentication Fix**: Resolved a critical "Invalid Credentials" bug where passwords were being double-hashed during save operations.
-   **Connectivity Fix**: Implemented a **Vite Proxy** and updated **CORS** configurations to resolve persistent "Network Errors" during local development.
-   **Feature Completion**: Replaced all "TBD" placeholders with fully functional pages:
    -   **Users Management**: Full CRUD for Admins.
    -   **Project Management**: Creation and oversight for Admins and Managers.
    -   **Task Management**: Global tracking for Managers/Admins and status updates for Users.
-   **Permission Logic**: Updated `App.jsx` and backend routes to ensure proper Role-Based Access Control (RBAC), specifically granting Admins access to project management.

---

## 🛠 Tech Stack

### Frontend
*   **React.js**: Powered by Vite for high-performance development.
*   **Redux Toolkit**: Centralized state management for Authentication and User Data.
*   **Tailwind CSS**: Modern, responsive design system.
*   **Lucide React**: Premium iconography.

### Backend
*   **Node.js & Express.js**: Scalable REST API architecture.
*   **MongoDB & Mongoose**: Flexible data modeling with secure schemas.
*   **Bcrypt.js**: Industry-standard password hashing.
*   **JWT (JSON Web Tokens)**: Secure, HTTP-only cookie-based authentication.

---

## 🔑 Demo Credentials

Use these seeded credentials to test the different role-based views:

| Role | Email | Password | Primary Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@taskflow.com` | `taskflow123` | Manage Users, Manage Projects, Manage Tasks |
| **Manager** | `manager@taskflow.com` | `manager123` | Create Projects, Assign Tasks |
| **User** | `user@taskflow.com` | `user123` | View My Tasks, Update Task Status |

---

## ⚙️ Start-to-End Setup Instructions

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local instance or Atlas URI)

### 2. Backend Configuration
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create/Configure .env file
# Ensure the following keys are present:
PORT=5050
MONGO_URI=mongodb://127.0.0.1:27017/taskflow-pro
JWT_SECRET=your_secret_key
NODE_ENV=development

# Seed the Database (Crucial for initial credentials)
node seed.js

# Start the Backend
npm run dev
```

### 3. Frontend Configuration
```bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Start the Frontend
npm run dev
```

The application will be accessible at `http://localhost:5173`. The Vite proxy will automatically route `/api` calls to the backend at `http://localhost:5050`.

---

## 📂 Project Structure
```
taskflow-pro/
├── backend/                # Node.js/Express API
│   ├── config/             # Database connection (db.js)
│   ├── controllers/        # Business logic (auth, project, task)
│   ├── middleware/         # Auth (protect/authorize) & Error handling
│   ├── models/             # Mongoose Schemas (User, Project, Task)
│   └── routes/             # API Endpoint definitions
└── frontend/               # Vite/React Client
    ├── src/
    │   ├── api/            # Axios instance with proxy config
    │   ├── components/     # Layout, Sidebar, Navbar, PrivateRoute
    │   ├── features/       # Redux Slices (authSlice)
    │   └── pages/          # Dedicated pages (Users, Projects, Tasks, Dashboards)
```

---

*This project was completed as part of the Full Stack MERN Intern Assessment for **Blackbucks**.*
