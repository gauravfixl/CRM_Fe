"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomInput } from "@/components/custom/CustomInput"
import { CustomTextarea } from "@/components/custom/CustomTextArea"
import { CustomSelect, CustomSelectItem } from "@/components/custom/CustomSelect"
import { FlatCard, FlatCardContent, FlatCardDescription, FlatCardHeader, FlatCardTitle } from "@/components/custom/FlatCard"
import SubHeader from "@/components/custom/SubHeader"
import { useLoaderStore } from "@/lib/loaderStore"
import { getTaskById, updateTask, deleteTask, getSubtasks, type Task } from "@/modules/project-management/task/hooks/taskHooks"
import { showError, showSuccess } from "@/utils/toast"
import { ArrowLeft, Trash2, Save, Calendar, User, Flag, Tag } from "lucide-react"
import {
    CustomDialog,
    CustomDialogContent,
    CustomDialogDescription,
    CustomDialogFooter,
    CustomDialogHeader,
    CustomDialogTitle
} from "@/components/custom/CustomDialog"

export default function TaskDetailsPage() {
    const [task, setTask] = useState<Task | null>(null)
    const [subtasks, setSubtasks] = useState<Task[]>([])
    const [isEditing, setIsEditing] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        type: "task" as "task" | "bug",
        priority: "medium" as "low" | "medium" | "high" | "critical",
        status: "",
        dueDate: "",
    })

    const { showLoader, hideLoader } = useLoaderStore()
    const params = useParams() as { orgName?: string; workspaceId: string; projectId: string; taskId: string }
    const router = useRouter()
    const [orgName, setOrgName] = useState("")

    useEffect(() => {
        const pOrg = params.orgName
        const storedOrg = localStorage.getItem("orgName") || ""
        setOrgName((pOrg && pOrg !== "null") ? pOrg : storedOrg)
    }, [params.orgName])

    useEffect(() => {
        fetchTaskData()
    }, [params.taskId])

    const fetchTaskData = async () => {
        try {
            showLoader()
            const [taskRes, subtasksRes] = await Promise.all([
                getTaskById(params.taskId),
                getSubtasks(params.projectId, params.taskId, task?.boardId || "")
            ])

            const taskData = taskRes?.data?.data
            setTask(taskData)
            setSubtasks(subtasksRes?.data?.data || [])
            setFormData({
                name: taskData.name,
                description: taskData.description || "",
                type: taskData.type,
                priority: taskData.priority,
                status: taskData.status,
                dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString().split('T')[0] : "",
            })
        } catch (err: any) {
            if (err?.response?.status !== 401) {
                console.error("Failed to fetch task:", err)
            }
        } finally {
            hideLoader()
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!task) return

        try {
            showLoader()
            await updateTask(params.projectId, params.taskId, formData)
            setIsEditing(false)
            fetchTaskData()
        } catch (err) {
            console.error("Error updating task:", err)
        } finally {
            hideLoader()
        }
    }

    const handleDelete = async () => {
        if (!task) return

        try {
            showLoader()
            await deleteTask(params.projectId, params.taskId, { boardId: task.boardId })
            router.push(`/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}/board`)
        } catch (err) {
            console.error("Error deleting task:", err)
        } finally {
            hideLoader()
            setDeleteConfirm(false)
        }
    }

    if (!task) {
        return <div className="p-4">Loading task...</div>
    }

    return (
        <>
            <SubHeader
                title={task.name}
                breadcrumbItems={[
                    { label: "Dashboard", href: `/${orgName}/dashboard` },
                    { label: "Workspaces", href: `/${orgName}/modules/workspaces` },
                    { label: "Projects", href: `/${orgName}/modules/workspaces/${params.workspaceId}/projects` },
                    { label: "Board", href: `/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}/board` },
                    { label: "Task", href: `/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}/tasks/${params.taskId}` },
                ]}
                rightControls={
                    <div className="flex space-x-2">
                        <Link href={`/${orgName}/modules/workspaces/${params.workspaceId}/projects/${params.projectId}/board`}>
                            <CustomButton variant="outline" className="flex items-center gap-1 text-xs h-8 px-3">
                                <ArrowLeft className="w-4 h-4" /> Back to Board
                            </CustomButton>
                        </Link>
                        {!isEditing && (
                            <CustomButton
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-1 text-xs h-8 px-3"
                            >
                                Edit Task
                            </CustomButton>
                        )}
                    </div>
                }
            />

            <div className="p-4 max-w-4xl mx-auto space-y-6">
                {isEditing ? (
                    <FlatCard>
                        <FlatCardHeader>
                            <FlatCardTitle>Edit Task</FlatCardTitle>
                            <FlatCardDescription>Update task details</FlatCardDescription>
                        </FlatCardHeader>
                        <FlatCardContent>
                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">
                                        Task Name <span className="text-red-500">*</span>
                                    </label>
                                    <CustomInput
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="description" className="text-sm font-medium">
                                        Description
                                    </label>
                                    <CustomTextarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Type</label>
                                        <CustomSelect
                                            value={formData.type}
                                            onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                                        >
                                            <CustomSelectItem value="task">Task</CustomSelectItem>
                                            <CustomSelectItem value="bug">Bug</CustomSelectItem>
                                        </CustomSelect>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Priority</label>
                                        <CustomSelect
                                            value={formData.priority}
                                            onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
                                        >
                                            <CustomSelectItem value="low">Low</CustomSelectItem>
                                            <CustomSelectItem value="medium">Medium</CustomSelectItem>
                                            <CustomSelectItem value="high">High</CustomSelectItem>
                                            <CustomSelectItem value="critical">Critical</CustomSelectItem>
                                        </CustomSelect>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="dueDate" className="text-sm font-medium">
                                        Due Date
                                    </label>
                                    <CustomInput
                                        id="dueDate"
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    />
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <CustomButton type="button" variant="outline" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </CustomButton>
                                    <CustomButton type="submit">
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </CustomButton>
                                </div>
                            </form>
                        </FlatCardContent>
                    </FlatCard>
                ) : (
                    <>
                        <FlatCard>
                            <FlatCardHeader>
                                <FlatCardTitle>Task Details</FlatCardTitle>
                                <FlatCardDescription>View task information</FlatCardDescription>
                            </FlatCardHeader>
                            <FlatCardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                                    <p className="text-base">{task.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                                    <p className="text-base">{task.description || "No description"}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                            <Tag className="w-4 h-4" /> Type
                                        </label>
                                        <p className="text-base capitalize">{task.type}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                            <Flag className="w-4 h-4" /> Priority
                                        </label>
                                        <span className={`px-2 py-1 rounded text-sm ${task.priority === "critical" ? "bg-red-100 text-red-700" :
                                            task.priority === "high" ? "bg-orange-100 text-orange-700" :
                                                task.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                                                    "bg-blue-100 text-blue-700"
                                            }`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                            <User className="w-4 h-4" /> Assignee
                                        </label>
                                        <p className="text-base">{task.assigneeId?.userId?.email || "Unassigned"}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                            <Calendar className="w-4 h-4" /> Due Date
                                        </label>
                                        <p className="text-base">
                                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                                    <p className="text-base capitalize">{task.status}</p>
                                </div>
                            </FlatCardContent>
                        </FlatCard>

                        {subtasks.length > 0 && (
                            <FlatCard>
                                <FlatCardHeader>
                                    <FlatCardTitle>Subtasks ({subtasks.length})</FlatCardTitle>
                                </FlatCardHeader>
                                <FlatCardContent>
                                    <div className="space-y-2">
                                        {subtasks.map((subtask) => (
                                            <div key={subtask._id} className="p-3 border rounded-lg">
                                                <h4 className="font-medium">{subtask.name}</h4>
                                                <p className="text-sm text-muted-foreground">{subtask.status}</p>
                                            </div>
                                        ))}
                                    </div>
                                </FlatCardContent>
                            </FlatCard>
                        )}

                        <FlatCard className="border-red-200 dark:border-red-900">
                            <FlatCardHeader>
                                <FlatCardTitle className="text-red-600">Danger Zone</FlatCardTitle>
                            </FlatCardHeader>
                            <FlatCardContent>
                                <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-red-600">Delete Task</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Permanently delete this task
                                        </p>
                                    </div>
                                    <CustomButton
                                        variant="destructive"
                                        onClick={() => setDeleteConfirm(true)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </CustomButton>
                                </div>
                            </FlatCardContent>
                        </FlatCard>
                    </>
                )}

                <CustomDialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
                    <CustomDialogContent>
                        <CustomDialogHeader>
                            <CustomDialogTitle>Delete Task</CustomDialogTitle>
                            <CustomDialogDescription>
                                Are you sure you want to delete "{task.name}"? This action cannot be undone.
                            </CustomDialogDescription>
                        </CustomDialogHeader>
                        <CustomDialogFooter>
                            <CustomButton variant="outline" onClick={() => setDeleteConfirm(false)}>
                                Cancel
                            </CustomButton>
                            <CustomButton variant="destructive" onClick={handleDelete}>
                                Delete Task
                            </CustomButton>
                        </CustomDialogFooter>
                    </CustomDialogContent>
                </CustomDialog>
            </div>
        </>
    )
}
