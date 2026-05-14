"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Users, Mail, Phone, Linkedin, Search, Filter, MoreVertical, Plus,
    Trash2, PencilLine, Eye, Building2, ShieldCheck, Briefcase, MessageSquare, Star, ExternalLink, Send,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { toast } from "@/shared/utils/toast"

interface Contact {
    id: number
    name: string
    role: string
    company: string
    email: string
    phone: string
    type: 'Decision Maker' | 'Champion' | 'End User' | 'Influencer'
    lastContact: string
}

const initialContacts: Contact[] = [
    { id: 1, name: "Sarah Jenkins", role: "CTO", company: "DataScale Inc", email: "sarah.j@datascale.com", phone: "+1 415-555-0123", type: "Decision Maker", lastContact: "2 days ago" },
    { id: 2, name: "Marcus Thorne", role: "Head of Growth", company: "Innova Hub", email: "m.thorne@innovahub.io", phone: "+1 212-555-0198", type: "Champion", lastContact: "5 hours ago" },
    { id: 3, name: "Elena Rodriguez", role: "Sr. Procurement", company: "Global Dynamics", email: "e.rodriguez@globald.com", phone: "+44 20-7946-0145", type: "Influencer", lastContact: "1 week ago" },
    { id: 4, name: "James Wilson", role: "IT Manager", company: "Swift Apps", email: "j.wilson@swiftapps.de", phone: "+49 30-1234567", type: "End User", lastContact: "3 days ago" },
    { id: 5, name: "Patricia Chen", role: "VP Marketing", company: "Horizon Media", email: "p.chen@horizon.au", phone: "+61 2-9876-5432", type: "Decision Maker", lastContact: "12 hours ago" },
]

const validators = {
    required: (v: any) => !v || !v.toString().trim() ? "This field is required" : "",
    email: (v: string) => v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "Enter a valid email" : "",
    phone: (v: string) => v && !/^[+\d][\d\s().-]{6,20}$/.test(v.trim()) ? "Enter a valid phone" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
}

const typeColor = (t: Contact['type']) =>
    t === 'Decision Maker' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
    t === 'Champion' ? "bg-violet-50 text-violet-600 border-violet-100" :
    t === 'Influencer' ? "bg-blue-50 text-blue-600 border-blue-100" :
    "bg-slate-50 text-slate-600 border-slate-100"

