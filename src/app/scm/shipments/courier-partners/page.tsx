"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { Plus, Download, Truck, MapPin, Mail, Phone, ExternalLink, Pencil, Trash2, Search } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import { cn } from "@/lib/utils"

import { StatusBadge } from "@/shared/components/scm/shared/StatusBadge"
import { DeleteConfirmDialog } from "@/shared/components/scm/shared/RowActions"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { useScmCouriersStore, type ScmCourier } from "@/shared/data/scm/scm-couriers-store"
import { validateField } from "@/shared/components/scm/shared/validation"

type FormShape = {
    courierName: string
    contactPerson: string
    phone: string
    email: string
    serviceAreas: string
    rateCard: string
    trackingApiUrl: string
    status: "Active" | "Inactive"
}

const empty: FormShape = {
    courierName: "", contactPerson: "", phone: "", email: "",
    serviceAreas: "", rateCard: "", trackingApiUrl: "", status: "Active",
}

const REQUIRED: Array<keyof FormShape> = ["courierName", "contactPerson", "phone", "email", "status"]

// Brand color palette — picked from courier name initial
const BRAND_PALETTE = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#0ea5e9", "#14b8a6", "#ec4899"]
const colorFor = (name: string) => BRAND_PALETTE[name.charCodeAt(0) % BRAND_PALETTE.length]
const initialsOf = (name: string) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase()

