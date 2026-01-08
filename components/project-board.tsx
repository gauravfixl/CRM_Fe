"use client"

import { useState, useEffect, useRef } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { Badge } from "@/components/ui/badge"
import { CustomButton } from "@/components/custom/CustomButton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Trash2, Bug, Zap, BookOpen, Target } from "lucide-react"
import { CustomInput } from "@/components/custom/CustomInput"
import { CustomDialog, CustomDialogContent, CustomDialogHeader, CustomDialogTitle, CustomDialogTrigger, CustomDialogDescription } from "@/components/custom/CustomDialog"
import { CustomTextarea } from "@/components/custom/CustomTextArea"
import { CustomSelect, CustomSelectContent, CustomSelectItem, CustomSelectTrigger, CustomSelectValue } from "@/components/custom/CustomSelect"
import { TaskDialog } from "./task-dialog"
import { useApp } from "@/contexts/app-context"
import { useToast } from "@/hooks/use-toast"
import { getBoardById } from "@/hooks/boardHooks"
import { addTask, getTaskById, getTasksByColumn, deleteTask, reorderTask } from "@/hooks/taskHooks"
import { getAllProjectMembers } from "@/hooks/projectMemberHooks"
import { addNewColumn, deleteColumn, updateColumn } from "@/hooks/boardHooks"
import { showError } from "@/utils/toast"
import { useLoaderStore } from "@/lib/loaderStore"

interface ProjectBoardProps {
  workspaceId: string
  projectId: string
  project: any
  teams: any[]
  tasks: any[]
  setTasks: React.Dispatch<React.SetStateAction<any[]>>
}

interface Column {
  _id: string
  id?: string
  name: string
  color?: string
  order?: number
  tasks?: any[]
}

