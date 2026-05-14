"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    FileText, ShieldCheck, Clock, CheckCircle2, AlertCircle, Search, Filter, Plus, MoreVertical,
    Download, Eye, History, FileSignature, PenTool, Trash2, PencilLine,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Badge } from "@/shared/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { toast } from "@/shared/utils/toast"

interface Contract {
    id: number
    client: string
    type: string
    status: 'Signed' | 'Active' | 'Reviewing' | 'Pending Signature'
    date: string
    expiry: string
    owner: string
    health: 'Secure' | 'In Progress' | 'Action Required'
}

const initial: Contract[] = [
    { id: 1, client: 'SpaceX', type: 'MSA + SLA', status: 'Signed', date: 'Jul 12, 2024', expiry: 'Jul 11, 2026', owner: 'Legal Team', health: 'Secure' },
    { id: 2, client: 'Tesla Inc', type: 'Enterprise Agreement', status: 'Active', date: 'Aug 05, 2024', expiry: 'Aug 04, 2025', owner: 'Sarah R.', health: 'Secure' },
    { id: 3, client: 'Adobe', type: 'Data Protection Addendum', status: 'Reviewing', date: 'Sep 28, 2024', expiry: 'TBD', owner: 'Compliance', health: 'In Progress' },
    { id: 4, client: 'Netflix', type: 'MSA Upgrade', status: 'Pending Signature', date: 'Oct 02, 2024', expiry: 'Oct 01, 2027', owner: 'Jack M.', health: 'Action Required' },
]

const validators = {
    required: (v: string) => !v || !v.trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
}