export default function CourierPartnersPage() {
    const { toast } = useToast()
    const couriers = useScmCouriersStore((s) => s.couriers)
    const addCourier = useScmCouriersStore((s) => s.addCourier)
    const updateCourier = useScmCouriersStore((s) => s.updateCourier)
    const deleteCourier = useScmCouriersStore((s) => s.deleteCourier)

    const [formOpen, setFormOpen] = useState(false)
    const [mode, setMode] = useState<"create" | "edit">("create")
    const [editing, setEditing] = useState<ScmCourier | null>(null)
    const [data, setData] = useState<FormShape>(empty)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [touched, setTouched] = useState<Record<string, boolean>>({})
    const [deleting, setDeleting] = useState<ScmCourier | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Inactive">("all")

    useEffect(() => {
        if (!formOpen) return
        if (editing && mode === "edit") {
            setData({
                courierName: editing.courierName, contactPerson: editing.contactPerson,
                phone: editing.phone, email: editing.email, serviceAreas: editing.serviceAreas,
                rateCard: editing.rateCard, trackingApiUrl: editing.trackingApiUrl, status: editing.status,
            })
        } else setData(empty)
        setErrors({}); setTouched({})
    }, [formOpen, editing, mode])

    const setField = (k: keyof FormShape, v: string) => {
        setData((d) => ({ ...d, [k]: v as any }))
        if (touched[k]) setErrors((e) => ({ ...e, [k]: validateField(k, v) ?? "" }))
    }
    const onBlur = (k: keyof FormShape) => {
        setTouched((t) => ({ ...t, [k]: true }))
        setErrors((e) => ({ ...e, [k]: validateField(k, data[k]) ?? "" }))
    }

    const validateAll = () => {
        const next: Record<string, string> = {}
        const fields = Object.keys(data) as Array<keyof FormShape>
        for (const f of fields) {
            const err = validateField(f, data[f])
            if (err) next[f] = err
        }
        for (const f of REQUIRED) {
            if (!next[f] && !String(data[f] ?? "").trim()) next[f] = "This field is required"
        }
        setErrors(next)
        setTouched(Object.fromEntries(fields.map((f) => [f, true])))
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
            const payload = {
                courierName: data.courierName.trim(),
                contactPerson: data.contactPerson.trim(),
                phone: data.phone.trim(), email: data.email.trim(),
                serviceAreas: data.serviceAreas.trim(),
                rateCard: data.rateCard.trim(),
                trackingApiUrl: data.trackingApiUrl.trim(),
                status: data.status,
            }
            if (mode === "edit" && editing) {
                updateCourier(editing.id, payload)
                toast({ title: "Courier updated", description: payload.courierName })
            } else {
                addCourier(payload)
                toast({ title: "Courier added", description: payload.courierName })
            }
            setFormOpen(false)
        } finally { setSubmitting(false) }
    }

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        return couriers.filter((c) => {
            if (statusFilter !== "all" && c.status !== statusFilter) return false
            if (!q) return true
            return (
                c.courierName.toLowerCase().includes(q) ||
                c.contactPerson.toLowerCase().includes(q) ||
                c.serviceAreas.toLowerCase().includes(q) ||
                c.email.toLowerCase().includes(q)
            )
        })
    }, [couriers, search, statusFilter])

    const handleExport = () => {
        if (couriers.length === 0) { toast({ title: "Nothing to export", variant: "destructive" }); return }
        const headers = ["Courier", "Contact Person", "Phone", "Email", "Service Areas", "Rate Card", "Tracking API URL", "Status"]
        const rows = couriers.map((c) => [c.courierName, c.contactPerson, c.phone, c.email, c.serviceAreas, c.rateCard, c.trackingApiUrl, c.status])
        const escape = (v: any) => { const s = String(v ?? ""); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
        const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = `scm-couriers-${new Date().toISOString().slice(0, 10)}.csv`; document.body.appendChild(a); a.click(); a.remove()
        URL.revokeObjectURL(url)
        toast({ title: "Export ready", description: `${rows.length} couriers exported` })
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-semibold text-[#0F172A] leading-tight">Courier Partners</h1>
                    <p className="text-[13px] text-[#64748B] mt-0.5">Logistics partners and their tracking integrations.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleExport} className="h-9 px-3 rounded-lg border-[#E5E7EB] text-[#374151] hover:bg-[#F3F4F6] text-[13px]">
                        <Download className="w-4 h-4 mr-1.5" /> Export
                    </Button>
                    <Button onClick={() => { setEditing(null); setMode("create"); setFormOpen(true) }} className="h-9 px-3 rounded-lg text-white text-[13px]" style={{ backgroundColor: "#8b5cf6", boxShadow: "0 4px 12px #8b5cf633" }}>
                        <Plus className="w-4 h-4 mr-1.5" /> Add Courier
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <Stat label="Total Couriers" value={couriers.length} color="#8b5cf6" />
                <Stat label="Active" value={couriers.filter((c) => c.status === "Active").length} color="#10b981" />
                <Stat label="Inactive" value={couriers.filter((c) => c.status === "Inactive").length} color="#94a3b8" />
            </div>

            <div className="bg-white rounded-xl border border-[#EEF1F6] shadow-sm p-3 flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#94A3B8]" />
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search couriers..." className="pl-8 h-9 border-[#E5E7EB] text-[13px]" />
                </div>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                    <SelectTrigger className="h-9 w-[140px] border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
                <span className="text-[12px] text-[#64748B] ml-auto">{filtered.length} courier{filtered.length !== 1 ? "s" : ""}</span>
            </div>

            {filtered.length === 0 ? (
                <div className="bg-white rounded-xl border border-[#EEF1F6] shadow-sm p-12 text-center">
                    <p className="text-[13px] text-[#64748B]">No couriers match your filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((c) => (
                        <CourierCard
                            key={c.id}
                            courier={c}
                            onEdit={() => { setEditing(c); setMode("edit"); setFormOpen(true) }}
                            onDelete={() => setDeleting(c)}
                        />
                    ))}
                </div>
            )}

            <SideFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                title={mode === "edit" ? "Edit Courier" : "Add Courier Partner"}
                description="Logistics provider for shipments."
                icon={<Truck className="w-5 h-5" />}
                onSubmit={onSubmit}
                loading={submitting}
                submitLabel={mode === "edit" ? "Save" : "Add"}
                width="lg"
                accentColor="#8b5cf6"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Courier Name" required error={touched.courierName ? errors.courierName : undefined} className="sm:col-span-2">
                        <Input value={data.courierName} onChange={(e) => setField("courierName", e.target.value)} onBlur={() => onBlur("courierName")} placeholder="e.g. Delhivery" className="h-10 border-[#E5E7EB] text-[13px]" />
                    </Field>
                    <Field label="Contact Person" required error={touched.contactPerson ? errors.contactPerson : undefined}>
                        <Input value={data.contactPerson} onChange={(e) => setField("contactPerson", e.target.value)} onBlur={() => onBlur("contactPerson")} className="h-10 border-[#E5E7EB] text-[13px]" />
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
                    <Field label="Phone" required error={touched.phone ? errors.phone : undefined}>
                        <Input value={data.phone} onChange={(e) => setField("phone", e.target.value)} onBlur={() => onBlur("phone")} placeholder="+91..." className="h-10 border-[#E5E7EB] text-[13px]" />
                    </Field>
                    <Field label="Email" required error={touched.email ? errors.email : undefined}>
                        <Input type="email" value={data.email} onChange={(e) => setField("email", e.target.value)} onBlur={() => onBlur("email")} className="h-10 border-[#E5E7EB] text-[13px]" />
                    </Field>
                    <Field label="Service Areas">
                        <Input value={data.serviceAreas} onChange={(e) => setField("serviceAreas", e.target.value)} placeholder="Pan-India, Metro only" className="h-10 border-[#E5E7EB] text-[13px]" />
                    </Field>
                    <Field label="Rate Card">
                        <Input value={data.rateCard} onChange={(e) => setField("rateCard", e.target.value)} placeholder="e.g. ₹40 base + ₹10/kg" className="h-10 border-[#E5E7EB] text-[13px]" />
                    </Field>
                    <Field label="Tracking API URL" className="sm:col-span-2">
                        <Input value={data.trackingApiUrl} onChange={(e) => setField("trackingApiUrl", e.target.value)} placeholder="https://api.courier.com/track" className="h-10 border-[#E5E7EB] text-[13px]" />
                    </Field>
                </div>
            </SideFormSheet>

            <DeleteConfirmDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)} title="Delete this courier?" itemLabel={deleting ? deleting.courierName : ""} onConfirm={() => { if (!deleting) return; deleteCourier(deleting.id); toast({ title: "Courier deleted", description: deleting.courierName }); setDeleting(null) }} />
        </div>
    )
}

