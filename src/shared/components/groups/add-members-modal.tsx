"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { CustomButton } from "@/components/custom/CustomButton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, X, Loader2, Users } from "lucide-react"
import { toast } from "sonner"
import { fetchUsersApi } from "@/modules/crm/organizations/hooks/orgHooks"
import { addTeamMember } from "@/hooks/teamHooks"

interface AddMembersModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    groupName?: string
    groupId?: string
    onMembersAdded?: (members: MemberEntry[]) => void
}

export interface MemberEntry {
    id: string
    name: string
    email: string
    role: string
}

interface AvailableUser {
    id: string
    name: string
    email: string
}

export function AddMembersModal({ open, onOpenChange, groupName, groupId, onMembersAdded }: AddMembersModalProps) {
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedMembers, setSelectedMembers] = useState<{ id: string; name: string; email: string; role: string }[]>([])
    const [role, setRole] = useState("Member")
    const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([])
    const [usersLoading, setUsersLoading] = useState(false)

    useEffect(() => {
        if (!open) return
        let cancelled = false
        ;(async () => {
            try {
                setUsersLoading(true)
                const res = await fetchUsersApi()
                const data: any = res?.data || res || []
                const usersArray: any[] = Array.isArray(data) ? data : data.users ? data.users : []
                const mapped: AvailableUser[] = usersArray
                    .filter((u: any) => u.orgActive !== false)
                    .map((u: any) => ({
                        id: u._id || u.memberId,
                        name: u.name || [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email || "Unknown",
                        email: u.email || "",
                    }))
                if (!cancelled) setAvailableUsers(mapped)
            } catch (err) {
                if (!cancelled) toast.error("Failed to load users")
            } finally {
                if (!cancelled) setUsersLoading(false)
            }
        })()
        return () => { cancelled = true }
    }, [open])

    const filteredUsers = availableUsers.filter(u =>
        (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
        !selectedMembers.find(m => m.id === u.id)
    )

    const addMember = (user: AvailableUser) => {
        setSelectedMembers(prev => [...prev, { ...user, role }])
        setSearchQuery("")
    }

    const removeMember = (id: string) => {
        setSelectedMembers(prev => prev.filter(m => m.id !== id))
    }

    const handleSubmit = async () => {
        if (selectedMembers.length === 0) {
            toast.error("Please select at least one member")
            return
        }
        if (!groupId) {
            toast.error("No group selected")
            return
        }

        setLoading(true)
        try {
            const results = await Promise.allSettled(
                selectedMembers.map((m) => addTeamMember(groupId, { memberId: m.id, role: m.role }))
            )
            const failed = results.filter((r) => r.status === "rejected").length
            const succeeded = selectedMembers.length - failed

            if (succeeded > 0) {
                toast.success(`${succeeded} member(s) added to "${groupName}"`)
                onMembersAdded?.(selectedMembers.slice(0, succeeded))
            }
            if (failed > 0) {
                toast.error(`${failed} member(s) failed to add`)
            }
            setSelectedMembers([])
            setSearchQuery("")
            onOpenChange(false)
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to add members")
        } finally {
            setLoading(false)
        }
    }

    const handleClose = (value: boolean) => {
        if (!value) {
            setSelectedMembers([])
            setSearchQuery("")
        }
        onOpenChange(value)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[520px] rounded-none p-0 gap-0">
                <div className="p-6 pb-4 bg-emerald-50 dark:bg-emerald-950/30">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <UserPlus className="w-5 h-5 text-emerald-600" />
                            <DialogTitle className="text-lg font-bold">Add Members</DialogTitle>
                        </div>
                        <DialogDescription>
                            {groupName ? `Add identities to "${groupName}"` : "Search and add users to this group"}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <Input
                                placeholder="Search users by name or email..."
                                className="rounded-none h-10 pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="w-32">
                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger className="rounded-none h-10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="Member">Member</SelectItem>
                                    <SelectItem value="Owner">Owner</SelectItem>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {searchQuery && (
                        <div className="border border-zinc-200 dark:border-zinc-800 max-h-40 overflow-y-auto">
                            {filteredUsers.length === 0 ? (
                                <div className="p-3 text-sm text-zinc-400 text-center">No users found</div>
                            ) : (
                                filteredUsers.map(user => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between p-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer border-b border-zinc-100 dark:border-zinc-800 last:border-b-0"
                                        onClick={() => addMember(user)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-semibold text-zinc-500">
                                                {user.name.split(" ").map(n => n[0]).join("")}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{user.name}</p>
                                                <p className="text-xs text-zinc-400">{user.email}</p>
                                            </div>
                                        </div>
                                        <UserPlus className="w-4 h-4 text-zinc-300" />
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {selectedMembers.length > 0 && (
                        <div>
                            <Label className="text-xs text-zinc-500 mb-2">
                                <Users className="w-3.5 h-3.5 inline mr-1" />
                                Selected ({selectedMembers.length})
                            </Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedMembers.map(member => (
                                    <Badge key={member.id} className="rounded-none bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium gap-2">
                                        {member.name}
                                        <span className="text-[10px] text-zinc-400">({member.role})</span>
                                        <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeMember(member.id)} />
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 pt-0">
                    <CustomButton variant="outline" className="rounded-none" onClick={() => handleClose(false)} disabled={loading}>
                        Cancel
                    </CustomButton>
                    <CustomButton className="rounded-none bg-primary text-white" onClick={handleSubmit} disabled={loading}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Add {selectedMembers.length > 0 ? `${selectedMembers.length} Members` : "Members"}
                    </CustomButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
