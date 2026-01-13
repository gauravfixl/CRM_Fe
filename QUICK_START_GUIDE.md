# Project Management Module - Quick Start Guide

## 🚀 Getting Started

This guide will help you quickly understand and use the newly implemented Project Management features.

---

## 📍 Navigation

### Access Workspaces
```
/{orgName}/modules/workspaces
```

### Access Projects
```
/{orgName}/modules/workspaces/{workspaceId}/projects
```

### Access Board
```
/{orgName}/modules/workspaces/{workspaceId}/projects/{projectId}/board
```

---

## 🎯 Common Workflows

### 1. Create Your First Workspace

1. Navigate to **Workspaces** from the sidebar
2. Click **"Create Workspace"** button
3. Fill in:
   - Workspace Name (required)
   - Description (optional)
4. Click **"Create Workspace"**

**API Endpoint**: `POST /workspace/create`

---

### 2. Add Members to Workspace

1. Go to Workspace Details
2. Click on **"Members"** tab
3. Click **"Add Member"** button
4. Enter:
   - Member Email
   - Role (WorkspaceAdmin/Member/Viewer)
5. Click **"Add Member"**

**API Endpoint**: `POST /workspace/AddMember/{workspaceId}`

---

### 3. Create a Project

1. Open a Workspace
2. Navigate to **"Projects"** section
3. Click **"Create Project"**
4. Fill in:
   - Project Name (required)
   - Description (optional)
   - Visibility (Public/Private)
   - Template (optional)
5. Click **"Create Project"**

**API Endpoint**: `POST /project/create/{workspaceId}`

---

### 4. Set Up Your Board

1. Open a Project
2. Click **"Open Board"**
3. Add Columns:
   - Click **"Add Column"**
   - Enter column name (e.g., "To Do", "In Progress", "Done")
   - Click **"Add Column"**
4. Repeat for all needed columns

**API Endpoint**: `POST /board/{boardId}/add-column`

---

### 5. Create Tasks

1. On the Board view
2. Click **"Add Task"** in any column (or use column menu)
3. Fill in:
   - Task Name (required)
   - Description (optional)
   - Type (Task/Bug)
   - Priority (Low/Medium/High/Critical)
4. Click **"Create Task"**

**API Endpoint**: `POST /tasks/{projectId}/create`

---

### 6. Create a Team

1. Navigate to Teams section
2. Click **"Create Team"**
3. Fill in:
   - Team Name
   - Description
   - Select Workspace
   - Select Project
   - Enable Team Board (optional)
4. Click **"Create Team"**

**API Endpoint**: `POST /team/`

---

## 📊 View Analytics

### Workspace Analytics
```
/{orgName}/modules/workspaces/{id}/analytics
```

**Metrics Available**:
- Total Projects
- Total Members
- Active/Completed Tasks
- Workload Distribution
- Project-wise Task Distribution
- Teams Overview

---

### Project Analytics
```
/{orgName}/modules/workspaces/{workspaceId}/projects/{projectId}/analytics
```

**Metrics Available**:
- Total/Completed/Pending/Overdue Tasks
- Completion Rate
- Tasks per Member
- Tasks per Status
- Team Performance
- On-Time Delivery Rate

---

## 🔧 Management Operations

### Update Workspace/Project
1. Navigate to Details page
2. Click **"Settings"**
3. Update information
4. Click **"Save Changes"**

### Archive Project
1. Go to Project Settings
2. Scroll to **"Danger Zone"**
3. Click **"Archive"**
4. Confirm action

### Delete Workspace/Project
1. Go to Settings
2. Scroll to **"Danger Zone"**
3. Click **"Delete"**
4. Confirm deletion (⚠️ This is permanent!)

---

## 🎨 Board Management

### Add Column
- Click **"Add Column"** button
- Enter column name
- Submit

### Edit Column
- Click column menu (⋮)
- Select **"Edit Column"**
- Update details

### Delete Column
- Click column menu (⋮)
- Select **"Delete Column"**
- Confirm deletion

---

## 👥 Team Management

### Add Team Member
1. Open Team Details
2. Click **"Add Member"**
3. Select member from assignable list
4. Choose role
5. Submit

### Remove Team Member
1. Go to Team Members
2. Click member menu (⋮)
3. Select **"Remove Member"**
4. Confirm

### Change Member Role
1. Go to Team Members
2. Click member menu (⋮)
3. Select **"Change Role"**
4. Select new role
5. Submit

---

## 🔍 Search & Filter

