"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { Plus, FolderTree } from "lucide-react"
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
import { useScmSettingsStore, type ScmCategory } from "@/shared/data/scm/scm-settings-store"
import { validateField } from "@/shared/components/scm/shared/validation"

type FormShape = { name: string; parent: string; description: string; status: "Active" | "Inactive" }
const empty: FormShape = { name: "", parent: "—", description: "", status: "Active" }

export default function ProductCategoriesPage() {
    const { toast } = useToast()
    const categories = useScmSettingsStore((s) => s.categories)
    const addCategory = useScmSettingsStore((s) => s.addCategory)
    const updateCategory = useScmSettingsStore((s) => s.updateCategory)
    const deleteCategory = useScmSettingsStore((s) => s.deleteCategory)

    const [formOpen, setFormOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<ScmCategory | null>(null)
    const [data, setData] = useState<FormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [deleting, setDeleting] = useState<ScmCategory | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [viewing, setViewing] = useState<ScmCategory | null>(null)

    useEffect(() => {
        if (!formOpen) return
        if (editing && mode === "edit") {
            setData({ name: editing.name, parent: editing.parent, description: editing.description, status: editing.status })
        } else {
            setData(empty)
        }
        setErrors({}); setTouched({})
    }, [formOpen, editing, mode])

    const setField = (k: keyof FormShape, v: string) => {
        setData((d) => ({ ...d, [k]: v as any }))
        if (touched[k]) setErrors((e) => ({ ...e, [k]: validateField("categoryName" === k ? "categoryName" : k, v) ?? "" }))
    }
    const onBlur = (k: keyof FormShape) => {
        setTouched((t) => ({ ...t, [k]: true }))
        const lookupKey = k === "name" ? "categoryName" : k
        setErrors((e) => ({ ...e, [k]: validateField(lookupKey, data[k]) ?? "" }))
    }

    const validateAll = () => {
        const next: Record<string, string> = {}
        const nameErr = validateField("categoryName", data.name)
        if (nameErr) next.name = nameErr
        if (!data.name.trim()) next.name = "This field is required"
        if (!data.status) next.status = "This field is required"
        setErrors(next)
        setTouched({ name: true, parent: true, description: true, status: true })
        return Object.keys(next).length === 0
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateAll()) {
            toast({ title: "Please fix the highlighted fields", variant: "destructive" })
            return
        }
        setSubmitting(true)
        try {
            const payload = { name: data.name.trim(), parent: data.parent || "—", description: data.description.trim(), status: data.status }
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

    const columns: DataTableColumn<ScmCategory>[] = useMemo(
        () => [
            { key: "name", header: "Category Name", sortable: true, render: (r) => <span className="font-medium text-[#0F172A]">{r.name}</span> },
            { key: "parent", header: "Parent", sortable: true, width: "140px" },
            { key: "description", header: "Description", render: (r) => <span className="text-[#64748B]">{r.description || "—"}</span> },
            { key: "status", header: "Status", width: "100px", render: (r) => <StatusBadge status={r.status} /> },
        ],
        []
    )

    const handleAdd = () => { setEditing(null); setMode("create"); setFormOpen(true) }
    const handleEdit = (c: ScmCategory) => { setEditing(c); setMode("edit"); setFormOpen(true) }
    const confirmDelete = () => {
        if (!deleting) return
        deleteCategory(deleting.id)
        toast({ title: "Category deleted", description: deleting.name })
        setDeleting(null)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Product Categories</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Organize products into searchable groups.</p>
                </div>
                <Button onClick={handleAdd} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#2563eb", boxShadow: "0 4px 12px #2563eb33" }}>
                    <Plus className="w-4 h-4 mr-1.5" /> Add Category
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={categories}
                rowKey={(r) => r.id}
                searchPlaceholder="Search categories..."
                searchKeys={["name", "parent", "description"]}
                pageSize={10}
                emptyMessage="No categories yet."
                onRowClick={(row) => setViewing(row)}
                actions={(row) => (
                    <RowActions onEdit={() => handleEdit(row)} onDelete={() => setDeleting(row)} />
                )}
            />

            <RowDetailSheet
                row={viewing}
                columns={columns}
                onOpenChange={(o) => !o && setViewing(null)}
                title={(r) => r.name}
                description={(r) => `Parent: ${r.parent}`}
                icon={<FolderTree className="w-5 h-5" />}
                accentColor="#2563eb"
            />

            <SideFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                title={mode === "edit" ? "Edit Category" : "Add Category"}
                description="Logical grouping for products."
                icon={<FolderTree className="w-5 h-5" />}
                onSubmit={onSubmit}
                loading={submitting}
                submitLabel={mode === "edit" ? "Save" : "Add"}
                width="md"
                accentColor="#2563eb"
            >
                <div className="space-y-4">
                    <Field label="Category Name" required error={touched.name ? errors.name : undefined}>
                        <Input value={data.name} onChange={(e) => setField("name", e.target.value)} onBlur={() => onBlur("name")} placeholder="e.g. Stationery" className="h-10 border-[#E5E7EB] text-[13px]" />
                    </Field>
                    <Field label="Parent Category">
                        <Select value={data.parent} onValueChange={(v) => setField("parent", v)}>
                            <SelectTrigger className="h-10 border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="—">— (Top level)</SelectItem>
                                {categories.filter((c) => !editing || c.id !== editing.id).map((c) => (
                                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Description">
                        <Textarea value={data.description} onChange={(e) => setField("description", e.target.value)} rows={3} placeholder="Optional description" className="border-[#E5E7EB] text-[13px] resize-none" />
                    </Field>
                    <Field label="Status" required>
                        <Select value={data.status} onValueChange={(v) => setField("status", v as "Active" | "Inactive")}>
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
                title="Delete this category?"
                itemLabel={deleting?.name ?? ""}
                onConfirm={confirmDelete}
            />
        </div>
    )
}
