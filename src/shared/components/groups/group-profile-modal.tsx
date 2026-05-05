"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { CustomButton } from "@/components/custom/CustomButton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Edit3, Loader2, Users, Shield, Globe, Zap } from "lucide-react"
import { toast } from "sonner"

interface GroupProfileModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    group?: {
        id: string
        name: string
        description: string
        type: string
        members: number
        status: string
    }
    onGroupUpdated?: (group: { id: string; name: string; description: string; type: string; status: string }) => void
}

export function GroupProfileModal({ open, onOpenChange, group, onGroupUpdated }: GroupProfileModalProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        type: "Security",
        status: "Active",
    })

    useEffect(() => {
        if (group) {
            setFormData({
                name: group.name,
                description: group.description,
                type: group.type,
                status: group.status,
            })
        }
    }, [group])

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            toast.error("Group name is required")
            return
        }

        setLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 800))
            onGroupUpdated?.({
                id: group?.id || "",
                name: formData.name,
                description: formData.description,
                type: formData.type,
                status: formData.status,
            })
            toast.success(`Group "${formData.name}" updated successfully`)
            onOpenChange(false)
        } catch {
            toast.error("Failed to update group")
        } finally {
            setLoading(false)
        }
    }

    const typeIcon = formData.type === "Security" ? <Shield className="w-4 h-4" /> : formData.type === "M365" ? <Globe className="w-4 h-4" /> : <Zap className="w-4 h-4" />

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px] rounded-none p-0 gap-0">
                <div className="p-6 pb-4 bg-zinc-50 dark:bg-zinc-900">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <Edit3 className="w-5 h-5 text-zinc-600" />
                            <DialogTitle className="text-lg font-bold">Group Profile</DialogTitle>
                        </div>
                        <DialogDescription>View and edit group details</DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 space-y-5">
                    <div className="flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                        <div className="h-12 w-12 bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-500 font-bold text-sm">
                            {formData.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-sm">{formData.name || "Untitled Group"}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge className="rounded-none text-[10px] px-2 py-0.5">{formData.type}</Badge>
                                <span className="text-xs text-zinc-400 flex items-center gap-1">
                                    <Users className="w-3 h-3" /> {group?.members || 0} members
                                </span>
                            </div>
                        </div>
                        {typeIcon}
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label>Group Name *</Label>
                            <Input
                                className="rounded-none h-10"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="col-span-2">
                            <Label>Description</Label>
                            <Textarea
                                className="rounded-none min-h-[80px] resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label>Group Type</Label>
                            <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                                <SelectTrigger className="rounded-none h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="Security">Security</SelectItem>
                                    <SelectItem value="M365">M365</SelectItem>
                                    <SelectItem value="Dynamic">Dynamic</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Status</Label>
                            <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                                <SelectTrigger className="rounded-none h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-6 pt-0">
                    <CustomButton variant="outline" className="rounded-none" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </CustomButton>
                    <CustomButton className="rounded-none bg-primary text-white" onClick={handleSubmit} disabled={loading}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save Changes
                    </CustomButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
