"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    Users, Building2, Briefcase, ShieldCheck, Search, Filter, MoreVertical, Plus,
    Trash2, PencilLine, Eye, MapPin, Globe, Calendar, ArrowUpRight, TrendingUp, ExternalLink,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu"
import { Badge } from "@/shared/components/ui/badge"
import { toast } from "@/shared/utils/toast"
import {
    getAllClients,
    addClient as apiAddClient,
    updateClient as apiUpdateClient,
    deleteClient as apiDeleteClient,
} from "@/modules/crm/clients/hooks/clientHooks"

interface Account {
    id: number | string
    name: string
    industry: string
    location: string
    size: 'Enterprise' | 'Mid-Market' | 'SMB'
    status: 'Active' | 'Churned' | 'Inactive'
    value: number
    joinedDate: string
}

const initialAccounts: Account[] = [
    { id: 1, name: "DataScale Inc", industry: "SaaS", location: "San Francisco, CA", size: "Mid-Market", status: "Active", value: 45000, joinedDate: "2023-05-12" },
    { id: 2, name: "Innova Hub", industry: "E-commerce", location: "New York, NY", size: "SMB", status: "Active", value: 12000, joinedDate: "2023-08-20" },
    { id: 3, name: "Global Dynamics", industry: "Finance", location: "London, UK", size: "Enterprise", status: "Active", value: 125000, joinedDate: "2022-11-05" },
    { id: 4, name: "Swift Apps", industry: "Tech Services", location: "Berlin, DE", size: "SMB", status: "Inactive", value: 8500, joinedDate: "2024-01-15" },
    { id: 5, name: "Horizon Media", industry: "Advertising", location: "Sydney, AU", size: "Mid-Market", status: "Active", value: 38000, joinedDate: "2023-02-28" },
]

const validators = {
    required: (v: any) => !v || !v.toString().trim() ? "This field is required" : "",
    minLen: (n: number) => (v: string) => v && v.trim().length < n ? `Must be at least ${n} characters` : "",
    number: (v: any) => v === "" || v === null || v === undefined ? "" : isNaN(Number(v)) ? "Enter a valid number" : Number(v) < 0 ? "Must be positive" : "",
    date: (v: string) => v && isNaN(new Date(v).getTime()) ? "Enter a valid date" : "",
}

const statusBg = (s: Account['status']) =>
    s === 'Active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
    s === 'Churned' ? "bg-rose-50 text-rose-600 border-rose-100" :
    "bg-slate-50 text-slate-600 border-slate-100"

