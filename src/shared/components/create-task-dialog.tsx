"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { CustomButton } from "@/components/custom/CustomButton"
import { CustomInput } from "@/components/custom/CustomInput"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CalendarIcon } from "lucide-react"

interface CreateTaskDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onTaskCreated: (task: any) => void
}

export function CreateTaskDialog({ open, onOpenChange, onTaskCreated }: CreateTaskDialogProps) {
    const [title, setTitle] = useState("")
    const [priority, setPriority] = useState("Medium")
    const [status, setStatus] = useState("To Do")
    const [assignee, setAssignee] = useState("JD")
    const [dueDate, setDueDate] = useState("")
    const [description, setDescription] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return

        setIsLoading(true)

        // Simulate API delay
        setTimeout(() => {
            const newTask = {
                id: `task-${Date.now()}`,
                key: `CRM-${Math.floor(Math.random() * 1000)}`,
                content: title,
                project: "CRM Frontend", // Simplified for now
                priority,
                status,
                assignee,
                dueDate: dueDate || new Date().toISOString(),
                description
            }

            onTaskCreated(newTask)
            setIsLoading(false)
            onOpenChange(false)

            // Reset form
            setTitle("")
            setDescription("")
            setPriority("Medium")
            setStatus("To Do")
        }, 500)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Task Title <span className="text-red-500">*</span></Label>
                        <CustomInput
                            placeholder="e.g. Fix navigation bar bug"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="To Do">To Do</SelectItem>
                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                    <SelectItem value="Review">Review</SelectItem>
                                    <SelectItem value="Done">Done</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select value={priority} onValueChange={setPriority}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                    <SelectItem value="Urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Assignee</Label>
                        <Select value={assignee} onValueChange={setAssignee}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="JD">John Doe</SelectItem>
                                <SelectItem value="SS">Sarah Smith</SelectItem>
                                <SelectItem value="MR">Mike Ross</SelectItem>
                                <SelectItem value="Unassigned">Unassigned</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            placeholder="Add details..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="resize-none h-20"
                        />
                    </div>

                    <DialogFooter>
                        <CustomButton type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </CustomButton>
                        <CustomButton type="submit" disabled={isLoading || !title.trim()}>
                            {isLoading ? "Creating..." : "Create Task"}
                        </CustomButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
