"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { CustomButton } from "@/components/custom/CustomButton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Users, UserMinus, MoreHorizontal, Loader2, UserPlus, Crown, Shield } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface ManageMembersModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    groupName?: string
    groupId?: string
    onMembersUpdated?: () => void
}

interface Member {
    id: string
    name: string
    email: string
    role: string
    joinedAt: string
}

const initialMembers: Member[] = [
    { id: "m1", name: "Alice Johnson", email: "alice@company.com", role: "Owner", joinedAt: "2025-01-15" },
    { id: "m2", name: "Bob Smith", email: "bob@company.com", role: "Admin", joinedAt: "2025-02-20" },
    { id: "m3", name: "Charlie Brown", email: "charlie@company.com", role: "Member", joinedAt: "2025-03-10" },
    { id: "m4", name: "Diana Prince", email: "diana@company.com", role: "Member", joinedAt: "2025-03-18" },
    { id: "m5", name: "Edward Norton", email: "edward@company.com", role: "Member", joinedAt: "2025-04-01" },
]

export function ManageMembersModal({ open, onOpenChange, groupName, onMembersUpdated }: ManageMembersModalProps) {
    const [members, setMembers] = useState<Member[]>(initialMembers)
    const [searchQuery, setSearchQuery] = useState("")
    const [removing, setRemoving] = useState<string | null>(null)

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const changeRole = (memberId: string, newRole: string) => {
        setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m))
        toast.success("Member role updated")
        onMembersUpdated?.()
    }

    const removeMember = async (memberId: string) => {
        setRemoving(memberId)
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            const member = members.find(m => m.id === memberId)
            setMembers(prev => prev.filter(m => m.id !== memberId))
            toast.success(`${member?.name} removed from group`)
            onMembersUpdated?.()
        } finally {
            setRemoving(null)
        }
    }

    const roleIcon = (role: string) => {
        if (role === "Owner") return <Crown className="w-3 h-3" />
        if (role === "Admin") return <Shield className="w-3 h-3" />
        return null
    }

    const roleBadgeStyle = (role: string) => {
        if (role === "Owner") return "bg-amber-50 text-amber-700 border-amber-200"
        if (role === "Admin") return "bg-blue-50 text-blue-700 border-blue-200"
        return "bg-zinc-50 text-zinc-600 border-zinc-200"
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[580px] rounded-none p-0 gap-0 max-h-[85vh] flex flex-col">
                <div className="p-6 pb-4 bg-zinc-50 dark:bg-zinc-900">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-zinc-600" />
                            <DialogTitle className="text-lg font-bold">Manage Members</DialogTitle>
                        </div>
                        <DialogDescription>
                            {groupName ? `${groupName} — ${members.length} members` : `${members.length} members in this group`}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            placeholder="Search members..."
                            className="rounded-none h-9 pl-10 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto min-h-0">
                    {filteredMembers.length === 0 ? (
                        <div className="p-8 text-center text-zinc-400">
                            <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No members found</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {filteredMembers.map(member => (
                                <div key={member.id} className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-semibold text-zinc-500">
                                            {member.name.split(" ").map(n => n[0]).join("")}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{member.name}</p>
                                            <p className="text-xs text-zinc-400">{member.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={`rounded-none text-[10px] px-2 py-0.5 border gap-1 ${roleBadgeStyle(member.role)}`}>
                                            {roleIcon(member.role)}
                                            {member.role}
                                        </Badge>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <CustomButton variant="ghost" size="icon" className="h-8 w-8 rounded-none">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </CustomButton>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-none">
                                                <DropdownMenuItem className="text-xs" onClick={() => changeRole(member.id, "Owner")}>
                                                    <Crown className="w-3.5 h-3.5 mr-2" /> Make Owner
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-xs" onClick={() => changeRole(member.id, "Admin")}>
                                                    <Shield className="w-3.5 h-3.5 mr-2" /> Make Admin
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-xs" onClick={() => changeRole(member.id, "Member")}>
                                                    <Users className="w-3.5 h-3.5 mr-2" /> Make Member
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-xs text-red-600" onClick={() => removeMember(member.id)} disabled={removing === member.id}>
                                                    {removing === member.id ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <UserMinus className="w-3.5 h-3.5 mr-2" />}
                                                    Remove
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                    <CustomButton variant="outline" className="rounded-none" onClick={() => onOpenChange(false)}>
                        Close
                    </CustomButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
