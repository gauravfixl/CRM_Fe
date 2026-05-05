"use client"

import { useState, useMemo } from "react"
import {
    Plus, Search, RefreshCw, Download, Headphones,
    CheckCircle2, Clock, Activity, Trash2, Edit,
    Loader2, X, Save, TicketCheck, Users, Zap, MessageSquare
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

type SupportTool = {
    id: string
    name: string
    tool: string
    category: string
    status: string
    ticketsSynced: number
    agentsConnected: number
    enabled: boolean
    lastSync: string
}

const INITIAL_TOOLS: SupportTool[] = [
    { id: "ST-001", name: "Zendesk main", tool: "Zendesk", category: "Helpdesk", status: "Active", ticketsSynced: 1840, agentsConnected: 12, enabled: true, lastSync: "5 min ago" },
    { id: "ST-002", name: "Intercom chat", tool: "Intercom", category: "Live Chat", status: "Active", ticketsSynced: 620, agentsConnected: 8, enabled: true, lastSync: "10 min ago" },
    { id: "ST-003", name: "Freshdesk support", tool: "Freshdesk", category: "Helpdesk", status: "Active", ticketsSynced: 940, agentsConnected: 6, enabled: true, lastSync: "30 min ago" },
    { id: "ST-004", name: "Jira service desk", tool: "Jira", category: "ITSM", status: "Paused", ticketsSynced: 310, agentsConnected: 4, enabled: false, lastSync: "2 days ago" },
    { id: "ST-005", name: "Crisp live support", tool: "Crisp", category: "Live Chat", status: "Active", ticketsSynced: 180, agentsConnected: 3, enabled: true, lastSync: "1 hr ago" },
]

const TOOLS = ["Zendesk", "Intercom", "Freshdesk", "Jira", "Crisp", "Kayako", "Help Scout"]
const CATEGORIES = ["Helpdesk", "Live Chat", "ITSM", "Knowledge Base", "Call Center"]

const TOOL_COLORS: Record<string, string> = {
    Zendesk: "bg-emerald-50 text-emerald-600",
    Intercom: "bg-indigo-50 text-indigo-600",
    Freshdesk: "bg-rose-50 text-rose-600",
    Jira: "bg-blue-50 text-blue-600",
    Crisp: "bg-violet-50 text-violet-600",
    Kayako: "bg-amber-50 text-amber-600",
    "Help Scout": "bg-cyan-50 text-cyan-600",
}

export default function SupportToolsPage() {
    const [tools, setTools] = useState<SupportTool[]>(INITIAL_TOOLS)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterCategory, setFilterCategory] = useState("all")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<SupportTool | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<SupportTool | null>(null)
    const [isSyncing, setIsSyncing] = useState(false)
    const [newTool, setNewTool] = useState({ name: "", tool: "Zendesk", category: "Helpdesk" })

    const stats = useMemo(() => ({
        active: tools.filter(t => t.enabled).length,
        totalTickets: tools.reduce((a, t) => a + t.ticketsSynced, 0),
        totalAgents: tools.reduce((a, t) => a + t.agentsConnected, 0),
        categories: new Set(tools.map(t => t.category)).size,
    }), [tools])

    const filtered = useMemo(() => tools.filter(t => {
        const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.tool.toLowerCase().includes(searchQuery.toLowerCase())
        const matchCat = filterCategory === "all" || t.category === filterCategory
        return matchSearch && matchCat
    }), [tools, searchQuery, filterCategory])

    const handleCreate = () => {
        if (!newTool.name.trim()) { toast.error("Tool name is required"); return }
        const t: SupportTool = { id: `ST-${String(tools.length + 1).padStart(3, "0")}`, name: newTool.name.trim(), tool: newTool.tool, category: newTool.category, status: "Active", ticketsSynced: 0, agentsConnected: 0, enabled: true, lastSync: "Never" }
        setTools(prev => [t, ...prev])
        setNewTool({ name: "", tool: "Zendesk", category: "Helpdesk" })
        setIsCreateOpen(false)
        toast.success(`Support tool "${t.name}" connected successfully`)
    }

    const handleEditSave = () => {
        if (!editTarget?.name.trim()) { toast.error("Name is required"); return }
        setTools(prev => prev.map(t => t.id === editTarget.id ? { ...editTarget } : t))
        setEditTarget(null)
        toast.success("Support tool updated")
    }

    const handleDelete = () => {
        if (!deleteTarget) return
        setTools(prev => prev.filter(t => t.id !== deleteTarget.id))
        setDeleteTarget(null)
        toast.success("Support tool disconnected")
    }

    const handleToggle = (id: string, current: boolean) => {
        setTools(prev => prev.map(t => t.id === id ? { ...t, enabled: !current, status: !current ? "Active" : "Paused" } : t))
        toast.success(current ? "Tool paused" : "Tool activated")
    }

    const handleSync = () => {
        setIsSyncing(true)
        toast.promise(new Promise(r => setTimeout(r, 1500)), { loading: "Syncing support tools...", success: "All tools synced", error: "Sync failed" })
        setTimeout(() => { setIsSyncing(false); setTools(prev => prev.map(t => t.enabled ? { ...t, lastSync: "Just now" } : t)) }, 1500)
    }

    const handleExport = () => {
        const csv = [["ID", "Name", "Tool", "Category", "Status", "Tickets Synced", "Agents"], ...tools.map(t => [t.id, t.name, t.tool, t.category, t.status, t.ticketsSynced, t.agentsConnected])].map(r => r.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "support-tools.csv"; a.click(); URL.revokeObjectURL(url)
        toast.success("Support tools exported")
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight">Support <span className="text-indigo-600">tools</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Connect helpdesk, live chat, and ITSM tools to your workflow</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleSync}>{isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 text-slate-400" />} Sync all</Button>
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={handleExport}><Download className="w-4 h-4 text-slate-400" /> Export</Button>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild><Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2"><Plus className="w-4 h-4" /> Connect tool</Button></DialogTrigger>
                        <DialogContent className="sm:max-w-[440px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                            <DialogHeader><DialogTitle className="text-2xl font-semibold text-slate-900">Connect <span className="text-indigo-600">support tool</span></DialogTitle></DialogHeader>
                            <div className="grid gap-5 py-6">
                                <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Integration name *</Label><Input value={newTool.name} onChange={e => setNewTool({ ...newTool, name: e.target.value })} placeholder="e.g. Zendesk main support" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" /></div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Tool</Label><Select value={newTool.tool} onValueChange={v => setNewTool({ ...newTool, tool: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{TOOLS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                                    <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Category</Label><Select value={newTool.category} onValueChange={v => setNewTool({ ...newTool, category: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                                </div>
                            </div>
                            <DialogFooter className="gap-2"><Button variant="ghost" className="rounded-xl font-semibold" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold px-8 text-white" onClick={handleCreate}>Connect</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: "Connected tools", value: stats.active, icon: Headphones, bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", border: "border-indigo-100/50" },
                    { label: "Tickets synced", value: stats.totalTickets.toLocaleString(), icon: TicketCheck, bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", border: "border-emerald-100/50" },
                    { label: "Agents connected", value: stats.totalAgents, icon: Users, bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", iconBg: "bg-violet-100", iconColor: "text-violet-600", border: "border-violet-100/50" },
                    { label: "Tool categories", value: stats.categories, icon: MessageSquare, bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", iconBg: "bg-amber-100", iconColor: "text-amber-600", border: "border-amber-100/50" },
                ].map((stat, i) => (
                    <Card key={i} className={`${stat.bg} ${stat.border} border shadow-sm hover:shadow-md transition-all rounded-[22px] overflow-hidden`}>
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`h-10 w-10 rounded-[14px] flex items-center justify-center ${stat.iconBg}`}><stat.icon className={`w-5 h-5 ${stat.iconColor}`} /></div>
                                <span className="text-[11px] font-semibold text-slate-400 bg-white/70 px-2 py-1 rounded-full border border-slate-100">{tools.length} total</span>
                            </div>
                            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">{stat.value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 group"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" /><Input placeholder="Search support tools..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-12 h-11 bg-white border-slate-200 rounded-xl text-sm font-medium" /></div>
                <Select value={filterCategory} onValueChange={setFilterCategory}><SelectTrigger className="w-44 h-11 rounded-xl border-slate-200 bg-white font-semibold text-slate-700 shadow-sm"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl"><SelectItem value="all">All categories</SelectItem>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
            </div>

            <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 bg-white overflow-hidden">
                <CardHeader className="px-8 py-6 border-b border-slate-100"><CardTitle className="text-lg font-semibold text-slate-900">Integrated support tools <span className="text-slate-400 font-medium text-sm ml-2">({filtered.length})</span></CardTitle></CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-50">
                        {filtered.map(t => (
                            <div key={t.id} className="px-8 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-slate-50/50 transition-colors group">
                                <div className="flex items-start gap-5 flex-1">
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${TOOL_COLORS[t.tool] || "bg-slate-50 text-slate-400"}`}><Headphones className="w-5 h-5" /></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{t.name}</h4>
                                            <Badge className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 ${TOOL_COLORS[t.tool]}`}>{t.tool}</Badge>
                                            <Badge className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border-0">{t.category}</Badge>
                                            <Badge className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border-0 ${t.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{t.status}</Badge>
                                        </div>
                                        <div className="flex items-center gap-6 text-[11px] text-slate-400 font-medium">
                                            <span className="flex items-center gap-1"><TicketCheck className="w-3 h-3" /> {t.ticketsSynced.toLocaleString()} tickets</span>
                                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {t.agentsConnected} agents</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {t.lastSync}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className="flex items-center gap-2 border border-slate-100 rounded-xl px-3 py-2 bg-white shadow-sm">
                                        <Switch checked={t.enabled} onCheckedChange={() => handleToggle(t.id, t.enabled)} className="data-[state=checked]:bg-indigo-600 scale-90" />
                                        <span className="text-[10px] font-semibold text-slate-400">{t.enabled ? "On" : "Off"}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl" onClick={() => setEditTarget({ ...t })}><Edit className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl" onClick={() => setDeleteTarget(t)}><Trash2 className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        ))}
                        {filtered.length === 0 && <div className="px-8 py-16 text-center"><p className="text-slate-400 font-medium">No support tools found.</p><Button variant="ghost" className="mt-3 text-indigo-600 font-semibold text-sm" onClick={() => { setSearchQuery(""); setFilterCategory("all") }}>Clear filters</Button></div>}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!editTarget} onOpenChange={() => setEditTarget(null)}>
                <DialogContent className="sm:max-w-[440px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    <DialogHeader><DialogTitle className="text-2xl font-semibold text-slate-900">Edit <span className="text-indigo-600">support tool</span></DialogTitle></DialogHeader>
                    {editTarget && <div className="grid gap-5 py-6">
                        <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Name *</Label><Input value={editTarget.name} onChange={e => setEditTarget({ ...editTarget, name: e.target.value })} className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium text-slate-900" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Tool</Label><Select value={editTarget.tool} onValueChange={v => setEditTarget({ ...editTarget, tool: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{TOOLS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                            <div className="space-y-2"><Label className="text-sm font-semibold text-slate-700">Category</Label><Select value={editTarget.category} onValueChange={v => setEditTarget({ ...editTarget, category: v })}><SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100 font-semibold text-slate-900 shadow-none"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl">{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                        </div>
                    </div>}
                    <DialogFooter className="gap-2"><Button variant="ghost" className="rounded-xl font-semibold gap-2" onClick={() => setEditTarget(null)}><X className="w-4 h-4" />Cancel</Button><Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold px-8 text-white gap-2" onClick={handleEditSave}><Save className="w-4 h-4" />Save</Button></DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent className="sm:max-w-[400px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    <DialogHeader><DialogTitle className="text-xl font-semibold text-slate-900">Disconnect tool</DialogTitle></DialogHeader>
                    <p className="text-sm font-medium text-slate-500 py-4">Are you sure you want to disconnect <span className="text-slate-900 font-semibold">"{deleteTarget?.name}"</span>?</p>
                    <DialogFooter className="gap-2"><Button variant="ghost" className="rounded-xl font-semibold" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button className="rounded-xl bg-rose-600 hover:bg-rose-700 font-semibold px-6 text-white gap-2" onClick={handleDelete}><Trash2 className="w-4 h-4" />Disconnect</Button></DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
