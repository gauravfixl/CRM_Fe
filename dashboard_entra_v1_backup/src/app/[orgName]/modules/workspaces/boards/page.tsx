"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { CustomButton } from "@/components/custom/CustomButton"
import SubHeader from "@/components/custom/SubHeader"
import { Search, Filter, Plus, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { CreateTaskDialog } from "@/shared/components/create-task-dialog"

// --- Mock Data & Types ---

type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent'

interface BoardTask {
    id: string
    key: string
    content: string
    priority: TaskPriority
    assignee: string
}

interface BoardColumn {
    id: string
    title: string
    taskIds: string[]
}

interface BoardData {
    tasks: Record<string, BoardTask>
    columns: Record<string, BoardColumn>
    columnOrder: string[]
}

const INITIAL_DATA: BoardData = {
    tasks: {
        'task-1': { id: 'task-1', key: 'CRM-101', content: 'Fix Sidebar Navigation', priority: 'High', assignee: 'JD' },
        'task-2': { id: 'task-2', key: 'CRM-102', content: 'Design Task Drawer', priority: 'Medium', assignee: 'SS' },
        'task-3': { id: 'task-3', key: 'API-505', content: 'Backend Auth API', priority: 'Urgent', assignee: 'MR' },
        'task-4': { id: 'task-4', key: 'APP-22', content: 'Splash Screen Animation', priority: 'Low', assignee: 'JD' },
        'task-5': { id: 'task-5', key: 'CRM-103', content: 'Unit Tests for Redux', priority: 'Medium', assignee: 'JD' },
    },
    columns: {
        'col-1': { id: 'col-1', title: 'To Do', taskIds: ['task-1', 'task-2', 'task-5'] },
        'col-2': { id: 'col-2', title: 'In Progress', taskIds: ['task-3'] },
        'col-3': { id: 'col-3', title: 'Done', taskIds: ['task-4'] },
    },
    columnOrder: ['col-1', 'col-2', 'col-3'],
}

// --- Components ---

export default function BoardsPage() {
    const params = useParams() as { orgName: string }
    const [data, setData] = useState<BoardData>(INITIAL_DATA)
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result

        if (!destination) return
        if (destination.droppableId === source.droppableId && destination.index === source.index) return

        const start = data.columns[source.droppableId]
        const finish = data.columns[destination.droppableId]

        // Moving within the same column
        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds)
            newTaskIds.splice(source.index, 1)
            newTaskIds.splice(destination.index, 0, draggableId)

            const newColumn = { ...start, taskIds: newTaskIds }
            setData(prev => ({
                ...prev,
                columns: { ...prev.columns, [newColumn.id]: newColumn }
            }))
            return
        }

        // Moving from one column to another
        const startTaskIds = Array.from(start.taskIds)
        startTaskIds.splice(source.index, 1)
        const newStart = { ...start, taskIds: startTaskIds }

        const finishTaskIds = Array.from(finish.taskIds)
        finishTaskIds.splice(destination.index, 0, draggableId)
        const newFinish = { ...finish, taskIds: finishTaskIds }

        setData(prev => ({
            ...prev,
            columns: {
                ...prev.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            }
        }))
    }

    const handleTaskCreated = (newTask: any) => {
        const taskId = newTask.id || `task-${Date.now()}`

        // Determine column based on status mock logic
        let columnId = 'col-1' // To Do
        if (newTask.status === 'In Progress') columnId = 'col-2'
        if (newTask.status === 'Done' || newTask.status === 'Review') columnId = 'col-3'

        setData(prev => {
            const newTasks = { ...prev.tasks, [taskId]: newTask }
            // Add to the top of the column
            const targetColumn = prev.columns[columnId]
            const newColumn = {
                ...targetColumn,
                taskIds: [taskId, ...targetColumn.taskIds]
            }

            return {
                ...prev,
                tasks: newTasks,
                columns: {
                    ...prev.columns,
                    [columnId]: newColumn
                }
            }
        })
    }

    return (
        <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-900/50">
            <SubHeader
                title="Kanban Board"
                breadcrumbItems={[
                    { label: "Dashboard", href: `/${params.orgName}/dashboard` },
                    { label: "Project Management", href: `/${params.orgName}/modules/workspaces` },
                    { label: "Boards", href: `/${params.orgName}/modules/workspaces/boards` },
                ]}
                rightControls={
                    <div className="flex items-center gap-2">
                        <CustomButton variant="outline" size="sm" className="h-8">
                            <Filter className="w-3.5 h-3.5 mr-1" /> Filter
                        </CustomButton>
                        <CustomButton className="flex items-center gap-1 text-xs h-8 px-3" onClick={() => setIsTaskDialogOpen(true)}>
                            <Plus className="w-4 h-4" /> Create Issue
                        </CustomButton>
                    </div>
                }
            />

            {/* Board Canvas */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex h-full gap-6 select-none">
                        {data.columnOrder.map((columnId) => {
                            const column = data.columns[columnId]
                            const tasks = column.taskIds.map(taskId => data.tasks[taskId])

                            return <Column key={column.id} column={column} tasks={tasks} />
                        })}
                    </div>
                </DragDropContext>
            </div>

            <CreateTaskDialog
                open={isTaskDialogOpen}
                onOpenChange={setIsTaskDialogOpen}
                onTaskCreated={handleTaskCreated}
            />
        </div>
    )
}

function Column({ column, tasks }: { column: BoardColumn, tasks: BoardTask[] }) {
    return (
        <div className="flex flex-col w-[300px] min-w-[300px] h-full rounded-xl bg-zinc-100/50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            {/* Column Header */}
            <div className="p-3 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-zinc-700 dark:text-zinc-200">{column.title}</span>
                    <span className="text-xs font-mono text-zinc-400 bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full">{tasks.length}</span>
                </div>
                <CustomButton variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="w-4 h-4 text-zinc-400" />
                </CustomButton>
            </div>

            {/* Droppable Area */}
            <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 p-2 flex flex-col gap-2 overflow-y-auto ${snapshot.isDraggingOver ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                    >
                        {tasks.map((task, index) => (
                            <TaskCard key={task.id} task={task} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    )
}

function TaskCard({ task, index }: { task: BoardTask, index: number }) {
    const getPriorityColor = (p: TaskPriority) => {
        switch (p) {
            case 'Urgent': return 'bg-red-500'
            case 'High': return 'bg-orange-500'
            case 'Medium': return 'bg-yellow-500'
            case 'Low': return 'bg-blue-500'
            default: return 'bg-zinc-400'
        }
    }

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-white dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group ${snapshot.isDragging ? 'shadow-lg rotate-2 scale-105 z-50' : ''
                        }`}
                    style={provided.draggableProps.style}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono text-zinc-400">{task.key}</span>
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} title={task.priority} />
                    </div>

                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-3 line-clamp-2">
                        {task.content}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                        <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal text-zinc-500 border-zinc-200 dark:border-zinc-700">
                            Story
                        </Badge>
                        <Avatar className="h-5 w-5 border border-white dark:border-zinc-900">
                            <AvatarFallback className="text-[8px] bg-zinc-100 text-zinc-600 font-bold">{task.assignee}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            )}
        </Draggable>
    )
}