export default function ContractsPage() {
    const router = useRouter()
    const [contracts, setContracts] = React.useState<Contract[]>(initial)
    const [search, setSearch] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<number | null>(null)
    const [selected, setSelected] = React.useState<Contract | null>(null)

    const [form, setForm] = React.useState({ client: "", type: "MSA + SLA", status: "Signed" as Contract['status'], date: "", expiry: "", owner: "", health: "Secure" as Contract['health'] })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const filtered = React.useMemo(() => {
        return contracts.filter(c => {
            const matchSearch = !search || c.client.toLowerCase().includes(search.toLowerCase()) || c.type.toLowerCase().includes(search.toLowerCase())
            const matchStatus = statusFilter === "all" || c.status === statusFilter
            return matchSearch && matchStatus
        })
    }, [contracts, search, statusFilter])

    const setField = (f: string, v: any) => {
        setForm(p => ({ ...p, [f]: v }))
        if (errors[f]) setErrors(p => { const c = { ...p }; delete c[f]; return c })
    }

    const validate = () => {
        const errs: Record<string, string> = {}
        errs.client = validators.required(form.client) || validators.minLen(2)(form.client)
        errs.type = validators.required(form.type)
        errs.date = validators.required(form.date)
        errs.owner = validators.required(form.owner)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ client: "", type: "MSA + SLA", status: "Signed", date: "", expiry: "", owner: "", health: "Secure" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (c: Contract) => {
        setEditingId(c.id)
        setForm({ client: c.client, type: c.type, status: c.status, date: c.date, expiry: c.expiry, owner: c.owner, health: c.health })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        const data: Contract = { id: editingId || Date.now(), client: form.client.trim(), type: form.type, status: form.status, date: form.date, expiry: form.expiry || 'TBD', owner: form.owner.trim(), health: form.health }
        if (editingId) { setContracts(contracts.map(c => c.id === editingId ? data : c)); toast.success("Contract updated") }
        else { setContracts([data, ...contracts]); toast.success("Contract added") }
        setIsFormOpen(false)
    }

    const handleDelete = (id: number) => { setContracts(contracts.filter(c => c.id !== id)); toast.success("Contract removed") }
    const openDetail = (c: Contract) => { setSelected(c); setIsDetailOpen(true) }

    const kpis = [
        { title: "Total Active Contracts", value: String(contracts.filter(c => c.status === 'Signed' || c.status === 'Active').length), icon: ShieldCheck, color: "emerald", trend: "98% COMPLIANT", path: "/client-management/customers" },
        { title: "Pending Signature", value: String(contracts.filter(c => c.status === 'Pending Signature').length), icon: FileSignature, color: "indigo", trend: "", path: "/client-management/subscriptions/active" },
        { title: "Expiring within 30d", value: "5", icon: Clock, color: "rose", trend: "", path: "/client-management/revenue/renewals" },
        { title: "Under Legal Review", value: String(contracts.filter(c => c.status === 'Reviewing').length), icon: PenTool, color: "amber", trend: "", path: "/client-management/settings/users" },
    ]
    const cm: Record<string, string> = { emerald: "bg-emerald-50 text-emerald-600", indigo: "bg-indigo-50 text-indigo-600", rose: "bg-rose-50 text-rose-600", amber: "bg-amber-50 text-amber-600" }

    return (
        <div className="space-y-6 pb-10">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Contract <span className="text-slate-500">Repository</span></h1>
                    <p className="text-sm font-medium text-slate-500 max-w-2xl">Manage MSAs, SLAs and enterprise contracts with version control.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => toast.success("Vault exported")}>
                        <Download className="h-4 w-4 mr-2" />Export Vault
                    </Button>
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-none h-10" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />New Document
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((k, i) => {
                    const Icon = k.icon
                    return (
                        <Card key={i} className="rounded-none cursor-pointer hover:shadow-md transition" onClick={() => router.push(k.path)}>
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`h-9 w-9 rounded-none flex items-center justify-center ${cm[k.color]}`}><Icon size={18} /></div>
                                    {k.trend && <Badge className="rounded-none bg-emerald-50 text-emerald-600 hover:bg-emerald-50 text-[9px]">{k.trend}</Badge>}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{k.value}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{k.title}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <Card className="rounded-none">
                <CardHeader className="border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-none bg-indigo-600 text-white flex items-center justify-center"><FileText size={16} /></div>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider">Document Repository</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-none h-9 w-64" />
                        </div>
                        <Button variant="outline" size="icon" className="rounded-none h-9 w-9" onClick={() => setIsFilterOpen(true)}><Filter className="h-4 w-4" /></Button>
                    </div>
                </CardHeader>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-100/30 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="px-6 py-3">Contract & Account</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Effective</th>
                                <th className="px-6 py-3">Expiry</th>
                                <th className="px-6 py-3">Compliance</th>
                                <th className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.length > 0 ? filtered.map((doc) => (
                                <tr key={doc.id} className="hover:bg-slate-50/80 cursor-pointer" onClick={() => openDetail(doc)}>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-slate-900 block">{doc.client}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: CTR-00{doc.id}X • {doc.owner}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2"><div className="h-2 w-2 bg-slate-300" /><span className="text-xs font-bold text-slate-600">{doc.type}</span></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-none text-[10px] font-bold uppercase border ${doc.status === 'Signed' || doc.status === 'Active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : doc.status === 'Reviewing' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}>{doc.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-500">{doc.date}</td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-900">{doc.expiry}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-[10px] font-bold">
                                            {doc.health === 'Secure' ? <CheckCircle2 size={14} className="text-emerald-500" /> : <AlertCircle size={14} className="text-amber-500" />}
                                            <span className={doc.health === 'Secure' ? "text-emerald-600" : "text-amber-600"}>{doc.health.toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-none"><MoreVertical className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-none">
                                                <DropdownMenuItem onClick={() => openDetail(doc)}><Eye className="h-4 w-4 mr-2" />View</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openEdit(doc)}><PencilLine className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => toast.success("Document downloaded")}><Download className="h-4 w-4 mr-2" />Download</DropdownMenuItem>
                                                <DropdownMenuItem className="text-rose-500" onClick={() => handleDelete(doc.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-500">No contracts found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <div>Showing {filtered.length} of {contracts.length} documents</div>
                    <Button variant="ghost" className="rounded-none text-indigo-600 text-[10px] uppercase tracking-widest" onClick={() => router.push('/client-management/automation/logs')}>
                        Audit History <History className="h-3 w-3 ml-2" />
                    </Button>
                </div>
            </Card>

            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">{editingId ? "Edit Contract" : "New Contract"}</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Client <span className="text-rose-500">*</span></Label>
                            <Input value={form.client} onChange={e => setField("client", e.target.value)} placeholder="e.g., Tesla Inc" className={`h-10 rounded-none ${errors.client ? "border-rose-500" : ""}`} />
                            {errors.client && <p className="text-[11px] text-rose-500">{errors.client}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Type</Label>
                                <Select value={form.type} onValueChange={v => setField("type", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="MSA + SLA">MSA + SLA</SelectItem>
                                        <SelectItem value="Enterprise Agreement">Enterprise Agreement</SelectItem>
                                        <SelectItem value="Data Protection Addendum">Data Protection Addendum</SelectItem>
                                        <SelectItem value="MSA Upgrade">MSA Upgrade</SelectItem>
                                        <SelectItem value="NDA">NDA</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Status</Label>
                                <Select value={form.status} onValueChange={(v: any) => setField("status", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Signed">Signed</SelectItem>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Reviewing">Reviewing</SelectItem>
                                        <SelectItem value="Pending Signature">Pending Signature</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Effective Date <span className="text-rose-500">*</span></Label>
                                <Input value={form.date} onChange={e => setField("date", e.target.value)} placeholder="Jul 12, 2024" className={`h-10 rounded-none ${errors.date ? "border-rose-500" : ""}`} />
                                {errors.date && <p className="text-[11px] text-rose-500">{errors.date}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Expiry</Label>
                                <Input value={form.expiry} onChange={e => setField("expiry", e.target.value)} placeholder="Jul 11, 2026" className="h-10 rounded-none" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Owner <span className="text-rose-500">*</span></Label>
                                <Input value={form.owner} onChange={e => setField("owner", e.target.value)} placeholder="Legal Team" className={`h-10 rounded-none ${errors.owner ? "border-rose-500" : ""}`} />
                                {errors.owner && <p className="text-[11px] text-rose-500">{errors.owner}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Health</Label>
                                <Select value={form.health} onValueChange={(v: any) => setField("health", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Secure">Secure</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Action Required">Action Required</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none" onClick={handleSave}>{editingId ? "Save" : "Add"}</Button>
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Contracts</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Status</Label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="Signed">Signed</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Reviewing">Reviewing</SelectItem>
                                    <SelectItem value="Pending Signature">Pending Signature</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setStatusFilter("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold">Contract Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Account</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.client}</p>
                                    <p className="text-sm text-slate-500">CTR-00{selected.id}X</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Type</p><p className="font-semibold text-slate-900">{selected.type}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p><Badge className="rounded-none">{selected.status}</Badge></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Effective</p><p className="font-semibold text-slate-900">{selected.date}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Expiry</p><p className="font-semibold text-slate-900">{selected.expiry}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Owner</p><p className="font-semibold text-slate-900">{selected.owner}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Health</p><p className={`font-semibold ${selected.health === 'Secure' ? 'text-emerald-600' : 'text-amber-600'}`}>{selected.health}</p></div>
                                </div>
                            </div>
                            <div className="p-5 border-t flex gap-3 bg-white">
                                <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setIsDetailOpen(false); openEdit(selected) }}>
                                    <PencilLine className="h-4 w-4 mr-2" />Edit
                                </Button>
                                <Button variant="outline" className="flex-1 h-10 rounded-none text-rose-500 border-rose-200 hover:bg-rose-50" onClick={() => { handleDelete(selected.id); setIsDetailOpen(false) }}>
                                    <Trash2 className="h-4 w-4 mr-2" />Delete
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
