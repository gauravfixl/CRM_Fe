"use client"

import React, { useState } from "react"
import {
    X,
    Mail,
    Shield,
    UserPlus,
    CheckCircle2,
    Briefcase
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useTeamStore, UserRole } from "@/shared/data/team-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"

interface InviteUserModalProps {
    isOpen: boolean
    onClose: () => void
}

export function InviteUserModal({ isOpen, onClose }: InviteUserModalProps) {
    const { addMember } = useTeamStore()
    const { activeWorkspaceId } = useWorkspaceStore()
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [role, setRole] = useState<UserRole>("MEMBER")
    const [isSent, setIsSent] = useState(false)

    if (!isOpen) return null

    const handleInvite = () => {
        if (!email.trim() || !name.trim()) return

        setIsSent(true)

        // Add to store (simulated)
        addMember({
            id: `u-${Date.now()}`,
            workspaceId: activeWorkspaceId || 'ws-1',
            name,
            email,
            avatar: `https://i.pravatar.cc/150?u=${email}`,
            role,
            joinedAt: new Date().toISOString().split('T')[0],
            projectsCount: 0
        })

        setTimeout(() => {
            setIsSent(false)
            setEmail("")
            setName("")
            onClose()
        }, 1500)
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white w-full max-w-[500px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
                style={{ zoom: "0.85" }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                            <UserPlus size={20} />
                        </div>
                        <div>
                            <h2 className="text-[18px] font-black text-slate-800 tracking-tight">Invite People</h2>
                            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Workspace Directory</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {isSent ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in duration-300">
                            <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                                <CheckCircle2 size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Invitation Sent!</h3>
                                <p className="text-slate-500 font-medium">We've sent an invite to {email}</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-3.5 h-4 w-4 text-slate-300" />
                                        <Input
                                            placeholder="e.g. John Doe"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="h-12 pl-11 border-slate-200 rounded-xl text-[15px] font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-300" />
                                        <Input
                                            placeholder="name@company.com"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-12 pl-11 border-slate-200 rounded-xl text-[15px] font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[12px] font-black text-slate-500 uppercase tracking-widest ml-1">Role & Permissions</label>
                                    <Select value={role} onValueChange={(val) => setRole(val as UserRole)}>
                                        <SelectTrigger className="h-12 border-slate-200 rounded-xl text-[14px] font-black text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Shield size={14} className="text-slate-400" />
                                                <SelectValue />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MEMBER" className="font-bold">Member (Default)</SelectItem>
                                            <SelectItem value="ADMIN" className="font-bold text-indigo-600">Admin (Full Access)</SelectItem>
                                            <SelectItem value="VIEWER" className="font-bold text-slate-400">Viewer (Read Only)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <p className="text-[11px] text-slate-400 font-bold leading-relaxed text-center px-4">
                                They will receive an email with a link to join your workspace. You can manage permissions later in settings.
                            </p>
                        </>
                    )}
                </div>

                {/* Footer */}
                {!isSent && (
                    <div className="p-6 bg-slate-50 flex items-center justify-end gap-3 border-t border-slate-100">
                        <Button variant="ghost" onClick={onClose} className="text-[14px] font-bold text-slate-500">Cancel</Button>
                        <Button
                            onClick={handleInvite}
                            disabled={!email.trim() || !name.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black h-11 px-8 rounded-xl shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02]"
                        >
                            Send Invitation
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