function CourierCard({ courier, onEdit, onDelete }: { courier: ScmCourier; onEdit: () => void; onDelete: () => void }) {
    const accent = colorFor(courier.courierName)
    const initials = initialsOf(courier.courierName)
    return (
        <div className={cn("bg-white rounded-xl border border-[#EEF1F6] shadow-sm overflow-hidden hover:shadow-md transition-all", courier.status === "Inactive" && "opacity-70")}>
            {/* Branded header */}
            <div className="px-5 py-4 flex items-center justify-between gap-3" style={{ background: `linear-gradient(135deg, ${accent}15, ${accent}05)` }}>
                <div className="flex items-center gap-3 min-w-0">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-[16px] shrink-0 shadow-md"
                        style={{ backgroundColor: accent, boxShadow: `0 4px 12px ${accent}40` }}
                    >
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <p className="text-[15px] font-semibold text-[#0F172A] truncate">{courier.courierName}</p>
                        <p className="text-[11.5px] text-[#64748B] truncate">{courier.contactPerson}</p>
                    </div>
                </div>
                <StatusBadge status={courier.status} />
            </div>

            {/* Body */}
            <div className="px-5 py-4 space-y-2.5 text-[12.5px]">
                <Row icon={<Phone className="w-3.5 h-3.5" />} value={courier.phone} />
                <Row icon={<Mail className="w-3.5 h-3.5" />} value={courier.email} />
                <Row icon={<MapPin className="w-3.5 h-3.5" />} value={courier.serviceAreas || "—"} />
                {courier.rateCard && (
                    <div className="bg-[#F8FAFC] rounded-md px-2.5 py-1.5 mt-2">
                        <p className="text-[10.5px] uppercase tracking-wide font-semibold text-[#94A3B8]">Rate Card</p>
                        <p className="text-[12.5px] font-medium text-[#0F172A] mt-0.5">{courier.rateCard}</p>
                    </div>
                )}
                {courier.trackingApiUrl && (
                    <a
                        href={courier.trackingApiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11.5px] font-medium text-blue-600 hover:underline"
                    >
                        Tracking API <ExternalLink className="w-3 h-3" />
                    </a>
                )}
            </div>

            {/* Actions */}
            <div className="px-5 py-3 border-t border-[#EEF1F6] bg-[#FAFBFC] flex items-center justify-end gap-1">
                <Button onClick={onEdit} variant="ghost" size="sm" className="h-8 px-2 text-[12px] text-[#64748B] hover:bg-slate-100">
                    <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                </Button>
                <Button onClick={onDelete} variant="ghost" size="sm" className="h-8 px-2 text-[12px] text-red-600 hover:bg-red-50">
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                </Button>
            </div>
        </div>
    )
}

function Row({ icon, value }: { icon: React.ReactNode; value: string }) {
    return (
        <div className="flex items-center gap-2 text-[#64748B]">
            <span className="shrink-0 text-[#94A3B8]">{icon}</span>
            <span className="truncate text-[#0F172A]">{value}</span>
        </div>
    )
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div
            className="rounded-xl border shadow-sm p-4 transition-all duration-200"
            style={{
                background: `linear-gradient(135deg, ${color}14 0%, ${color}06 45%, #ffffff 100%)`,
                borderColor: `${color}33`,
            }}
        >
            <p className="text-[12px] font-medium text-[#64748B]">{label}</p>
            <p className="text-[22px] font-semibold mt-1 tabular-nums leading-tight" style={{ color }}>{value}</p>
        </div>
    )
}
