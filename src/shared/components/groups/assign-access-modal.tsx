"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { CustomButton } from "@/components/custom/CustomButton"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Lock, Loader2, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

interface AssignAccessModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    groupName?: string
    onAccessAssigned?: (permissions: string[]) => void
}

const availablePermissions = [
    { id: "read_docs", label: "Read Documents", category: "Documents" },
    { id: "write_docs", label: "Write Documents", category: "Documents" },
    { id: "delete_docs", label: "Delete Documents", category: "Documents" },
    { id: "view_reports", label: "View Reports", category: "Analytics" },
    { id: "export_reports", label: "Export Reports", category: "Analytics" },
    { id: "manage_users", label: "Manage Users", category: "Administration" },
    { id: "manage_settings", label: "Manage Settings", category: "Administration" },
    { id: "access_api", label: "API Access", category: "Integration" },
    { id: "manage_webhooks", label: "Manage Webhooks", category: "Integration" },
]

export function AssignAccessModal({ open, onOpenChange, groupName, onAccessAssigned }: AssignAccessModalProps) {
    const [loading, setLoading] = useState(false)
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
    const [accessLevel, setAccessLevel] = useState("read")

    const togglePermission = (id: string) => {
        setSelectedPermissions(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        )
    }

    const handleSubmit = async () => {
        if (selectedPermissions.length === 0) {
            toast.error("Please select at least one permission")
            return
        }

        setLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 800))
            onAccessAssigned?.(selectedPermissions)
            toast.success(`Access permissions assigned to "${groupName}"`)
            setSelectedPermissions([])
            onOpenChange(false)
        } catch {
            toast.error("Failed to assign access")
        } finally {
            setLoading(false)
        }
    }

    const handleClose = (value: boolean) => {
        if (!value) {
            setSelectedPermissions([])
            setAccessLevel("read")
        }
        onOpenChange(value)
    }

    const categories = [...new Set(availablePermissions.map(p => p.category))]

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[520px] rounded-none p-0 gap-0">
                <div className="p-6 pb-4 bg-amber-50 dark:bg-amber-950/30">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5 text-amber-600" />
                            <DialogTitle className="text-lg font-bold">Assign Access</DialogTitle>
                        </div>
                        <DialogDescription>
                            {groupName ? `Configure permissions for "${groupName}"` : "Assign resource access to this group"}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 space-y-5">
                    <div>
                        <Label>Access Level</Label>
                        <Select value={accessLevel} onValueChange={setAccessLevel}>
                            <SelectTrigger className="rounded-none h-10">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                                <SelectItem value="read">Read Only</SelectItem>
                                <SelectItem value="write">Read & Write</SelectItem>
                                <SelectItem value="admin">Full Access</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-xs text-zinc-500">
                            <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />
                            Granular Permissions
                        </Label>
                        {categories.map(category => (
                            <div key={category} className="space-y-2">
                                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{category}</p>
                                <div className="space-y-1.5">
                                    {availablePermissions.filter(p => p.category === category).map(perm => (
                                        <div
                                            key={perm.id}
                                            className="flex items-center gap-3 p-2.5 border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
                                            onClick={() => togglePermission(perm.id)}
                                        >
                                            <Checkbox
                                                checked={selectedPermissions.includes(perm.id)}
                                                onCheckedChange={() => togglePermission(perm.id)}
                                                className="rounded-none"
                                            />
                                            <span className="text-sm font-medium">{perm.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <DialogFooter className="p-6 pt-0">
                    <CustomButton variant="outline" className="rounded-none" onClick={() => handleClose(false)} disabled={loading}>
                        Cancel
                    </CustomButton>
                    <CustomButton className="rounded-none bg-primary text-white" onClick={handleSubmit} disabled={loading}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Assign Permissions
                    </CustomButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
