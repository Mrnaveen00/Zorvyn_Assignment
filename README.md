# Finance Data Processing and Access Control Backend

A backend assignment project for an organization-level finance dashboard with role-based access control, financial record management, and summary analytics.

## Live Links

- Frontend Demo: `https://zorvyn-frontend-q8so.onrender.com`
- Backend API Health: `https://zorvyn-backend-7ixs.onrender.com/api/health`
- Backend Swagger Docs: `https://zorvyn-backend-7ixs.onrender.com/api/docs/`

## Deployment Summary

- Frontend hosted on Render Static Site
- Backend hosted on Render Web Service
- PostgreSQL hosted on Render Postgres

Note:

- Database connection URLs are intentionally not included in this README because they contain credentials and should remain private.

## Project Structure

```text
Zorvyn_ASG/
  backend/   # Express + TypeScript + Prisma + PostgreSQL
  frontend/  # React + Vite dashboard consuming the backend APIs
```

## Assumptions

This project is implemented as a shared company finance dashboard, not a personal expense tracker.

- Financial records belong to the organization, not to individual users.
- `Admin` users manage finance records and users.
- `Analyst` users can read and filter financial records and access dashboard insights.
- `Viewer` users can access dashboard summary endpoints only.
- `createdById` and `updatedById` are stored for auditability, but they do not imply record ownership.

## Tech Stack

- Backend: Node.js, TypeScript, Express, PostgreSQL, Prisma ORM, JWT, Zod
- Frontend: React, Vite, React Router, Recharts

## Tech Stack And Purpose

### Backend

- `Node.js`: runtime for the backend application
- `TypeScript`: stronger type safety and clearer maintainability
- `Express`: routing, middleware, and API handling
- `Prisma ORM`: schema definition, database access, and migrations
- `PostgreSQL`: persistent relational database for users and financial records
- `JWT`: stateless authentication for protected API access
- `Zod`: request validation for safer input handling

### Frontend

- `React`: component-based frontend for the dashboard UI
- `Vite`: fast frontend development server and production build tool
- `React Router`: role-aware navigation between login, dashboard, records, and users pages
- `Recharts`: dashboard charts for trends and category summaries

### Documentation And API Testing

- `Swagger UI / OpenAPI`: interactive API documentation
- `Postman Collection`: quick API testing and evaluator walkthrough

## Role Model

### Viewer

- Can access dashboard summary APIs
- Cannot access record management APIs
- Cannot manage users

### Analyst

- Can access dashboard summary APIs
- Can list and view financial records
- Can filter records
- Cannot create, update, or delete records
- Cannot manage users

### Admin

- Full dashboard access
- Full financial record CRUD access
- Full user management access

## Features Implemented

- JWT-based login
- Current-user endpoint
- Role-based route protection
- User management with role and status control
- Financial record CRUD
- Record filtering and pagination
- Dashboard summary and analytics APIs
- Frontend dashboard for evaluator walkthrough
- Input validation and centralized error handling
- Prisma migrations and seed data

## Setup Instructions

### 1. Prerequisites

- Node.js 22+
- npm
- PostgreSQL running locally

### 2. Configure Environment

Go to [`.env.example`](C:\Users\Naveen\Desktop\Zorvyn_ASG\backend\.env.example) and copy the values into `backend/.env`.

Example:

