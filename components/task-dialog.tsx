"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomInput } from "@/components/custom/CustomInput"
import { CustomTextarea } from "@/components/custom/CustomTextArea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  CustomSelect,
  CustomSelectContent,
  CustomSelectItem,
  CustomSelectTrigger,
  CustomSelectValue
} from "@/components/custom/CustomSelect"
import {
  Calendar,
  MessageSquare,
  User,
  Tag,
  Clock,
  X
} from "lucide-react"
import { getAllSubTasks, addTask, updateTask } from "@/hooks/taskHooks"
import { Permission } from "./custom/Permission"
import { useAuthStore } from "@/lib/useAuthStore"
import { hasPermission } from "@/utils/permission"

interface TaskDialogProps {
  boardId: string
  taskId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  tasks: any[]
  setTasks: React.Dispatch<React.SetStateAction<any[]>>
  filterData: any
  selectedTaskData: any
  onTaskUpdate: any
}

export function TaskDialog({ boardId, taskId, open, onOpenChange, tasks, filterData, setTasks, selectedTaskData, onTaskUpdate }: TaskDialogProps) {
  const task = tasks?.flatMap(column => column.tasks).find((t: any) => t._id === taskId);
  const projectId = selectedTaskData?.projectId?._id || "";

  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("")
  const [assignee, setAssignee] = useState("")
  const [priority, setPriority] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [labels, setLabels] = useState<string[]>([])
  const [newLabel, setNewLabel] = useState("")
  const [subtasks, setSubtasks] = useState<any[]>([])
  const [showSubtaskInput, setShowSubtaskInput] = useState(false)
  const [newSubtask, setNewSubtask] = useState("")
  const [comment, setComment] = useState("")
  const [subTasks, setSubTasks] = useState<any[]>([]);

  useEffect(() => {
    if (selectedTaskData) {
      setDescription(selectedTaskData.description || "")
      setStatus(selectedTaskData.status || "")
      setAssignee(selectedTaskData.assigneeId?.firstName || "")
      setPriority(selectedTaskData.priority || "")
      setDueDate(selectedTaskData.dueDate || "")
      setLabels(selectedTaskData.labels || [])
      setSubtasks(selectedTaskData.subtasks || [])
    }
  }, [task, selectedTaskData])

  useEffect(() => {
    if (!task?._id || !projectId || !boardId) return;

    const fetchSubTasks = async () => {
      try {
        const response = await getAllSubTasks(projectId, boardId, task._id);
        setSubTasks(response.data.tasks);
      } catch (err) {
        console.error("Error fetching subtasks:", err);
      }
    };

    fetchSubTasks();
  }, [task?._id, projectId, boardId]);

  const handleAddSubtask = async () => {
    const trimmedSubtask = newSubtask.trim();
    if (trimmedSubtask === "") return;

    const subtaskObject = {
      boardId,
      name: trimmedSubtask,
      description: "",
      type: "task",
      status: task.status,
      priority: task.priority,
      assigneeId: "",
      assignedTeamId: task.assignedTeamId || "",
      parentId: task._id,
      storyPoints: 1,
      labels: []
    };

    try {
      const response = await addTask(subtaskObject, projectId);

      setTasks((prev: any[]) => prev.map(col => ({
        ...col,
        tasks: col.tasks.map((t: any) =>
          (t._id === task._id)
            ? { ...t, subtasks: [...(t.subtasks || []), response.data.task] }
            : t
        )
      })));

      setSubTasks(prev => [...prev, response.data.task]);
      setNewSubtask("");
      setShowSubtaskInput(false);
    } catch (error) {
      console.error("Error adding subtask:", error);
    }
  };

  const handleAddLabel = () => {
    if (newLabel.trim() === "" || labels.includes(newLabel)) return
    setLabels([...labels, newLabel])
    setNewLabel("")
  }

  const handleRemoveLabel = (label: string) => {
    setLabels(labels.filter((l) => l !== label))
  }

  const handleSave = async (updatedTask: any) => {
    try {
      const payload = {
        name: updatedTask.name,
        description: updatedTask.description,
        type: updatedTask.type,
        columnOrder: updatedTask.columnOrder,
        status: updatedTask.status,
        priority: updatedTask.priority,
        boardId: updatedTask.boardId,
        projectId,
        parentId: updatedTask.parentId?._id || "",
        assigneeId: updatedTask.assigneeId || "",
        assignedTeamId: updatedTask.assignedTeamId || "",
        storyPoints: updatedTask.storyPoints || 1,
        labels: updatedTask.labels || [],
        subtasks: updatedTask.subtasks || [],
        taskCode: updatedTask.taskCode
      };

      const updatedFromServer = await updateTask(projectId, updatedTask._id, payload);

      setTasks((prev: any[]) => {
        const updatedTask = updatedFromServer.data.task;
        const withoutTask = prev.map(col => ({
          ...col,
          tasks: col.tasks.filter((t: any) => t._id !== updatedTask._id)
        }));

        const targetColIndex = withoutTask.findIndex(col => col.key === updatedTask.status);
        if (targetColIndex !== -1) {
          withoutTask[targetColIndex].tasks = [
            ...withoutTask[targetColIndex].tasks,
            updatedTask
          ];
        }
        return [...withoutTask];
      });

      if (onTaskUpdate) {
        onTaskUpdate(updatedFromServer.data.task);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const canEditTask = useAuthStore(state => hasPermission(state.permissions, "project", "EDIT_TASK"));
  const canAssignTask = useAuthStore(state => hasPermission(state.permissions, "project", "ASSIGN_TASK"));

  if (!task) return null

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          const updatedTask = {
            ...task,
            description,
            status,
            priority,
            dueDate,
            labels,
            subtasks
          }
          handleSave(updatedTask)
        }
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="max-w-4xl h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{task.taskCode ?? task._id}</span>
            <span>{task.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row gap-6 h-[calc(90vh-60px)]">
          <div className="lg:w-2/3 h-[100%] flex flex-col bg-primary-foreground my-2" style={{ backgroundColor: 'hsl(var(--primary-50))' }}>
            <div className="flex-1 overflow-y-auto pr-4 space-y-6">
              <div>
                <p className="mb-2 ml-2">Description</p>
                <CustomTextarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] ml-6"
                  readOnly={!canEditTask}
                />
              </div>

              <div>
                <p className="mb-2 ml-2">Subtasks</p>
                <ul className="list-disc list-inside space-y-1 text-sm pl-4">
                  {subTasks.length > 0 ? (
                    subTasks.map((subtask) => (
                      <li key={subtask._id}>{subtask.name}</li>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No subtasks yet.</p>
                  )}
                </ul>

                {showSubtaskInput ? (
                  <div className="flex items-center gap-2 mt-2">
                    <CustomInput
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      placeholder="Enter subtask"
                      className="flex-1 ml-1"
                      disabled={!canEditTask}
                    />
                    <CustomButton size="icon" onClick={handleAddSubtask} className="text-green-600">✓</CustomButton>
                    <CustomButton size="icon" onClick={() => setShowSubtaskInput(false)} className="text-red-600">✕</CustomButton>
                  </div>
                ) : (
                  <CustomButton
                    variant="outline"
                    size="sm"
                    className="mt-2 ml-2"
                    onClick={() => setShowSubtaskInput(true)}
                  >
                    + Add Subtask
                  </CustomButton>
                )}
              </div>

              <Permission module="project" action="COMMENT_ON_TASK">
                <div>
                  <p className="mb-2 ml-2 flex flex-row items-center gap-1">
                    <MessageSquare className="h-4 w-4 ml-2" />
                    Comments
                  </p>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <CustomTextarea
                          placeholder="Add a comment..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <CustomButton size="sm">Post Comment</CustomButton>
                      </div>
                    </div>
                  </div>
                </div>
              </Permission>
            </div>
          </div>

          <div className="lg:w-1/3 h-[80%] overflow-y-auto border pl-4 pr-1 space-y-6 my-8 mx-4 py-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <CustomSelect value={status} onValueChange={setStatus} disabled={!canEditTask}>
                <CustomSelectTrigger>
                  <CustomSelectValue placeholder="Select status" />
                </CustomSelectTrigger>
                <CustomSelectContent>
                  <CustomSelectItem value="todo">To Do</CustomSelectItem>
                  <CustomSelectItem value="in_progress">In Progress</CustomSelectItem>
                  <CustomSelectItem value="in_review">Review</CustomSelectItem>
                  <CustomSelectItem value="done">Done</CustomSelectItem>
                </CustomSelectContent>
              </CustomSelect>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <CustomSelect value={priority} onValueChange={setPriority} disabled={!canEditTask}>
                <CustomSelectTrigger>
                  <CustomSelectValue placeholder="Select priority" />
                </CustomSelectTrigger>
                <CustomSelectContent>
                  <CustomSelectItem value="Low">Low</CustomSelectItem>
                  <CustomSelectItem value="Medium">Medium</CustomSelectItem>
                  <CustomSelectItem value="High">High</CustomSelectItem>
                  <CustomSelectItem value="Critical">Critical</CustomSelectItem>
                </CustomSelectContent>
              </CustomSelect>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2 text-black">
                <User className="h-4 w-4" />
                Assignee
              </label>
              <CustomSelect
                value={assignee || "unassigned"}
                onValueChange={setAssignee}
                disabled={!canEditTask}
              >
                <CustomSelectTrigger>
                  <CustomSelectValue placeholder="Unassigned" />
                </CustomSelectTrigger>
                <CustomSelectContent>
                  <CustomSelectItem value="unassigned">Unassigned</CustomSelectItem>
                  {canAssignTask && filterData?.assignee?.map((person: any) => (
                    <CustomSelectItem key={person.id.email} value={person.id.email}>
                      {person.text.firstName}
                    </CustomSelectItem>
                  ))}
                </CustomSelectContent>
              </CustomSelect>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Due Date
              </label>
              <CustomInput type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} disabled={!canEditTask} />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Labels
              </label>
              <div className="space-y-2">
                {labels.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {labels.map((label) => (
                      <Badge key={label} variant="secondary" className="gap-1">
                        {label}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveLabel(label)} />
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <CustomInput placeholder="Add label" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} disabled={!canEditTask} />
                  <CustomButton type="button" variant="outline" size="sm" onClick={handleAddLabel}>Add</CustomButton>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Tracking
              </label>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Estimated:</span>
                  <span>Not set</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Logged:</span>
                  <span>0h</span>
                </div>
                <CustomInput placeholder="Log time (e.g., 2h 30m)" disabled={!canEditTask} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
