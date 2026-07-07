# Backend Architecture

**Project:** Cubit
**Version:** 1.0
**Phase:** Backend Development

---

# Purpose

This document defines the architecture, responsibilities, and development conventions for Cubit's backend.

The goal is to keep the backend:

* Modular
* Predictable
* Easy to maintain
* Easy to scale
* Consistent across all modules

Every endpoint implemented in Cubit should follow the architecture defined in this document.

---

# Tech Stack

## Runtime

* Node.js

## Framework

* Express.js

## Database

* PostgreSQL

## ORM

* Prisma

## Authentication

* JWT
* bcrypt

## Validation

* Zod

---

# Project Structure

```plaintext
server/

src/

│
├── config/
│   ├── database.js
│   ├── env.js
│   └── logger.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── profile.controller.js
│   ├── timer.controller.js
│   ├── stats.controller.js
│   ├── trainer.controller.js
│   └── community.controller.js
│
├── services/
│   ├── auth.service.js
│   ├── profile.service.js
│   ├── timer.service.js
│   ├── stats.service.js
│   ├── trainer.service.js
│   └── community.service.js
│
├── routes/
│   ├── auth.routes.js
│   ├── profile.routes.js
│   ├── timer.routes.js
│   ├── stats.routes.js
│   ├── trainer.routes.js
│   └── community.routes.js
│
├── middlewares/
│   ├── auth.middleware.js
│   ├── validate.middleware.js
│   ├── error.middleware.js
│   └── notFound.middleware.js
│
├── utils/
│   ├── response.js
│   ├── pagination.js
│   └── statistics.js
│
├── prisma/
│
├── app.js
└── server.js
```

---

# Request Lifecycle

Every request follows the same flow.

```text
Client

↓

Route

↓

Middleware

↓

Controller

↓

Service

↓

Prisma

↓

PostgreSQL

↓

JSON Response
```

Business logic should **never** bypass this flow.

---

# Layer Responsibilities

## Routes

Routes define API endpoints.

Responsibilities:

* Register endpoints
* Attach middleware
* Forward request to controller

Routes should never:

* Query the database
* Perform calculations
* Return business logic

Example

```text
POST /auth/login

↓

loginController
```

---

## Controllers

Controllers coordinate requests.

Responsibilities:

* Read request body
* Read params
* Read query parameters
* Call the appropriate service
* Return HTTP response

Controllers should remain lightweight.

Controllers should never contain:

* Database queries
* Business logic
* Statistics calculations

---

## Services

Services contain the application's business logic.

Responsibilities include:

* Authentication
* Statistics calculations
* Session management
* Community operations
* Profile updates
* Trainer progress

Services communicate with Prisma and return processed data to controllers.

---

## Prisma

Prisma is the only layer allowed to directly interact with PostgreSQL.

Responsibilities:

* CRUD operations
* Database transactions
* Query optimization

Prisma should never:

* Access Express request objects
* Generate HTTP responses

---

# Middleware

Middleware handles cross-cutting concerns.

Examples:

* JWT Authentication
* Request Validation
* Global Error Handling
* 404 Handling
* Logging

Middleware should never contain feature-specific business logic.

---

# Utility Functions

Utilities provide reusable helper functions.

Examples:

* Standard API responses
* Pagination helpers
* Statistics calculations
* Date formatting

Utilities should remain stateless and reusable.

---

# API Modules

The backend is divided into independent modules.

## Authentication

Responsible for:

* Register
* Login
* JWT
* Password hashing
* Current user

---

## Profile

Responsible for:

* Profile information
* Avatar
* Preferences
* Public profile

---

## Timer

Responsible for:

* Sessions
* Solves
* Scramble history
* Session management

---

## Statistics

Responsible for:

* PB
* AO5
* AO12
* Mean
* Session trends
* Time distribution
* Analytics

Statistics are derived from solve data.

No statistics are permanently stored.

---

## Trainer

Responsible for:

* Lessons
* Progress
* Completed lessons
* Learning path

---

## Community

Responsible for:

* Posts
* Personal Best shares
* Comments
* Likes
* Friend system
* Leaderboards

---

# API Design Principles

All endpoints should follow REST conventions.

Examples:

```text
GET    /profile

PATCH  /profile

GET    /sessions

POST   /sessions

DELETE /sessions/:id

GET    /stats

GET    /community/posts

POST   /community/posts
```

Avoid verbs in endpoint names.

Prefer resources over actions.

---

# Response Format

Successful responses should follow a consistent structure.

```json
{
    "success": true,
    "message": "Session created successfully.",
    "data": {}
}
```

Error responses:

```json
{
    "success": false,
    "message": "Invalid credentials."
}
```

This format should remain consistent across the application.

---

# Error Handling

Controllers should never manually catch and format every error.

Instead:

```
Service throws error

↓

Error Middleware

↓

Consistent JSON response
```

This keeps controllers clean and consistent.

---

# Authentication Flow

Protected endpoints should follow this flow.

```
Client Request

↓

Authorization Header

↓

JWT Middleware

↓

Verify Token

↓

Attach User to Request

↓

Controller

↓

Service
```

Services should trust the authenticated user provided by the middleware instead of decoding JWTs themselves.

---

# Statistics Philosophy

Cubit treats statistics as **derived data**, not stored data.

The source of truth is always:

```
Session

↓

Solve

↓

Statistics
```

Metrics such as:

* Personal Best
* AO5
* AO12
* Mean
* Time Distribution
* Session Trends

are calculated when requested instead of being stored separately.

This prevents stale data and keeps the database normalized.

---

# Development Principles

* Keep controllers thin.
* Keep services focused.
* One responsibility per file.
* Never duplicate business logic.
* Prefer composition over duplication.
* Keep naming consistent.
* Write reusable functions whenever possible.

---

# Long-Term Goal

The backend should remain modular enough that new features can be added without modifying existing modules.

The architecture should scale from Cubit v1 to future versions while remaining easy to understand for contributors.
