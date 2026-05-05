"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { CustomButton } from "@/components/custom/CustomButton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Globe, Users, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface CreateGroupModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    defaultType?: "Security" | "M365" | "Dynamic"
    onGroupCreated?: (group: GroupFormData) => void
}

export interface GroupFormData {
    id: string
    name: string
    description: string
    type: "Security" | "M365" | "Dynamic"
    visibility: string
    membershipType: string
    owner: string
    status: string
    members: number
}

export function CreateGroupModal({ open, onOpenChange, defaultType, onGroupCreated }: CreateGroupModalProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        type: defaultType || "Security",
        visibility: "Private",
        membershipType: "Assigned",
        owner: "",
    })

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            toast.error("Group name is required")
            return
        }
        
        // Name validation (no numbers)
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(formData.name.trim())) {
            toast.error("Group name should not contain numbers or special characters")
            return
        }

        if (!formData.owner.trim()) {
            toast.error("Group owner is required")
            return
        }

        // Email validation for owner
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.owner.trim())) {
            toast.error("Please enter a valid owner email address")
            return
        }

        setLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 800))
            const newGroup: GroupFormData = {
                id: Date.now().toString(),
                name: formData.name,
                description: formData.description,
                type: formData.type as "Security" | "M365" | "Dynamic",
                visibility: formData.visibility,
                membershipType: formData.membershipType,
                owner: formData.owner,
                status: "Active",
                members: 0,
            }
            onGroupCreated?.(newGroup)
            toast.success(`Group "${formData.name}" created successfully`)
            resetForm()
            onOpenChange(false)
        } catch {
            toast.error("Failed to create group")
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            type: defaultType || "Security",
            visibility: "Private",
            membershipType: "Assigned",
            owner: "",
        })
    }

    const handleClose = (value: boolean) => {
        if (!value) resetForm()
        onOpenChange(value)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[560px] rounded-none p-0 gap-0">
                <div className={`p-6 pb-4 ${formData.type === "Security" ? "bg-indigo-50 dark:bg-indigo-950/30" : formData.type === "M365" ? "bg-blue-50 dark:bg-blue-950/30" : "bg-emerald-50 dark:bg-emerald-950/30"}`}>
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            {formData.type === "Security" ? <Shield className="w-5 h-5 text-indigo-600" /> : formData.type === "M365" ? <Globe className="w-5 h-5 text-blue-600" /> : <Users className="w-5 h-5 text-emerald-600" />}
                            <DialogTitle className="text-lg font-bold">Create New Group</DialogTitle>
                        </div>
                        <DialogDescription className="mt-1">
                            Define a new {formData.type === "M365" ? "Microsoft 365 collaboration" : formData.type === "Security" ? "security" : "dynamic"} group for your organization.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label>Group Name *</Label>
                            <Input
                                placeholder="e.g. Engineering Team"
                                className="rounded-none h-10"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="col-span-2">
                            <Label>Description</Label>
                            <Textarea
                                placeholder="Describe the purpose of this group..."
                                className="rounded-none min-h-[80px] resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label>Group Type *</Label>
                            <Select value={formData.type} onValueChange={(v: "Security" | "M365" | "Dynamic") => setFormData({ ...formData, type: v })}>
                                <SelectTrigger className="rounded-none h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="Security">Security Group</SelectItem>
                                    <SelectItem value="M365">M365 Group</SelectItem>
                                    <SelectItem value="Dynamic">Dynamic Group</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Visibility</Label>
                            <Select value={formData.visibility} onValueChange={(v) => setFormData({ ...formData, visibility: v })}>
                                <SelectTrigger className="rounded-none h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="Private">Private</SelectItem>
                                    <SelectItem value="Public">Public</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Membership Type</Label>
                            <Select value={formData.membershipType} onValueChange={(v) => setFormData({ ...formData, membershipType: v })}>
                                <SelectTrigger className="rounded-none h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="Assigned">Assigned</SelectItem>
                                    <SelectItem value="Dynamic">Dynamic</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Owner *</Label>
                            <Input
                                placeholder="e.g. john@company.com"
                                className="rounded-none h-10"
                                value={formData.owner}
                                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 pt-0">
                    <CustomButton variant="outline" className="rounded-none" onClick={() => handleClose(false)} disabled={loading}>
                        Cancel
                    </CustomButton>
                    <CustomButton className="rounded-none bg-primary text-white" onClick={handleSubmit} disabled={loading}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Create Group
                    </CustomButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
