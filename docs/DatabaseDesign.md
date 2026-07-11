# Database Design

**Project:** Cubit
**Version:** 1.0
**Phase:** Backend Development

---

# Purpose

This document defines the database architecture, data relationships, and modeling principles for Cubit.

The database is designed around the following goals:

* Normalized data structure
* Clear ownership of data
* Minimal duplication
* Scalability
* Easy maintenance
* Efficient querying

This document serves as the reference before implementing the Prisma schema.

---

# Database Stack

Database

* PostgreSQL

ORM

* Prisma

---

# Database Philosophy

Cubit follows a **source of truth** philosophy.

Only fundamental data is stored.

Derived values such as:

* Personal Best (PB)
* AO5
* AO12
* Mean
* Statistics
* Charts

are **never stored** inside the database.

Instead, they are calculated from solve data whenever requested.

This prevents stale data and keeps the database normalized.

---

# Core Database Models

Cubit V1 consists of the following core entities.

```text
User
Session
Solve
Lesson
LessonProgress
Post
Comment
Friendship
Notification
```

---

# Entity Relationship Diagram

```text
                                  User
                                    │
     ┌──────────────┬───────────────┼──────────────┬───────────────┬────────────────┐
     │              │               │              │               │                │
 Session          Post        LessonProgress  Notification    Friendship      (Auth)
     │              │               │                              │
     │              │               │                              │
   Solve         Comment         Lesson                      User ↔ User
     │
     │
(Optional PB Share)
     │
     └──────────────────────────────► Post
```

---

# Model Breakdown

---

## User

Represents a registered Cubit user.

Stores:

* Account information
* Profile information
* Authentication identity

Relationships

```text
User

↓

Many Sessions

↓

Many Posts

↓

Many Comments

↓

Many Lesson Progress

↓

Many Notifications

↓

Many Friendships
```

---

## Session

Represents a single cubing practice session.

Example:

Morning Practice

↓

40 solves

Each session belongs to exactly one user.

A user may have multiple sessions.

Relationships

```text
User

↓

Session

↓

Many Solves
```

isActive

Purpose:
Indicates the user's currently active solving session.

Rules:

- Each user can have at most one active session.
- Creating a new session automatically deactivates the previous active session.
- Archived sessions cannot be active.

---

## Solve

Represents a single solve performed during a session.

Stores:

* Solve Time
* Scramble
* Penalty
* DNF
* Timestamp

A solve belongs to exactly one session.

Statistics are calculated from solves.

---

## Lesson

Represents static trainer metadata.
**Note:** PostgreSQL stores only lesson metadata. Actual lesson content lives as MDX files which support rich formatting including images, videos, callouts, and embedded React components.

Examples:

* Cube Basics
* Cube Notation
* White Cross
* First Layer

Lessons are independent of users.

---

## Lesson Progress

Tracks user learning progress.

Stores:

* Completed
* Completion Date

Creates a many-to-many relationship between:

User

↔

Lesson

---

## Post

Represents a community post.

Stores:

* Type
* Title
* Content
* Image URL (Optional)
* Timestamp

A post may be:

* Discussion
* Tip
* Question
* PB Share
* Solve Share

A post may optionally reference a solve.

```text
Solve

↓

(Optional)

↓

Post
```

---

## Comment

Represents replies to community posts.

Relationships

```text
Post

↓

Many Comments
```

Each comment belongs to:

* One post
* One user

---

## Friendship

Represents relationships between users.

Instead of storing a friend list inside User, Cubit stores friendship records.

Each friendship contains:

* Sender
* Receiver
* Status

Status may be:

* Pending
* Accepted
* Rejected
* Blocked

This approach naturally supports friend requests.

---

## Notification

Represents activity notifications.

Examples:

* Friend Request
* Friend Accepted
* Someone liked your PB
* Someone commented on your post

Each notification belongs to exactly one user.

---

# Database Relationships

| Parent  | Child          | Relationship               |
| ------- | -------------- | -------------------------- |
| User    | Session        | One → Many                 |
| Session | Solve          | One → Many                 |
| User    | Post           | One → Many                 |
| Post    | Comment        | One → Many                 |
| User    | Comment        | One → Many                 |
| User    | LessonProgress | One → Many                 |
| Lesson  | LessonProgress | One → Many                 |
| User    | Notification   | One → Many                 |
| User    | Friendship     | One → Many (Self Relation) |
| Solve   | Post           | Optional One → One         |

---

# Statistics Architecture

Cubit does **not** maintain a dedicated Statistics table.

Instead, statistics are derived dynamically from Solve records. The **Solve** is the single source of truth for all statistical calculations.

```text
User
↓
Sessions
↓
Solves
↓
Statistics Service
↓
API Response
```

Examples of calculated values:

* Personal Best
* AO5
* AO12
* Mean
* Time Distribution
* Solve Trends
* Progress

This ensures every statistic always reflects the latest data without risk of staleness or data duplication.

---

# Data Ownership

Each module owns its own data.

| Module     | Owns                        |
| ---------- | --------------------------- |
| Auth       | User Authentication         |
| Profile    | User Information            |
| Timer      | Sessions & Solves           |
| Statistics | Derived Analytics           |
| Trainer    | Lessons & Progress          |
| Community  | Posts & Comments            |
| Social     | Friendships & Notifications |

Modules should not directly modify another module's data unless explicitly required.

---

# Cascade Strategy

Deleting a User should remove:

* Sessions
* Solves
* Posts
* Comments
* Lesson Progress
* Notifications
* Friendships

Deleting a Session should remove:

* Solves

Deleting a Post should remove:

* Comments

Deleting a Lesson should preserve user history where possible.

---

# Indexing Strategy

Indexes should exist on frequently queried fields.

Examples:

User

* email
* username

Session

* userId
* createdAt

Solve

* sessionId
* createdAt

Post

* authorId
* createdAt

Comment

* postId

Friendship

* senderId
* receiverId

Notification

* userId
* read

---

# Database Phases

## Phase 3A — Core

Implement first:

* User
* Session
* Solve

These power:

* Authentication
* Timer
* Statistics

---

## Phase 3B — Learning

Implement:

* Lesson
* LessonProgress

---

## Phase 3C — Community

Implement:

* Post
* Comment
* Friendship
* Notification

---

# Design Principles

* Store raw data, not calculated data.
* Normalize relationships.
* Prefer references over duplication.
* Keep each model responsible for one domain.
* Use optional relationships only where they add flexibility.
* Build for maintainability before optimization.

