"use client"

import { useState, useMemo } from "react"
import {
    Plus, Search, RefreshCw, Download, ArrowLeftRight,
    Clock, Trash2, Edit, Loader2, X, Save,
    CheckCircle2, AlertCircle, Activity, Database,
    ArrowRight, Play
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"
import { toast } from "@/shared/utils/toast"

type SyncMapping = {
    id: string
    name: string
    sourceSystem: string
    targetSystem: string
    sourceField: string
    targetField: string
    transform: string
    status: string
    enabled: boolean
    lastRun: string
    recordsMapped: number
    errors: number
}

const SYSTEMS = ["Salesforce", "HubSpot", "Internal CRM", "Zendesk", "Stripe", "QuickBooks", "Pipedrive", "Zoho"]
const TRANSFORM_TYPES = ["Direct copy", "Format date", "Uppercase", "Lowercase", "Concatenate", "Trim whitespace", "Map values"]

const INITIAL_MAPPINGS: SyncMapping[] = [
    { id: "SM-001", name: "Contact email sync", sourceSystem: "Salesforce", targetSystem: "Internal CRM", sourceField: "Email__c", targetField: "email", transform: "Lowercase", status: "Active", enabled: true, lastRun: "5 min ago", recordsMapped: 4820, errors: 0 },
    { id: "SM-002", name: "Company name mapping", sourceSystem: "HubSpot", targetSystem: "Internal CRM", sourceField: "company", targetField: "organization_name", transform: "Direct copy", status: "Active", enabled: true, lastRun: "10 min ago", recordsMapped: 2310, errors: 3 },
    { id: "SM-003", name: "Invoice amount field", sourceSystem: "Stripe", targetSystem: "QuickBooks", sourceField: "amount_due", targetField: "InvoiceTotal", transform: "Direct copy", status: "Active", enabled: true, lastRun: "1 hr ago", recordsMapped: 880, errors: 0 },
    { id: "SM-004", name: "Ticket subject clean", sourceSystem: "Zendesk", targetSystem: "Internal CRM", sourceField: "subject", targetField: "ticket_title", transform: "Trim whitespace", status: "Active", enabled: true, lastRun: "30 min ago", recordsMapped: 620, errors: 1 },
    { id: "SM-005", name: "Deal date formatter", sourceSystem: "Pipedrive", targetSystem: "Salesforce", sourceField: "close_time", targetField: "CloseDate", transform: "Format date", status: "Paused", enabled: false, lastRun: "2 days ago", recordsMapped: 340, errors: 0 },
    { id: "SM-006", name: "Lead status map", sourceSystem: "Zoho", targetSystem: "Internal CRM", sourceField: "Lead_Status", targetField: "stage", transform: "Map values", status: "Active", enabled: true, lastRun: "2 hr ago", recordsMapped: 1540, errors: 8 },
]

const SYSTEM_COLORS: Record<string, string> = {
    Salesforce: "bg-blue-50 text-blue-600",
    HubSpot: "bg-orange-50 text-orange-600",
    "Internal CRM": "bg-indigo-50 text-indigo-600",
    Zendesk: "bg-emerald-50 text-emerald-600",
    Stripe: "bg-violet-50 text-violet-600",
    QuickBooks: "bg-green-50 text-green-600",
    Pipedrive: "bg-teal-50 text-teal-600",
    Zoho: "bg-red-50 text-red-600",
}

export default function DataSyncMappingPage() {
    const [mappings, setMappings] = useState<SyncMapping[]>(INITIAL_MAPPINGS)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterSource, setFilterSource] = useState("all")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<SyncMapping | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<SyncMapping | null>(null)
    const [isSyncing, setIsSyncing] = useState(false)
    const [newMapping, setNewMapping] = useState({ name: "", sourceSystem: "Salesforce", targetSystem: "Internal CRM", sourceField: "", targetField: "", transform: "Direct copy" })

    const stats = useMemo(() => ({
        active: mappings.filter(m => m.enabled).length,
        totalRecords: mappings.reduce((a, m) => a + m.recordsMapped, 0),
        totalErrors: mappings.reduce((a, m) => a + m.errors, 0),
        systems: new Set([...mappings.map(m => m.sourceSystem), ...mappings.map(m => m.targetSystem)]).size,
    }), [mappings])

    const filtered = useMemo(() => mappings.filter(m => {
        const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.sourceField.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.targetField.toLowerCase().includes(searchQuery.toLowerCase())
        const matchSource = filterSource === "all" || m.sourceSystem === filterSource
        return matchSearch && matchSource
    }), [mappings, searchQuery, filterSource])

    const handleCreate = () => {
        if (!newMapping.name.trim() || !newMapping.sourceField.trim() || !newMapping.targetField.trim()) { toast.error("Name, source field, and target field are required"); return }
        if (newMapping.sourceSystem === newMapping.targetSystem) { toast.error("Source and target systems cannot be the same"); return }
        const m: SyncMapping = { id: `SM-${String(mappings.length + 1).padStart(3, "0")}`, name: newMapping.name.trim(), sourceSystem: newMapping.sourceSystem, targetSystem: newMapping.targetSystem, sourceField: newMapping.sourceField.trim(), targetField: newMapping.targetField.trim(), transform: newMapping.transform, status: "Active", enabled: true, lastRun: "Never", recordsMapped: 0, errors: 0 }
        setMappings(prev => [m, ...prev])
        setNewMapping({ name: "", sourceSystem: "Salesforce", targetSystem: "Internal CRM", sourceField: "", targetField: "", transform: "Direct copy" })
        setIsCreateOpen(false)
        toast.success(`Mapping "${m.name}" created successfully`)
    }

    const handleEditSave = () => {
        if (!editTarget?.name.trim()) { toast.error("Name is required"); return }
        setMappings(prev => prev.map(m => m.id === editTarget.id ? { ...editTarget } : m))
        setEditTarget(null)
        toast.success("Mapping updated successfully")
    }

    const handleDelete = () => {
        if (!deleteTarget) return
        setMappings(prev => prev.filter(m => m.id !== deleteTarget.id))
        setDeleteTarget(null)
        toast.success("Mapping removed")
    }

    const handleToggle = (id: string, current: boolean) => {
        setMappings(prev => prev.map(m => m.id === id ? { ...m, enabled: !current, status: !current ? "Active" : "Paused" } : m))
        toast.success(current ? "Mapping paused" : "Mapping activated")
    }

    const handleRunMapping = (id: string, name: string) => {
        setMappings(prev => prev.map(m => m.id === id ? { ...m, lastRun: "Just now", errors: 0 } : m))
        toast.promise(new Promise(r => setTimeout(r, 1500)), { loading: `Running mapping: ${name}...`, success: "Mapping completed successfully", error: "Mapping failed" })
    }

    const handleSyncAll = () => {
        setIsSyncing(true)
        toast.promise(new Promise(r => setTimeout(r, 2000)), { loading: "Running all active mappings...", success: "All mappings synced", error: "Sync failed" })
        setTimeout(() => { setIsSyncing(false); setMappings(prev => prev.map(m => m.enabled ? { ...m, lastRun: "Just now", errors: 0 } : m)) }, 2000)
    }

    const handleExport = () => {
        const csv = [["ID", "Name", "Source System", "Target System", "Source Field", "Target Field", "Transform", "Status", "Records", "Errors"], ...mappings.map(m => [m.id, m.name, m.sourceSystem, m.targetSystem, m.sourceField, m.targetField, m.transform, m.status, m.recordsMapped, m.errors])].map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "data-mappings.csv"; a.click(); URL.revokeObjectURL(url)
        toast.success("Data mappings exported")
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight">Data sync <span className="text-indigo-600">mapping</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Define field-level mappings between connected systems for accurate data sync</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleSyncAll}>{isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 text-slate-400" />} Sync all</Button>
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleExport}><Download className="w-4 h-4 text-slate-400" /> Export</Button>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild><Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2"><Plus className="w-4 h-4" /> New mapping</Button></DialogTrigger>
                        <DialogContent className="sm:max-w-[520px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                            <DialogHeader><DialogTitle className="text-2xl font-semibold text-slate-900">Create <span className="text-indigo-600">field mapping</span></DialogTitle></DialogHeader>
                            <div className="grid gap-5 py-6">
                                <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Mapping name *</Label><Input value={newMapping.name} onChange={e => setNewMapping({ ...newMapping, name: e.target.value })} placeholder="e.g. Contact email sync" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Source system</Label><Select value={newMapping.sourceSystem} onValueChange={v => setNewMapping({ ...newMapping, sourceSystem: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{SYSTEMS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
                                    <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Target system</Label><Select value={newMapping.targetSystem} onValueChange={v => setNewMapping({ ...newMapping, targetSystem: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{SYSTEMS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Source field *</Label><Input value={newMapping.sourceField} onChange={e => setNewMapping({ ...newMapping, sourceField: e.target.value })} placeholder="e.g. Email__c" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-mono text-sm text-slate-900" /></div>
                                    <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Target field *</Label><Input value={newMapping.targetField} onChange={e => setNewMapping({ ...newMapping, targetField: e.target.value })} placeholder="e.g. email" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-mono text-sm text-slate-900" /></div>
                                </div>
                                <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Transform type</Label><Select value={newMapping.transform} onValueChange={v => setNewMapping({ ...newMapping, transform: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{TRANSFORM_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                            </div>
                            <DialogFooter className="gap-2"><Button variant="ghost" className="rounded-xl font-semibold" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold px-8 text-white" onClick={handleCreate}>Create mapping</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: "Active mappings", value: stats.active, icon: ArrowLeftRight, bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-100/50" },
                    { label: "Records mapped", value: stats.totalRecords.toLocaleString(), icon: Database, bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-100/50" },
                    { label: "Connected systems", value: stats.systems, icon: Activity, bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-100/50" },
                    { label: "Total errors", value: stats.totalErrors, icon: AlertCircle, bg: `bg-gradient-to-br ${stats.totalErrors > 0 ? "from-rose-50 to-rose-100/50" : "from-amber-50 to-amber-100/50"}`, iconBg: `${stats.totalErrors > 0 ? "bg-rose-100" : "bg-amber-100"}`, iconColor: `${stats.totalErrors > 0 ? "text-rose-600" : "text-amber-600"}`, border: "border-amber-100/50" },
                ].map((stat, i) => (
                    <Card key={i} className={`${stat.bg} ${stat.border} border shadow-sm hover:shadow-md transition-all rounded-[22px] overflow-hidden`}>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`h-10 w-10 rounded-[14px] flex items-center justify-center ${stat.iconBg}`}><stat.icon className={`w-5 h-5 ${stat.iconColor}`} /></div>
                                <span className="text-[11px] font-semibold text-slate-400 bg-white/70 px-2 py-1 rounded-full border border-slate-100">{mappings.length} total</span>
                            </div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">{stat.value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 group"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" /><Input placeholder="Search mappings or field names..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-12 h-11 bg-white border-slate-200 rounded-xl text-sm font-medium" /></div>
                <Select value={filterSource} onValueChange={setFilterSource}><SelectTrigger className="w-48 h-11 rounded-xl border-slate-200 bg-white font-semibold text-slate-700 shadow-sm"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="all">All source systems</SelectItem>{SYSTEMS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
            </div>

            {/* List */}
            <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                <CardHeader className="px-8 py-6 border-b border-slate-100"><CardTitle className="text-lg font-semibold text-slate-900">Field mappings <span className="text-slate-400 font-medium text-sm ml-2">({filtered.length})</span></CardTitle></CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-50">
                        {filtered.map(m => (
                            <div key={m.id} className="px-8 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-slate-50/50 transition-colors group">
                                <div className="flex items-start gap-5 flex-1">
                                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><ArrowLeftRight className="w-5 h-5" /></div>
                                    <div className="space-y-2.5 flex-1">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{m.name}</h4>
                                            <Badge className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 ${m.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{m.status}</Badge>
                                            <Badge className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border-0">{m.transform}</Badge>
                                            {m.errors > 0 && <Badge className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border-0">{m.errors} errors</Badge>}
                                        </div>
                                        {/* Field mapping visual */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold ${SYSTEM_COLORS[m.sourceSystem] || "bg-slate-50 text-slate-500"}`}>
                                                <span className="opacity-60">{m.sourceSystem}</span>
                                                <span>·</span>
                                                <code>{m.sourceField}</code>
                                            </div>
                                            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold ${SYSTEM_COLORS[m.targetSystem] || "bg-slate-50 text-slate-500"}`}>
                                                <span className="opacity-60">{m.targetSystem}</span>
                                                <span>·</span>
                                                <code>{m.targetField}</code>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 text-[11px] text-slate-400 font-medium">
                                            <span className="flex items-center gap-1"><Database className="w-3 h-3" /> {m.recordsMapped.toLocaleString()} records</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Last run: {m.lastRun}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                                    <Button variant="ghost" size="sm" className="h-9 px-3 text-indigo-600 hover:bg-indigo-50 rounded-xl font-semibold text-xs gap-1.5" onClick={() => handleRunMapping(m.id, m.name)}><Play className="w-3 h-3" />Run</Button>
                                    <div className="flex items-center gap-2 border border-slate-100 rounded-xl px-3 py-2 bg-white shadow-sm">
                                        <Switch checked={m.enabled} onCheckedChange={() => handleToggle(m.id, m.enabled)} className="data-[state=checked]:bg-indigo-600 scale-90" />
                                        <span className="text-[10px] font-semibold text-slate-400">{m.enabled ? "On" : "Off"}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl" onClick={() => setEditTarget({ ...m })}><Edit className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl" onClick={() => setDeleteTarget(m)}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        ))}
                        {filtered.length === 0 && <div className="px-8 py-16 text-center"><p className="text-slate-400 font-medium">No mappings found.</p><Button variant="ghost" className="mt-3 text-indigo-600 font-semibold text-sm" onClick={() => { setSearchQuery(""); setFilterSource("all") }}>Clear filters</Button></div>}
                    </div>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={!!editTarget} onOpenChange={() => setEditTarget(null)}>
                <DialogContent className="sm:max-w-[520px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    <DialogHeader><DialogTitle className="text-2xl font-semibold text-slate-900">Edit <span className="text-indigo-600">mapping</span></DialogTitle></DialogHeader>
                    {editTarget && <div className="grid gap-5 py-6">
                        <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Name *</Label><Input value={editTarget.name} onChange={e => setEditTarget({ ...editTarget, name: e.target.value })} className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Source field</Label><Input value={editTarget.sourceField} onChange={e => setEditTarget({ ...editTarget, sourceField: e.target.value })} className="h-11 rounded-xl bg-slate-50 border-slate-100 font-mono text-sm text-slate-900" /></div>
                            <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Target field</Label><Input value={editTarget.targetField} onChange={e => setEditTarget({ ...editTarget, targetField: e.target.value })} className="h-11 rounded-xl bg-slate-50 border-slate-100 font-mono text-sm text-slate-900" /></div>
                        </div>
                        <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Transform</Label><Select value={editTarget.transform} onValueChange={v => setEditTarget({ ...editTarget, transform: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{TRANSFORM_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                    </div>}
                    <DialogFooter className="gap-2"><Button variant="ghost" className="rounded-xl font-semibold gap-2" onClick={() => setEditTarget(null)}><X className="w-4 h-4" />Cancel</Button><Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold px-8 text-white gap-2" onClick={handleEditSave}><Save className="w-4 h-4" />Save</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent className="sm:max-w-[400px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    <DialogHeader><DialogTitle className="text-xl font-semibold text-slate-900">Remove mapping</DialogTitle></DialogHeader>
                    <p className="text-sm font-medium text-slate-500 py-4">Are you sure you want to remove <span className="text-slate-900 font-semibold">"{deleteTarget?.name}"</span>? Data sync for these fields will stop immediately.</p>
                    <DialogFooter className="gap-2"><Button variant="ghost" className="rounded-xl font-semibold" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button className="rounded-xl bg-rose-600 hover:bg-rose-700 font-semibold px-6 text-white gap-2" onClick={handleDelete}><Trash2 className="w-4 h-4" />Remove</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
