export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  avatarUrl?: string
  role: "admin" | "member" | "viewer"
}

export interface Workspace {
  id: string
  _id?: string
  name: string
  description?: string
  avatar?: string
  createdAt: Date | string
  updatedAt: Date | string
  members: WorkspaceMember[]
  projects: Project[]
}

export interface WorkspaceMember {
  id: string
  userId: string
  workspaceId: string
  role: "admin" | "member" | "viewer"
  joinedAt: Date
  user: User
}

export interface Project {
  id: string
  _id?: string
  name: string
  key: string
  description?: string
  avatar?: string
  workspaceId: string
  leadId: string
  createdAt: Date | string
  updatedAt: Date | string
  members: ProjectMember[]
  boards: Board[]
}

export interface ProjectMember {
  id: string
  userId: string
  projectId: string
  role: "admin" | "member" | "viewer"
  joinedAt: Date
  user: User
}

export interface Board {
  id: string
  name: string
  type: "kanban" | "scrum"
  projectId: string
  columns: BoardColumn[]
  createdAt: Date | string
  updatedAt: Date | string
}

export interface BoardColumn {
  id: string
  name: string
  boardId: string
  position: number
  tasks: Task[]
}

export interface Task {
  id: string
  _id?: string
  title: string
  description?: string
  status: string
  priority: "lowest" | "low" | "medium" | "high" | "highest"
  type: "story" | "task" | "bug" | "epic"
  assigneeId?: string
  reporterId: string
  projectId: string
  boardId: string
  columnId: string
  position: number
  createdAt: Date | string
  updatedAt: Date | string
  assignee?: User
  reporter: User
}

export interface Team {
  id: string
  _id: string
  name: string
  description?: string
  workspaceId: string
  projectId?: string
  leadId?: string
  members: any[]
  createdAt?: Date | string
  updatedAt?: Date | string
}

export interface TeamMember {
  id: string
  userId: string
  teamId: string
  role: "lead" | "member"
  joinedAt: Date
  user: User
}
