"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { Plus, Tag } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Textarea } from "@/shared/components/ui/textarea"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"

import { DataTable, type DataTableColumn } from "@/shared/components/scm/shared/DataTable"
import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { RowActions, DeleteConfirmDialog } from "@/shared/components/scm/shared/RowActions"
import { RowDetailSheet } from "@/shared/components/scm/shared/RowDetailSheet"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { useScmVendorExtraStore, type ScmVendorCategory } from "@/shared/data/scm/scm-vendor-extra-store"

type FormShape = { name: string; description: string; vendorCount: string; status: "Active" | "Inactive" }
const empty: FormShape = { name: "", description: "", vendorCount: "0", status: "Active" }

export default function VendorCategoriesPage() {
    const { toast } = useToast()
    const categories = useScmVendorExtraStore((s) => s.categories)
    const addCategory = useScmVendorExtraStore((s) => s.addCategory)
    const updateCategory = useScmVendorExtraStore((s) => s.updateCategory)
    const deleteCategory = useScmVendorExtraStore((s) => s.deleteCategory)

    const [formOpen, setFormOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<ScmVendorCategory | null>(null)
    const [data, setData] = useState<FormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [deleting, setDeleting] = useState<ScmVendorCategory | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [viewing, setViewing] = useState<ScmVendorCategory | null>(null)

    useEffect(() => {
        if (!formOpen) return
        if (editing && mode === "edit") {
            setData({ name: editing.name, description: editing.description, vendorCount: String(editing.vendorCount), status: editing.status })
        } else setData(empty)
        setErrors({}); setTouched({})
    }, [formOpen, editing, mode])

    const validate = () => {
        const next: Record<string, string> = {}
        if (!data.name.trim()) next.name = "This field is required"
        else if (data.name.trim().length < 2) next.name = "Minimum 2 characters"
        else if (data.name.trim().length > 60) next.name = "Maximum 60 characters"
        if (data.description.length > 200) next.description = "Maximum 200 characters"
        setErrors(next)
        setTouched({ name: true, description: true, vendorCount: true, status: true })
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
            const payload = { name: data.name.trim(), description: data.description.trim(), vendorCount: Number(data.vendorCount || 0), status: data.status }
            if (mode === "edit" && editing) {
                updateCategory(editing.id, payload)
                toast({ title: "Category updated", description: payload.name })
            } else {
                addCategory(payload)
                toast({ title: "Category added", description: payload.name })
            }
            setFormOpen(false)
        } finally { setSubmitting(false) }
    }

    const columns: DataTableColumn<ScmVendorCategory>[] = useMemo(
        () => [
            { key: "name", header: "Category", sortable: true, render: (r) => <span className="font-medium text-[#0F172A]">{r.name}</span> },
            { key: "description", header: "Description", render: (r) => <span className="text-[#64748B]">{r.description || "—"}</span> },
            { key: "vendorCount", header: "Vendors", width: "100px", align: "right", sortable: true, accessor: (r) => r.vendorCount, render: (r) => <span className="tabular-nums font-semibold">{r.vendorCount}</span> },
            { key: "status", header: "Status", width: "100px", render: (r) => <StatusBadge status={r.status} /> },
        ],
        []
    )

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Vendor Categories</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Organize vendors by what they supply.</p>
                </div>
                <Button onClick={() => { setEditing(null); setMode("create"); setFormOpen(true) }} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#8b5cf6", boxShadow: "0 4px 12px #8b5cf633" }}>
                    <Plus className="w-4 h-4 mr-1.5" /> Add Category
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={categories}
                rowKey={(r) => r.id}
                searchPlaceholder="Search categories..."
                searchKeys={["name", "description"]}
                pageSize={10}
                emptyMessage="No categories yet."
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
                description="Vendor category"
                icon={<Tag className="w-5 h-5" />}
                accentColor="#8b5cf6"
            />

            <SideFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                title={mode === "edit" ? "Edit Category" : "Add Category"}
                description="Vendor category."
                icon={<Tag className="w-5 h-5" />}
                onSubmit={onSubmit}
                loading={submitting}
                submitLabel={mode === "edit" ? "Save" : "Add"}
                width="md"
                accentColor="#8b5cf6"
            >
                <div className="space-y-4">
                    <Field label="Category Name" required error={touched.name ? errors.name : undefined}>
                        <Input value={data.name} onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))} placeholder="e.g. Raw Material Supplier" className="h-10 border-[#E5E7EB] text-[13px]" />
                    </Field>
                    <Field label="Description" error={touched.description ? errors.description : undefined}>
                        <Textarea value={data.description} onChange={(e) => setData((d) => ({ ...d, description: e.target.value }))} rows={3} placeholder="Optional description" className="border-[#E5E7EB] text-[13px] resize-none" />
                    </Field>
                    <Field label="Status" required>
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

            <DeleteConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} title="Delete this category?" itemLabel={deleting ? deleting.name : ""} onConfirm={() => { if (!deleting) return; deleteCategory(deleting.id); toast({ title: "Category deleted", description: deleting.name }); setDeleting(null) }} />
        </div>
    )
}
