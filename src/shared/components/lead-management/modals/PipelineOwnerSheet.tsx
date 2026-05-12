"use client"

import React, { useEffect, useState } from "react"
import { SideFormSheet } from "@/shared/components/ui/side-form-sheet"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import { Users } from "lucide-react"

interface PipelineOwnerSheetProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (ownerName: string) => void
    selectedCount: number
    currentOwner?: string
}

const USERS = [
    { name: "Rajesh Kumar", role: "Senior Consultant", color: "bg-indigo-100 text-indigo-700" },
    { name: "Anita Sharma", role: "Lead Catalyst", color: "bg-emerald-100 text-emerald-700" },
    { name: "Sunil Moitra", role: "Sales Architect", color: "bg-amber-100 text-amber-700" },
    { name: "David Miller", role: "Account Executive", color: "bg-blue-100 text-blue-700" },
    { name: "Unassigned", role: "General Pool", color: "bg-slate-100 text-slate-700" },
]

export function PipelineOwnerSheet({
    isOpen,
    onClose,
    onConfirm,
    selectedCount,
    currentOwner,
}: PipelineOwnerSheetProps) {
    const [selectedUser, setSelectedUser] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        if (isOpen) {
            setSelectedUser(currentOwner || "")
            setError("")
        }
    }, [isOpen, currentOwner])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedUser) {
            setError("Please select an owner before confirming")
            return
        }
        onConfirm(selectedUser)
    }

    return (
        <SideFormSheet
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose()
            }}
            title="Transfer Ownership"
            description={`Reassign ${selectedCount} ${selectedCount === 1 ? "lead" : "leads"} to a new team member.`}
            icon={<Users className="h-5 w-5" />}
            accentColor="#4f46e5"
            width="md"
            onSubmit={handleSubmit}
            submitLabel="Confirm Transfer"
            submitDisabled={!selectedUser}
        >
            <div className="space-y-3">
                <p className="text-[11px] font-bold uppercase text-slate-400 tracking-widest">
                    Select Target Owner
                </p>
                {error && (
                    <p className="text-[12px] text-rose-500 font-medium">{error}</p>
                )}
                <div className="grid gap-3">
                    {USERS.map((user) => (
                        <button
                            type="button"
                            key={user.name}
                            onClick={() => {
                                setSelectedUser(user.name)
                                setError("")
                            }}
                            className={`flex items-center justify-between p-3 border-2 transition-all text-left rounded-none ${
                                selectedUser === user.name
                                    ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                                    : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9 rounded-none">
                                    <AvatarFallback className={`${user.color} rounded-none`}>
                                        {user.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-slate-900 text-[13px]">
                                        {user.name}
                                    </p>
                                    <p className="text-[11px] text-slate-500 font-medium">
                                        {user.role}
                                    </p>
                                </div>
                            </div>
                            {selectedUser === user.name && (
                                <div className="h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center">
                                    <div className="h-2 w-2 rounded-full bg-white" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </SideFormSheet>
    )
}
