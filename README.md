# 🌴 Vacation Management System

A fullstack web application for managing employee vacation requests.

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Quick Start](#quick-start)
4. [Getting Started](#getting-started)
5. [Usage Guide](#usage-guide)
6. [Architecture](#architecture)
7. [API Documentation](#api-documentation)
8. [Development](#development)
9. [Testing](#testing)
10. [Technical Decisions](#technical-decisions)
11. [Known Limitations](#known-limitations)
12. [Future Enhancements](#future-enhancements)
13. [Troubleshooting](#troubleshooting)
14. [Project Structure](#project-structure)

---

## 🧩 Overview

This project provides a complete Vacation Management system built with modern technologies:

- **Frontend**: React (Vite) with TypeScript
- **Backend**: Express.js + Sequelize (TypeScript)
- **Database**: PostgreSQL
- **Infrastructure**: Docker & Docker Compose

## ✨ Features

### Core Functionality
- ✍️ **Submit Vacation Requests**: Employees can create vacation requests with start/end dates and reasons
- 👁️ **Track Requests**: View all your vacation requests with their current status
- ✅ **Approve/Reject**: Authorized validators can approve or reject requests with comments
- 📊 **Dashboard Views**: Separate interfaces for requesters and validators
- 📄 **Pagination**: Efficient handling of large request lists

### User Roles
- **Requester**: Submit and track vacation requests
- **Validator**: View all requests, approve/reject with optional comments

### Technical Features
- 🔄 **Automatic Seeding**: Database automatically populated with test users
- 🎨 **Modern UI**: Clean, responsive interface
- 🔒 **Input Validation**: Comprehensive validation on both client and server
- 📝 **Audit Trail**: Timestamp tracking for all requests
- 🧪 **Test Coverage**: 13+ passing tests

---

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vacation-management.git
   cd vacation-management
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:4000/api

4. **Login**
   - Select **Alice** (Requester) to see employee view
   - Select **Bob** (Validator) to see manager view
   - No password required (simplified for demo purposes)

That's it! The application is ready to use.

---

## 🎓 Getting Started

### Installation Options

#### Option 1: Docker (Recommended)
```bash
docker-compose up --build
```

#### Option 2: Local Development
Requires: Node.js, PostgreSQL

**Backend Setup**:
```bash
cd server
npm install
npm run dev
```

**Frontend Setup**:
```bash
cd client
npm install
npm run dev
```

**Note**: Make sure PostgreSQL is running locally on port 5432.

### Database Seeding

The database automatically seeds with test users on startup:
- **Alice** - Requester (Employee)
- **Bob** - Validator (Manager)

To manually run seeding:
```bash
cd server
npm run seed
```

### Environment Variables

**Backend** (auto-configured in Docker):
```env
DB_NAME=vacationdb
DB_USER=postgres
DB_PASS=postgres
DB_HOST=db
PORT=4000
```

**Frontend**:
```env
VITE_API_URL=http://localhost:4000/api
```

---

## 📱 Usage Guide

### As a Requester (Employee)

1. **Login**: Select "Alice" from the login page
2. **Create Request**: Click "New Request" and fill in:
   - Start date
   - End date
   - Reason for vacation
3. **View Status**: See all your requests with their current status (Pending, Approved, Rejected)
4. **Track History**: View comments from validators if your request was reviewed

### As a Validator (Manager)

1. **Login**: Select "Bob" from the login page
2. **View Requests**: See all vacation requests from all employees
3. **Filter**: Filter by status (Pending, Approved, Rejected)
4. **Take Action**: Approve or reject requests with optional comments

---

## 🏗️ Architecture

### System Overview

```
vacation-management/
│
├── client/               → React (Vite) frontend
├── server/               → Express + Sequelize backend
├── docker-compose.yml    → Container orchestration
└── README.md             → This file
```

### Services

| Service | Description | Port |
|---------|-------------|------|
| **Frontend** | Vite development server | 5173 |
| **Backend** | Express API server | 4000 |
| **Database** | PostgreSQL database | 5432 |

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React (Vite), TypeScript, Axios |
| **Backend** | Node.js, Express.js, Sequelize ORM |
| **Database** | PostgreSQL |
| **Runtime** | Docker Compose |
| **Language** | TypeScript |

---

## 🔌 API Documentation

### Base URL
```
http://localhost:4000/api
```

### Vacation Requests

#### Create Vacation Request
```http
POST /api/vacations
Content-Type: application/json

{
  "user_id": 1,
  "start_date": "2025-12-01",
  "end_date": "2025-12-05",
  "reason": "Family vacation"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "start_date": "2025-12-01",
    "end_date": "2025-12-05",
    "reason": "Family vacation",
    "status": "Pending",
    "comments": null,
    "created_at": "2024-10-26T..."
  }
}
```

#### Get My Vacation Requests
```http
GET /api/vacations/me?userId=1
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "user_id": 1,
    "start_date": "2025-12-01",
    "end_date": "2025-12-05",
    "reason": "Family vacation",
    "status": "Pending",
    "comments": null,
    "created_at": "2024-10-26T..."
  }
]
```

#### Get All Vacation Requests (Validators)
```http
GET /api/vacations?page=1&limit=10&status=Pending
```

**Response** (200 OK):
```json
{
  "vacations": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

#### Update Vacation Request Status
```http
PATCH /api/vacations/:id
Content-Type: application/json

{
  "status": "Approved",
  "validatorId": 2,
  "comments": "Enjoy your vacation!"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Vacation request updated successfully"
}
```

### Users

#### Get All Users
```http
GET /api/users
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Alice",
    "role": "Requester"
  },
  {
    "id": 2,
    "name": "Bob",
    "role": "Validator"
  }
]
```

---

## 💻 Development

### Running Locally

You can run each service independently without Docker:

**Backend**:
```bash
cd server
npm install
npm run dev
```

**Frontend**:
```bash
cd client
npm install
npm run dev
```

### Development Workflow

1. Make changes to code
2. Restart services to see changes
3. Check logs for debugging information
4. Run tests to ensure functionality

### Database Management

**Reset Database**:
```bash
docker-compose down -v
docker-compose up --build
```

**View Database**:
Connect to PostgreSQL at `localhost:5432` with credentials from docker-compose.yml

---

## 🧪 Testing

### Running Tests

```bash
cd server
npm test
```

### Test Coverage

```bash
npm run test:coverage
```

### Test Suite

The project includes **13 passing tests** covering:
- ✅ CRUD operations
- ✅ Validation and error handling
- ✅ Business logic (date overlap, permissions)
- ✅ Request status updates

**Note**: Tests are configured to NOT delete your development data. Only test users and vacation requests are cleaned up after tests.

---

## 🔍 Technical Decisions

### Frontend Architecture

#### React with TypeScript
- **Why**: Type safety, better IDE support, self-documenting code
- **Benefits**: Compile-time error checking, improved developer experience

#### Vite as Build Tool
- **Why**: Faster builds, better HMR (Hot Module Replacement)
- **Benefits**: Optimized production builds, instant startup

#### Context API for State Management
- **Why**: Simpler for this application size
- **Benefits**: No additional dependencies, sufficient for centralized state

#### Axios for HTTP
- **Why**: Interceptors for global error handling, automatic JSON parsing
- **Benefits**: Request/response transformation, better error handling

### Backend Architecture

#### Express.js with TypeScript
- **Why**: Minimal, flexible, mature ecosystem
- **Benefits**: Excellent middleware support, large community

#### Sequelize ORM
- **Why**: TypeScript support, migrations, model relationships
- **Benefits**: Validation at model level, database agnostic

#### PostgreSQL
- **Why**: ACID compliance, robust, excellent for relational data
- **Benefits**: Scalability, reliability, advanced features

#### RESTful API Design
- **Why**: Standard, predictable, stateless
- **Benefits**: Cacheable responses, clear conventions

### Security & Validation

#### Input Validation
- **Implementation**: express-validator + custom middleware
- **Why**: Prevent invalid data, clear error messages

#### Error Handling
- **Implementation**: Centralized error handler middleware
- **Why**: DRY principle, consistent API responses

### Testing

#### Jest for Testing
- **Why**: Built-in mocking, async support, coverage reports
- **Benefits**: Fast feedback, high confidence in deployments

---

## 🚨 Known Limitations

### Functionality Limitations

1. **No Authentication System**
   - User login is simulated via user selection
   - No password protection or JWT tokens
   - **Impact**: Not suitable for production without adding authentication
   - **Rationale**: Kept simple intentionally to focus on core features

2. **No Calendar Integration**
   - No visualization of vacation calendar
   - No conflict detection UI
   - **Impact**: Validators can't see vacation distribution at a glance

3. **Single Validator Approval**
   - No multi-level approval workflow
   - **Impact**: No delegation or tiered approval process

### Technical Limitations

1. **No Rate Limiting**
   - **Impact**: Vulnerable to DoS attacks in production

2. **No CORS Configuration for Production**
   - CORS allows all origins (development setting)
   - **Impact**: Security risk if deployed without proper configuration

3. **No Database Migrations**
   - Uses Sequelize sync (not recommended for production)
   - **Impact**: Data loss risk in schema changes

4. **No Logging System**
   - Console.log only
   - **Impact**: Difficult to debug production issues

5. **No Caching**
   - No Redis or caching layer
   - **Impact**: Performance degradation with scale

---

## 🎯 Future Enhancements

### Planned Improvements
- [ ] Add JWT authentication
- [ ] Implement email notifications
- [ ] Add calendar visualization
- [ ] Implement multi-level approval workflow
- [ ] Add vacation balance tracking
- [ ] Implement rate limiting
- [ ] Add proper logging system (Winston, Pino)
- [ ] Add caching layer (Redis)
- [ ] Implement database migrations
- [ ] Add comprehensive API documentation (Swagger)
- [ ] Add end-to-end tests (Playwright, Cypress)

---

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart database
docker-compose restart db

# Check database logs
docker-compose logs db
```

#### Frontend Not Connecting to Backend
```bash
# Verify backend is running on port 4000
curl http://localhost:4000/api/users

# Check CORS configuration in server/src/index.ts
```

#### Tests Failing
```bash
# Clear node_modules and reinstall
cd server
rm -rf node_modules
npm install

# Run tests with verbose output
npm test -- --verbose
```

#### Docker Issues
```bash
# Rebuild containers
docker-compose down
docker-compose up --build

# Remove all containers and volumes
docker-compose down -v
```

---

## 📦 Project Structure

```
vacation-management/
├── client/
│   ├── src/
│   │   ├── api/              # Axios configuration
│   │   ├── components/        # React components
│   │   ├── context/           # React Context providers
│   │   ├── pages/             # Page components
│   │   ├── types/             # TypeScript definitions
│   │   └── main.tsx           # Entry point
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Express middleware
│   │   ├── models/            # Sequelize models
│   │   ├── routes/            # Route definitions
│   │   ├── __tests__/        # Test suite
│   │   ├── index.ts           # Entry point
│   │   └── seed.ts            # Database seeding
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## 📝 License

ISC

---

## 👤 Author

Jacob Elbaz

Built as a technical assessment project for web development intern recruitment.
