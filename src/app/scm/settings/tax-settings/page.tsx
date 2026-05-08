"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { Plus, Percent } from "lucide-react"
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
import { useScmSettingsStore, type ScmTaxRate } from "@/shared/data/scm/scm-settings-store"

const REGIONS = ["India", "United States", "United Kingdom", "United Arab Emirates", "Singapore"]

type FormShape = { name: string; percentage: string; region: string; status: "Active" | "Inactive" }
const empty: FormShape = { name: "", percentage: "", region: "India", status: "Active" }

export default function TaxSettingsPage() {
    const { toast } = useToast()
    const taxes = useScmSettingsStore((s) => s.taxes)
    const addTax = useScmSettingsStore((s) => s.addTax)
    const updateTax = useScmSettingsStore((s) => s.updateTax)
    const deleteTax = useScmSettingsStore((s) => s.deleteTax)

    const [formOpen, setFormOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<ScmTaxRate | null>(null)
    const [data, setData] = useState<FormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [deleting, setDeleting] = useState<ScmTaxRate | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [viewing, setViewing] = useState<ScmTaxRate | null>(null)

    useEffect(() => {
        if (!formOpen) return
        if (editing && mode === "edit") {
            setData({ name: editing.name, percentage: String(editing.percentage), region: editing.region, status: editing.status })
        } else {
            setData(empty)
        }
        setErrors({}); setTouched({})
    }, [formOpen, editing, mode])

    const validate = () => {
        const next: Record<string, string> = {}
        if (!data.name.trim()) next.name = "This field is required"
        else if (data.name.trim().length > 40) next.name = "Maximum 40 characters"
        const pct = Number(data.percentage)
        if (data.percentage === "" || Number.isNaN(pct)) next.percentage = "Enter a valid percentage"
        else if (pct < 0) next.percentage = "Cannot be negative"
        else if (pct > 100) next.percentage = "Cannot exceed 100"
        if (!data.region) next.region = "This field is required"
        if (!data.status) next.status = "This field is required"
        setErrors(next)
        setTouched({ name: true, percentage: true, region: true, status: true })
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
            const payload = { name: data.name.trim(), percentage: Number(data.percentage), region: data.region, status: data.status }
            if (mode === "edit" && editing) {
                updateTax(editing.id, payload)
                toast({ title: "Tax updated", description: payload.name })
            } else {
                addTax(payload)
                toast({ title: "Tax added", description: payload.name })
            }
            setFormOpen(false)
        } finally { setSubmitting(false) }
    }

    const columns: DataTableColumn<ScmTaxRate>[] = useMemo(
        () => [
            { key: "name", header: "Tax Name", sortable: true, render: (r) => <span className="font-medium text-[#0F172A]">{r.name}</span> },
            { key: "percentage", header: "Rate %", width: "100px", align: "right", sortable: true, accessor: (r) => r.percentage, render: (r) => <span className="tabular-nums font-semibold">{r.percentage}%</span> },
            { key: "region", header: "Region", sortable: true, width: "200px" },
            { key: "status", header: "Status", width: "100px", render: (r) => <StatusBadge status={r.status} /> },
        ],
        []
    )

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Tax Settings</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Manage tax rates applied to products and orders.</p>
                </div>
                <Button onClick={() => { setEditing(null); setMode("create"); setFormOpen(true) }} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#2563eb", boxShadow: "0 4px 12px #2563eb33" }}>
                    <Plus className="w-4 h-4 mr-1.5" /> Add Tax Rate
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={taxes}
                rowKey={(r) => r.id}
                searchPlaceholder="Search taxes..."
                searchKeys={["name", "region"]}
                pageSize={10}
                emptyMessage="No tax rates yet."
                onRowClick={(row) => setViewing(row)}
                actions={(row) => (
                    <RowActions onEdit={() => { setEditing(row); setMode("edit"); setFormOpen(true) }} onDelete={() => setDeleting(row)} />
                )}
            />

            <RowDetailSheet
                row={viewing}
                columns={columns}
                onOpenChange={(o) => !o && setViewing(null)}
                title={(r) => r.name}
                description={(r) => `${r.percentage}% · ${r.region}`}
                icon={<Percent className="w-5 h-5" />}
                accentColor="#2563eb"
            />

            <SideFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                title={mode === "edit" ? "Edit Tax Rate" : "Add Tax Rate"}
                description="A tax rate that can be applied to products and line items."
                icon={<Percent className="w-5 h-5" />}
                onSubmit={onSubmit}
                loading={submitting}
                submitLabel={mode === "edit" ? "Save" : "Add"}
                width="md"
                accentColor="#2563eb"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Tax Name" required error={touched.name ? errors.name : undefined} className="sm:col-span-2">
                        <Input value={data.name} onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))} placeholder="e.g. GST 18%" className="h-10 border-[#E5E7EB] text-[13px]" />
                    </Field>
                    <Field label="Percentage" required error={touched.percentage ? errors.percentage : undefined}>
                        <Input type="number" min="0" max="100" step="0.01" value={data.percentage} onChange={(e) => setData((d) => ({ ...d, percentage: e.target.value }))} placeholder="18" className="h-10 border-[#E5E7EB] text-[13px] tabular-nums" />
                    </Field>
                    <Field label="Region" required error={touched.region ? errors.region : undefined}>
                        <Select value={data.region} onValueChange={(v) => setData((d) => ({ ...d, region: v }))}>
                            <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                            <SelectContent>{REGIONS.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}</SelectContent>
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
                title="Delete this tax rate?"
                itemLabel={deleting ? `${deleting.name} (${deleting.region})` : ""}
                onConfirm={() => {
                    if (!deleting) return
                    deleteTax(deleting.id)
                    toast({ title: "Tax deleted", description: deleting.name })
                    setDeleting(null)
                }}
            />
        </div>
    )
}
