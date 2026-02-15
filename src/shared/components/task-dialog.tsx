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
  X,
  Send,
  Paperclip,
  FileIcon,
  Download,
  Trash2,
  Plus
} from "lucide-react"
import { getSubtasks, addTask, updateTask } from "@/modules/project-management/task/hooks/taskHooks"
import { getTaskComments, addTaskComment, deleteComment, type Comment } from "@/modules/project-management/task/hooks/commentHooks"
import { getTaskAttachments, uploadAttachment, deleteAttachment, type Attachment } from "@/modules/project-management/task/hooks/attachmentHooks"
import { Permission } from "@/components/custom/Permission"
import { useAuthStore } from "@/lib/useAuthStore"
import { hasPermission } from "@/utils/permission"
import { formatDistanceToNow } from "date-fns"

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
  const [comments, setComments] = useState<Comment[]>([])
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [subTasks, setSubTasks] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false)

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
        const response = await getSubtasks(projectId, task._id, boardId);
        setSubTasks(response.data.tasks);
      } catch (err) {
        console.error("Error fetching subtasks:", err);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await getTaskComments(task._id);
        setComments(response.data.comments || []);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    const fetchAttachments = async () => {
      try {
        const response = await getTaskAttachments(task._id);
        setAttachments(response.data.attachments || []);
      } catch (err) {
        console.error("Error fetching attachments:", err);
      }
    };

    fetchSubTasks();
    fetchComments();
    fetchAttachments();
  }, [task?._id, projectId, boardId]);

  const handleAddSubtask = async () => {
    const trimmedSubtask = newSubtask.trim();
    if (trimmedSubtask === "") return;

    const subtaskObject = {
      boardId,
      name: trimmedSubtask,
      description: "",
      type: "task" as "task" | "bug",
      status: task.status,
      priority: task.priority as "low" | "medium" | "high" | "critical",
      assigneeId: "",
      assignedTeamId: task.assignedTeamId || "",
      parentId: task._id,
      storyPoints: 1,
      labels: []
    };

    try {
      const response = await addTask(projectId, subtaskObject);

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

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      const response = await addTaskComment(task._id, comment);
      setComments([response.data.comment, ...comments]);
      setComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(task._id, commentId);
      setComments(comments.filter(c => c._id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    setIsUploading(true);
    try {
      const response = await uploadAttachment(task._id, file);
      setAttachments([...attachments, response.data.attachment]);
    } catch (err) {
      console.error("Error uploading file:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId: string) => {
    try {
      await deleteAttachment(task._id, attachmentId);
      setAttachments(attachments.filter(a => a._id !== attachmentId));
    } catch (err) {
      console.error("Error deleting attachment:", err);
    }
  };

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

        <div className="flex flex-col lg:flex-row gap-0 h-[calc(90vh-80px)] overflow-hidden">
          {/* Main Content Area */}
          <div className="lg:w-[65%] h-full overflow-y-auto px-6 py-4 space-y-8 hide-scrollbar">
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                <span>Description</span>
              </div>
              <CustomTextarea
                placeholder="Add a detailed description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white focus:border-primary transition-all text-slate-700 leading-relaxed"
                readOnly={!canEditTask}
              />
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                  <span>Subtasks</span>
                </div>
                {!showSubtaskInput && (
                  <CustomButton
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-primary hover:bg-primary/10"
                    onClick={() => setShowSubtaskInput(true)}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add
                  </CustomButton>
                )}
              </div>

              <div className="space-y-2">
                {subTasks.length > 0 ? (
                  <div className="grid gap-2">
                    {subTasks.map((subtask) => (
                      <div key={subtask._id} className="flex items-center gap-3 p-2 rounded-md border border-slate-100 hover:bg-slate-50 group transition-colors">
                        <div className={`w-1.5 h-1.5 rounded-full ${subtask.status === 'done' ? 'bg-green-500' : 'bg-slate-300'}`} />
                        <span className="text-sm text-slate-700 flex-1">{subtask.name}</span>
                        <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 uppercase">{subtask.taskCode}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm italic pl-1 text-[13px]">No subtasks created yet.</p>
                )}

                {showSubtaskInput && (
                  <div className="flex items-center gap-2 mt-3 p-2 bg-slate-50 rounded-lg animate-in fade-in slide-in-from-top-1">
                    <CustomInput
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      placeholder="What needs to be done?"
                      className="flex-1 h-9 bg-white"
                      autoFocus
                      disabled={!canEditTask}
                    />
                    <CustomButton size="sm" onClick={handleAddSubtask} className="h-9 px-3">Add</CustomButton>
                    <CustomButton variant="ghost" size="sm" onClick={() => setShowSubtaskInput(false)} className="h-9 px-2 text-slate-400">Cancel</CustomButton>
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                <Paperclip className="h-4 w-4" />
                <span>Attachments</span>
              </div>
              <div className="space-y-3">
                {attachments.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {attachments.map((attachment) => (
                      <div key={attachment._id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white group hover:border-primary/30 hover:bg-primary/5 transition-all">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="p-2 bg-slate-100 rounded text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <FileIcon className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-slate-700 truncate">{attachment.name}</span>
                            <span className="text-[10px] text-slate-400">Added recently</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-10 group-hover:opacity-100 transition-opacity">
                          <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer">
                            <CustomButton variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-primary">
                              <Download className="h-4 w-4" />
                            </CustomButton>
                          </a>
                          <CustomButton
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteAttachment(attachment._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </CustomButton>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="file-upload"
                    className={`inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg border-2 border-dashed border-slate-200 hover:border-primary hover:bg-primary/5 cursor-pointer text-slate-500 hover:text-primary transition-all ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {isUploading ? 'Uploading...' : 'Drop files or Click to upload'}
                  </label>
                </div>
              </div>
            </section>

            <section className="pt-6 border-t border-slate-100 space-y-6">
              <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                <MessageSquare className="h-4 w-4" />
                <span>Comments</span>
              </div>

              <div className="space-y-6">
                <Permission module="project" action="COMMENT_ON_TASK">
                  <div className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                    <Avatar className="h-9 w-9 ring-2 ring-white">
                      <AvatarFallback className="bg-primary text-white">U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <CustomTextarea
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[80px] bg-white border-transparent focus:border-primary transition-all"
                      />
                      <div className="flex justify-end">
                        <CustomButton size="sm" className="shadow-sm font-medium" onClick={handleAddComment}>
                          Post Comment
                        </CustomButton>
                      </div>
                    </div>
                  </div>
                </Permission>

                <div className="space-y-6 pl-2 mt-4">
                  {comments.map((c) => (
                    <div key={c._id} className="flex gap-4 group">
                      <Avatar className="h-9 w-9 ring-2 ring-white border shadow-sm">
                        <AvatarImage src={c.author.avatar} />
                        <AvatarFallback className="bg-slate-100 text-slate-600 text-xs">{c.author.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1.5 pt-0.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-800">{c.author.fullName}</span>
                            <span className="text-[11px] text-slate-400 font-medium tracking-tight">
                              {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <CustomButton
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 hover:bg-red-50"
                            onClick={() => handleDeleteComment(c._id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </CustomButton>
                        </div>
                        <div className="text-sm text-slate-700 bg-white border border-slate-100 p-3 rounded-tr-xl rounded-b-xl shadow-sm inline-block min-w-[120px]">
                          {c.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <div className="text-center py-8">
                      <MessageSquare className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                      <p className="text-xs text-slate-400 italic">No activity yet. Start the conversation!</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar / Details Panel */}
          <div className="lg:w-[35%] h-full overflow-y-auto bg-slate-50/80 border-l border-slate-100 p-6 space-y-7">
            <div className="space-y-5">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Details</h3>

              <div className="grid gap-6">
                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-slate-600 flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" /> Status
                  </label>
                  <CustomSelect value={status} onValueChange={setStatus} disabled={!canEditTask}>
                    <CustomSelectTrigger className="bg-white hover:bg-slate-50 border-slate-200">
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

                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-slate-600 flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 rotate-90" /> Priority
                  </label>
                  <CustomSelect value={priority} onValueChange={setPriority} disabled={!canEditTask}>
                    <CustomSelectTrigger className="bg-white hover:bg-slate-50 border-slate-200">
                      <CustomSelectValue placeholder="Select priority" />
                    </CustomSelectTrigger>
                    <CustomSelectContent>
                      <CustomSelectItem value="low">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /> Low</div>
                      </CustomSelectItem>
                      <CustomSelectItem value="medium">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-400" /> Medium</div>
                      </CustomSelectItem>
                      <CustomSelectItem value="high">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500" /> High</div>
                      </CustomSelectItem>
                      <CustomSelectItem value="critical">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-600" /> Critical</div>
                      </CustomSelectItem>
                    </CustomSelectContent>
                  </CustomSelect>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-slate-600 flex items-center gap-2">
                    <User className="h-3.5 w-3.5" /> Assignee
                  </label>
                  <CustomSelect
                    value={assignee || "unassigned"}
                    onValueChange={setAssignee}
                    disabled={!canEditTask}
                  >
                    <CustomSelectTrigger className="bg-white hover:bg-slate-50 border-slate-200">
                      <CustomSelectValue placeholder="Unassigned" />
                    </CustomSelectTrigger>
                    <CustomSelectContent>
                      <CustomSelectItem value="unassigned">Unassigned</CustomSelectItem>
                      {canAssignTask && filterData?.assignee?.map((person: any) => (
                        <CustomSelectItem key={person.id.email} value={person.id.email}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[9px] bg-slate-100 font-bold">{person.text.firstName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {person.text.firstName}
                          </div>
                        </CustomSelectItem>
                      ))}
                    </CustomSelectContent>
                  </CustomSelect>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-semibold text-slate-600 flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" /> Due Date
                  </label>
                  <CustomInput type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} disabled={!canEditTask} className="bg-white border-slate-200" />
                </div>

                <div className="space-y-3">
                  <label className="text-[13px] font-semibold text-slate-600 flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5" /> Labels
                  </label>
                  <div className="space-y-3">
                    {labels.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {labels.map((label) => (
                          <Badge key={label} variant="secondary" className="gap-1 bg-white border-slate-200 text-slate-600 hover:bg-slate-100 rounded-md py-1 px-2.5">
                            {label}
                            <X className="h-3 w-3 cursor-pointer text-slate-400 hover:text-red-500" onClick={() => handleRemoveLabel(label)} />
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <CustomInput placeholder="New tag..." value={newLabel} onChange={(e) => setNewLabel(e.target.value)} disabled={!canEditTask} className="h-8 text-xs bg-white" />
                      <CustomButton type="button" variant="outline" size="sm" onClick={handleAddLabel} className="h-8 text-xs">Add</CustomButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 space-y-4">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Time Tracking</h3>
              <div className="grid gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Estimated:</span>
                  <span className="text-slate-700 font-bold italic">Not set</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary/30 h-full w-[0%]" />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Logged:</span>
                  <span className="text-slate-700 font-bold">0h</span>
                </div>
              </div>
              <CustomInput placeholder="Log time (e.g., 2h 30m)" disabled={!canEditTask} className="h-9 text-xs bg-white" />
            </div>

            <div className="pt-8 text-[10px] text-slate-400 text-center font-medium">
              Created recently • Updated just now
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