```env
DATABASE_URL="postgresql://postgres:1234@localhost:5432/finance_dashboard?schema=public"
PORT=4000
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="1d"
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Run Database Migration

```bash
npm run prisma:migrate -- --name init
```

### 5. Seed the Database

```bash
npm run prisma:seed
```

### 6. Start the Backend

Development:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

### 7. Start the Frontend

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Then run:

```bash
cd frontend
npm install
npm run dev
```

### 8. Health Check

```http
GET /api/health
```

Example:

```bash
curl http://localhost:4000/api/health
```

## Sample Credentials

These are seeded automatically by [seed.ts](C:\Users\Naveen\Desktop\Zorvyn_ASG\backend\prisma\seed.ts):

- Admin: `admin@companyx.com` / `Admin@123`
- Analyst: `analyst@companyx.com` / `Analyst@123`
- Viewer: `viewer@companyx.com` / `Viewer@123`

These same accounts can be used in the frontend login page.

## API Endpoint List

Base URL:

```text
http://localhost:4000/api
```

Interactive API docs:

```text
http://localhost:4000/api/docs/
```

Postman collection:

- [Finance-Dashboard.postman_collection.json](C:\Users\Naveen\Desktop\Zorvyn_ASG\backend\docs\Finance-Dashboard.postman_collection.json)

### Simple API List With Use Case

#### Auth APIs

- `backend/api/auth/login` or `POST /api/auth/login`
  - Use case: log in with email and password and receive a JWT token
- `backend/api/auth/me` or `GET /api/auth/me`
  - Use case: fetch the currently logged-in user details from the token

#### User Management APIs

Admin only.

- `backend/api/users` or `POST /api/users`
  - Use case: create a new system user and assign role/status
- `backend/api/users` or `GET /api/users`
  - Use case: list all users for admin management
- `backend/api/users/:id` or `GET /api/users/:id`
  - Use case: fetch one user’s details
- `backend/api/users/:id` or `PATCH /api/users/:id`
  - Use case: update user name, role, or status
- `backend/api/users/:id/status` or `PATCH /api/users/:id/status`
  - Use case: activate or deactivate a user
- `backend/api/users/:id` or `DELETE /api/users/:id`
  - Use case: delete a user when allowed by business rules

#### Financial Record APIs

Admin and Analyst can read. Only Admin can write.

- `backend/api/records` or `GET /api/records`
  - Use case: list financial records with filters and pagination
- `backend/api/records/:id` or `GET /api/records/:id`
  - Use case: view one financial record in detail
- `backend/api/records` or `POST /api/records`
  - Use case: create a new income or expense record
- `backend/api/records/:id` or `PATCH /api/records/:id`
  - Use case: update an existing financial record
- `backend/api/records/:id` or `DELETE /api/records/:id`
  - Use case: delete a financial record

Supported query params for `GET /api/records`:

- `type`
  - Use case: filter records by `INCOME` or `EXPENSE`
- `category`
  - Use case: filter records by category
- `startDate`
  - Use case: filter records from a start date
- `endDate`
  - Use case: filter records up to an end date
- `search`
  - Use case: search inside category or notes
- `page`
  - Use case: paginate the record list
- `limit`
  - Use case: control how many records are returned per page

#### Dashboard APIs

Accessible to Viewer, Analyst, and Admin.

- `backend/api/dashboard/summary` or `GET /api/dashboard/summary`
  - Use case: fetch top-level metrics like total income, expenses, net balance, and record count
- `backend/api/dashboard/category-breakdown` or `GET /api/dashboard/category-breakdown`
  - Use case: fetch grouped totals by category and type
- `backend/api/dashboard/recent-activity` or `GET /api/dashboard/recent-activity`
  - Use case: fetch latest finance entries for dashboard activity view
- `backend/api/dashboard/trends` or `GET /api/dashboard/trends`
  - Use case: fetch monthly or weekly trend data for charts

Supported query params for dashboard APIs:

- `startDate`
  - Use case: filter dashboard analytics from a start date
- `endDate`
  - Use case: filter dashboard analytics up to an end date
- `limit`
  - Use case: control the number of recent activity records returned
- `granularity=monthly|weekly`
  - Use case: choose trend grouping for the trends API

## Example Request Flow

### Login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "admin@companyx.com",
  "password": "Admin@123"
}
```

### Use Token

```http
Authorization: Bearer <jwt-token>
```

### Create Record as Admin

```http
POST /api/records
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

```json
{
  "amount": 9999.5,
  "type": "EXPENSE",
  "category": "Travel",
  "recordDate": "2026-04-03",
  "notes": "Client visit travel booking"
}
```

### Get Dashboard Summary

```http
GET /api/dashboard/summary
Authorization: Bearer <jwt-token>
```

## Backend Architecture

Inside [backend/src](C:\Users\Naveen\Desktop\Zorvyn_ASG\backend\src):

- `config/`: environment and Prisma client setup
- `middleware/`: auth, role checks, validation, error handling
- `modules/auth/`: login and current-user logic
- `modules/users/`: user management
- `modules/records/`: financial record CRUD and filtering
- `modules/dashboard/`: summary and analytics
- `routes/`: API route registration
- `utils/`: shared utilities like async handler and API error

## Frontend Overview

Inside [frontend/src](C:\Users\Naveen\Desktop\Zorvyn_ASG\frontend\src):

- `api/`: backend request helpers
- `auth/`: auth context and local storage session handling
- `components/`: shell, protected route, reusable cards
- `pages/`: login, dashboard, records, and users
- `styles.css`: app-wide styling

## Database Design

Main entities:

### User

- `id`
- `name`
- `email`
- `passwordHash`
- `role`
- `status`
- `createdAt`
- `updatedAt`

### FinancialRecord

- `id`
- `amount`
- `type`
- `category`
- `recordDate`
- `notes`
- `createdById`
- `updatedById`
- `createdAt`
- `updatedAt`

The schema is defined in [schema.prisma](C:\Users\Naveen\Desktop\Zorvyn_ASG\backend\prisma\schema.prisma).

## Validation and Error Handling

- Request validation is handled with Zod
- Centralized error middleware returns structured JSON errors
- Invalid credentials return `401`
- Forbidden actions return `403`
- Missing resources return `404`
- Duplicate or invalid operations return `400` or `409` where appropriate

## Tradeoffs

- JWT auth is implemented without refresh tokens to keep the assignment focused.
- The frontend is intentionally lightweight and built to demonstrate backend functionality clearly rather than maximize UI complexity.
- The system uses organization-level shared records to keep the permission model clear and aligned with the assignment.
- Soft delete, rate limiting, and automated tests are not yet added, but the structure supports them cleanly.

## Useful Commands

From [backend](C:\Users\Naveen\Desktop\Zorvyn_ASG\backend):

```bash
npm run dev
npm run build
npm start
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run prisma:studio
```

From [frontend](C:\Users\Naveen\Desktop\Zorvyn_ASG\frontend):

```bash
npm run dev
npm run build
npm run preview
```

## Current Status

Implemented and verified:

- authentication
- role-based access control
- user management
- financial record CRUD and filtering
- dashboard summary APIs
- PostgreSQL persistence
- Prisma migration and seed flow
- Swagger/OpenAPI documentation
- Postman collection
- role-aware frontend dashboard
