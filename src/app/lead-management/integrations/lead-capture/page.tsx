"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
    Share2, Plus, Search, ChevronLeft, Globe, MessageSquare, Link2,
    Database, Zap, RefreshCw, Trash2, Settings2, Code, Filter, Pencil,
} from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { useToast } from "@/shared/components/ui/use-toast"
import IntegrationFormSide, { type IntegrationFormShape } from "@/shared/components/lead-management/sheets/IntegrationFormSide"
import { DeleteConfirmationModal } from "@/shared/components/lead-management/modals/DeleteConfirmationModal"

interface LeadSource extends Partial<IntegrationFormShape> {
    id: string
    integrationName: string
    provider: string
    leads: number
    lastSync: string
    health: "Healthy" | "Warning" | "Critical"
    integrationStatus: string
}

const PROVIDER_OPTIONS = [
    "Embedded HTML Form", "REST API Webhook", "Native App Sync",
    "Intercom", "Typeform", "JotForm", "WordPress Form", "Zapier", "Other",
]

const INITIAL: LeadSource[] = [
    { id: "SRC-001", integrationName: "Main Website Form", provider: "Embedded HTML Form", leads: 1240, lastSync: "2m ago", health: "Healthy", integrationStatus: "Active" },
    { id: "SRC-002", integrationName: "Contact Us Chatbot", provider: "Intercom", leads: 450, lastSync: "1h ago", health: "Healthy", integrationStatus: "Active" },
    { id: "SRC-003", integrationName: "LinkedIn Lead Gen", provider: "Native App Sync", leads: 820, lastSync: "5m ago", health: "Healthy", integrationStatus: "Active" },
    { id: "SRC-004", integrationName: "Typeform Survey", provider: "Typeform", leads: 124, lastSync: "2d ago", health: "Warning", integrationStatus: "Paused" },
]

