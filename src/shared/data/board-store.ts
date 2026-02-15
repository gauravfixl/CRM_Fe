import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Task {
    id: number | string
    title: string
    priority: "High" | "Medium" | "Low" | "Critical"
    comments: number
    files: number
    date: string
    category: string
    code: string
    type: "task" | "bug" | "story"
    description?: string
    assignee?: string
}

export interface Column {
    id: string
    title: string
    limit: string
    taskIds: (string | number)[]
}

export interface ProjectBoardData {
    projectId: string
    columns: Column[]
    tasks: Record<string | number, Task>
}

interface BoardStore {
    boards: Record<string, ProjectBoardData> // Keyed by Project ID
    createBoard: (projectId: string, type: "kanban" | "scrum") => void
    addTask: (projectId: string, columnId: string, task: Task) => void
    moveTask: (projectId: string, taskId: string | number, sourceColId: string, targetColId: string, newIndex: number) => void
    getBoardData: (projectId: string) => ProjectBoardData | undefined
}

const DEFAULT_KANBAN_COLUMNS = [
    { id: "todo", title: "TO DO", limit: "MAX 10", taskIds: [] },
    { id: "inprogress", title: "IN PROGRESS", limit: "MAX 5", taskIds: [] },
    { id: "review", title: "IN REVIEW", limit: "", taskIds: [] },
    { id: "done", title: "DONE", limit: "", taskIds: [] }
]

const MOCK_TASKS = {
    1: { id: 1, title: "Design System Guidelines", priority: "High", comments: 12, files: 4, date: "Nov 25", category: "Design", code: "KAN-1", type: "task" },
    2: { id: 2, title: "API Integration - Auth Module", priority: "Medium", comments: 5, files: 2, date: "Dec 02", category: "Dev", code: "KAN-2", type: "story" },
    3: { id: 3, title: "Kanban Board Implementation", priority: "High", comments: 8, files: 1, date: "Jan 28", category: "Dev", code: "KAN-3", type: "task" },
}

export const useBoardStore = create<BoardStore>()(
    persist(
        (set, get) => ({
            boards: {}, // Start empty, created dynamically

            createBoard: (projectId, type) => set((state) => {
                if (state.boards[projectId]) return state; // Already exists

                // If it's the "demo" project (p1), we might want to pre-fill it for showcase
                const isDemo = projectId === "p1";

                return {
                    boards: {
                        ...state.boards,
                        [projectId]: {
                            projectId,
                            columns: isDemo ? [
                                { id: "todo", title: "TO DO", limit: "MAX 10", taskIds: [1, 2] },
                                { id: "inprogress", title: "IN PROGRESS", limit: "MAX 5", taskIds: [3] },
                                { id: "done", title: "DONE", limit: "", taskIds: [] }
                            ] : DEFAULT_KANBAN_COLUMNS.map(c => ({ ...c, taskIds: [] })),

                            tasks: isDemo ? MOCK_TASKS : {} // Empty tasks for new projects
                        }
                    }
                }
            }),

            addTask: (projectId, columnId, task) => set((state) => {
                const board = state.boards[projectId];
                if (!board) return state;

                return {
                    boards: {
                        ...state.boards,
                        [projectId]: {
                            ...board,
                            tasks: { ...board.tasks, [task.id]: task },
                            columns: board.columns.map(col =>
                                col.id === columnId
                                    ? { ...col, taskIds: [...col.taskIds, task.id] }
                                    : col
                            )
                        }
                    }
                }
            }),

            moveTask: (projectId, taskId, sourceColId, targetColId, newIndex) => set((state) => {
                // Drag and drop logic placeholder
                return state;
            }),

            getBoardData: (projectId) => get().boards[projectId]
        }),
        {
            name: 'cubicle-board-storage',
        }
    )
)
