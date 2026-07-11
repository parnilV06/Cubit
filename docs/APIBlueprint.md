# Cubit API Blueprint

This document defines the REST API contract for Cubit.

It serves as the source of truth for backend implementation and frontend integration.

Every endpoint defined here should follow the Backend Architecture document and use the database schema defined in `DatabaseDesign.md`.

---

# Base URL

Development

```
http://localhost:5000/api
```

Production

```
https://api.cubit.app/api
```

---

# Authentication

Authentication uses JWT.

Protected endpoints require

```
Authorization: Bearer <JWT_TOKEN>
```

---

# Response Format

## Success

```json
{
    "success": true,
    "message": "...",
    "data": {}
}
```

## Error

```json
{
    "success": false,
    "message": "...",
    "error": {}
}
```

---

# Authentication

Base Route

```
/api/auth
```

---

## Register

POST

```
/register
```

Creates a new account.

Request

```json
{
    "displayName": "",
    "username": "",
    "email": "",
    "password": ""
}
```

Response

```
201 Created
```

---

## Login

POST

```
/login
```

Request

```json
{
    "email": "",
    "password": ""
}
```

Returns

- JWT
- User

---

## Logout

POST

```
/logout
```

Invalidates current session (future implementation).

---

## Get Current User

GET

```
/me
```

Returns authenticated user's information.

Protected

✅

---

# Profile

Base Route

```
/api/profile
```

---

## Get Profile

GET

```
/:username
```

Returns

- displayName
- username
- avatarUrl
- bio
- createdAt
- totalPosts
- totalFriends
- totalSessions

Protected

❌

---

## Update Profile

PATCH

```
/
```

Fields

- displayName
- bio

Protected

✅

---

## Upload Avatar

POST

```
/avatar
```

Future implementation.

Protected

✅

---

# Sessions

Base Route

```
/api/sessions
```

---

## Get Sessions

GET

```
/
```

Returns all user sessions.

Protected

✅

---

GET
```
/current
```
Returns the user's currently active session.
If no active session exists, the backend automatically creates a new default session, marks it as active, and returns it.
---

## Create Session

POST

```
/
```

Request

```json
{
    "name": "",
    "puzzleType": "THREE_BY_THREE"
}
```
Creates a new session, automatically deactivates the previous active session (if one exists), and marks the new session as active.

Protected

✅

---

## Rename Session

PATCH

```
/:id
```

Protected

✅

---

## Archive Session

PATCH

```
/:id/archive
```

Sets

```
isArchived = true
```

Protected

✅

---

## Delete Session

DELETE

```
/:id
```

Deletes session and all solves.

Protected

✅

---

# Solves

Base Route

```
/api/solves
```

---

## Get Solves

GET

```
/session/:sessionId
```

Returns solves for a session.

Protected

✅

---

## Add Solve

POST

```
/
```

Request

```json
{
    "sessionId": "",
    "time": 5123,
    "scramble": "",
    "penalty": "NONE"
}
```

Protected

✅

---

## Update Solve

PATCH

```
/:id
```

Allows

- Penalty
- DNF
- Notes (future)

Protected

✅

---

## Delete Solve

DELETE

```
/:id
```

Protected

✅

---

# Statistics

Base Route

```
/api/stats
```

Statistics are **never stored**.

Every endpoint calculates statistics dynamically.

---

## Dashboard

GET

```
/dashboard
```

Returns the complete statistical data for the frontend dashboard in a single optimized payload.

### Response Schema

```json
{
    "success": true,
    "message": "Statistics fetched successfully.",
    "data": {
        "kpis": {
            "pb": "number | null",
            "ao5": "number | null",
            "ao12": "number | null",
            "mean": "number | null",
            "totalSolves": "number",
            "totalSessions": "number"
        },
        "solveTrend": [
            {
                "sessionId": "string",
                "sessionName": "string",
                "pb": "number | null",
                "mean": "number | null",
                "ao5": "number | null",
                "ao12": "number | null"
            }
        ],
        "timeDistribution": [
            {
                "range": "string",
                "count": "number"
            }
        ],
        "bestProgress": [
            {
                "sessionId": "string",
                "sessionName": "string",
                "bestTime": "number | null"
            }
        ],
        "recentSessions": [
            {
                "sessionId": "string",
                "sessionName": "string",
                "puzzleType": "string",
                "solveCount": "number",
                "best": "number | null",
                "average": "number | null",
                "createdAt": "date"
            }
        ]
    }
}
```

