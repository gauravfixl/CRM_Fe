/**
 * Refactor Summary:
 * - Organized code into logical sections (Types, Initial State, Reducer, Provider)
 * - Improved type definitions and added consistency
 * - Cleaned up reducer logic and improved readability
 * - Preserved existing state structure, mock data, and functionality
 * - Defined 'AppTeamMember' for better type safety in Team interface
 */

"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"

// --- Types ---

export interface Workspace {
  id: string
  name: string
  description: string
  createdAt: string
  members: Array<{
    id: string
    name: string
    role: "admin" | "member" | "viewer"
  }>
  isDeleted?: boolean
}

export interface Project {
  id: string
  workspaceId: string
  name: string
  description: string
  template: string
  status: "active" | "archived" | "completed"
  visibility: "public" | "private"
  createdAt: string
  members: string[]
  isDeleted?: boolean
}

export interface Task {
  id: string
  projectId: string
  boardId?: string
  columnId?: string
  title: string
  description: string
  status: string
  priority: "low" | "medium" | "high"
  assignee?: string
  labels: string[]
  dueDate?: string
  comments: number
  attachments: number
  position?: number
  createdAt: string
  timeEstimate?: string
  timeSpent?: string
}

export interface AppTeamMember {
  id: string
  name: string
  email: string
  avatar: string | null
  role: string
}

export interface Team {
  id: string
  projectId: string
  name: string
  description?: string
  members: string[] | AppTeamMember[] // Typed union explicitly
  createdAt: string | Date
  isDeleted?: boolean
  // Fields from mock data
  project?: {
    id: string
    name: string
    template: string
  }
  availableMembers?: AppTeamMember[] // Typed available members
}

export interface Board {
  id: string
  projectId: string
  name: string
  type: "kanban" | "scrum" | "bug-tracking" | "todo"
  isDefault: boolean
  teamId: string | null
  createdAt: string
}

export interface Column {
  id: string
  boardId: string
  name: string
  position: number
  color: string
}

export interface AppState {
  workspaces: Workspace[]
  projects: Project[]
  tasks: Task[]
  teams: Team[]
  boards: Board[]
  columns: Column[]
  currentWorkspace: string | null
  currentProject: string | null
  currentBoard: string | null
  currentModule: string | null
  viewMode: "grid" | "table"
}

// --- Actions ---

