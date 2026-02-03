# TaskFlow – Role-Based Project & Task Management System

**Full Stack MERN Intern Assessment 

TaskFlow is a production-ready Role-Based Project & Task Management System designed to streamline collaboration between Admins, Managers, and Users. It features secure authentication, role-based access control, and dynamic dashboards.

## 🚀 Live Demo
**[Insert Your Deployed Link Here]**

---

## 🛠 Tech Stack

### Frontend
*   **React.js**: specialized with Vite for performance.
*   **Redux Toolkit**: Global state management (Authentication & User Data).
*   **Tailwind CSS**: Modern, responsive styling.
*   **React Router**: Role-based navigation and protected routes.

### Backend
*   **Node.js & Express.js**: RESTful API architecture.
*   **MongoDB**: NoSQL database for flexible data modeling.
*   **JWT (JSON Web Tokens)**: Secure, HTTP-only cookie-based authentication.

---

## ✨ Key Features

### 1. Authentication & Authorization
*   **Secure Login**: Email & Password authentication using Bcrypt & JWT.
*   **Role-Based Access**: Strict separation of concerns (Admin, Manager, User).
*   **Protected Routes**: Middleware ensures users only access authorized resources.

### 2. Role-Based Dashboards

#### 🛡 Admin Dashboard
*   **User Management**: View all users, Delete users, and Update roles (Promote/Demote).
*   **System Overview**: View all projects across the organization.
*   **User Creation**: Manually onboard new users.

#### 💼 Manager Dashboard
*   **Project Lifecycle**: Create, Edit, and Delete projects.
*   **Task Management**: Create tasks within projects and assign them to team members.
*   **Team Oversight**: View project members and progress.

#### 👤 User Dashboard
*   **Task Tracking**: View assigned tasks with Priority and Deadlines.
*   **Status Updates**: Move tasks from "Todo" → "In Progress" → "Done".
*   **Project Visibility**: View details of projects they are part of.

---

## ⚙️ Local Setup Instructions

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas URI)

### 1. Clone the Repository
```bash
git clone <repository_url>
cd taskflow-pro
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "PORT=5050" > .env
echo "MONGO_URI=mongodb://127.0.0.1:27017/taskflow-pro" >> .env
echo "JWT_SECRET=your_super_secret_key" >> .env
echo "NODE_ENV=development" >> .env

# Seed Database (Creates default Admin/Manager/User)
node seed.js

# Start Server
npm run dev
```
*Backend runs on `http://localhost:5050`*

### 3. Frontend Setup
```bash
cd ../frontend-pro
npm install

# Start React App
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🔑 Demo Credentials (Role-Based)

Use these credentials to test the different roles:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@taskflow.com` | `taskflow123` | Manage Users, View All Projects |
| **Manager** | `manager@taskflow.com` | `manager123` | Manage Projects, Assign Tasks |
| **User** | `user@taskflow.com` | `user123` | View Tasks, Update Status |

---

## 📂 Project Structure
```
taskflow-pro/
├── backend/                # Node.js/Express API
│   ├── config/             # DB Connection
│   ├── controllers/        # Route Logic
│   ├── middleware/         # Auth & Error Handling
│   ├── models/             # Mongoose Schemas (User, Project, Task)
│   └── routes/             # API Routes
└── frontend-pro/           # React Client
    ├── src/
    │   ├── api/            # Axios Setup
    │   ├── app/            # Redux Store
    │   ├── components/     # Reusable UI (Navbar, Sidebar)
    │   ├── features/       # Redux Slices (Auth)
    │   └── pages/          # Dashboards (Admin, Manager, User)
```

---

*This project was built as part of the Full Stack MERN Intern Assessment.*