### Data Dictionary

- **kpis**: High-level key performance indicators calculated across all valid solves.
- **solveTrend**: Chronological metrics for every session. Contains PB, Mean, AO5, and AO12.
- **timeDistribution**: Counts of solves grouped into buckets (`<6`, `6-8`, `8-10`, `10-12`, `>12`, `DNF`).
- **bestProgress**: A timeline of the user's overall cumulative Personal Best improvement.
- **recentSessions**: Summary of the 5 most recently created sessions.

Protected

✅

---

# Trainer

Base Route

```
/api/trainer
```

---

## Get Lessons

GET

```
/lessons
```

Public

---

## Get Lesson

GET

```
/lessons/:slug
```

Public

---

## Complete Lesson

POST

```
/lessons/:id/complete
```

Protected

✅

---

## Get Progress

GET

```
/progress
```

Protected

✅

---

# Community

Base Route

```
/api/community
```

---

## Feed

GET

```
/posts
```

Query

```
feed=global

or

feed=friends
```

Optional Filters

- type
- page
- limit

Protected

✅

---

## Create Post

POST

```
/posts
```

Supports

- Discussion
- Tip
- Question
- PB Share
- Solve Share

Accepts `multipart/form-data`:

- `type` (required)
- `title` (optional)
- `content` (required)
- `solveId` (optional)
- `image` (optional file upload, max 5MB)

Protected

✅

---

## Get Single Post

GET

```
/posts/:id
```

Protected

✅

---

## Delete Post

DELETE

```
/posts/:id
```

Protected

✅

---

## Like Post

POST

```
/posts/:id/like
```

Protected

✅

---

## Unlike Post

DELETE

```
/posts/:id/like
```

Protected

✅

---

## Add Comment

POST

```
/posts/:id/comments
```

Protected

✅

---

## Delete Comment

DELETE

```
/comments/:id
```

Protected

✅

---

# Friends

Base Route

```
/api/friends
```

---

## Get Friends

GET

```
/
```

Protected

✅

---

## Get Friend Requests

GET

```
/requests
```

Returns:
- incoming: Pending requests where you are the receiver
- outgoing: Pending requests where you are the sender

Protected

✅

---

## Send Friend Request

POST

```
/request
```

Protected

✅

---

## Accept Request

PATCH

```
/request/:id/accept
```

Protected

✅

---

## Reject Request

PATCH

```
/request/:id/reject
```

Protected

✅

---

## Remove Friend

DELETE

```
/:id
```

Protected

✅

---

# Notifications

Base Route

```
/api/notifications
```

---

## Get Notifications

GET

```
/
```

Protected

✅

---

## Mark As Read

PATCH

```
/:id/read
```

Protected

✅

---

## Mark All As Read

PATCH

```
/read-all
```

Protected

✅

---

# Search (Future)

Base Route

```
/api/search
```

---

## Search Users

GET

```
/users
```

---

## Search Posts

GET

```
/posts
```

---

# Health

Base Route

```
/api
```

---

## Health Check

GET

```
/health
```

Returns

```
200 OK
```

Used by Railway/Vercel monitoring.

---

# API Development Order

Phase 1

- Health
- Auth
- Profile

Phase 2

- Sessions
- Solves

Phase 3

- Statistics

Phase 4

- Trainer

Phase 5

- Community

Phase 6

- Friends

Phase 7

- Notifications

---

# Guiding Principles

- Thin Controllers
- Business Logic in Services
- Prisma Access only inside Services
- JWT Authentication
- RESTful Routes
- Consistent Response Format
- Input Validation before Controllers
- Statistics calculated dynamically
- Pagination for community feeds
- Never expose password hashes
- Always authorize resource ownership