export function ProjectBoard({ projectId, project, teams, tasks, setTasks }: ProjectBoardProps) {
  const { toast } = useToast()
  const [columns, setColumns] = useState<Column[]>([])
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [searchTerm] = useState("")
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isEditColumnOpen, setIsEditColumnOpen] = useState(false)
  const [editingColumn, setEditingColumn] = useState<Column | null>(null)
  const [editColumnTitle, setEditColumnTitle] = useState("")
  const [members, setMembers] = useState<any[]>([])
  const [selectedTaskData, setSelectedTaskData] = useState<any>(null)
  const [tasksByColumn, setTasksByColumn] = useState<any[]>([])
  const boardId = project?.boardId?._id
  const [isAddingColumn, setIsAddingColumn] = useState(false)
  const [newColumnTitle, setNewColumnTitle] = useState("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [columnToDelete, setColumnToDelete] = useState<string | null>(null)
  const { showLoader, hideLoader } = useLoaderStore()

  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [newTaskType, setNewTaskType] = useState("task")
  const [newTaskStatus, setNewTaskStatus] = useState("todo")
  const [newTaskPriority, setNewTaskPriority] = useState("Medium")
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState("")
  const [newTaskAssignedTeamId, setNewTaskAssignedTeamId] = useState("")
  const [newTaskParentId, setNewTaskParentId] = useState("")
  const [newTaskStoryPoints, setNewTaskStoryPoints] = useState(0)
  const [newTaskLabels, setNewTaskLabels] = useState<string[]>([])

  const [isDeleteCustomDialogOpen, setIsDeleteCustomDialogOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)

  useEffect(() => {
    if (!projectId || !boardId) return
    const fetchBoard = async () => {
      try {
        showLoader()
        const response = await getBoardById(projectId, boardId)
        if (response.data.board.columns) setColumns(response.data.board.columns)
      } catch (err) {
        console.error("Failed to fetch board:", err)
      } finally {
        hideLoader()
      }
    }
    fetchBoard()
  }, [projectId, boardId])

  useEffect(() => {
    if (!boardId) return
    const fetchTasks = async () => {
      try {
        showLoader()
        const response = await getTasksByColumn(boardId)
        setTasksByColumn(response.data.columns)
      } catch (error) {
        console.error("Error fetching tasks:", error)
      } finally {
        hideLoader()
      }
    }
    fetchTasks()
  }, [boardId])

  useEffect(() => {
    if (!projectId) return
    const fetchMembers = async () => {
      try {
        showLoader()
        const res = await getAllProjectMembers(projectId)
        setMembers(res.data.members)
      } catch (err) {
        console.error("Failed to fetch project members:", err)
      } finally {
        hideLoader()
      }
    }
    fetchMembers()
  }, [projectId])

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return
    const { source, destination, draggableId } = result
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const toOrder = filteredTasks.find(c => c.id === destination.droppableId)?.order
    try {
      await reorderTask(projectId, draggableId, {
        boardId,
        from: filteredTasks.find(c => c.id === source.droppableId)?.order,
        to: toOrder,
      })
      setTasks(tasks.map((t: any) => t._id === draggableId ? { ...t, columnOrder: toOrder } : t))
    } catch (error) {
      console.error("Error reordering task:", error)
    }
  }

  const columnsArray = Array.isArray(tasksByColumn) ? tasksByColumn : Object.values(tasksByColumn)
  const filteredTasks = columnsArray.map((col: any) => {
    const term = searchTerm?.toLowerCase() || ""
    const columnTasks = Array.isArray(col.tasks) ? col.tasks : []
    const filteredColumnTasks = columnTasks.filter((task: any) =>
      task.name.toLowerCase().includes(term) || (task.description || "").toLowerCase().includes(term)
    )
    return { ...col, tasks: filteredColumnTasks }
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-500"
      case "Medium": return "bg-yellow-500"
      case "Low": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const handleAddTask = async () => {
    try {
      const res = await addTask({
        boardId,
        name: newTaskTitle,
        description: newTaskDescription,
        type: newTaskType,
        status: newTaskStatus,
        priority: newTaskPriority,
        assigneeId: newTaskAssigneeId,
        assignedTeamId: newTaskAssignedTeamId,
        parentId: newTaskParentId,
        storyPoints: newTaskStoryPoints,
        labels: newTaskLabels,
      }, projectId)
      setTasks([...tasks, res.data.task])
      setIsAddTaskOpen(false)
      setNewTaskTitle("")
      setNewTaskDescription("")
    } catch (err) {
      console.error("Failed to add task:", err)
    }
  }

  const handleUpdateColumn = async () => {
    if (!editingColumn || !editColumnTitle.trim()) return
    const columnId = editingColumn.id || editingColumn._id
    try {
      await updateColumn(boardId, { name: editColumnTitle, columnId })
      setTasksByColumn((prev: any[]) => prev.map(col => (col._id || col.id) === columnId ? { ...col, name: editColumnTitle } : col))
      setIsEditColumnOpen(false)
    } catch (err) {
      console.error("Error updating column:", err)
    }
  }

  const handleSaveColumn = async () => {
    if (!newColumnTitle.trim()) return
    try {
      showLoader()
      const response = await addNewColumn(boardId, { name: newColumnTitle, projectId })
      setTasksByColumn((prev: any[]) => [...prev, { ...response.data.column, tasks: [] }])
      setNewColumnTitle("")
      setIsAddingColumn(false)
    } catch (err) {
      console.error("Failed to create column:", err)
    } finally {
      hideLoader()
    }
  }

  const handleDeleteTaskConfirm = async (taskId: string | null) => {
    if (!taskId) return
    try {
      await deleteTask(projectId, boardId, taskId, "")
      setTasksByColumn((prev: any[]) => prev.map(col => ({
        ...col,
        tasks: col.tasks.filter((t: any) => t._id !== taskId)
      })))
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const handleCardClick = async (taskId: string) => {
    try {
      const response = await getTaskById(taskId)
      setSelectedTask(taskId)
      setSelectedTaskData(response.data.task)
    } catch (err) {
      console.error(err)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "bug": return Bug
      case "story": return BookOpen
      case "epic": return Target
      default: return Zap
    }
  }

  return (
    <div className="space-y-6 h-[100vh] overflow-x-hidden">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 p-4 h-[70vh] overflow-y-auto">
          {filteredTasks.map((column: any) => (
            <div key={column.id} className="w-80 flex-shrink-0 flex flex-col h-[70vh] min-h-[1410px] bg-primary/20">
              <div className="p-2 border-b bg-gray-100 dark:bg-gray-800 sticky top-0 z-20">
                <div className="flex items-center justify-between">
                  <h6 className="font-small text-sm uppercase tracking-wide text-gray-700">{column.name}</h6>
                  <Badge variant="secondary">{column.tasks.length}</Badge>
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className={`flex-1 p-3 space-y-2 transition-colors ${snapshot.isDraggingOver ? "bg-blue-50" : ""}`}>
                    {column.tasks.map((task: any, index: number) => {
                      const TypeIcon = getTypeIcon(task.type)
                      return (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided, snapshot) => (
                            <SmallCard ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`mb-3 cursor-move border rounded-lg ${snapshot.isDragging ? "shadow-lg" : ""}`} onClick={() => handleCardClick(task._id)}>
                              <SmallCardContent>
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <TypeIcon className="h-3.5 w-3.5" />
                                    <Badge variant="secondary" className="text-xs">{task.type.toUpperCase()}</Badge>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></span>
                                    <CustomButton variant="ghost" size="sm" className="p-1 h-auto" onClick={(e) => { e.stopPropagation(); setTaskToDelete(task._id); setIsDeleteCustomDialogOpen(true); }}>
                                      <Trash2 className="h-3 w-3 text-red-500" />
                                    </CustomButton>
                                  </div>
                                </div>
                                <span className="text-xs font-semibold text-blue-600 mb-1 block">{task.taskCode}</span>
                                <p className="text-sm font-medium leading-tight mb-2">{task.name}</p>
                                <div className="flex justify-end">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback>{task.assignee?.name?.charAt(0) || "U"}</AvatarFallback>
                                  </Avatar>
                                </div>
                              </SmallCardContent>
                            </SmallCard>
                          )}
                        </Draggable>
                      )
                    })}
                    {provided.placeholder}
                    <div className="mt-4 border border-dashed rounded-lg p-2 text-center cursor-pointer hover:bg-accent" onClick={() => { setNewTaskStatus(column.key); setIsAddTaskOpen(true); }}>
                      <Plus className="h-4 w-4 inline mr-1" /> Add Task
                    </div>
                  </div>
                )}
              </Droppable>
            </div>
          ))}

          <div className="flex-shrink-0 w-80">
            {isAddingColumn ? (
              <div className="flex flex-col gap-2 p-2 bg-white rounded border">
                <CustomInput value={newColumnTitle} onChange={(e) => setNewColumnTitle(e.target.value)} placeholder="Column name" autoFocus />
                <div className="flex gap-2">
                  <CustomButton size="sm" onClick={handleSaveColumn}>Add</CustomButton>
                  <CustomButton size="sm" variant="ghost" onClick={() => setIsAddingColumn(false)}>Cancel</CustomButton>
                </div>
              </div>
            ) : (
              <CustomButton variant="outline" className="w-full h-12 border-dashed" onClick={() => setIsAddingColumn(true)}><Plus className="mr-2 h-4 w-4" /> Add Column</CustomButton>
            )}
          </div>
        </div>
      </DragDropContext>

      {selectedTask && selectedTaskData && (
        <TaskDialog
          boardId={boardId}
          taskId={selectedTask}
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
          tasks={filteredTasks}
          setTasks={setTasks}
          filterData={{}} // Pass proper filter data if needed
          selectedTaskData={selectedTaskData}
          onTaskUpdate={(updated: any) => setTasks(tasks.map((t: any) => t._id === updated._id ? updated : t))}
        />
      )}

      <CustomDialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <CustomDialogContent>
          <CustomDialogHeader><CustomDialogTitle>Add New Task</CustomDialogTitle></CustomDialogHeader>
          <div className="space-y-4">
            <CustomInput value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="Title" />
            <CustomTextarea value={newTaskDescription} onChange={(e) => setNewTaskDescription(e.target.value)} placeholder="Description" />
            <CustomSelect value={newTaskPriority} onValueChange={setNewTaskPriority}>
              <CustomSelectTrigger><CustomSelectValue placeholder="Priority" /></CustomSelectTrigger>
              <CustomSelectContent>
                <CustomSelectItem value="Low">Low</CustomSelectItem>
                <CustomSelectItem value="Medium">Medium</CustomSelectItem>
                <CustomSelectItem value="High">High</CustomSelectItem>
              </CustomSelectContent>
            </CustomSelect>
            <div className="flex justify-end gap-2">
              <CustomButton variant="outline" onClick={() => setIsAddTaskOpen(false)}>Cancel</CustomButton>
              <CustomButton onClick={handleAddTask}>Add Task</CustomButton>
            </div>
          </div>
        </CustomDialogContent>
      </CustomDialog>

      <CustomDialog open={isDeleteCustomDialogOpen} onOpenChange={setIsDeleteCustomDialogOpen}>
        <CustomDialogContent>
          <CustomDialogHeader><CustomDialogTitle>Confirm Delete</CustomDialogTitle></CustomDialogHeader>
          <p>Are you sure you want to delete this task?</p>
          <div className="flex justify-end gap-2 mt-4">
            <CustomButton variant="outline" onClick={() => setIsDeleteCustomDialogOpen(false)}>Cancel</CustomButton>
            <CustomButton variant="destructive" onClick={() => { handleDeleteTaskConfirm(taskToDelete); setIsDeleteCustomDialogOpen(false); }}>Delete</CustomButton>
          </div>
        </CustomDialogContent>
      </CustomDialog>
    </div>
  )
}