### Workspaces
- Use search bar to filter by:
  - Workspace name
  - Description
  - Creator email

### Projects
- Filter by:
  - Project name
  - Description
  - Visibility (Public/Private)
  - Status (Active/Archived)

### Members
- Search by:
  - Email
  - Name
  - Role

---

## 📱 Responsive Features

All pages are fully responsive and work on:
- ✅ Desktop
- ✅ Tablet
- ✅ Mobile

---

## 🎯 Keyboard Shortcuts (Future Enhancement)

Planned shortcuts:
- `Ctrl/Cmd + K`: Quick search
- `N`: New task
- `C`: New column
- `Esc`: Close dialogs

---

## 🐛 Troubleshooting

### Issue: Can't see workspaces
**Solution**: Check if you have workspace access. Contact admin to add you as a member.

### Issue: Can't create project
**Solution**: Ensure you have workspace admin or member role.

### Issue: Tasks not showing on board
**Solution**: Refresh the page or check if tasks are in the correct column.

### Issue: 401 Errors
**Solution**: Your session may have expired. Please log in again.

---

## 📚 API Documentation Reference

All implemented endpoints follow the backend API documentation:

### Workspace Endpoints
- `POST /workspace/create`
- `GET /workspace/admin/all`
- `GET /workspace/my-workspace/all`
- `GET /workspace/{workspaceId}`
- `PATCH /workspace/update/{id}`
- `PATCH /workspace/delete/{id}`
- `GET /workspace/{workspaceId}/Analytics`
- `GET /workspace/member/{workspaceId}`
- `POST /workspace/AddMember/{workspaceId}`
- `PATCH /workspace/RemoveMember/{workspaceId}`

### Project Endpoints
- `POST /project/create/{workspaceId}`
- `GET /project/workspace/{workspaceId}/projects`
- `GET /project/workspace/{workspaceId}/my-projects`
- `GET /project/{projectId}/details`
- `PATCH /project/update/{projectId}`
- `DELETE /project/delete/{projectId}`
- `PATCH /project/archive/{projectId}`
- `GET /project/{projectId}/Analytics`

### Board Endpoints
- `POST /board/create`
- `GET /board/{projectId}/all`
- `GET /board/{boardId}`
- `DELETE /board/{boardId}/delete`
- `POST /board/{boardId}/add-column`
- `PATCH /board/{boardId}/update-column`
- `DELETE /board/{boardId}/delete-column`

### Task Endpoints
- `POST /tasks/{projectId}/create`
- `GET /tasks/{projectId}/all`
- `GET /tasks/{taskId}`
- `PATCH /tasks/project/{projectId}/{taskId}/update`
- `DELETE /tasks/project/{projectId}/{taskId}/delete`
- `GET /tasks/project/{projectId}/{taskId}/subtasks`
- `PATCH /tasks/project/{projectId}/{taskId}/re-order`
- `GET /tasks/{boardId}/by-board`

### Team Endpoints
- `POST /team/`
- `GET /team/`
- `GET /team/{teamId}/details`
- `GET /team/{workspaceId}/all`
- `GET /team/{projectId}/{teamId}/assignable/members`
- `POST /team/{teamId}/add-member`
- `GET /team/{teamId}/members`
- `DELETE /team/{teamId}/member/{memberId}`
- `PATCH /team/{teamId}/change-role`
- `PATCH /team/{teamId}/archive`
- `DELETE /team/{teamId}/delete`

---

## 💡 Best Practices

1. **Workspace Organization**
   - Create separate workspaces for different departments
   - Use descriptive names
   - Add relevant members only

2. **Project Management**
   - Use templates for consistency
   - Set appropriate visibility
   - Archive completed projects

3. **Board Setup**
   - Keep columns simple (3-5 columns)
   - Use consistent naming
   - Order columns logically

4. **Task Management**
   - Write clear task names
   - Set appropriate priorities
   - Assign tasks to specific members
   - Use due dates

5. **Team Collaboration**
   - Create teams for specific features
   - Assign appropriate roles
   - Use team boards for focused work

---

## 🎓 Training Resources

### For Admins
1. Workspace setup and configuration
2. Member management
3. Analytics interpretation
4. Permission management

### For Project Managers
1. Project creation and setup
2. Board configuration
3. Task management
4. Team coordination

### For Team Members
1. Task updates
2. Board navigation
3. Collaboration features
4. Status reporting

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review the Implementation Summary
3. Contact your system administrator
4. Check backend API documentation

---

**Last Updated**: January 11, 2026
**Version**: 1.0.0
