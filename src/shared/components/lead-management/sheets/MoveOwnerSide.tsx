"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { UserCheck, Users } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import { useToast } from "@/shared/components/ui/use-toast"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { Textarea } from "@/shared/components/ui/textarea"
import { validateField } from "../lead-validation"

const USERS = [
    { name: "Rajesh Kumar", role: "Senior Consultant", color: "bg-indigo-100 text-indigo-700" },
    { name: "Anita Sharma", role: "Lead Catalyst", color: "bg-emerald-100 text-emerald-700" },
    { name: "Sunil Moitra", role: "Sales Architect", color: "bg-amber-100 text-amber-700" },
    { name: "Priya Singh", role: "Account Manager", color: "bg-rose-100 text-rose-700" },
    { name: "Unassigned", role: "General Pool", color: "bg-slate-100 text-slate-700" },
]

interface MoveOwnerSideProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (ownerName: string, note?: string) => void
    selectedCount: number
}

export default function MoveOwnerSide({
    open, onOpenChange, onConfirm, selectedCount,
}: MoveOwnerSideProps) {
    const { toast } = useToast()
    const [selected, setSelected] = useState("")
    const [note, setNote] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    useEffect(() => {
        if (open) {
            setSelected("")
            setNote("")
            setErrors({})
            setTouched({})
        }
    }, [open])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const next: Record<string, string> = {}
        if (!selected) next.targetowner = "Please select a target owner"
        const noteErr = validateField("note", note)
        if (noteErr) next.note = noteErr
        setErrors(next)
        setTouched({ targetowner: true, note: true })
        if (Object.keys(next).length > 0) {
            toast({
                title: "Cannot transfer ownership",
                description: next.targetowner ?? next.note ?? "Please review highlighted fields.",
                variant: "destructive",
            })
            return
        }
        onConfirm(selected, note.trim() || undefined)
    }

    return (
        <SideFormSheet
            open={open}
            onOpenChange={onOpenChange}
            title="Transfer Ownership"
            description={`Reassign ${selectedCount} selected lead${selectedCount === 1 ? "" : "s"} to a new team member.`}
            icon={<UserCheck className="w-5 h-5" />}
            onSubmit={handleSubmit}
            submitLabel={`Transfer ${selectedCount} Lead${selectedCount === 1 ? "" : "s"}`}
            submitDisabled={!selected}
            width="md"
            accentColor="#6366f1"
        >
            <div className="space-y-5">
                <Field
                    label="Target Owner"
                    required
                    error={touched.targetowner ? errors.targetowner : undefined}
                >
                    <div className="grid gap-2">
                        {USERS.map((user) => {
                            const active = selected === user.name
                            return (
                                <button
                                    type="button"
                                    key={user.name}
                                    onClick={() => { setSelected(user.name); setTouched((p) => ({ ...p, targetowner: true })) }}
                                    className={`flex items-center justify-between p-3 rounded-none border transition-all text-left ${
                                        active
                                            ? "border-indigo-500 bg-indigo-50/40 shadow-sm"
                                            : "border-[#E5E7EB] hover:border-slate-300 hover:bg-slate-50"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 rounded-none">
                                            <AvatarFallback className={`${user.color} rounded-none text-[12px] font-bold`}>
                                                {user.name.split(" ").map((n) => n[0]).join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-[13px] font-semibold text-[#0F172A]">{user.name}</p>
                                            <p className="text-[11.5px] text-[#64748B]">{user.role}</p>
                                        </div>
                                    </div>
                                    {active && (
                                        <span className="w-2 h-2 bg-indigo-600 rounded-none" />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </Field>

                <Field label="Handover Note" error={touched.note ? errors.note : undefined} hint="Optional · context for the new owner (max 500 chars)">
                    <Textarea
                        value={note}
                        onChange={(e) => {
                            setNote(e.target.value)
                            if (touched.note) setErrors((p) => ({ ...p, note: validateField("note", e.target.value) ?? "" }))
                        }}
                        onBlur={() => { setTouched((p) => ({ ...p, note: true })); setErrors((p) => ({ ...p, note: validateField("note", note) ?? "" })) }}
                        placeholder="Customer is in late-stage negotiation. Pricing discussed but not finalized."
                        rows={3}
                        className="rounded-none border-[#E5E7EB] text-[13px]"
                    />
                </Field>
            </div>
        </SideFormSheet>
    )
}
