🌴 Vacation Management System

A fullstack web application for managing employee vacation requests.

⸻

🧩 Overview

This project provides a complete Vacation Management system built with modern technologies:
	•	Frontend: React (Vite)
	•	Backend: Express.js + Sequelize (TypeScript)
	•	Database: PostgreSQL
	•	Infrastructure: Docker & Docker Compose

It allows users to:
	•	Submit and track vacation requests
	•	Have requests validated or rejected by authorized managers
	•	Manage users and vacation data through a clean REST API

⸻

🏗️ Architecture

vacation-management/
│
├── client/               → React (Vite) frontend
├── server/               → Express + Sequelize backend
├── docker-compose.yml    → Container orchestration
└── README.md             → You are here

Services:

Service  | Description             | Port 
frontend | Vite development server | 5173
backend  | Express API server      | 4000
db       | PostgreSQL database     | 5432

⚙️ Tech Stack

Layer    | Technology
Frontend | React (Vite), TypeScript, Axios
Backend  | Node.js, Express.js, Sequelize ORM
Database | PostgreSQL
Runtime  | Docker Compose 
Language | TypeScript 

🚀 Quick Start (with Docker)

1. Clone the repository
git clone https://github.com/yourusername/vacation-management.git
cd vacation-management

2. Start all services
docker-compose up --build
This will:
	•	Spin up a PostgreSQL container
	•	Build and start the backend (server/)
	•	Build and start the frontend (client/)

3. Access the app
Frontend http://localhost:5173
Backend API http://localhost:4000/api
Database localhost:5432

📜 Environment Variables

The main environment variables are passed automatically by Docker:

Backend
DB_NAME=vacationdb
DB_USER=postgres
DB_PASS=postgres
DB_HOST=db
PORT=4000

Frontend
VITE_API_URL=http://localhost:4000/api

🧠 Development Notes

✅ Run locally without Docker

You can still run each service manually:
# Run backend
cd server
npm install
npm run dev

# Run frontend
cd client
npm install
npm run dev
Make sure PostgreSQL is running locally on port 5432.
