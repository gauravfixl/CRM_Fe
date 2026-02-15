"use client"

import React, { useState } from "react"
import {
    X,
    Users,
    Type,
    AlignLeft,
    LayoutGrid,
    CheckCircle2,
    Crown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useTeamStore } from "@/shared/data/team-store"
import { useWorkspaceStore } from "@/shared/data/workspace-store"

interface CreateTeamModalProps {
    isOpen: boolean
    onClose: () => void
}

export function CreateTeamModal({ isOpen, onClose }: CreateTeamModalProps) {
    const { addTeam, getMembersByWorkspace } = useTeamStore()
    const { activeWorkspaceId } = useWorkspaceStore()

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [leadId, setLeadId] = useState("")
    const [avatar, setAvatar] = useState("🎨")
    const [isCreated, setIsCreated] = useState(false)

    const workspaceMembers = activeWorkspaceId ? getMembersByWorkspace(activeWorkspaceId) : []

    if (!isOpen) return null

    const handleCreate = () => {
        if (!name.trim() || !leadId) return

        setIsCreated(true)

        const lead = workspaceMembers.find(m => m.id === leadId)

        addTeam({
            id: `team-${Date.now()}`,
            workspaceId: activeWorkspaceId || 'ws-1',
            name,
            description,
            memberIds: [leadId], // Lead is the first member
            leadId: leadId,      // Storing the specific lead ID
            avatar,
            createdAt: new Date().toISOString().split('T')[0]
        })

        setTimeout(() => {
            setIsCreated(false)
            setName("")
            setDescription("")
            onClose()
        }, 1500)
    }

    const avatars = ["🎨", "🚀", "💅", "⚙️", "📊", "🔒", "🌐", "📱"]

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white w-full max-w-[550px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
                style={{ zoom: "0.85" }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                            <Users size={20} />
                        </div>
                        <div>
                            <h2 className="text-[18px] font-black text-slate-800 tracking-tight">Create New Team</h2>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Workspace Organization</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {isCreated ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in duration-300">
                            <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                                <CheckCircle2 size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Team Created!</h3>
                                <p className="text-slate-500 font-medium">"{name}" is now part of your workspace.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Team Name</label>
                                    <div className="relative">
                                        <Type className="absolute left-4 top-3.5 h-4 w-4 text-slate-300" />
                                        <Input
                                            placeholder="e.g. Frontend Core, Marketing Ops"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="h-12 pl-11 border-slate-200 rounded-xl text-[15px] font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Team Icon / Avatar</label>
                                    <div className="flex items-center gap-3">
                                        {avatars.map(a => (
                                            <button
                                                key={a}
                                                onClick={() => setAvatar(a)}
                                                className={`h-10 w-10 rounded-xl border-2 flex items-center justify-center text-xl transition-all ${avatar === a ? "border-indigo-600 bg-indigo-50 scale-110 shadow-lg shadow-indigo-100" : "border-slate-100 hover:border-slate-200"}`}
                                            >
                                                {a}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Description</label>
                                    <div className="relative">
                                        <AlignLeft className="absolute left-4 top-4 h-4 w-4 text-slate-300" />
                                        <Textarea
                                            placeholder="What does this team do?"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="min-h-[100px] pl-11 py-3.5 border-slate-200 rounded-xl text-[14px] font-bold text-slate-600 focus:ring-2 focus:ring-indigo-500/10 transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Team Lead</label>
                                    <Select value={leadId} onValueChange={setLeadId}>
                                        <SelectTrigger className="h-12 border-slate-200 rounded-xl text-[14px] font-black text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Crown size={14} className="text-amber-500" />
                                                <SelectValue placeholder="Select a lead..." />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {workspaceMembers.map(m => (
                                                <SelectItem key={m.id} value={m.id} className="font-bold">
                                                    {m.name} ({m.role})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                {!isCreated && (
                    <div className="p-6 bg-slate-50 flex items-center justify-end gap-3 border-t border-slate-100">
                        <Button variant="ghost" onClick={onClose} className="text-[14px] font-bold text-slate-500">Cancel</Button>
                        <Button
                            onClick={handleCreate}
                            disabled={!name.trim() || !leadId}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black h-11 px-8 rounded-xl shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02]"
                        >
                            Create Team
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
