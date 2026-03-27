
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"

interface MoveOwnerModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (ownerName: string) => void
    selectedCount: number
}

const USERS = [
    { name: "Rajesh Kumar", role: "Senior Consultant", color: "bg-indigo-100 text-indigo-700" },
    { name: "Anita Sharma", role: "Lead Catalyst", color: "bg-emerald-100 text-emerald-700" },
    { name: "Sunil Moitra", role: "Sales Architect", color: "bg-amber-100 text-amber-700" },
    { name: "Unassigned", role: "General Pool", color: "bg-slate-100 text-slate-700" },
]

export function MoveOwnerModal({ isOpen, onClose, onConfirm, selectedCount }: MoveOwnerModalProps) {
    const [selectedUser, setSelectedUser] = React.useState("")

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] border-none shadow-2xl rounded-2xl p-0 overflow-hidden">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white">
                    <DialogTitle className="text-2xl font-black uppercase tracking-tight mb-2">Transfer Ownership</DialogTitle>
                    <DialogDescription className="text-indigo-100 font-medium">
                        You are about to reassign <span className="text-white font-black underline decoration-2">{selectedCount} Lead Records</span> to a new team member.
                    </DialogDescription>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        <Label className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Select Target Owner</Label>
                        <div className="grid gap-3">
                            {USERS.map((user) => (
                                <button
                                    key={user.name}
                                    onClick={() => setSelectedUser(user.name)}
                                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${selectedUser === user.name
                                            ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                                            : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className={user.color}>
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                                            <p className="text-[11px] text-slate-500 font-medium">{user.role}</p>
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
                </div>

                <DialogFooter className="p-8 pt-0 flex gap-3">
                    <Button variant="ghost" onClick={onClose} className="flex-1 font-bold text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl h-12">Cancel</Button>
                    <Button
                        disabled={!selectedUser}
                        onClick={() => onConfirm(selectedUser)}
                        className="flex-[2] bg-indigo-600 hover:bg-indigo-700 font-bold text-white rounded-xl h-12 shadow-lg shadow-indigo-100 disabled:opacity-50"
                    >
                        Confirm Transfer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
