"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProjectStore, ProjectStatus, ProjectPriority } from "@/shared/data/projects-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"
import { Loader2 } from "lucide-react"
import SidePanel from "./side-panel"

interface CreateProjectModalProps {
    isOpen: boolean
    onClose: () => void
    workspaceId?: string
}

const projectSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "Project name must be at least 2 characters")
            .max(80, "Project name cannot exceed 80 characters"),
        description: z.string().max(500, "Description is too long").optional().or(z.literal("")),
        status: z.enum(["Active", "Planned", "On Hold", "Completed"]),
        priority: z.enum(["Low", "Medium", "High"]),
        startDate: z.string().optional().or(z.literal("")),
        endDate: z.string().optional().or(z.literal("")),
    })
    .refine(
        (data) => {
            if (!data.startDate || !data.endDate) return true
            return new Date(data.startDate) <= new Date(data.endDate)
        },
        { message: "End date must be after start date", path: ["endDate"] }
    )

type ProjectFormValues = z.infer<typeof projectSchema>

export default function CreateProjectModal({ isOpen, onClose, workspaceId }: CreateProjectModalProps) {
    const { createProject } = useProjectStore()
    const { activeWorkspaceId } = useWorkspaceStore()
    const targetWorkspaceId = workspaceId || activeWorkspaceId

    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            description: "",
            status: "Active",
            priority: "Medium",
            startDate: "",
            endDate: "",
        },
    })

    const status = watch("status")
    const priority = watch("priority")

    React.useEffect(() => {
        if (isOpen) reset()
    }, [isOpen, reset])

    const onSubmit = async (values: ProjectFormValues) => {
        if (!targetWorkspaceId) return
        setIsLoading(true)
        await new Promise((r) => setTimeout(r, 500))

        createProject({
            name: values.name,
            description: values.description || "",
            workspaceId: targetWorkspaceId,
            organizationId: "org-1",
            status: values.status as ProjectStatus,
            priority: values.priority as ProjectPriority,
            startDate: values.startDate || undefined,
            endDate: values.endDate || undefined,
            leadId: "u1",
            boardId: `b-${Date.now()}`,
        } as any)

        setIsLoading(false)
        onClose()
        reset()
    }

    return (
        <SidePanel
            open={isOpen}
            onClose={onClose}
            title="Create New Project"
            description="Initialize a new project in your workspace."
            width="lg"
            footer={
                <div className="flex items-center justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="font-bold text-slate-600 rounded-none"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="create-project-form"
                        disabled={!isValid || isLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 rounded-none"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Project"
                        )}
                    </Button>
                </div>
            }
        >
            <form id="create-project-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Project Name <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                        id="name"
                        {...register("name")}
                        placeholder="e.g. Website Redesign"
                        className="rounded-none"
                    />
                    {errors.name && (
                        <p className="text-[11px] font-semibold text-rose-600">{errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Description
                    </Label>
                    <Textarea
                        id="description"
                        {...register("description")}
                        placeholder="Describe the project goals..."
                        className="min-h-[100px] rounded-none resize-none"
                    />
                    {errors.description && (
                        <p className="text-[11px] font-semibold text-rose-600">{errors.description.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</Label>
                        <Select value={status} onValueChange={(v) => setValue("status", v as any, { shouldValidate: true })}>
                            <SelectTrigger className="rounded-none">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Planned">Planned</SelectItem>
                                <SelectItem value="On Hold">On Hold</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Priority</Label>
                        <Select value={priority} onValueChange={(v) => setValue("priority", v as any, { shouldValidate: true })}>
                            <SelectTrigger className="rounded-none">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Start Date</Label>
                        <Input type="date" {...register("startDate")} className="rounded-none" />
                        {errors.startDate && (
                            <p className="text-[11px] font-semibold text-rose-600">{errors.startDate.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">End Date</Label>
                        <Input type="date" {...register("endDate")} className="rounded-none" />
                        {errors.endDate && (
                            <p className="text-[11px] font-semibold text-rose-600">{errors.endDate.message}</p>
                        )}
                    </div>
                </div>
            </form>
        </SidePanel>
    )
}
