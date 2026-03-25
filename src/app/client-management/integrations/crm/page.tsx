"use client"

import { useState, useMemo } from "react"
import {
    Plus, Search, RefreshCw, Download, Link2,
    CheckCircle2, Clock, Activity, Trash2, Edit,
    Loader2, X, Save, AlertCircle, Zap, Database,
    ArrowUpRight, ArrowDownRight, Settings, Play
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

type CrmSync = {
    id: string
    name: string
    platform: string
    status: string
    lastSync: string
    records: number
    errors: number
    enabled: boolean
    direction: string
}

const INITIAL_SYNCS: CrmSync[] = [
    { id: "CS-001", name: "Salesforce main sync", platform: "Salesforce", status: "Active", lastSync: "5 min ago", records: 4820, errors: 0, enabled: true, direction: "Bidirectional" },
    { id: "CS-002", name: "HubSpot contact sync", platform: "HubSpot", status: "Active", lastSync: "12 min ago", records: 2310, errors: 2, enabled: true, direction: "Import" },
    { id: "CS-003", name: "Pipedrive deals sync", platform: "Pipedrive", status: "Error", lastSync: "2 hr ago", records: 880, errors: 14, enabled: true, direction: "Export" },
    { id: "CS-004", name: "Zoho contact import", platform: "Zoho CRM", status: "Active", lastSync: "1 hr ago", records: 1540, errors: 0, enabled: true, direction: "Import" },
    { id: "CS-005", name: "Microsoft Dynamics", platform: "MS Dynamics", status: "Paused", lastSync: "2 days ago", records: 680, errors: 0, enabled: false, direction: "Bidirectional" },
]

const PLATFORMS = ["Salesforce", "HubSpot", "Pipedrive", "Zoho CRM", "MS Dynamics", "Freshsales"]
const DIRECTIONS = ["Bidirectional", "Import", "Export"]

const PLATFORM_COLORS: Record<string, string> = {
    Salesforce: "bg-blue-50 text-blue-600",
    HubSpot: "bg-orange-50 text-orange-600",
    Pipedrive: "bg-emerald-50 text-emerald-600",
    "Zoho CRM": "bg-red-50 text-red-600",
    "MS Dynamics": "bg-indigo-50 text-indigo-600",
    Freshsales: "bg-violet-50 text-violet-600",
}

export default function CrmSyncPage() {
    const [syncs, setSyncs] = useState<CrmSync[]>(INITIAL_SYNCS)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<CrmSync | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<CrmSync | null>(null)
    const [isSyncing, setIsSyncing] = useState(false)
    const [newSync, setNewSync] = useState({ name: "", platform: "Salesforce", direction: "Bidirectional" })

    const stats = useMemo(() => ({
        active: syncs.filter(s => s.enabled).length,
        totalRecords: syncs.reduce((a, s) => a + s.records, 0),
        totalErrors: syncs.reduce((a, s) => a + s.errors, 0),
        paused: syncs.filter(s => !s.enabled).length,
    }), [syncs])

    const filtered = useMemo(() => syncs.filter(s => {
        const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.platform.toLowerCase().includes(searchQuery.toLowerCase())
        const matchStatus = filterStatus === "all" || s.status.toLowerCase() === filterStatus
        return matchSearch && matchStatus
    }), [syncs, searchQuery, filterStatus])

    const handleCreate = () => {
        if (!newSync.name.trim()) { toast.error("Sync name is required"); return }
        const s: CrmSync = { id: `CS-${String(syncs.length + 1).padStart(3, "0")}`, name: newSync.name.trim(), platform: newSync.platform, status: "Active", lastSync: "Never", records: 0, errors: 0, enabled: true, direction: newSync.direction }
        setSyncs(prev => [s, ...prev])
        setNewSync({ name: "", platform: "Salesforce", direction: "Bidirectional" })
        setIsCreateOpen(false)
        toast.success(`CRM sync "${s.name}" created successfully`)
    }

    const handleEditSave = () => {
        if (!editTarget?.name.trim()) { toast.error("Name is required"); return }
        setSyncs(prev => prev.map(s => s.id === editTarget.id ? { ...editTarget } : s))
        setEditTarget(null)
        toast.success("Sync updated successfully")
    }

    const handleDelete = () => {
        if (!deleteTarget) return
        setSyncs(prev => prev.filter(s => s.id !== deleteTarget.id))
        setDeleteTarget(null)
        toast.success("Sync deleted successfully")
    }

    const handleToggle = (id: string, current: boolean) => {
        setSyncs(prev => prev.map(s => s.id === id ? { ...s, enabled: !current, status: !current ? "Active" : "Paused" } : s))
        toast.success(current ? "Sync paused" : "Sync activated")
    }

    const handleRunSync = (id: string, name: string) => {
        setSyncs(prev => prev.map(s => s.id === id ? { ...s, lastSync: "Just now", errors: 0, status: "Active" } : s))
        toast.promise(new Promise(r => setTimeout(r, 1500)), { loading: `Running sync: ${name}...`, success: `${name} synced successfully`, error: "Sync failed" })
    }

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(new Promise(r => setTimeout(r, 1500)), { loading: "Running all CRM syncs...", success: "All syncs completed", error: "Sync failed" })
        setTimeout(() => { setIsSyncing(false); setSyncs(prev => prev.map(s => s.enabled ? { ...s, lastSync: "Just now", errors: 0 } : s)) }, 1500)
    }

    const handleExport = () => {
        const csv = [["ID", "Name", "Platform", "Status", "Direction", "Records", "Errors", "Last Sync"], ...syncs.map(s => [s.id, s.name, s.platform, s.status, s.direction, s.records, s.errors, s.lastSync])].map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a"); a.href = url; a.download = "crm-syncs.csv"; a.click(); URL.revokeObjectURL(url)
        toast.success("CRM syncs exported as CSV")
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight">CRM <span className="text-indigo-600">sync</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Connect and synchronize data across your CRM platforms</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleSync}>
                        {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 text-slate-400" />} {isSyncing ? "Syncing" : "Sync all"}
                    </Button>
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleExport}>
                        <Download className="w-4 h-4 text-slate-400" /> Export
                    </Button>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2"><Plus className="w-4 h-4" /> Add sync</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[440px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                            <DialogHeader><DialogTitle className="text-2xl font-semibold text-slate-900">Add <span className="text-indigo-600">CRM sync</span></DialogTitle></DialogHeader>
                            <div className="grid gap-5 py-6">
                                <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Sync name *</Label><Input value={newSync.name} onChange={e => setNewSync({ ...newSync, name: e.target.value })} placeholder="e.g. Salesforce main sync" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Platform</Label>
                                        <Select value={newSync.platform} onValueChange={v => setNewSync({ ...newSync, platform: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select>
                                    </div>
                                    <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Direction</Label>
                                        <Select value={newSync.direction} onValueChange={v => setNewSync({ ...newSync, direction: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{DIRECTIONS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="gap-2"><Button variant="ghost" className="rounded-xl font-semibold" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold px-8 text-white" onClick={handleCreate}>Create</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: "Active syncs", value: stats.active, icon: Link2, bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-100/50" },
                    { label: "Total records synced", value: stats.totalRecords.toLocaleString(), icon: Database, bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-100/50" },
                    { label: "Sync errors", value: stats.totalErrors, icon: AlertCircle, bg: `bg-gradient-to-br ${stats.totalErrors > 0 ? "from-rose-50 to-rose-100/50" : "from-violet-50 to-violet-100/50"}`, iconBg: `${stats.totalErrors > 0 ? "bg-rose-100" : "bg-violet-100"}`, iconColor: `${stats.totalErrors > 0 ? "text-rose-600" : "text-violet-600"}`, border: "border-violet-100/50" },
                    { label: "Paused syncs", value: stats.paused, icon: Activity, bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", iconBg: "bg-amber-100", iconColor: "text-amber-600", border: "border-amber-100/50" },
                ].map((stat, i) => (
                    <Card key={i} className={`${stat.bg} ${stat.border} border shadow-sm hover:shadow-md transition-all rounded-[22px] overflow-hidden`}>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`h-10 w-10 rounded-[14px] flex items-center justify-center ${stat.iconBg}`}><stat.icon className={`w-5 h-5 ${stat.iconColor}`} /></div>
                                <span className="text-[11px] font-semibold text-slate-400 bg-white/70 px-2 py-1 rounded-full border border-slate-100">{syncs.length} total</span>
                            </div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">{stat.value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 group"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" /><Input placeholder="Search syncs or platforms..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-12 h-11 bg-white border-slate-200 rounded-xl text-sm font-medium" /></div>
                <Select value={filterStatus} onValueChange={setFilterStatus}><SelectTrigger className="w-44 h-11 rounded-xl border-slate-200 bg-white font-semibold text-slate-700 shadow-sm"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="all">All statuses</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="paused">Paused</SelectItem><SelectItem value="error">Error</SelectItem></SelectContent></Select>
            </div>

            {/* List */}
            <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                <CardHeader className="px-8 py-6 border-b border-slate-100"><CardTitle className="text-lg font-semibold text-slate-900">CRM connections <span className="text-slate-400 font-medium text-sm ml-2">({filtered.length})</span></CardTitle></CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-50">
                        {filtered.map(s => (
                            <div key={s.id} className="px-8 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-slate-50/50 transition-colors group">
                                <div className="flex items-start gap-5 flex-1">
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${PLATFORM_COLORS[s.platform] || "bg-slate-50 text-slate-400"}`}><Link2 className="w-5 h-5" /></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{s.name}</h4>
                                            <Badge className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 ${PLATFORM_COLORS[s.platform] || "bg-slate-100 text-slate-500"}`}>{s.platform}</Badge>
                                            <Badge className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 ${s.status === "Active" ? "bg-emerald-100 text-emerald-700" : s.status === "Error" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>{s.status}</Badge>
                                            <Badge className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border-0">{s.direction}</Badge>
                                        </div>
                                        <div className="flex items-center gap-6 text-[11px] text-slate-400 font-medium">
                                            <span className="flex items-center gap-1"><Database className="w-3 h-3" /> {s.records.toLocaleString()} records</span>
                                            {s.errors > 0 && <span className="flex items-center gap-1 text-rose-500"><AlertCircle className="w-3 h-3" /> {s.errors} errors</span>}
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Last synced: {s.lastSync}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <Button variant="ghost" size="sm" className="h-9 px-3 text-indigo-600 hover:bg-indigo-50 rounded-xl font-semibold text-xs gap-1.5" onClick={() => handleRunSync(s.id, s.name)}><Play className="w-3 h-3" />Run sync</Button>
                                    <div className="flex items-center gap-2 border border-slate-100 rounded-xl px-3 py-2 bg-white shadow-sm">
                                        <Switch checked={s.enabled} onCheckedChange={() => handleToggle(s.id, s.enabled)} className="data-[state=checked]:bg-indigo-600 scale-90" />
                                        <span className="text-[10px] font-semibold text-slate-400">{s.enabled ? "On" : "Off"}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl" onClick={() => setEditTarget({ ...s })}><Edit className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl" onClick={() => setDeleteTarget(s)}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        ))}
                        {filtered.length === 0 && <div className="px-8 py-16 text-center"><p className="text-slate-400 font-medium">No CRM syncs found.</p><Button variant="ghost" className="mt-3 text-indigo-600 font-semibold text-sm" onClick={() => { setSearchQuery(""); setFilterStatus("all") }}>Clear filters</Button></div>}
                    </div>
                </CardContent>
            </Card>

            {/* Edit */}
            <Dialog open={!!editTarget} onOpenChange={() => setEditTarget(null)}>
                <DialogContent className="sm:max-w-[440px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    <DialogHeader><DialogTitle className="text-2xl font-semibold text-slate-900">Edit <span className="text-indigo-600">sync</span></DialogTitle></DialogHeader>
                    {editTarget && <div className="grid gap-5 py-6">
                        <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Sync name *</Label><Input value={editTarget.name} onChange={e => setEditTarget({ ...editTarget, name: e.target.value })} className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Platform</Label><Select value={editTarget.platform} onValueChange={v => setEditTarget({ ...editTarget, platform: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{PLATFORMS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
                            <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Direction</Label><Select value={editTarget.direction} onValueChange={v => setEditTarget({ ...editTarget, direction: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{DIRECTIONS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></div>
                        </div>
                    </div>}
                    <DialogFooter className="gap-2"><Button variant="ghost" className="rounded-xl font-semibold gap-2" onClick={() => setEditTarget(null)}><X className="w-4 h-4" />Cancel</Button><Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold px-8 text-white gap-2" onClick={handleEditSave}><Save className="w-4 h-4" />Save</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete */}
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent className="sm:max-w-[400px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    <DialogHeader><DialogTitle className="text-xl font-semibold text-slate-900">Delete sync</DialogTitle></DialogHeader>
                    <p className="text-sm font-medium text-slate-500 py-4">Are you sure you want to delete <span className="text-slate-900 font-semibold">"{deleteTarget?.name}"</span>? This cannot be undone.</p>
                    <DialogFooter className="gap-2"><Button variant="ghost" className="rounded-xl font-semibold" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button className="rounded-xl bg-rose-600 hover:bg-rose-700 font-semibold px-6 text-white gap-2" onClick={handleDelete}><Trash2 className="w-4 h-4" />Delete</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
