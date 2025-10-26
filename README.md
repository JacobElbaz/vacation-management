# 🌴 Vacation Management System

A fullstack web application for managing employee vacation requests.

---

## 🧩 Overview

This project provides a complete Vacation Management system built with modern technologies:

- **Frontend**: React (Vite) with TypeScript
- **Backend**: Express.js + Sequelize (TypeScript)
- **Database**: PostgreSQL
- **Infrastructure**: Docker & Docker Compose

It allows users to:

- Submit and track vacation requests
- Have requests validated or rejected by authorized managers
- Manage users and vacation data through a clean REST API

---

## 🏗️ Architecture

```
vacation-management/
│
├── client/               → React (Vite) frontend
├── server/               → Express + Sequelize backend
├── docker-compose.yml    → Container orchestration
└── README.md             → This file
```

### Services

Service  | Description             | Port 
frontend | Vite development server | 5173
backend  | Express API server      | 4000
db       | PostgreSQL database     | 5432

## ⚙️ Tech Stack

Layer    | Technology
Frontend | React (Vite), TypeScript, Axios
Backend  | Node.js, Express.js, Sequelize ORM
Database | PostgreSQL
Runtime  | Docker Compose 
Language | TypeScript 

## 🚀 Quick Start (with Docker)

1. Clone the repository
```bash
git clone https://github.com/yourusername/vacation-management.git
cd vacation-management
```

2. Start all services
```bash
docker-compose up --build
```
This will:
- Spin up a PostgreSQL container
- Build and start the backend (server/)
- Build and start the frontend (client/)

3. Access the app
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000/api
- **Database**: localhost:5432

## 📜 Environment Variables

The main environment variables are passed automatically by Docker:

**Backend**:
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

## 🧠 Development Notes

### ✅ Run locally without Docker

You can still run each service manually:

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

> **Note**: Make sure PostgreSQL is running locally on port 5432.

---

## 📋 Technical Choices

### Frontend Architecture

#### React with TypeScript
- **Choice**: React with TypeScript for type safety and modern component patterns
- **Rationale**: TypeScript provides compile-time error checking, better IDE support, and self-documenting code

#### Vite as Build Tool
- **Choice**: Vite instead of Create React App
- **Rationale**: Faster development builds, better HMR (Hot Module Replacement), and optimized production builds

#### Context API for State Management
- **Choice**: React Context API instead of Redux/Zustand
- **Rationale**: Simpler for this application size, avoids additional dependencies, sufficient for centralized state

#### Axios for HTTP
- **Choice**: Axios for API calls
- **Rationale**: Interceptors for global error handling, request/response transformation, automatic JSON parsing

### Backend Architecture

#### Express.js with TypeScript
- **Choice**: Express.js as web framework
- **Rationale**: Minimal, flexible, mature ecosystem, excellent middleware support

#### Sequelize ORM
- **Choice**: Sequelize for database operations
- **Rationale**: TypeScript support, migrations, model relationships, validation at model level

#### PostgreSQL
- **Choice**: PostgreSQL as relational database
- **Rationale**: ACID compliance, robust, excellent for relational data, scalability

#### RESTful API Design
- **Choice**: RESTful endpoints with proper HTTP verbs
- **Rationale**: Standard, predictable, stateless, cacheable responses

### Database Design

#### User Roles
- Enum-based role system (Requester/Validator)
- **Rationale**: Simple, clear separation of concerns

#### Vacation Request Schema
- Status field with ENUM (Pending, Approved, Rejected)
- Created_at timestamp for audit trail
- Comments field for rejection feedback
- **Rationale**: Complete audit trail, flexible status workflow

### Security & Validation

#### Input Validation
- express-validator for request validation
- Custom validation middleware
- **Rationale**: Prevent invalid data from reaching controllers, clear error messages

#### Error Handling
- Centralized error handler middleware
- Consistent error response format
- **Rationale**: DRY principle, consistent API responses

### Testing

#### Jest for Testing
- **Choice**: Jest as testing framework
- **Rationale**: Built-in mocking, async support, snapshot testing, coverage reports

#### Test Strategy
- Unit tests for controllers
- Integration tests for API endpoints
- **Rationale**: Fast feedback, high confidence in deployments

---

## 🚨 Known Limitations

### Functionality Limitations

1. **No Authentication System**
   - User login is simulated via user selection
   - No password protection or JWT tokens
   - **Impact**: Not suitable for production without adding authentication

2. **No Email Notifications**
   - No email alerts for request status changes
   - **Impact**: Manual checking required for request updates

3. **No Calendar Integration**
   - No visualization of vacation calendar
   - No conflict detection UI
   - **Impact**: Validators can't see vacation distribution at a glance

4. **Single Validator Approval**
   - No multi-level approval workflow
   - Single validator approves/rejects all requests
   - **Impact**: No delegation or tiered approval process

5. **No Vacation Balance Tracking**
   - No automatic calculation of remaining vacation days
   - **Impact**: Validators must manually check vacation balance

### Technical Limitations

1. **No Rate Limiting**
   - API has no rate limiting protection
   - **Impact**: Vulnerable to DoS attacks in production

2. **No CORS Configuration for Production**
   - CORS allows all origins (development setting)
   - **Impact**: Security risk if deployed without proper CORS configuration

3. **No Database Migrations**
   - Uses Sequelize sync (not recommended for production)
   - **Impact**: Data loss risk in schema changes

4. **No Logging System**
   - No centralized logging (console.log only)
   - **Impact**: Difficult to debug production issues

5. **No Caching**
   - No Redis or caching layer
   - **Impact**: Performance degradation with scale

---

## 🔌 API Documentation

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

## 🧪 Testing

### Run Tests
```bash
cd server
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

### Test Suite
- ✅ 13 passing tests
- ✅ Tests for CRUD operations
- ✅ Tests for validation and error handling
- ✅ Tests for business logic (date overlap, permissions)

**Note**: Tests are configured to NOT delete your development data. Only test users and vacation requests are cleaned up after tests.

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
│   │   ├── components/       # React components
│   │   ├── context/          # React Context providers
│   │   ├── pages/            # Page components
│   │   ├── types/            # TypeScript definitions
│   │   └── main.tsx          # Entry point
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── controllers/      # Request handlers
│   │   ├── middleware/       # Express middleware
│   │   ├── models/           # Sequelize models
│   │   ├── routes/           # Route definitions
│   │   ├── __tests__/        # Test suite
│   │   ├── index.ts          # Entry point
│   │   └── seed.ts           # Database seeding
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## 🎯 Future Enhancements

### Potential Improvements
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

## 📝 License

ISC

---

## 👤 Author
Jacob Elbaz

Built as a technical assessment project for web development intern recruitment.
