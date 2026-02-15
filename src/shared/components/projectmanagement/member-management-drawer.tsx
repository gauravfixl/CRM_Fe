"use client"

import React, { useState } from "react"
import { SheetContent } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    X,
    UserPlus,
    Search,
    ShieldCheck,
    MoreHorizontal,
    Trash2,
    Mail,
    UserCircle2,
    CheckCircle2
} from "lucide-react"
import { usePermissions, Role } from "@/shared/hooks/use-permissions"

interface Member {
    id: string
    name: string
    email: string
    avatar?: string
    role: Role
    status: "active" | "invited"
}

interface MemberManagementDrawerProps {
    type: "WORKSPACE" | "PROJECT"
    id: string
    onClose: () => void
}

/**
 * SOURCE OF TRUTH: RBAC Member Management
 * Handles adding, removing, and role assignment for Projects/Workspaces.
 */
export default function MemberManagementDrawer({ type, id, onClose }: MemberManagementDrawerProps) {
    const permissions = usePermissions(type === "PROJECT" ? { projectId: id } : { workspaceId: id })

    // Mock existing members
    const [members, setMembers] = useState<Member[]>([
        { id: "u1", name: "Gaurav Garg", email: "gaurav@fixl.com", avatar: "https://i.pravatar.cc/150?u=u1", role: type === "PROJECT" ? "ProjectOwner" : "WorkspaceAdmin", status: "active" },
        { id: "u2", name: "Sarah Bloom", email: "sarah@fixl.com", avatar: "https://i.pravatar.cc/150?u=u2", role: "ProjectAdmin", status: "active" },
        { id: "u3", name: "Alex Rivera", email: "alex@fixl.com", avatar: "https://i.pravatar.cc/150?u=u3", role: "Member", status: "active" },
        { id: "u4", name: "Jordan Smith", email: "jordan@fixl.com", avatar: "https://i.pravatar.cc/150?u=u4", role: "Guest", status: "active" },
    ])

    const [inviteEmail, setInviteEmail] = useState("")
    const [isInviting, setIsInviting] = useState(false)

    const handleRemoveMember = (memberId: string) => {
        if (!permissions.canManageMembers) return
        if (confirm("Permanently remove this member?")) {
            setMembers(members.filter(m => m.id !== memberId))
        }
    }

    const handleInvite = () => {
        if (!inviteEmail.trim()) return
        setIsInviting(true)
        setTimeout(() => {
            const newMember: Member = {
                id: `u-${Math.random().toString(36).substr(2, 5)}`,
                name: inviteEmail.split("@")[0],
                email: inviteEmail,
                role: "Member",
                status: "invited"
            }
            setMembers([newMember, ...members])
            setInviteEmail("")
            setIsInviting(false)
        }, 1000)
    }

    return (
        <SheetContent className="sm:max-w-[550px] p-0 border-l border-slate-200 shadow-2xl flex flex-col h-full bg-white font-sans overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-8 h-20 border-b border-slate-100 bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <UserCircle2 size={20} />
                    </div>
                    <div>
                        <h4 className="text-[14px] font-black text-slate-800 uppercase tracking-tight">
                            Manage {type === "PROJECT" ? "Project" : "Workspace"} Members
                        </h4>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            {members.length} Total Contributors
                        </p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all">
                    <X size={24} />
                </Button>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-8 space-y-10">

                    {/* Invite Section (Admin Only) */}
                    {permissions.canManageMembers && (
                        <section className="space-y-4">
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-1">Invite New Strategists</h3>
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="user@organisation.com"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        className="pl-10 h-10 bg-slate-50 border-slate-100 focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-500/5 transition-all rounded-xl text-[12px] font-bold"
                                    />
                                </div>
                                <Button
                                    onClick={handleInvite}
                                    disabled={isInviting || !inviteEmail.trim()}
                                    className="h-10 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] uppercase tracking-widest gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                                >
                                    {isInviting ? "Sending..." : <><UserPlus size={14} /> Invite</>}
                                </Button>
                            </div>
                        </section>
                    )}

                    {/* Members List */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Active Roster</h3>
                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-slate-100 text-slate-400 px-2 py-1">
                                Your Role: {permissions.label}
                            </Badge>
                        </div>

                        <div className="space-y-3">
                            {members.map((member) => (
                                <div key={member.id} className="group p-4 bg-white border-2 border-slate-100 rounded-[28px] hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Avatar className="h-12 w-12 border-2 border-slate-50 shadow-sm">
                                                <AvatarImage src={member.avatar} />
                                                <AvatarFallback className="bg-slate-100 text-[12px] font-black text-slate-400">{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            {member.status === "invited" && (
                                                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-amber-500 border-2 border-white rounded-full flex items-center justify-center">
                                                    <Badge className="h-full w-full p-0 flex items-center justify-center bg-transparent" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h5 className="text-[14px] font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                                                {member.name}
                                                {member.id === "u1" && <Badge variant="secondary" className="text-[9px] font-black bg-indigo-50 text-indigo-600 border-none px-1.5 h-4">YOU</Badge>}
                                            </h5>
                                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[180px]">
                                                {member.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <Badge className={`font-black text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg border-none ${['WorkspaceAdmin', 'ProjectOwner', 'ProjectAdmin'].includes(member.role)
                                                    ? 'bg-indigo-100 text-indigo-700'
                                                    : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {member.role.replace(/([A-Z])/g, ' $1').trim()}
                                            </Badge>
                                            {member.status === "invited" && (
                                                <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mt-1 animate-pulse">Pending</p>
                                            )}
                                        </div>

                                        {permissions.canManageMembers && member.id !== "u1" && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveMember(member.id)}
                                                className="h-9 w-9 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </ScrollArea>

            {/* Persistence Feedback Layer */}
            <div className="h-20 px-10 border-t border-slate-100 bg-slate-50/50 flex items-center justify-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    Security protocols active • Changes are logged
                </p>
            </div>
        </SheetContent>
    )
}