export default function ContactsPage() {
    const router = useRouter()
    const [contacts, setContacts] = React.useState<Contact[]>(initialContacts)
    const [search, setSearch] = React.useState("")
    const [typeFilter, setTypeFilter] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingId, setEditingId] = React.useState<number | null>(null)
    const [selected, setSelected] = React.useState<Contact | null>(null)

    const [form, setForm] = React.useState({
        name: "", role: "", company: "", email: "", phone: "",
        type: "Champion" as Contact['type'], lastContact: "Just now",
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    const metrics = React.useMemo(() => {
        const decisionMakers = contacts.filter(c => c.type === 'Decision Maker').length
        const champions = contacts.filter(c => c.type === 'Champion').length
        const influencers = contacts.filter(c => c.type === 'Influencer').length
        return { total: contacts.length, decisionMakers, champions, influencers, activeRate: "92%" }
    }, [contacts])

    const filtered = React.useMemo(() => {
        return contacts.filter(c => {
            const matchSearch = !search ||
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.company.toLowerCase().includes(search.toLowerCase()) ||
                c.role.toLowerCase().includes(search.toLowerCase()) ||
                c.email.toLowerCase().includes(search.toLowerCase())
            const matchType = typeFilter === "all" || c.type === typeFilter
            return matchSearch && matchType
        })
    }, [contacts, search, typeFilter])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(form.name) || validators.minLen(2)(form.name)
        errs.role = validators.required(form.role)
        errs.company = validators.required(form.company)
        errs.email = validators.required(form.email) || validators.email(form.email)
        errs.phone = validators.phone(form.phone)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingId(null)
        setForm({ name: "", role: "", company: "", email: "", phone: "", type: "Champion", lastContact: "Just now" })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (c: Contact) => {
        setEditingId(c.id)
        setForm({ name: c.name, role: c.role, company: c.company, email: c.email, phone: c.phone, type: c.type, lastContact: c.lastContact })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        const data: Contact = {
            id: editingId || Date.now(),
            name: form.name.trim(), role: form.role.trim(), company: form.company.trim(),
            email: form.email.trim(), phone: form.phone.trim(), type: form.type, lastContact: form.lastContact,
        }
        if (editingId) {
            setContacts(contacts.map(c => c.id === editingId ? data : c))
            toast.success("Contact updated")
        } else {
            setContacts([data, ...contacts])
            toast.success("Contact created")
        }
        setIsFormOpen(false)
    }

    const handleDelete = (id: number) => {
        setContacts(contacts.filter(c => c.id !== id))
        toast.success("Contact removed")
    }

    const openDetail = (c: Contact) => { setSelected(c); setIsDetailOpen(true) }

    const kpis = [
        { title: "Total Contacts", value: String(metrics.total), subtitle: "System-wide Network", icon: Users, color: "blue", path: "/client-management/customers" },
        { title: "Decision Makers", value: String(metrics.decisionMakers), subtitle: "Exec Level Stakeholders", icon: ShieldCheck, color: "violet", path: "/client-management/customers/journey" },
        { title: "Champions", value: String(metrics.champions), subtitle: "Direct Platform Users", icon: Star, color: "emerald", path: "/client-management/customers/feedback" },
        { title: "Engagement Rate", value: metrics.activeRate, subtitle: "Last 30 Days", icon: MessageSquare, color: "amber", path: "/client-management/communication" },
    ]
    const cm: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        blue: { bg: "bg-gradient-to-br from-blue-50 to-blue-100/50", border: "border-blue-200/50", text: "text-blue-600", iconBg: "bg-blue-100" },
        violet: { bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", border: "border-violet-200/50", text: "text-violet-600", iconBg: "bg-violet-100" },
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        amber: { bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", border: "border-amber-200/50", text: "text-amber-600", iconBg: "bg-amber-100" },
    }

    return (
        <div className="px-8 py-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Contacts & <span className="text-violet-600">Key People</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Network intelligence of stakeholders, decision makers and platform champions.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />Add Contact
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi, i) => {
                    const cc = cm[kpi.color]
                    const Icon = kpi.icon
                    return (
                        <Card key={i} className={`rounded-none cursor-pointer hover:shadow-md transition ${cc.bg} ${cc.border} border`} onClick={() => router.push(kpi.path)}>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 tracking-wide mb-1">{kpi.title}</p>
                                        <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
                                        <p className="mt-2 text-xs text-slate-400">{kpi.subtitle}</p>
                                    </div>
                                    <div className={`h-10 w-10 rounded-none flex items-center justify-center ${cc.iconBg}`}>
                                        <Icon className={`h-5 w-5 ${cc.text}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <Card className="rounded-none">
                <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <CardTitle className="text-base font-semibold">Stakeholder Directory</CardTitle>
                        <Badge className="rounded-none bg-slate-100 text-slate-600">{filtered.length} people</Badge>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input placeholder="Search contacts..." value={search} onChange={e => setSearch(e.target.value)}
                            className="pl-10 rounded-none w-64 h-9" />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                    <th className="px-6 py-3">People</th>
                                    <th className="px-6 py-3">Company & Role</th>
                                    <th className="px-6 py-3">Contact Info</th>
                                    <th className="px-6 py-3">Relationship</th>
                                    <th className="px-6 py-3">Last Sync</th>
                                    <th className="px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.length > 0 ? filtered.map((c) => (
                                    <tr key={c.id} className="group hover:bg-slate-50/80 transition cursor-pointer" onClick={() => openDetail(c)}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 rounded-none border-2 border-white shadow-sm">
                                                    <AvatarFallback className="rounded-none bg-violet-50 text-violet-600 font-bold text-xs">{c.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{c.name}</p>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <Linkedin className="h-3 w-3 text-slate-300" />
                                                        <p className="text-[10px] font-medium text-slate-400">LinkedIn Profile</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-[13px] font-bold text-slate-800">{c.company}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <Briefcase className="h-3 w-3 text-slate-400" />
                                                <p className="text-[11px] font-medium text-slate-500">{c.role}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-3 w-3 text-slate-400" />
                                                    <span className="text-[11px] font-medium text-slate-600">{c.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-3 w-3 text-slate-400" />
                                                    <span className="text-[11px] font-medium text-slate-600">{c.phone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-none text-[11px] font-bold border ${typeColor(c.type)}`}>{c.type}</span>
                                        </td>
                                        <td className="px-6 py-4 text-[11px] font-bold text-slate-500">{c.lastContact}</td>
                                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="rounded-none">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44 rounded-none">
                                                    <DropdownMenuItem className="flex items-center gap-2" onClick={() => openEdit(c)}>
                                                        <PencilLine className="h-4 w-4" /> Edit Contact
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-2" onClick={() => toast.success(`Email draft to ${c.name}`)}>
                                                        <Mail className="h-4 w-4" /> Send Email
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-2 border-t mt-1" onClick={() => router.push('/client-management/customers')}>
                                                        <ExternalLink className="h-4 w-4" /> View Account
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-2 text-rose-500" onClick={() => handleDelete(c.id)}>
                                                        <Trash2 className="h-4 w-4" /> Delete Record
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-500">No people match your filters.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Form Sheet */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-violet-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingId ? "Edit Contact" : "Add New Contact"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Manage stakeholder relationships.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Full Name <span className="text-rose-500">*</span></Label>
                                <Input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="e.g. John Doe" className={`h-10 rounded-none ${errors.name ? "border-rose-500" : ""}`} />
                                {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Role <span className="text-rose-500">*</span></Label>
                                <Input value={form.role} onChange={e => setField("role", e.target.value)} placeholder="e.g. CTO" className={`h-10 rounded-none ${errors.role ? "border-rose-500" : ""}`} />
                                {errors.role && <p className="text-[11px] text-rose-500">{errors.role}</p>}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Company <span className="text-rose-500">*</span></Label>
                            <Input value={form.company} onChange={e => setField("company", e.target.value)} placeholder="e.g. Acme Corp" className={`h-10 rounded-none ${errors.company ? "border-rose-500" : ""}`} />
                            {errors.company && <p className="text-[11px] text-rose-500">{errors.company}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Email <span className="text-rose-500">*</span></Label>
                                <Input value={form.email} onChange={e => setField("email", e.target.value)} placeholder="john@company.com" className={`h-10 rounded-none ${errors.email ? "border-rose-500" : ""}`} />
                                {errors.email && <p className="text-[11px] text-rose-500">{errors.email}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Phone</Label>
                                <Input value={form.phone} onChange={e => setField("phone", e.target.value)} placeholder="+1 234-567-890" className={`h-10 rounded-none ${errors.phone ? "border-rose-500" : ""}`} />
                                {errors.phone && <p className="text-[11px] text-rose-500">{errors.phone}</p>}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Relationship Type</Label>
                            <Select value={form.type} onValueChange={(v: any) => setField("type", v)}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="Decision Maker">Decision Maker</SelectItem>
                                    <SelectItem value="Champion">Champion</SelectItem>
                                    <SelectItem value="End User">End User</SelectItem>
                                    <SelectItem value="Influencer">Influencer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-violet-600 hover:bg-violet-700 text-white rounded-none" onClick={handleSave}>
                            {editingId ? "Save Changes" : "Create Contact"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Contacts</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Relationship Type</Label>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="Decision Maker">Decision Maker</SelectItem>
                                    <SelectItem value="Champion">Champion</SelectItem>
                                    <SelectItem value="End User">End User</SelectItem>
                                    <SelectItem value="Influencer">Influencer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setTypeFilter("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-violet-600 hover:bg-violet-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-violet-50">
                        <SheetTitle className="text-[18px] font-semibold">Contact Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-14 w-14 rounded-none">
                                        <AvatarFallback className="rounded-none bg-violet-50 text-violet-600 font-bold text-base">{selected.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-lg font-semibold text-slate-900">{selected.name}</p>
                                        <p className="text-sm text-slate-500">{selected.role} @ {selected.company}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-3 pt-3 border-t">
                                    <div className="flex items-center gap-2 p-3 border border-slate-100 rounded-none">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                        <span className="text-sm text-slate-700">{selected.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 border border-slate-100 rounded-none">
                                        <Phone className="h-4 w-4 text-slate-400" />
                                        <span className="text-sm text-slate-700">{selected.phone}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 border border-slate-100 rounded-none">
                                        <span className="text-[11px] text-slate-400 uppercase">Relationship</span>
                                        <span className={`inline-flex px-2 py-0.5 rounded-none text-[11px] font-bold border ${typeColor(selected.type)}`}>{selected.type}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 border border-slate-100 rounded-none">
                                        <span className="text-[11px] text-slate-400 uppercase">Last Sync</span>
                                        <span className="text-sm font-semibold text-slate-700">{selected.lastContact}</span>
                                    </div>
                                </div>
                                <div className="pt-3 border-t space-y-2">
                                    <Button variant="outline" className="w-full h-10 rounded-none justify-start" onClick={() => toast.success(`Email draft to ${selected.name}`)}>
                                        <Send className="h-4 w-4 mr-2" />Send Email
                                    </Button>
                                    <Button variant="outline" className="w-full h-10 rounded-none justify-start" onClick={() => { setIsDetailOpen(false); router.push('/client-management/customers') }}>
                                        <Building2 className="h-4 w-4 mr-2" />View Account
                                    </Button>
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
