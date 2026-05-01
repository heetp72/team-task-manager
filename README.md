# Team Task Manager

Team Task Manager is a full-stack web app where users can sign up, log in, create projects, assign team tasks, and track progress. It supports Admin and Member roles.

## Features

- Authentication with signup, login, and JWT protected routes
- Admin and Member role-based access control
- Project creation, update, delete, and team member management
- Task creation, assignment, priority, due date, and status tracking
- Member view for assigned projects and tasks
- Dashboard with total tasks, pending, in-progress, overdue, and completion progress
- REST API with MongoDB relationships between users, projects, and tasks
- Responsive React frontend

## Screenshots

<img width="1920" height="1080" alt="Screenshot 626" src="https://github.com/user-attachments/assets/6e50ff31-8805-4455-bded-ccaa128a5063" />
<img width="1920" height="1080" alt="Screenshot 625" src="https://github.com/user-attachments/assets/52a43263-fc2a-4d4e-9bbf-dda008ae35ce" />
<img width="1920" height="1080" alt="Screenshot 624" src="https://github.com/user-attachments/assets/5bbf83f1-c198-4a64-87f8-b576e357d254" />
<img width="1920" height="1080" alt="Screenshot 623" src="https://github.com/user-attachments/assets/44a9a6e6-841f-4d5b-a675-af45fe57a781" />
<img width="1920" height="1080" alt="Screenshot 622" src="https://github.com/user-attachments/assets/0d160d4a-99e8-40ab-8f19-7ebf90ef9e5b" />
<img width="1920" height="1080" alt="Screenshot 621" src="https://github.com/user-attachments/assets/9ab7460f-b11f-4b01-a15f-578b60c1a8ee" />
<img width="1920" height="1080" alt="Screenshot 620" src="https://github.com/user-attachments/assets/13788bdb-c269-4b1e-a40e-f65cdf948180" />
<img width="1920" height="1080" alt="Screenshot 619" src="https://github.com/user-attachments/assets/439860ca-538e-4c97-8b38-181e3d7c499d" />
<img width="1920" height="1080" alt="Screenshot 618" src="https://github.com/user-attachments/assets/f451f288-6acd-47db-a151-5b834d15035f" />
<img width="1920" height="1080" alt="Screenshot 617" src="https://github.com/user-attachments/assets/972d5faa-6ee3-4290-830a-e73b31d92429" />

## Tech Stack

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Auth: JWT and bcryptjs
- Deployment: Railway

## Folder Structure

```txt
team-task-manager/
  backend/
  frontend/
  README.md
  README.txt
```

## Local Setup

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm start
```

Required backend `.env` values:

```txt
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
```

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Required frontend `.env` value:

```txt
VITE_API_URL=http://localhost:4000/api
```

## Demo Flow

1. Signup as Admin.
2. Signup as Member with a different email.
3. Login as Admin.
4. Create a project and select the Member.
5. Create a task and assign it to the Member.
6. Logout Admin.
7. Login as Member.
8. Check assigned project and task.
9. Update task status and view dashboard progress.

## API Endpoints

```txt
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
GET    /api/users
GET    /api/projects
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id
GET    /api/tasks
POST   /api/tasks
PATCH  /api/tasks/:id/status
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

## Railway Deployment

### Backend Service

Set root directory:

```txt
backend
```

Variables:

```txt
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=your_frontend_railway_url
```

Start command:

```bash
npm start
```

### Frontend Service

Set root directory:

```txt
frontend
```

Variable:

```txt
VITE_API_URL=your_backend_railway_url/api
```

Build command:

```bash
npm run build
```

Start command:

```bash
npm run preview -- --host 0.0.0.0 --port $PORT
```

After both services are deployed, update backend `CLIENT_URL` with the final frontend Railway URL and redeploy the backend.

## Submission Checklist

- Live Application URL
- GitHub Repository Link
- README.txt file
- 2 to 5 minute demo video
