"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { Plus, Ruler } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { RowActions, DeleteConfirmDialog } from "@/shared/components/scm/shared/RowActions"
import { RowDetailSheet } from "@/shared/components/scm/shared/RowDetailSheet"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { useScmSettingsStore, type ScmUnit } from "@/shared/data/scm/scm-settings-store"

const TYPES = ["Count", "Weight", "Volume", "Length"] as const

type FormShape = { name: string; abbreviation: string; type: typeof TYPES[number]; status: "Active" | "Inactive" }
const empty: FormShape = { name: "", abbreviation: "", type: "Count", status: "Active" }

export default function UnitManagementPage() {
    const { toast } = useToast()
    const units = useScmSettingsStore((s) => s.units)
    const addUnit = useScmSettingsStore((s) => s.addUnit)
    const updateUnit = useScmSettingsStore((s) => s.updateUnit)
    const deleteUnit = useScmSettingsStore((s) => s.deleteUnit)

    const [formOpen, setFormOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<ScmUnit | null>(null)
    const [data, setData] = useState<FormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [deleting, setDeleting] = useState<ScmUnit | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [viewing, setViewing] = useState<ScmUnit | null>(null)

    useEffect(() => {
        if (!formOpen) return
        if (editing && mode === "edit") {
            setData({ name: editing.name, abbreviation: editing.abbreviation, type: editing.type, status: editing.status })
        } else {
            setData(empty)
        }
        setErrors({}); setTouched({})
    }, [formOpen, editing, mode])

    const validate = () => {
        const next: Record<string, string> = {}
        if (!data.name.trim()) next.name = "This field is required"
        else if (data.name.trim().length > 30) next.name = "Maximum 30 characters"
        if (!data.abbreviation.trim()) next.abbreviation = "This field is required"
        else if (!/^[A-Z]{1,6}$/.test(data.abbreviation.trim())) next.abbreviation = "Use 1–6 uppercase letters"
        if (!data.type) next.type = "This field is required"
        if (!data.status) next.status = "This field is required"
        setErrors(next)
        setTouched({ name: true, abbreviation: true, type: true, status: true })
        return Object.keys(next).length === 0
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) {
            toast({ title: "Please fix the highlighted fields", variant: "destructive" })
            return
        }
        setSubmitting(true)
        try {
            const payload = { name: data.name.trim(), abbreviation: data.abbreviation.trim().toUpperCase(), type: data.type, status: data.status }
            if (mode === "edit" && editing) {
                updateUnit(editing.id, payload)
                toast({ title: "Unit updated", description: payload.name })
            } else {
                addUnit(payload)
                toast({ title: "Unit added", description: payload.name })
            }
            setFormOpen(false)
        } finally { setSubmitting(false) }
    }

    const columns: DataTableColumn<ScmUnit>[] = useMemo(
        () => [
            { key: "name", header: "Unit Name", sortable: true, render: (r) => <span className="font-medium text-[#0F172A]">{r.name}</span> },
            { key: "abbreviation", header: "Abbreviation", sortable: true, width: "140px", render: (r) => <span className="font-mono text-[12.5px] uppercase">{r.abbreviation}</span> },
            { key: "type", header: "Type", sortable: true, width: "120px" },
            { key: "status", header: "Status", width: "100px", render: (r) => <StatusBadge status={r.status} /> },
        ],
        []
    )

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Unit Management</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Define units of measurement used across the catalog.</p>
                </div>
                <Button onClick={() => { setEditing(null); setMode("create"); setFormOpen(true) }} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#2563eb", boxShadow: "0 4px 12px #2563eb33" }}>
                    <Plus className="w-4 h-4 mr-1.5" /> Add Unit
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={units}
                rowKey={(r) => r.id}
                searchPlaceholder="Search units..."
                searchKeys={["name", "abbreviation", "type"]}
                pageSize={10}
                emptyMessage="No units yet."
                onRowClick={(row) => setViewing(row)}
                actions={(row) => (
                    <RowActions onEdit={() => { setEditing(row); setMode("edit"); setFormOpen(true) }} onDelete={() => setDeleting(row)} />
                )}
            />

            <RowDetailSheet
                row={viewing}
                columns={columns}
                onOpenChange={(o) => !o && setViewing(null)}
                title={(r) => `${r.name} (${r.abbreviation})`}
                description={(r) => `Type: ${r.type}`}
                icon={<Ruler className="w-5 h-5" />}
                accentColor="#2563eb"
            />

            <SideFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                title={mode === "edit" ? "Edit Unit" : "Add Unit"}
                description="Unit of measurement."
                icon={<Ruler className="w-5 h-5" />}
                onSubmit={onSubmit}
                loading={submitting}
                submitLabel={mode === "edit" ? "Save" : "Add"}
                width="md"
                accentColor="#2563eb"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Unit Name" required error={touched.name ? errors.name : undefined} className="sm:col-span-2">
                        <Input value={data.name} onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))} placeholder="e.g. Kilogram" className="h-10 border-[#E5E7EB] text-[13px]" />
                    </Field>
                    <Field label="Abbreviation" required error={touched.abbreviation ? errors.abbreviation : undefined}>
                        <Input value={data.abbreviation} onChange={(e) => setData((d) => ({ ...d, abbreviation: e.target.value.toUpperCase() }))} placeholder="KG" className="h-10 border-[#E5E7EB] text-[13px] uppercase" />
                    </Field>
                    <Field label="Type" required>
                        <Select value={data.type} onValueChange={(v) => setData((d) => ({ ...d, type: v as any }))}>
                            <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                            <SelectContent>{TYPES.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}</SelectContent>
                        </Select>
                    </Field>
                    <Field label="Status" required className="sm:col-span-2">
                        <Select value={data.status} onValueChange={(v) => setData((d) => ({ ...d, status: v as "Active" | "Inactive" }))}>
                            <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </SideFormSheet>

            <DeleteConfirmDialog
                open={!!deleting}
                onOpenChange={(o) => !o && setDeleting(null)}
                title="Delete this unit?"
                itemLabel={deleting ? `${deleting.name} (${deleting.abbreviation})` : ""}
                onConfirm={() => {
                    if (!deleting) return
                    deleteUnit(deleting.id)
                    toast({ title: "Unit deleted", description: deleting.name })
                    setDeleting(null)
                }}
            />
        </div>
    )
}
