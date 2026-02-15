"use client"

import React, { useState } from "react"
import { X, UserPlus, Shield, Eye, Settings, Trash2, Mail, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useProjectMemberStore, ProjectRole, DEFAULT_PERMISSIONS } from "@/shared/data/project-member-store"
import { useTeamStore } from "@/shared/data/team-store"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

interface ProjectMemberManagementProps {
    projectId: string
    workspaceId: string
    onClose: () => void
}

const ROLE_COLORS: Record<ProjectRole, string> = {
    ProjectOwner: "bg-purple-100 text-purple-700 border-purple-200",
    ProjectAdmin: "bg-indigo-100 text-indigo-700 border-indigo-200",
    ProjectMember: "bg-blue-100 text-blue-700 border-blue-200",
    ProjectViewer: "bg-slate-100 text-slate-600 border-slate-200"
}

const ROLE_ICONS: Record<ProjectRole, React.ReactNode> = {
    ProjectOwner: <Shield size={14} className="text-purple-600" />,
    ProjectAdmin: <Settings size={14} className="text-indigo-600" />,
    ProjectMember: <UserPlus size={14} className="text-blue-600" />,
    ProjectViewer: <Eye size={14} className="text-slate-500" />
}

export default function ProjectMemberManagement({ projectId, workspaceId, onClose }: ProjectMemberManagementProps) {
    const { getAllProjectMembers, assignMember, updateProjectMember, removeMember } = useProjectMemberStore()
    const { getMembersByWorkspace } = useTeamStore()

    const projectMembers = getAllProjectMembers(projectId)
    const workspaceMembers = getMembersByWorkspace(workspaceId)
    const availableMembers = workspaceMembers.filter(wm => !projectMembers.some(pm => pm.userId === wm.id))

    const [isAddingMember, setIsAddingMember] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState("")
    const [selectedRole, setSelectedRole] = useState<ProjectRole>("ProjectMember")
    const [editingMemberId, setEditingMemberId] = useState<string | null>(null)


    const handleAddMember = () => {
        if (!selectedUserId) return

        const workspaceMember = workspaceMembers.find(m => m.id === selectedUserId)
        if (!workspaceMember) return

        assignMember({
            projectId,
            workspaceId,
            userId: workspaceMember.id,
            userName: workspaceMember.name,
            userEmail: workspaceMember.email,
            userAvatar: workspaceMember.avatar,
            role: selectedRole,
            addedBy: "u1" // TODO: Replace with actual logged-in user
        })

        setSelectedUserId("")
        setSelectedRole("ProjectMember")
        setIsAddingMember(false)
    }

    const handleRemoveMember = (memberId: string) => {
        const member = projectMembers.find(m => m.id === memberId)
        if (member?.role === "ProjectOwner") {
            alert("Cannot remove project owner")
            return
        }
        removeMember(memberId)
    }

    const handleUpdateRole = (memberId: string, newRole: ProjectRole) => {
        updateProjectMember(memberId, { role: newRole, customPermissions: undefined })
    }

    const handleTogglePermission = (memberId: string, permission: string) => {
        const member = projectMembers.find(m => m.id === memberId)
        if (!member) return

        const currentPerms = member.customPermissions || DEFAULT_PERMISSIONS[member.role]
        // @ts-ignore - Dynamic key access on permissions object
        const newPerms = { ...currentPerms, [permission]: !currentPerms[permission as keyof typeof currentPerms] }

        updateProjectMember(memberId, { customPermissions: newPerms as any })
    }

    return (
        <div className="h-full flex flex-col bg-white font-sans">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Project Members</h2>
                    <p className="text-[13px] text-slate-500 font-medium mt-1">Manage access and permissions for this project</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9 rounded-xl">
                    <X size={18} />
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Add Member Section */}
                {!isAddingMember ? (
                    <Button
                        onClick={() => setIsAddingMember(true)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-11 rounded-xl shadow-lg shadow-indigo-100 text-[13px]"
                    >
                        <UserPlus size={16} className="mr-2" />
                        Add Member to Project
                    </Button>
                ) : (
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[14px] font-bold text-slate-800">Add New Member</h3>
                            <Button variant="ghost" size="sm" onClick={() => setIsAddingMember(false)} className="h-7 text-[12px]">
                                Cancel
                            </Button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-[11px] font-bold text-slate-600 mb-1.5 block">Select Member</label>
                                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                    <SelectTrigger className="h-10 rounded-xl text-[13px] font-medium">
                                        <SelectValue placeholder="Choose from workspace members..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {availableMembers.map(member => (
                                            <SelectItem key={member.id} value={member.id} className="text-[13px] font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-5 w-5">
                                                        <AvatarImage src={member.avatar} />
                                                        <AvatarFallback className="text-[9px]">{member.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    {member.name} • {member.email}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-slate-600 mb-1.5 block">Assign Role</label>
                                <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as ProjectRole)}>
                                    <SelectTrigger className="h-10 rounded-xl text-[13px] font-medium">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="ProjectAdmin" className="text-[13px] font-medium">Project Admin</SelectItem>
                                        <SelectItem value="ProjectMember" className="text-[13px] font-medium">Project Member</SelectItem>
                                        <SelectItem value="ProjectViewer" className="text-[13px] font-medium">Project Viewer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                onClick={handleAddMember}
                                disabled={!selectedUserId}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-10 rounded-xl text-[13px]"
                            >
                                Add Member
                            </Button>
                        </div>
                    </div>
                )}

                <Separator />

                {/* Members List */}
                <div className="space-y-3">
                    <h3 className="text-[13px] font-bold text-slate-700">Current Members ({projectMembers.length})</h3>

                    {projectMembers.map(member => {
                        const permissions = member.customPermissions || DEFAULT_PERMISSIONS[member.role]
                        const isEditing = editingMemberId === member.id

                        return (
                            <div key={member.id} className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-md transition-all">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3 flex-1">
                                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                            <AvatarImage src={member.userAvatar} />
                                            <AvatarFallback className="text-[12px] font-bold">{member.userName[0]}</AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-[14px] font-bold text-slate-900 truncate">{member.userName}</h4>
                                                <Badge className={`text-[10px] font-bold px-2 py-0.5 border ${ROLE_COLORS[member.role]}`}>
                                                    <span className="mr-1">{ROLE_ICONS[member.role]}</span>
                                                    {member.role.replace("Project", "")}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                                                <span className="flex items-center gap-1">
                                                    <Mail size={11} />
                                                    {member.userEmail}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={11} />
                                                    Added {new Date(member.addedAt).toLocaleDateString()}
                                                </span>
                                            </div>

                                            {/* Permissions */}
                                            {isEditing && (
                                                <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-2">
                                                    <p className="text-[11px] font-bold text-slate-600 mb-2">Custom Permissions</p>
                                                    {Object.entries(permissions).map(([key, value]) => (
                                                        <div key={key} className="flex items-center justify-between">
                                                            <span className="text-[12px] font-medium text-slate-700 capitalize">
                                                                {key.replace("can", "").replace(/([A-Z])/g, " $1").trim()}
                                                            </span>
                                                            <Switch
                                                                checked={value as boolean}
                                                                onCheckedChange={() => handleTogglePermission(member.id, key as any)}
                                                                className="scale-75"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {member.role !== "ProjectOwner" && (
                                            <>
                                                <Select value={member.role} onValueChange={(v) => handleUpdateRole(member.id, v as ProjectRole)}>
                                                    <SelectTrigger className="h-8 w-32 rounded-lg text-[11px] font-semibold border-slate-200">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        <SelectItem value="ProjectAdmin" className="text-[12px] font-medium">Admin</SelectItem>
                                                        <SelectItem value="ProjectMember" className="text-[12px] font-medium">Member</SelectItem>
                                                        <SelectItem value="ProjectViewer" className="text-[12px] font-medium">Viewer</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setEditingMemberId(isEditing ? null : member.id)}
                                                    className="h-8 w-8 p-0 rounded-lg"
                                                >
                                                    <Settings size={14} />
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveMember(member.id)}
                                                    className="h-8 w-8 p-0 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