export default function LeadCapturePage() {
    const router = useRouter()
    const { toast } = useToast()

    const [sources, setSources] = useState<LeadSource[]>(INITIAL)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [healthFilter, setHealthFilter] = useState<string>("all")

    const [formOpen, setFormOpen] = useState(false)
    const [editing, setEditing] = useState<LeadSource | null>(null)
    const [deleting, setDeleting] = useState<LeadSource | null>(null)

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase()
        return sources.filter((s) => {
            if (statusFilter !== "all" && s.integrationStatus !== statusFilter) return false
            if (healthFilter !== "all" && s.health !== healthFilter) return false
            if (!q) return true
            return s.integrationName.toLowerCase().includes(q) || s.provider.toLowerCase().includes(q)
        })
    }, [sources, search, statusFilter, healthFilter])

    const stats = useMemo(() => {
        const totalLeads = sources.reduce((acc, s) => acc + s.leads, 0)
        const active = sources.filter((s) => s.integrationStatus === "Active").length
        const healthy = sources.filter((s) => s.health === "Healthy").length
        const uptime = sources.length === 0 ? 0 : Math.round((healthy / sources.length) * 100)
        return { totalLeads, active, healthy, uptime }
    }, [sources])

    const openCreate = () => { setEditing(null); setFormOpen(true) }
    const openEdit = (s: LeadSource) => { setEditing(s); setFormOpen(true) }

    const handleSubmit = (data: IntegrationFormShape) => {
        if (editing) {
            setSources((prev) => prev.map((s) => s.id === editing.id ? { ...s, ...data } : s))
            toast({ title: "Source updated", description: data.integrationName })
        } else {
            const newSrc: LeadSource = {
                id: `SRC-${String(sources.length + 1).padStart(3, "0")}`,
                ...data,
                leads: 0,
                lastSync: "Never",
                health: "Healthy",
            }
            setSources((prev) => [newSrc, ...prev])
            toast({ title: "Source added", description: data.integrationName })
        }
        setFormOpen(false)
        setEditing(null)
    }

    const confirmDelete = () => {
        if (!deleting) return
        setSources((prev) => prev.filter((s) => s.id !== deleting.id))
        toast({ title: "Source disconnected", description: deleting.integrationName })
        setDeleting(null)
    }

    const handleTest = (s: LeadSource) => {
        toast({ title: "Test ingestion sent", description: `Sample payload dispatched to ${s.integrationName}.` })
    }

    return (
        <div className="space-y-5 pb-12 max-w-[1600px] mx-auto" style={{ zoom: 0.9 }}>
            {/* Header — tinted */}
            <div
                className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-5 border shadow-sm rounded-none"
                style={{
                    background: "linear-gradient(135deg, #6366f114 0%, #6366f106 45%, #ffffff 100%)",
                    borderColor: "#6366f133",
                }}
            >
                <div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push("/lead-management")}
                        className="-ml-2 h-7 text-[11px] font-semibold text-slate-400 hover:text-indigo-600 rounded-none"
                    >
                        <ChevronLeft className="h-3 w-3 mr-1" /> Back to Dashboard
                    </Button>
                    <div className="flex items-center gap-3 mt-1">
                        <div
                            className="p-2 text-white shadow-sm rounded-none"
                            style={{ background: "#6366f1", boxShadow: "0 4px 12px #6366f133" }}
                        >
                            <Share2 className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="text-[20px] font-semibold text-slate-900 leading-tight">Lead Capture</h1>
                            <p className="text-[12.5px] text-slate-500 max-w-2xl">
                                Configure ingestion endpoints — forms, webhooks and external sources feeding the lead pipeline.
                            </p>
                        </div>
                    </div>
                </div>
                <Button
                    onClick={openCreate}
                    className="h-9 text-white font-semibold px-4 rounded-none"
                    style={{ background: "#6366f1", boxShadow: "0 4px 12px #6366f133" }}
                >
                    <Plus className="h-4 w-4 mr-1.5" /> Add Source
                </Button>
            </div>

            {/* Stat strip — tinted */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Stat label="Active Sources" value={stats.active} accent="#6366f1" icon={<Link2 className="w-4 h-4" />} helper={`of ${sources.length} total`} />
                <Stat label="Total Leads" value={stats.totalLeads.toLocaleString()} accent="#10b981" icon={<Database className="w-4 h-4" />} helper="all-time ingested" />
                <Stat label="Healthy Endpoints" value={stats.healthy} accent="#3b82f6" icon={<Zap className="w-4 h-4" />} helper={`${stats.uptime}% uptime`} />
                <Stat label="Avg Sync Latency" value="1.2s" accent="#f59e0b" icon={<RefreshCw className="w-4 h-4" />} helper="real-time edge" />
            </div>

            {/* Filter bar */}
            <div className="bg-white border border-[#EEF1F6] shadow-sm rounded-none p-3 flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#94A3B8]" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or provider..."
                        className="pl-8 h-9 rounded-none border-[#E5E7EB] text-[13px]"
                    />
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#64748B]">
                    <Filter className="w-3.5 h-3.5" /> Filter
                </span>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-9 w-[140px] rounded-none border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Paused">Paused</SelectItem>
                        <SelectItem value="Disconnected">Disconnected</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={healthFilter} onValueChange={setHealthFilter}>
                    <SelectTrigger className="h-9 w-[140px] rounded-none border-[#E5E7EB] text-[13px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All health</SelectItem>
                        <SelectItem value="Healthy">Healthy</SelectItem>
                        <SelectItem value="Warning">Warning</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                </Select>
                {(statusFilter !== "all" || healthFilter !== "all" || search) && (
                    <Button
                        variant="ghost"
                        onClick={() => { setSearch(""); setStatusFilter("all"); setHealthFilter("all") }}
                        className="h-9 rounded-none text-[12px] text-[#64748B]"
                    >
                        Clear
                    </Button>
                )}
                <span className="text-[11.5px] text-[#94A3B8] ml-auto">{filtered.length} of {sources.length}</span>
            </div>

            {/* Table */}
            <div className="bg-white border border-[#EEF1F6] shadow-sm rounded-none overflow-x-auto">
                <table className="w-full text-[12.5px]">
                    <thead className="bg-slate-50 border-b border-[#EEF1F6] text-[10.5px] font-bold uppercase tracking-wider text-[#64748B]">
                        <tr>
                            <th className="px-4 py-2.5 text-left">Source</th>
                            <th className="px-4 py-2.5 text-left">Provider</th>
                            <th className="px-4 py-2.5 text-right w-[100px]">Leads</th>
                            <th className="px-4 py-2.5 text-left w-[120px]">Health</th>
                            <th className="px-4 py-2.5 text-left w-[110px]">Status</th>
                            <th className="px-4 py-2.5 text-left w-[110px]">Last Sync</th>
                            <th className="px-4 py-2.5 text-right w-[140px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-10 text-center text-[#94A3B8]">
                                    No sources match the current filters.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((s) => (
                                <tr key={s.id} className="hover:bg-slate-50/60">
                                    <td className="px-4 py-2.5">
                                        <div className="flex items-center gap-2">
                                            <span className="w-7 h-7 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-none border border-indigo-100">
                                                {s.provider.includes("HTML") ? <Code className="w-3.5 h-3.5" /> :
                                                    s.provider.includes("Intercom") ? <MessageSquare className="w-3.5 h-3.5" /> :
                                                        <Globe className="w-3.5 h-3.5" />}
                                            </span>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-[#0F172A]">{s.integrationName}</p>
                                                <p className="text-[10.5px] text-[#94A3B8] font-mono">{s.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <span className="inline-flex items-center px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider rounded-none border bg-white text-slate-600 border-slate-200">
                                            {s.provider}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 text-right tabular-nums font-bold text-[#0F172A]">{s.leads.toLocaleString()}</td>
                                    <td className="px-4 py-2.5">
                                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                                            s.health === "Healthy" ? "text-emerald-700" :
                                                s.health === "Warning" ? "text-amber-700" : "text-red-700"
                                        }`}>
                                            <span className={`w-2 h-2 ${
                                                s.health === "Healthy" ? "bg-emerald-500" :
                                                    s.health === "Warning" ? "bg-amber-500" : "bg-red-500"
                                            }`} />
                                            {s.health}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <span className={`inline-flex items-center px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wider rounded-none border ${
                                            s.integrationStatus === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                s.integrationStatus === "Paused" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                    "bg-slate-50 text-slate-700 border-slate-200"
                                        }`}>
                                            {s.integrationStatus}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2.5 tabular-nums text-[#64748B]">{s.lastSync}</td>
                                    <td className="px-4 py-2.5 text-right">
                                        <div className="inline-flex items-center gap-0.5">
                                            <Button onClick={() => handleTest(s)} size="sm" variant="ghost" className="h-7 px-1.5 rounded-none text-[#64748B] hover:bg-slate-100" title="Test">
                                                <Zap className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button onClick={() => openEdit(s)} size="sm" variant="ghost" className="h-7 px-1.5 rounded-none text-blue-600 hover:bg-blue-50" title="Edit">
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button onClick={() => setDeleting(s)} size="sm" variant="ghost" className="h-7 px-1.5 rounded-none text-red-600 hover:bg-red-50" title="Disconnect">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Side-slide form */}
            <IntegrationFormSide
                open={formOpen}
                onOpenChange={(o) => { setFormOpen(o); if (!o) setEditing(null) }}
                initialData={editing as Partial<IntegrationFormShape> | null}
                providerOptions={PROVIDER_OPTIONS}
                onSubmit={handleSubmit}
                accentColor="#6366f1"
                title={editing ? "Edit Capture Source" : "Add Capture Source"}
                description="Configure a new ingestion endpoint with provider type, credentials, and webhook URL."
            />

            <DeleteConfirmationModal
                isOpen={!!deleting}
                onClose={() => setDeleting(null)}
                onConfirm={confirmDelete}
                title="Disconnect this source?"
                description="This action will stop data ingestion from this source. Existing leads remain in the system."
                itemName={deleting?.integrationName}
            />
        </div>
    )
}

function Stat({ label, value, icon, accent, helper }: { label: string; value: string | number; icon: React.ReactNode; accent: string; helper?: string }) {
    return (
        <div
            className="border shadow-sm p-4 rounded-none"
            style={{ background: `linear-gradient(135deg, ${accent}14 0%, ${accent}06 45%, #ffffff 100%)`, borderColor: `${accent}33` }}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[12px] font-medium text-[#64748B] truncate">{label}</p>
                    <p className="mt-1.5 text-[20px] font-bold tabular-nums leading-tight truncate" style={{ color: accent }}>{value}</p>
                    {helper && <p className="text-[11px] text-[#94A3B8] mt-1 truncate">{helper}</p>}
                </div>
                <div className="w-9 h-9 rounded-none flex items-center justify-center text-white shrink-0" style={{ background: accent, boxShadow: `0 4px 12px ${accent}33` }}>
                    {icon}
                </div>
            </div>
        </div>
    )
}
