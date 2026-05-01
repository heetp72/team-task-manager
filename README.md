Team Task Manager - Full-Stack Assignment

Overview
Team Task Manager is a full-stack web app where users can sign up, log in, create projects, assign team tasks, and track progress. It supports Admin and Member roles.

Key features
- Authentication: signup, login, JWT protected routes
- Role-based access control: Admin can create projects and tasks; Members can view and update assigned tasks
- Project and team management: create projects and add members
- Task management: create tasks, assign members, set priority, due date, and status
- Dashboard: total tasks, pending, in-progress, overdue, completion percentage, upcoming tasks
- REST APIs with MongoDB relationships between Users, Projects, and Tasks
- Responsive interactive frontend built with React and Vite

Tech stack
- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- Deployment target: Railway

Folder structure
- frontend: React client
- backend: Express API server

Local setup
1. Backend
   cd backend
   npm install
   copy .env.example .env
   Add MONGODB_URI and JWT_SECRET in .env
   npm run dev

2. Frontend
   cd frontend
   npm install
   copy .env.example .env
   Set VITE_API_URL=http://localhost:4000/api
   npm run dev

Demo roles
- Choose Admin during signup to create projects and assign tasks.
- Choose Member during signup to view assigned tasks and update status.

Important API endpoints
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- GET /api/users
- GET /api/projects
- POST /api/projects
- PUT /api/projects/:id
- DELETE /api/projects/:id
- GET /api/tasks
- POST /api/tasks
- PATCH /api/tasks/:id/status
- PUT /api/tasks/:id
- DELETE /api/tasks/:id

Railway deployment
Backend service:
1. Create a new Railway project.
2. Add a MongoDB database service or use MongoDB Atlas.
3. Deploy the backend folder as a Railway service.
4. Add environment variables:
   PORT=4000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_long_random_secret
   CLIENT_URL=your_frontend_url
5. Start command: npm start

Frontend service:
1. Add another Railway service from the frontend folder.
2. Add environment variable:
   VITE_API_URL=your_backend_url/api
3. Build command: npm run build
4. Start command: npm run preview -- --host 0.0.0.0 --port $PORT

Submission checklist
- Live Application URL: add your Railway frontend URL
- GitHub Repository Link: add your repository URL
- README file: upload this README.txt
- Demo video: record 2-5 minutes showing signup/login, admin project creation, task assignment, dashboard stats, member status update, and overdue/progress tracking