export type AppAction =
  | { type: "SET_CURRENT_WORKSPACE"; payload: string }
  | { type: "SET_CURRENT_PROJECT"; payload: string }
  | { type: "SET_CURRENT_BOARD"; payload: string }
  | { type: "SET_VIEW_MODE"; payload: "grid" | "table" }
  | { type: "SET_CURRENT_MODULE"; payload: string }
  | { type: "CREATE_WORKSPACE"; payload: Workspace }
  | { type: "UPDATE_WORKSPACE"; payload: { id: string; updates: Partial<Workspace> } }
  | { type: "SOFT_DELETE_WORKSPACE"; payload: string }
  | { type: "CREATE_PROJECT"; payload: Project }
  | { type: "UPDATE_PROJECT"; payload: { id: string; updates: Partial<Project> } }
  | { type: "SOFT_DELETE_PROJECT"; payload: string }
  | { type: "CREATE_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: { id: string; updates: Partial<Task> } }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "MOVE_TASK"; payload: { taskId: string; columnId: string; position: number } }
  | { type: "CREATE_TEAM"; payload: Team }
  | { type: "UPDATE_TEAM"; payload: { id: string; updates: Partial<Team> } }
  | { type: "SOFT_DELETE_TEAM"; payload: string }
  | { type: "ADD_TEAM_MEMBER"; payload: { teamId: string; memberId: string } }
  | { type: "REMOVE_TEAM_MEMBER"; payload: { teamId: string; memberId: string } }
  | { type: "UPDATE_TEAM_MEMBERS"; payload: { teamId: string; members: string[] } }
  | { type: "CREATE_BOARD"; payload: Board }
  | { type: "UPDATE_BOARD"; payload: { id: string; updates: Partial<Board> } }
  | { type: "DELETE_BOARD"; payload: string }
  | { type: "CREATE_COLUMN"; payload: Column }
  | { type: "UPDATE_COLUMN"; payload: { id: string; updates: Partial<Column> } }
  | { type: "DELETE_COLUMN"; payload: string }

// --- Initial State ---

const initialState: AppState = {
  workspaces: [
    {
      id: "ws-1",
      name: "Acme Corporation",
      description: "Main company workspace",
      createdAt: "2024-01-01T00:00:00Z",
      members: [
        { id: "user-1", name: "John Doe", role: "admin" },
        { id: "user-2", name: "Alice Johnson", role: "member" },
        { id: "user-3", name: "Bob Smith", role: "member" },
        { id: "user-4", name: "Carol Davis", role: "viewer" },
      ],
    } as Workspace,
    {
      id: "ws-2",
      name: "Design Team",
      description: "Creative projects and design work",
      createdAt: "2024-01-15T00:00:00Z",
      members: [
        { id: "user-1", name: "John Doe", role: "admin" },
        { id: "user-2", name: "Alice Johnson", role: "member" },
      ],
    } as Workspace,
  ],
  projects: [
    {
      id: "proj-1",
      workspaceId: "ws-1",
      name: "Website Redesign",
      description: "Complete overhaul of company website",
      template: "kanban",
      status: "active",
      visibility: "public",
      createdAt: "2024-01-10T00:00:00Z",
      members: ["user-1", "user-2", "user-3"],
    } as Project,
    {
      id: "proj-2",
      workspaceId: "ws-1",
      name: "Mobile App",
      description: "iOS and Android mobile application",
      template: "scrum",
      status: "active",
      visibility: "private",
      createdAt: "2024-01-20T00:00:00Z",
      members: ["user-1", "user-2"],
    } as Project,
  ],
  tasks: [
    {
      id: "task-1",
      projectId: "proj-1",
      boardId: "board-1",
      columnId: "col-1",
      title: "Design homepage mockup",
      description: "Create initial design concepts for the new homepage",
      status: "todo",
      priority: "high",
      assignee: "Alice Johnson",
      labels: ["design", "homepage"],
      dueDate: "2024-02-15",
      comments: 3,
      attachments: 2,
      position: 0,
      createdAt: "2024-01-10T00:00:00Z",
    } as Task,
    {
      id: "task-2",
      projectId: "proj-1",
      boardId: "board-1",
      columnId: "col-2",
      title: "Implement responsive navigation",
      description: "Build mobile-friendly navigation component",
      status: "in-progress",
      priority: "medium",
      assignee: "Bob Smith",
      labels: ["frontend", "responsive"],
      dueDate: "2024-02-20",
      comments: 1,
      attachments: 0,
      position: 0,
      createdAt: "2024-01-12T00:00:00Z",
    } as Task,
  ],
  teams: [
    {
      id: "team-123",
      name: "Design Team",
      description: "Responsible for UI/UX across the product",
      createdAt: new Date("2024-04-10"),
      project: {
        id: "proj-1",
        name: "Website Redesign",
        template: "Kanban",
      },
      members: [
        {
          id: "user-1",
          name: "Alice Smith",
          email: "alice@example.com",
          avatar: null,
          role: "Designer",
        },
        {
          id: "user-2",
          name: "Bob Jones",
          email: "bob@example.com",
          avatar: null,
          role: "Product Manager",
        },
      ],
      availableMembers: [
        {
          id: "user-3",
          name: "Charlie Green",
          email: "charlie@example.com",
          avatar: null,
          role: "Engineer",
        },
        {
          id: "user-4",
          name: "Dana White",
          email: "dana@example.com",
          avatar: null,
          role: "QA",
        },
      ],
    } as unknown as Team,
  ],
  boards: [
    {
      id: "board-1",
      projectId: "proj-1",
      name: "Main Board",
      type: "kanban",
      isDefault: true,
      teamId: null,
      createdAt: "2024-01-10T00:00:00Z",
    } as Board,
  ],
  columns: [
    {
      id: "col-1",
      boardId: "board-1",
      name: "To Do",
      position: 0,
      color: "bg-gray-100",
    },
    {
      id: "col-2",
      boardId: "board-1",
      name: "In Progress",
      position: 1,
      color: "bg-blue-100",
    },
    {
      id: "col-3",
      boardId: "board-1",
      name: "Review",
      position: 2,
      color: "bg-yellow-100",
    },
    {
      id: "col-4",
      boardId: "board-1",
      name: "Done",
      position: 3,
      color: "bg-green-100",
    },
  ],
  currentWorkspace: null,
  currentProject: null,
  currentBoard: null,
  currentModule: null,
  viewMode: "grid",
}

// --- Reducer ---

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_CURRENT_MODULE":
      return { ...state, currentModule: action.payload }
    case "SET_CURRENT_WORKSPACE":
      return { ...state, currentWorkspace: action.payload }
    case "SET_CURRENT_PROJECT":
      return { ...state, currentProject: action.payload }
    case "SET_CURRENT_BOARD":
      return { ...state, currentBoard: action.payload }
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload }

    case "CREATE_WORKSPACE":
      return { ...state, workspaces: [...state.workspaces, action.payload] }
    case "UPDATE_WORKSPACE":
      return {
        ...state,
        workspaces: state.workspaces.map((workspace) =>
          workspace.id === action.payload.id ? { ...workspace, ...action.payload.updates } : workspace,
        ),
      }
    case "SOFT_DELETE_WORKSPACE":
      return {
        ...state,
        workspaces: state.workspaces.map((workspace) =>
          workspace.id === action.payload ? { ...workspace, isDeleted: true } : workspace,
        ),
      }

    case "CREATE_PROJECT":
      return { ...state, projects: [...state.projects, action.payload] }
    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload.id ? { ...project, ...action.payload.updates } : project,
        ),
      }
    case "SOFT_DELETE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload ? { ...project, isDeleted: true } : project,
        ),
      }

    case "CREATE_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] }
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload.updates } : task,
        ),
      }
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      }
    case "MOVE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.taskId
            ? { ...task, columnId: action.payload.columnId, position: action.payload.position }
            : task,
        ),
      }

    case "CREATE_TEAM":
      return { ...state, teams: [...state.teams, action.payload] }
    case "UPDATE_TEAM":
      return {
        ...state,
        teams: state.teams.map((team) =>
          team.id === action.payload.id ? { ...team, ...action.payload.updates } : team,
        ),
      }
    case "SOFT_DELETE_TEAM":
      return {
        ...state,
        teams: state.teams.map((team) => (team.id === action.payload ? { ...team, isDeleted: true } : team)),
      }
    case "ADD_TEAM_MEMBER":
      return {
        ...state,
        teams: state.teams.map((team) =>
          team.id === action.payload.teamId
            ? {
              ...team,
              members: (team.members as string[]).includes(action.payload.memberId)
                ? team.members
                : [...(team.members as string[]), action.payload.memberId],
            }
            : team,
        ),
      }
    case "REMOVE_TEAM_MEMBER":
      return {
        ...state,
        teams: state.teams.map((team) =>
          team.id === action.payload.teamId
            ? {
              ...team,
              members: (team.members as string[]).filter((id) => id !== action.payload.memberId),
            }
            : team,
        ),
      }
    case "UPDATE_TEAM_MEMBERS":
      return {
        ...state,
        teams: state.teams.map((team) =>
          team.id === action.payload.teamId
            ? {
              ...team,
              members: action.payload.members,
            }
            : team,
        ),
      }

    case "CREATE_BOARD":
      return { ...state, boards: [...state.boards, action.payload] }
    case "UPDATE_BOARD":
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.id === action.payload.id ? { ...board, ...action.payload.updates } : board,
        ),
      }
    case "DELETE_BOARD":
      return {
        ...state,
        boards: state.boards.filter((board) => board.id !== action.payload),
      }

    case "CREATE_COLUMN":
      return { ...state, columns: [...state.columns, action.payload] }
    case "UPDATE_COLUMN":
      return {
        ...state,
        columns: state.columns.map((column) =>
          column.id === action.payload.id ? { ...column, ...action.payload.updates } : column,
        ),
      }
    case "DELETE_COLUMN":
      return {
        ...state,
        columns: state.columns.filter((column) => column.id !== action.payload),
      }

    default:
      return state
  }
}

// --- Context & Provider ---

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

// --- Hook ---

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