const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`
    return `$${val}`
}

export default function AccountOverviewPage() {
    const router = useRouter()
    const [accounts, setAccounts] = React.useState<Account[]>(initialAccounts)
    const [search, setSearch] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState("all")
    const [sizeFilter, setSizeFilter] = React.useState("all")

    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDetailOpen, setIsDetailOpen] = React.useState(false)
    const [isFilterOpen, setIsFilterOpen] = React.useState(false)
    const [editingAccount, setEditingAccount] = React.useState<Account | null>(null)
    const [selected, setSelected] = React.useState<Account | null>(null)

    const [form, setForm] = React.useState({
        name: '', industry: '', location: '',
        size: 'Mid-Market' as Account['size'],
        status: 'Active' as Account['status'],
        value: '', joinedDate: new Date().toISOString().split('T')[0],
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    React.useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await getAllClients()
                const data = response?.data?.clients || response?.data || []
                if (Array.isArray(data) && data.length > 0) {
                    const mapped: Account[] = data.map((c: any, idx: number) => ({
                        id: c._id || c.id || idx + 1,
                        name: c.name || c.companyName || c.clientName || 'Unknown',
                        industry: c.industry || '',
                        location: c.location || c.address || '',
                        size: c.size || 'Mid-Market',
                        status: c.status === 'active' || c.isActive ? 'Active' : c.status === 'churned' ? 'Churned' : 'Inactive',
                        value: c.value || c.dealValue || c.revenue || 0,
                        joinedDate: c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : '',
                    }))
                    setAccounts(mapped)
                }
            } catch (err) {
                console.error('Failed to fetch clients, using local data:', err)
            }
        }
        fetchClients()
    }, [])

    const metrics = React.useMemo(() => {
        const totalValue = accounts.reduce((s, a) => s + (a.value || 0), 0)
        const active = accounts.filter(a => a.status === 'Active').length
        const enterprise = accounts.filter(a => a.size === 'Enterprise').length
        const avg = accounts.length > 0 ? totalValue / accounts.length : 0
        return {
            total: accounts.length,
            active,
            enterprise,
            totalValue: formatCurrency(totalValue),
            avgValue: formatCurrency(Math.round(avg)),
        }
    }, [accounts])

    const filtered = React.useMemo(() => {
        return accounts.filter(a => {
            const matchSearch = !search ||
                a.name.toLowerCase().includes(search.toLowerCase()) ||
                a.industry.toLowerCase().includes(search.toLowerCase()) ||
                a.location.toLowerCase().includes(search.toLowerCase())
            const matchStatus = statusFilter === "all" || a.status === statusFilter
            const matchSize = sizeFilter === "all" || a.size === sizeFilter
            return matchSearch && matchStatus && matchSize
        })
    }, [accounts, search, statusFilter, sizeFilter])

    const setField = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) setErrors(prev => { const c = { ...prev }; delete c[field]; return c })
    }

    const validate = (): boolean => {
        const errs: Record<string, string> = {}
        errs.name = validators.required(form.name) || validators.minLen(2)(form.name)
        errs.industry = validators.required(form.industry)
        errs.location = validators.required(form.location)
        errs.value = validators.required(form.value) || validators.number(form.value)
        errs.joinedDate = validators.required(form.joinedDate) || validators.date(form.joinedDate)
        Object.keys(errs).forEach(k => { if (!errs[k]) delete errs[k] })
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const openCreate = () => {
        setEditingAccount(null)
        setForm({ name: '', industry: '', location: '', size: 'Mid-Market', status: 'Active', value: '', joinedDate: new Date().toISOString().split('T')[0] })
        setErrors({})
        setIsFormOpen(true)
    }

    const openEdit = (a: Account) => {
        setEditingAccount(a)
        setForm({
            name: a.name, industry: a.industry, location: a.location,
            size: a.size, status: a.status, value: String(a.value),
            joinedDate: a.joinedDate || new Date().toISOString().split('T')[0],
        })
        setErrors({})
        setIsFormOpen(true)
    }

    const handleSave = async () => {
        if (!validate()) { toast.error("Please correct the highlighted fields"); return }
        const payload = {
            name: form.name.trim(),
            industry: form.industry.trim(),
            location: form.location.trim(),
            size: form.size,
            status: form.status,
            value: Number(form.value),
            joinedDate: form.joinedDate,
        }
        try {
            if (editingAccount) {
                await apiUpdateClient(String(editingAccount.id), payload)
                setAccounts(prev => prev.map(a => a.id === editingAccount.id ? { ...a, ...payload } : a))
                toast.success("Account updated")
            } else {
                const res = await apiAddClient(payload)
                const newClient = res?.data?.client || res?.data
                const newId = newClient?._id || Date.now()
                setAccounts(prev => [{ ...payload, id: newId } as Account, ...prev])
                toast.success("Account created")
            }
        } catch (err) {
            console.error("Save failed:", err)
            if (editingAccount) {
                setAccounts(prev => prev.map(a => a.id === editingAccount.id ? { ...a, ...payload } : a))
                toast.success("Saved locally (API sync pending)")
            } else {
                const newId = Date.now()
                setAccounts(prev => [{ ...payload, id: newId } as Account, ...prev])
                toast.success("Saved locally (API sync pending)")
            }
        }
        setIsFormOpen(false)
    }

    const handleDelete = async (id: Account['id']) => {
        try {
            await apiDeleteClient(String(id))
            setAccounts(prev => prev.filter(a => a.id !== id))
            toast.success("Account removed")
        } catch (err) {
            setAccounts(prev => prev.filter(a => a.id !== id))
            toast.success("Removed locally")
        }
    }

    const openDetail = (a: Account) => { setSelected(a); setIsDetailOpen(true) }

    const kpis = [
        { title: "Total Accounts", value: String(metrics.total), subtitle: "Portfolio Size", icon: Building2, color: "indigo", trend: "+2", path: "/client-management/customers/contacts" },
        { title: "Active Clients", value: String(metrics.active), subtitle: "Platform Utilization", icon: ShieldCheck, color: "emerald", trend: "+4%", path: "/client-management/customers/health" },
        { title: "Portfolio Value", value: metrics.totalValue, subtitle: "Annual Recurring", icon: TrendingUp, color: "blue", trend: "+12%", path: "/client-management/revenue/overview" },
        { title: "Enterprise", value: String(metrics.enterprise), subtitle: "High-Value Accounts", icon: Briefcase, color: "violet", trend: "+1", path: "/client-management/customers/journey" },
        { title: "Avg. Account", value: metrics.avgValue, subtitle: "Revenue Per Client", icon: Users, color: "amber", trend: "+5%", path: "/client-management/analytics/revenue" },
    ]
    const cm: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
        indigo: { bg: "bg-gradient-to-br from-indigo-50 to-indigo-100/50", border: "border-indigo-200/50", text: "text-indigo-600", iconBg: "bg-indigo-100" },
        emerald: { bg: "bg-gradient-to-br from-emerald-50 to-emerald-100/50", border: "border-emerald-200/50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
        blue: { bg: "bg-gradient-to-br from-blue-50 to-blue-100/50", border: "border-blue-200/50", text: "text-blue-600", iconBg: "bg-blue-100" },
        violet: { bg: "bg-gradient-to-br from-violet-50 to-violet-100/50", border: "border-violet-200/50", text: "text-violet-600", iconBg: "bg-violet-100" },
        amber: { bg: "bg-gradient-to-br from-amber-50 to-amber-100/50", border: "border-amber-200/50", text: "text-amber-600", iconBg: "bg-amber-100" },
    }

    return (
        <div className="px-8 py-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Account <span className="text-blue-600">Overview</span>
                    </h1>
                    <p className="text-[14px] font-medium text-slate-500">Manage your complete client portfolio, track account value, and monitor activation status.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-none h-10" onClick={() => setIsFilterOpen(true)}>
                        <Filter className="h-4 w-4 mr-2" />Filter
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-none h-10 px-5" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" />Add Account
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {kpis.map((kpi, i) => {
                    const cc = cm[kpi.color]
                    const Icon = kpi.icon
                    return (
                        <Card key={i} className={`rounded-none cursor-pointer hover:shadow-md transition ${cc.bg} ${cc.border} border`} onClick={() => router.push(kpi.path)}>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 tracking-wide mb-1">{kpi.title}</p>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
                                            <span className="text-xs font-bold text-emerald-600">{kpi.trend}</span>
                                        </div>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-none">
                        <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-base font-semibold">Portfolio Directory</CardTitle>
                                <Badge className="rounded-none bg-slate-100 text-slate-600">{filtered.length} accounts</Badge>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search accounts..." value={search} onChange={e => setSearch(e.target.value)}
                                    className="pl-10 rounded-none w-64 h-9" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[11px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                            <th className="px-6 py-3">Account Details</th>
                                            <th className="px-6 py-3">Status & Size</th>
                                            <th className="px-6 py-3">Annual Value</th>
                                            <th className="px-6 py-3">Joining Date</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {filtered.length > 0 ? filtered.map((a) => (
                                            <tr key={a.id} className="group hover:bg-slate-50/80 transition cursor-pointer" onClick={() => openDetail(a)}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-none bg-white border border-slate-100 flex items-center justify-center group-hover:bg-blue-50">
                                                            <Building2 className="h-5 w-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800">{a.name}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <Briefcase className="h-3 w-3 text-slate-400" />
                                                                <p className="text-[11px] font-medium text-slate-500">{a.industry}</p>
                                                            </div>
                                                            {a.location && (
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <MapPin className="h-3 w-3 text-slate-400" />
                                                                    <p className="text-[11px] font-medium text-slate-500">{a.location}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className={`inline-flex items-center w-fit px-2 py-0.5 rounded-none text-[11px] font-bold border ${statusBg(a.status)}`}>{a.status}</span>
                                                        <span className="text-[10px] text-slate-400 font-bold ml-1">{a.size}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-900">${a.value.toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        <span className="text-[11px] font-bold">{a.joinedDate}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="rounded-none">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44 rounded-none">
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openEdit(a)}>
                                                                <PencilLine className="h-4 w-4" /> Edit Account
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => openDetail(a)}>
                                                                <Eye className="h-4 w-4" /> View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="flex items-center gap-2 text-rose-500 border-t mt-1" onClick={() => handleDelete(a.id)}>
                                                                <Trash2 className="h-4 w-4" /> Delete Record
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">No accounts match your filters.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="rounded-none">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">Geographic Distribution</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[
                                    { region: 'North America', count: 12, value: '$450k', color: 'bg-blue-600' },
                                    { region: 'Europe', count: 8, value: '$220k', color: 'bg-blue-400' },
                                    { region: 'Asia Pacific', count: 5, value: '$95k', color: 'bg-blue-200' },
                                ].map((reg) => (
                                    <div key={reg.region} className="flex items-center justify-between p-3 border border-slate-100 rounded-none cursor-pointer hover:bg-slate-50" onClick={() => toast.success(`${reg.region} report opened`)}>
                                        <div className="flex items-center gap-3">
                                            <div className={`h-2.5 w-2.5 ${reg.color}`} />
                                            <span className="text-[13px] font-bold text-slate-700">{reg.region}</span>
                                        </div>
                                        <span className="text-[13px] font-bold text-slate-900">{reg.value}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="rounded-none">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold">Upcoming Renewals</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[
                                    { name: 'Globex Corp', date: 'Oct 12', value: '$24k' },
                                    { name: 'Tesla Inc', date: 'Oct 28', value: '$85k' },
                                    { name: 'Netflix', date: 'Nov 05', value: '$12k' },
                                ].map((ren) => (
                                    <div key={ren.name} className="flex items-center justify-between p-3 border border-slate-100 rounded-none cursor-pointer hover:bg-slate-50" onClick={() => router.push('/client-management/revenue/renewals')}>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-none bg-orange-50 flex items-center justify-center text-[10px] font-bold text-orange-600">{ren.date}</div>
                                            <span className="text-[13px] font-bold text-slate-700">{ren.name}</span>
                                        </div>
                                        <span className="text-[13px] font-bold text-slate-900">{ren.value}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-none border-blue-100 bg-blue-50/10">
                        <CardHeader>
                            <CardTitle className="text-xs font-bold text-blue-600 tracking-wider flex items-center gap-2 uppercase">
                                <Globe className="h-4 w-4" /> Global Accounts Sync
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-3 bg-white border border-blue-100 rounded-none">
                                <p className="text-[12px] text-slate-600">
                                    Your portfolio is expanding in <span className="text-blue-600 font-bold">EMEA</span> region. 4 new accounts added this month.
                                </p>
                            </div>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-none" onClick={() => router.push('/client-management/analytics/revenue')}>
                                View Region Report
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Account Health</CardTitle>
                            <div className="h-2 w-2 bg-emerald-500 animate-pulse" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[
                                { name: 'Health Score', value: '88/100', color: 'text-emerald-600', path: '/client-management/customers/health' },
                                { name: 'Active Users', value: '1,240', color: 'text-slate-900', path: '/client-management/customers' },
                                { name: 'Churn Risk', value: 'Low', color: 'text-emerald-600', path: '/client-management/analytics/retention' },
                            ].map((stat) => (
                                <div key={stat.name} className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-0 last:pb-0 cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1" onClick={() => router.push(stat.path)}>
                                    <span className="text-[13px] font-bold text-slate-500">{stat.name}</span>
                                    <span className={`text-[14px] font-bold ${stat.color}`}>{stat.value}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="rounded-none">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xs font-bold text-slate-400 tracking-wider uppercase">Recent Wins</CardTitle>
                            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { company: 'Globex Corp', type: 'Migration', time: '2h ago', icon: <Globe className="h-3 w-3" /> },
                                { company: 'Tesla Inc', type: 'Expansion', time: '5h ago', icon: <TrendingUp className="h-3 w-3" /> },
                                { company: 'Apple', type: 'New Logo', time: '1d ago', icon: <Building2 className="h-3 w-3" /> },
                            ].map((win, i) => (
                                <div key={i} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 -mx-2 px-2 py-1" onClick={() => toast.success(`${win.company} details opened`)}>
                                    <div className="h-9 w-9 rounded-none bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">{win.icon}</div>
                                    <div className="flex-1">
                                        <p className="text-[13px] font-bold text-slate-700 leading-tight">{win.company}</p>
                                        <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{win.type} • {win.time}</p>
                                    </div>
                                    <ExternalLink className="h-3 w-3 text-slate-300" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Form Sheet (Add/Edit) */}
            <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-blue-50 to-indigo-50">
                        <SheetTitle className="text-[18px] font-semibold text-slate-900">{editingAccount ? "Edit Account" : "Add New Account"}</SheetTitle>
                        <p className="text-[12px] text-slate-500">Track and manage your client portfolio.</p>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Account Name <span className="text-rose-500">*</span></Label>
                            <Input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="e.g. Acme Corp" className={`h-10 rounded-none ${errors.name ? "border-rose-500" : ""}`} />
                            {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Industry <span className="text-rose-500">*</span></Label>
                                <Input value={form.industry} onChange={e => setField("industry", e.target.value)} placeholder="e.g. Technology" className={`h-10 rounded-none ${errors.industry ? "border-rose-500" : ""}`} />
                                {errors.industry && <p className="text-[11px] text-rose-500">{errors.industry}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Location <span className="text-rose-500">*</span></Label>
                                <Input value={form.location} onChange={e => setField("location", e.target.value)} placeholder="e.g. London, UK" className={`h-10 rounded-none ${errors.location ? "border-rose-500" : ""}`} />
                                {errors.location && <p className="text-[11px] text-rose-500">{errors.location}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Account Size</Label>
                                <Select value={form.size} onValueChange={(v: any) => setField("size", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Enterprise">Enterprise</SelectItem>
                                        <SelectItem value="Mid-Market">Mid-Market</SelectItem>
                                        <SelectItem value="SMB">SMB</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Status</Label>
                                <Select value={form.status} onValueChange={(v: any) => setField("status", v)}>
                                    <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-none">
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Churned">Churned</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Annual Value ($) <span className="text-rose-500">*</span></Label>
                                <Input type="number" value={form.value} onChange={e => setField("value", e.target.value)} placeholder="50000" className={`h-10 rounded-none ${errors.value ? "border-rose-500" : ""}`} />
                                {errors.value && <p className="text-[11px] text-rose-500">{errors.value}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[12px] font-semibold">Joined Date <span className="text-rose-500">*</span></Label>
                                <Input type="date" value={form.joinedDate} onChange={e => setField("joinedDate", e.target.value)} className={`h-10 rounded-none ${errors.joinedDate ? "border-rose-500" : ""}`} />
                                {errors.joinedDate && <p className="text-[11px] text-rose-500">{errors.joinedDate}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                        <Button className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-none" onClick={handleSave}>
                            {editingAccount ? "Save Changes" : "Create Account"}
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Filter Sheet */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-blue-50">
                        <SheetTitle className="text-[18px] font-semibold">Filter Accounts</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Status</Label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Churned">Churned</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[12px] font-semibold">Account Size</Label>
                            <Select value={sizeFilter} onValueChange={setSizeFilter}>
                                <SelectTrigger className="h-10 rounded-none"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-none">
                                    <SelectItem value="all">All Sizes</SelectItem>
                                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                                    <SelectItem value="Mid-Market">Mid-Market</SelectItem>
                                    <SelectItem value="SMB">SMB</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="p-5 border-t flex gap-3 bg-white">
                        <Button variant="outline" className="flex-1 h-10 rounded-none" onClick={() => { setStatusFilter("all"); setSizeFilter("all"); toast.success("Filters reset") }}>Reset</Button>
                        <Button className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 rounded-none" onClick={() => { setIsFilterOpen(false); toast.success("Filters applied") }}>Apply</Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Detail Sheet */}
            <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <SheetContent side="right" className="sm:max-w-md w-full p-0 rounded-none flex flex-col">
                    <SheetHeader className="p-6 border-b bg-gradient-to-br from-slate-50 to-blue-50">
                        <SheetTitle className="text-[18px] font-semibold">Account Details</SheetTitle>
                    </SheetHeader>
                    {selected && (
                        <>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">Account</p>
                                    <p className="text-lg font-semibold text-slate-900">{selected.name}</p>
                                    <p className="text-sm text-slate-500">{selected.industry}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                                    <div><p className="text-[11px] text-slate-400 uppercase">Status</p>
                                        <span className={`inline-flex px-2 py-0.5 rounded-none text-[11px] font-bold border ${statusBg(selected.status)}`}>{selected.status}</span>
                                    </div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Size</p><Badge className="rounded-none">{selected.size}</Badge></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Annual Value</p><p className="font-semibold text-slate-900">${selected.value.toLocaleString()}</p></div>
                                    <div><p className="text-[11px] text-slate-400 uppercase">Joined</p><p className="font-semibold text-slate-900">{selected.joinedDate}</p></div>
                                    <div className="col-span-2"><p className="text-[11px] text-slate-400 uppercase">Location</p><p className="font-semibold text-slate-900">{selected.location}</p></div>
                                </div>
                                <div className="pt-3 border-t space-y-2">
                                    <Button variant="outline" className="w-full h-10 rounded-none justify-start" onClick={() => { setIsDetailOpen(false); router.push('/client-management/customers/contacts') }}>
                                        <Users className="h-4 w-4 mr-2" />View Contacts
                                    </Button>
                                    <Button variant="outline" className="w-full h-10 rounded-none justify-start" onClick={() => { setIsDetailOpen(false); router.push('/client-management/customers/health') }}>
                                        <TrendingUp className="h-4 w-4 mr-2" />View Health
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
