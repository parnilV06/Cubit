# Cubit Integration Audit Report

**Project:** Cubit  
**Version:** 1.0  
**Phase:** Technical Audit & Gaps Assessment

This report identifies the architectural, protocol, and data representation mismatches between Cubit's frontend mock interface and its backend implementation. It provides an engineering inventory of gaps that must be resolved to achieve full integration.

---

## 1. Executive Summary

During the frontend integration audit, the server implementation and client-side shell were analyzed side-by-side. The backend is fully implemented with strict Prisma schemas and REST endpoints. The frontend is a visually complete, static React application relying entirely on mock state and local calculations.

Three major areas require translation logic:
1. **Time Storage Mismatches**: The backend stores solve times in integer milliseconds, while the frontend expects decimal seconds.
2. **Chart/Grid Contract Discrepancies**: The keys returned by the dashboard API mismatch the properties expected by the Recharts data structures.
3. **Relationship Paradigm Mismatch**: The backend operates on double-sided, mutual friendships, while the frontend UI features an asymmetrical followers/following paradigm.

---

## 2. Detailed Technical Gaps

### 2.1. Solve Time Format Mismatch
* **Backend Source of Truth**: The database schema (`schema.prisma` -> `Solve` model) declares the `time` field as an `Int`. The controller/service handles it as milliseconds (e.g., `11420` represents `11.42s`).
* **Frontend Expectation**: The UI components (`timerDashboard.jsx`, `statsBar.jsx`, `statsDashboard.jsx`) calculate and display float seconds as strings (e.g. `"11.42s"`).
* **Gap Solution**: Write an utility mapper that divides backend milliseconds by `1000` to show decimal seconds in views, and multiplies input fields/timer durations by `1000` before shipping POST payloads.

### 2.2. Stats Dashboard Chart Schemas
The backend unified statistics payload (`GET /api/stats/dashboard`) exposes structure schemas that mismatch the mock data formats:

* **Solve Trend Chart**:
  * *Backend Schema*: `{ sessionId, sessionName, pb, mean, ao5, ao12 }`
  * *Mock Expected*: `{ session: "S1", pb: 10.09, mean: 8.65, ao5: 10.09, ao12: 11.31 }`
  * *Mismatch*: X-axis coordinates key differs. Map `sessionName` to `session` or update Recharts `<XAxis dataKey="sessionName" />`.
* **Time Distribution Chart**:
  * *Backend Schema*: `{ range, count }`
  * *Mock Expected*: `{ name: "<6s", value: 12 }`
  * *Mismatch*: Key names differ. The client must map `range` -> `name` and `count` -> `value` before feeding the Pie chart.
* **Best Time Progress Chart**:
  * *Backend Schema*: `{ sessionId, sessionName, bestTime }`
  * *Mock Expected*: `{ date: "07/10", bestTime: 5.85 }`
  * *Mismatch*: The backend tracks progress by session creation order rather than calendar dates. The frontend must map `bestTime` to seconds (dividing by `1000`) and adjust the X-axis key to `sessionName`.
* **Recent Sessions Grid**:
  * *Backend Schema*: `{ sessionId, sessionName, puzzleType, solveCount, best, average }`
  * *Mock Expected*: `{ name: "Session 1", best: "5.85s", ao5: "8.65s", ao12: "11.31s", mean: "8.65s", date: "07/15/2026" }`
  * *Mismatch*: The backend does not calculate `ao5` or `ao12` averages for individual historical sessions in the dashboard endpoint. The client must either leave these columns blank/dashes or fetch historical solves separately to compute them.

### 2.3. Asymmetrical Followers vs. Mutual Friends
* **Frontend UI**: Renders profiles displaying separate "Followers" and "Following" counters, opening modal listings of other users.
* **Backend Database**: Exclusively implements a mutual `Friendship` request entity (`PENDING` or `ACCEPTED` requests). No following/follower concept exists.
* **Gap Solution**: Map "Followers" counts to `totalFriends`. Replace follower modals with a simplified "Friends List" populated from `GET /api/friends`.

### 2.4. Profile Updates & Fields
* **Frontend UI**: The Profile Edit modal allows inputs for Display Name, Username, Biography, Profile Picture URL (text input), Email Address, and Default Puzzle.
* **Backend DB**: The profile route `PATCH /api/profile` accepts *only* `displayName` and `bio`. Avatar updates require a binary file upload via `POST /api/profile/avatar` to Cloudinary. Email addresses and default puzzle selections are not stored as modifiable User metadata.
* **Gap Solution**: Refactor the profile editor to send plain text inputs to the patch endpoint and separate avatar updates into a multipart file upload. Remove the email and default puzzle options from this specific editor form.

### 2.5. Community Post Types
* **Frontend UI**: The community tab allows categories: `All`, `Tips`, `Random`, `Discussions`, `News`, `Solves`.
* **Backend DB**: Post types are defined by the enum `PostType` (`DISCUSSION`, `TIP`, `QUESTION`, `PB_SHARE`, `SOLVE_SHARE`).
* **Gap Solution**: Map UI category dropdowns to backend enum values during posts querying and creation.

---

## 3. Inventory of Mock Data Locations

The following files contain hardcoded data that must be deleted or replaced during integration:

1. **`client/src/components/layout/statsBar.jsx`**:
   * Contains a hardcoded `dummySolves` array containing 25 solves.
   * Holds static metrics: PB (`"5:04"`), Mean (`"8:65"`), AO12 (`"11:31"`), AO5 (`"10:09"`).
2. **`client/src/components/pages/statsDashboard.jsx`**:
   * Imports `dummySolveTrend`, `dummyTimeDistribution`, `dummyBestProgress`, and `dummyRecentSessions` from `client/src/mock/statsData.js`.
3. **`client/src/components/pages/community.jsx`**:
   * Contains static arrays for `dummyPosts`, `dummyNotifications`, `dummyComments`, and `leaderboardUsers`.
4. **`client/src/components/pages/profile.jsx`**:
   * Holds hardcoded arrays `userPosts`, `followersList`, and `followingList`.
5. **`client/src/components/pages/trainer.jsx`**:
   * Contains a static list of lessons grouped under Beginner, Intermediate, and Advanced categories.

---

## 4. Integration Resolution Status

All gaps identified in this audit have been successfully resolved:

1. **Solve Time Format Mismatch**: Fully integrated within the Zustand store (`store.js`). Time inputs are automatically scaled to milliseconds for backend storage and mapped back to decimal seconds for display.
2. **Stats Dashboard Chart Schemas**: Wired Recharts coordinates to backend dashboard structures in `statsDashboard.jsx`, correcting key references and scaling times for distribution curves, PB progress lists, and trend charts.
3. **Mutual Friendship Paradigm**: Migrated followers widgets to mutual friendships (`friendAPI`). Integrated popover action sheets in `community.jsx` and modals in `profile.jsx` to list friends, delete connections, and manage pending requests.
4. **Profile Updates**: Configured bio and display name PATCH requests in `profile.jsx`, with avatar image change driven by a binary multipart form upload.
5. **Trainer Module**: Created dynamic categorized dashboards in `trainer.jsx` and a Markdown renderer in `lesson.jsx` that formats mdx files and registers completion state hooks.
6. **Real-Time Notification Popovers**: Hooked client Socket.io listeners to backend notifications, automatically appending pushes to the community activity feed.
