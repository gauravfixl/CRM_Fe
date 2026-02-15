"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProjectStore, ProjectStatus, ProjectPriority } from "@/shared/data/projects-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"
import { Loader2, Layout, Calendar, AlertCircle } from "lucide-react"

interface CreateProjectModalProps {
    isOpen: boolean
    onClose: () => void
    workspaceId?: string
}

export default function CreateProjectModal({ isOpen, onClose, workspaceId }: CreateProjectModalProps) {
    const { createProject } = useProjectStore()
    const { activeWorkspaceId } = useWorkspaceStore()
    const targetWorkspaceId = workspaceId || activeWorkspaceId

    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "Active" as ProjectStatus,
        priority: "Medium" as ProjectPriority,
        startDate: "",
        endDate: ""
    })

    const handleCreate = async () => {
        if (!formData.name || !targetWorkspaceId) return

        setIsLoading(true)

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800))

        createProject({
            name: formData.name,
            description: formData.description,
            workspaceId: targetWorkspaceId,
            organizationId: "org-1", // Default org
            status: formData.status,
            priority: formData.priority,
            startDate: formData.startDate || undefined,
            endDate: formData.endDate || undefined,
            leadId: "u1", // Default to current user
            boardId: `b-${Date.now()}` // Auto-create board ID
        })

        setIsLoading(false)
        onClose()
        setFormData({
            name: "",
            description: "",
            status: "Active",
            priority: "Medium",
            startDate: "",
            endDate: ""
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Create New Project</DialogTitle>
                    <DialogDescription>
                        Initialize a new project in your workspace.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-right">Project Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Website Redesign"
                            className="col-span-3"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe the project goals..."
                            className="col-span-3 min-h-[100px]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(v) => setFormData({ ...formData, status: v as ProjectStatus })}
                            >
                                <SelectTrigger>
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
                            <Label>Priority</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(v) => setFormData({ ...formData, priority: v as ProjectPriority })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LOW">Low</SelectItem>
                                    <SelectItem value="MEDIUM">Medium</SelectItem>
                                    <SelectItem value="HIGH">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleCreate} disabled={!formData.name || isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create Project"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
