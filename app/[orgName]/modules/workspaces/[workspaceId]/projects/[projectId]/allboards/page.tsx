"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Trash2 } from "lucide-react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { getAllProjectBoards, deleteColumn, addNewColumn, updateColumn } from "@/hooks/boardHooks"
import { useParams } from "next/navigation"
import { getTasksByColumn, reorderTask, addTask, getTaskById } from "@/hooks/taskHooks"
import { TaskDialog } from "@/components/task-dialog"
import { Permission } from "@/components/custom/Permission"
import { useLoaderStore } from "@/lib/loaderStore"

export default function BoardPage() {
  const params = useParams()
  const projectId = params.projectId as string
  const { showLoader, hideLoader } = useLoaderStore()

  const [searchQuery, setSearchQuery] = useState("")
  const [boards, setBoards] = useState<any[]>([])
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null)
  const [selectedBoardColumns, setSelectedBoardColumns] = useState<any>(null)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false)
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [selectedTaskData, setSelectedTaskData] = useState<any>(null)
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null)
  const [newName, setNewName] = useState("")
  const [newTaskStatus, setNewTaskStatus] = useState("")

  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskDescription, setNewTaskDescription] = useState("")
  const [newTaskType, setNewTaskType] = useState("task")
  const [newTaskPriority, setNewTaskPriority] = useState("Medium")
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState("")
  const [newTaskAssignedTeamId, setNewTaskAssignedTeamId] = useState("")
  const [newTaskParentId, setNewTaskParentId] = useState("")
  const [newTaskStoryPoints, setNewTaskStoryPoints] = useState<number | "">("")
  const [newTaskLabels, setNewTaskLabels] = useState<string[]>([])

  const [columnForm, setColumnForm] = useState({ name: "" })

  useEffect(() => {
    if (!projectId) return
    const fetchBoards = async () => {
      try {
        showLoader()
        const response = await getAllProjectBoards(projectId)
        const boardsData = response.data.boards || []
        setBoards(boardsData)
        if (boardsData.length > 0) {
          const firstBoardId = boardsData[0]._id
          setActiveBoardId(firstBoardId)
          await fetchBoardTasks(firstBoardId)
        }
      } catch (err) {
        console.error("Error fetching boards:", err)
      } finally {
        hideLoader()
      }
    }
    fetchBoards()
  }, [projectId])

  const fetchBoardTasks = async (boardId: string) => {
    try {
      showLoader()
      const response = await getTasksByColumn(boardId)
      setSelectedBoardColumns(response.data)
    } catch (err) {
      console.error("Error fetching board tasks:", err)
    } finally {
      hideLoader()
    }
  }

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result
    if (!destination || !selectedBoardColumns) return

    const sourceCol = selectedBoardColumns.columns.find((col: any) => col.id === source.droppableId)
    const destCol = selectedBoardColumns.columns.find((col: any) => col.id === destination.droppableId)

    if (!sourceCol || !destCol) return

    const sourceTasks = [...(sourceCol.tasks || [])]
    const destTasks = source.droppableId === destination.droppableId ? sourceTasks : [...(destCol.tasks || [])]

    const [movedTask] = sourceTasks.splice(source.index, 1)
    destTasks.splice(destination.index, 0, movedTask)

    if (source.droppableId !== destination.droppableId) {
      movedTask.status = destCol.name
    }

    const newColumns = selectedBoardColumns.columns.map((col: any) => {
      if (col.id === sourceCol.id) return { ...col, tasks: sourceTasks }
      if (col.id === destCol.id) return { ...col, tasks: destTasks }
      return col
    })

    setSelectedBoardColumns({ ...selectedBoardColumns, columns: newColumns })

    try {
      await reorderTask(projectId, movedTask._id, {
        boardId: activeBoardId,
        from: sourceCol.order,
        to: destCol.order,
      })
    } catch (error) {
      console.error("Error reordering task:", error)
    }
  }

  const handleAddTask = async () => {
    const payload = {
      boardId: activeBoardId,
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
    }

    try {
      showLoader()
      await addTask(payload, projectId)
      await fetchBoardTasks(activeBoardId!)
      setIsAddTaskOpen(false)
      setNewTaskTitle("")
      setNewTaskDescription("")
    } catch (err) {
      console.error("Failed to add task:", err)
    } finally {
      hideLoader()
    }
  }

  const handleAddColumn = async () => {
    if (!columnForm.name.trim() || !activeBoardId) return
    try {
      showLoader()
      await addNewColumn(activeBoardId, { name: columnForm.name, projectId })
      await fetchBoardTasks(activeBoardId)
      setColumnForm({ name: "" })
      setIsColumnDialogOpen(false)
    } catch (err) {
      console.error("Failed to add column:", err)
    } finally {
      hideLoader()
    }
  }

  const handleDeleteColumn = async (columnId: string) => {
    if (!activeBoardId) return
    const column = selectedBoardColumns?.columns.find((c: any) => c.id === columnId)
    if (column?.tasks?.length > 0) {
      alert("Cannot delete column with tasks.")
      return
    }
    try {
      showLoader()
      await deleteColumn(activeBoardId, { projectId, columnId })
      await fetchBoardTasks(activeBoardId)
    } catch (error) {
      console.error("Failed to delete column:", error)
    } finally {
      hideLoader()
    }
  }

  const handleEditColumn = async (columnId: string, name: string) => {
    if (!activeBoardId) return
    try {
      showLoader()
      await updateColumn(activeBoardId, { columnId, name })
      await fetchBoardTasks(activeBoardId)
      setEditingColumnId(null)
    } catch (error) {
      console.error("Failed to update column:", error)
    } finally {
      hideLoader()
    }
  }

  const handleCardClick = async (taskId: string) => {
    try {
      showLoader()
      const response = await getTaskById(taskId)
      setSelectedTask(taskId)
      setSelectedTaskData(response.data.task)
      setIsTaskDetailOpen(true)
    } catch (err) {
      console.error(err)
    } finally {
      hideLoader()
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high": return "bg-red-500"
      case "medium": return "bg-yellow-500"
      case "low": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-2xl font-bold">Project Board</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 w-64"
          />
        </div>
      </div>

      <Tabs value={activeBoardId || ""} onValueChange={(val) => { setActiveBoardId(val); fetchBoardTasks(val); }} className="flex-1 flex flex-col">
        <div className="border-b px-6">
          <TabsList className="h-12 bg-transparent">
            {boards.map((board) => (
              <TabsTrigger key={board._id} value={board._id} className="data-[state=active]:border-b-2 border-primary rounded-none">
                {board.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {boards.map((board) => (
          <TabsContent key={board._id} value={board._id} className="flex-1 p-6 overflow-x-auto">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex gap-6 h-full items-start">
                {selectedBoardColumns?.columns?.map((column: any) => (
                  <div key={column.id} className="flex-shrink-0 w-80">
                    <Card className="bg-muted/50 border-none shadow-none">
                      <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
                        {editingColumnId === column.id ? (
                          <Input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onBlur={() => handleEditColumn(column.id, newName)}
                            onKeyDown={(e) => e.key === "Enter" && handleEditColumn(column.id, newName)}
                            autoFocus
                            className="h-8"
                          />
                        ) : (
                          <CardTitle className="text-sm font-semibold">{column.name}</CardTitle>
                        )}
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingColumnId(column.id); setNewName(column.name); }}>
                            <Plus className="h-4 w-4 rotate-45 scale-75" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteColumn(column.id)}>
                            <Trash2 className="h-4 w-4 scale-75" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="px-3 pb-3">
                        <Droppable droppableId={column.id}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className="min-h-[100px] flex flex-col gap-2">
                              {column.tasks?.map((task: any, index: number) => (
                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      onClick={() => handleCardClick(task._id)}
                                      className={`bg-card p-3 rounded-md shadow-sm border cursor-pointer hover:border-primary transition-colors ${snapshot.isDragging ? "shadow-lg border-primary" : ""}`}
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                                        <span className="text-[10px] font-medium text-muted-foreground uppercase">{task.taskCode}</span>
                                      </div>
                                      <h4 className="text-sm font-medium mb-2">{task.name}</h4>
                                      <div className="flex items-center justify-between">
                                        <div className="flex gap-1">
                                          {task.labels?.slice(0, 2).map((label: string) => (
                                            <Badge key={label} variant="secondary" className="text-[10px] px-1 py-0">{label}</Badge>
                                          ))}
                                        </div>
                                        <Avatar className="h-6 w-6">
                                          <AvatarImage src={task.assignee?.avatar} />
                                          <AvatarFallback className="text-[10px]">{task.assignee?.name?.[0] || "U"}</AvatarFallback>
                                        </Avatar>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                              <Permission module="project" action="CREATE_TASK">
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start text-muted-foreground text-xs h-9 hover:bg-background/50"
                                  onClick={() => { setNewTaskStatus(column.key); setIsAddTaskOpen(true); }}
                                >
                                  <Plus className="h-3 w-3 mr-2" /> Add Task
                                </Button>
                              </Permission>
                            </div>
                          )}
                        </Droppable>
                      </CardContent>
                    </Card>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="flex-shrink-0 w-80 h-14 border-dashed"
                  onClick={() => setIsColumnDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Column
                </Button>
              </div>
            </DragDropContext>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Add New Task</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="Task title" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={newTaskDescription} onChange={(e) => setNewTaskDescription(e.target.value)} placeholder="Task description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newTaskType} onValueChange={setNewTaskType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="w-full" onClick={handleAddTask}>Create Task</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isColumnDialogOpen} onOpenChange={setIsColumnDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Column</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Column Name</Label>
              <Input value={columnForm.name} onChange={(e) => setColumnForm({ name: e.target.value })} placeholder="e.g. In Review" />
            </div>
            <Button className="w-full" onClick={handleAddColumn}>Add Column</Button>
          </div>
        </DialogContent>
      </Dialog>

      {isTaskDetailOpen && selectedTask && activeBoardId && (
        <TaskDialog
          boardId={activeBoardId}
          taskId={selectedTask}
          open={isTaskDetailOpen}
          onOpenChange={(open) => { if (!open) { setIsTaskDetailOpen(false); setSelectedTask(null); } }}
          tasks={selectedBoardColumns?.columns}
          setTasks={setSelectedBoardColumns}
          filterData="null"
          selectedTaskData={selectedTaskData}
          onTaskUpdate={() => fetchBoardTasks(activeBoardId!)}
        />
      )}
    </div>
  )
}