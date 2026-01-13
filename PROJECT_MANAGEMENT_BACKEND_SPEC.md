# 🏗️ Project Management Module - Master Backend Specification
**Version:** 1.0 (Phase 1: Kanban Focus)
**Target**: Backend Development Team

---

## 1. Executive Summary & Goal
We are building a **Jira-style Project Management System** integrated into our CRM.
Current Architecture: `1 Workspace = 1 Project` (Insufficient).
**New Architecture**: `Organization -> Workspace -> Projects -> Tasks`.

**Primary Goal for Phase 1**:
Enable teams to track work using **Projects** and **Kanban Boards**.
*Note: Scrum/Sprints are explicitly OUT OF SCOPE for Phase 1.*

---

## 2. The User Workflow (How it works)
*Backend Developer Note: Understand this flow to implement logic correctly.*

### Step 1: The Setup (Admin Level)
1.  **Workspace Creation**: An Admin creates a **Workspace** (e.g., "Engineering Team").
    *   *Backend Action*: Create `Workspace` record. Add members to it.
2.  **Project Creation**: Inside that Workspace, a Manager creates a **Project** (e.g., "CRM Revamp").
    *   *Backend Action*: Create `Project` record linked to `workspaceId`. Default type = "Kanban".

### Step 2: Task Management (The Core)
3.  **Creating Issues**: Users add **Tasks** (Issues) to the Project.
    *   *Backend Action*: Create `Task` linked to `projectId`. Status = "Todo".
4.  **The Kanban Board**: Users drag & drop tasks from "Todo" → "In Progress" → "Done".
    *   *Backend Action*: API updates `status` and `order` (for position) of the Task.

### Step 3: Accountability
5.  **Time Tracking**: A developer logs "2 hours" on a task.
    *   *Backend Action*: Create a `TimeLog` entry linked to the Task.

---

## 3. Data Hierarchy (The Tree)

```text
ORGANIZATION (Root)
 │
 ├── WORKSPACE (Container: "Marketing", "Dev")
 │    │
 │    ├── PROJECT 1 ("Website Redesign")
 │    │    │
 │    │    ├── TASK A ("Fix Header") --> has TimeLogs / Comments
 │    │    └── TASK B ("Write Content")
 │    │
 │    └── PROJECT 2 ("Mobile App")
 │         │
 │         └── TASK C ("Setup React Native")
```

---

## 4. Database Schema Design
*Implementation Guide: Use logical foreign keys and Indexes for performance.*

### A. Projects Collection (New)
*Stores the high-level goals.*

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | UUID/ObjectId | Unique Project ID |
| `name` | String | e.g. "CRM Frontend" (Required) |
| `key` | String | Short code e.g. "CRM" (For Task IDs: CRM-1, CRM-2) |
| `description` | String | Optional details |
| `workspaceId` | Ref(Workspace) | **INDEXED**. The parent folder. |
| `ownerId` | Ref(User) | Project Lead / Manager |
| `status` | Enum | `active` (Default), `archived`, `completed` |
| `settings` | Object | `{ columns: ["Todo", "Doing", "Done"] }` |
| `createdAt` | DateTime | |

### B. Tasks Collection (New)
*The most frequently accessed data. Needs optimization.*

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | UUID/ObjectId | Unique Task ID |
| `projectId` | Ref(Project) | **INDEXED**. Core parent link. |
| `workspaceId` | Ref(Workspace) | **INDEXED**. For fast global filtering. |
| `title` | String | Task summary. Required. |
| `description` | String | Rich text / HTML content. |
| `status` | String | "Todo", "In Progress", "Done" (Must match Status Config) |
| `priority` | Enum | `low`, `medium`, `high`, `urgent`. Default: `medium` |
| `type` | Enum | `task`, `bug`, `story`. Default: `task` |
| `assigneeId` | Ref(User) | Who is working on this? (Nullable) |
| `reporterId` | Ref(User) | Who created this? |
| `dueDate` | DateTime | Optional deadline. |
| `order` | Number | **INDEXED**. For Kanban Sorting (Drag & Drop position). |
| `tags` | Array[String] | e.g. ["Frontend", "UI"] |
| `createdAt` | DateTime | |

### C. TimeLogs Collection (New)
*History of work done.*

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | UUID/ObjectId | |
| `taskId` | Ref(Task) | Link to specific task |
| `userId` | Ref(User) | Who did the work |
| `duration` | Number | Minutes spent (e.g. 120 for 2 hours) |
| `date` | DateTime | When work happened |
| `note` | String | "Fixed the login bug" |

---

## 5. API Endpoints Specification (RESTful)

### Group 1: Project Management (The Dashboard)

**1. Create Project**
*   `POST /api/projects`
*   Payload: `{ name, description, workspaceId, key }`
*   Logic: Check if `key` is unique in workspace.

**2. Get Workspace Projects**
*   `GET /api/workspaces/:workspaceId/projects`
*   Response: List of projects with minimal stats (active task count).

**3. Get Project Details**
*   `GET /api/projects/:projectId`
*   Response: Full details including Board Column configuration.

### Group 2: Task Management (The Board)

**4. Create Task**
*   `POST /api/tasks`
*   Payload: `{ title, projectId, type, priority, assigneeId }`
*   Logic: Auto-generate ID based on Project Key (e.g. CRM-101).

**5. Get Project Tasks (The Board View)**
*   `GET /api/projects/:projectId/tasks`
*   Params: `?status=Todo` (Optional), `?assignee=me` (Optional)
*   Response: Array of tasks. **Crucial**: Clean response, don't send heavy HTML description in list view.

**6. Update Task (Drag & Drop)**
*   `PUT /api/tasks/:taskId`
*   Payload: `{ status: "Done", order: 5 }`
*   Logic: If status changes, update `updatedAt`.

**7. Get Single Task**
*   `GET /api/tasks/:taskId`
*   Response: Full details + TimeLogs + Comments.

### Group 3: Time Tracking

**8. Log Time**
*   `POST /api/tasks/:taskId/log-time`
*   Payload: `{ duration: 60, note: "Coding", date: "..." }`

---

## 6. Business Logic & Validation Rules (For Developer)

1.  **Isolation**: A user cannot see Projects/Tasks if they are not a member of the parent **Workspace**.
2.  **Deletion**:
    *   If a **Workspace** is deleted -> Delete all **Projects**.
    *   If a **Project** is deleted -> Delete all **Tasks**.
3.  **Kanban Logic**:
    *   Store `order` as a float or integer with gaps (lexorank style preferred but simple index works for MVP) to prevent massive re-indexing on every drop.
4.  **Task Keys**:
    *   Maintain a counter on Project model to generate readable IDs (e.g. `PROJECT-1`, `PROJECT-2`) instead of just random UUIDs for user friendliness.

---

## 7. Future Scope (Do Not Implement Yet)
*   **Sprints / Scrum**: Will be added in Phase 2.
*   **Epics**: Will be added later.
*   **Github Integration**: Future scope.

---
**End of Specification**
