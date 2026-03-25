"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import {
    Users,
    Building2,
    Briefcase,
    ShieldCheck,
    Search,
    Filter,
    MoreVertical,
    Plus,
    Trash2,
    PencilLine,
    Eye,
    Save,
    MapPin,
    Globe,
    Calendar,
    ArrowUpRight,
    TrendingUp,
    ExternalLink
} from "lucide-react"

import { Card, CardContent } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/shared/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { useToast } from "@/shared/components/ui/use-toast"
import { getAllClients, addClient as apiAddClient, updateClient as apiUpdateClient, deleteClient as apiDeleteClient } from "@/modules/crm/clients/hooks/clientHooks"

// Types
interface Account {
    id: number;
    name: string;
    industry: string;
    location: string;
    size: 'Enterprise' | 'Mid-Market' | 'SMB';
    status: 'Active' | 'Churned' | 'Inactive';
    value: number;
    joinedDate: string;
}

const initialAccounts: Account[] = [
    { id: 1, name: "DataScale Inc", industry: "SaaS", location: "San Francisco, CA", size: "Mid-Market", status: "Active", value: 45000, joinedDate: "2023-05-12" },
    { id: 2, name: "Innova Hub", industry: "E-commerce", location: "New York, NY", size: "SMB", status: "Active", value: 12000, joinedDate: "2023-08-20" },
    { id: 3, name: "Global Dynamics", industry: "Finance", location: "London, UK", size: "Enterprise", status: "Active", value: 125000, joinedDate: "2022-11-05" },
    { id: 4, name: "Swift Apps", industry: "Tech Services", location: "Berlin, DE", size: "SMB", status: "Inactive", value: 8500, joinedDate: "2024-01-15" },
    { id: 5, name: "Horizon Media", industry: "Advertising", location: "Sydney, AU", size: "Mid-Market", status: "Active", value: 38000, joinedDate: "2023-02-28" },
]

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ')

const MetricBox = ({ title, value, icon: Icon, color, subValue, trend }: any) => {
    const colorClasses: any = {
        blue: "from-blue-50 to-blue-100/50 border-blue-200/50 text-blue-600",
        indigo: "from-indigo-50 to-indigo-100/50 border-indigo-200/50 text-indigo-600",
        violet: "from-violet-50 to-violet-100/50 border-violet-200/50 text-violet-600",
        emerald: "from-emerald-50 to-emerald-100/50 border-emerald-200/50 text-emerald-600",
        amber: "from-amber-50 to-amber-100/50 border-amber-200/50 text-amber-600",
    }
    const currentClasses = colorClasses[color] || colorClasses.indigo
    return (
        <Card className={cn("bg-gradient-to-br border shadow-none transition-all hover:shadow-md", currentClasses.split(' ').slice(0, 3).join(' '))}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 tracking-wide font-outfit mb-2">{title}</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight leading-none">{value}</h3>
                            {trend && (
                                <span className={cn("text-xs font-bold font-outfit flex items-center gap-0.5",
                                    trend.startsWith('+') ? "text-emerald-600" : "text-rose-600"
                                )}>
                                    {trend}
                                </span>
                            )}
                        </div>
                        <p className="mt-2 text-xs font-medium text-slate-400 font-outfit">{subValue}</p>
                    </div>
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center bg-white/60 shadow-sm border border-white/50", currentClasses.split(' ').pop())}>
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function AccountOverviewPage() {
    const [accounts, setAccounts] = useState<Account[]>(initialAccounts)
    const [search, setSearch] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingAccount, setEditingAccount] = useState<Account | null>(null)
    const { toast } = useToast()

    // Fetch clients from API on mount
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

    // Form states
    const [formData, setFormData] = useState<Partial<Account>>({
        name: '',
        industry: '',
        location: '',
        size: 'Mid-Market',
        status: 'Active',
        value: 0,
        joinedDate: new Date().toISOString().split('T')[0]
    })

    const metrics = useMemo(() => {
        const totalValue = accounts.reduce((sum, item) => sum + item.value, 0)
        const activeAccounts = accounts.filter(a => a.status === 'Active').length
        const enterpriseCount = accounts.filter(a => a.size === 'Enterprise').length
        const avgValue = accounts.length > 0 ? (totalValue / accounts.length).toFixed(0) : 0

        const formatCurrency = (val: number) => {
            if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`
            return `$${val}`
        }

        return {
            totalValue: formatCurrency(totalValue),
            active: activeAccounts,
            enterprise: enterpriseCount,
            avgValue: formatCurrency(Number(avgValue)),
            totalCount: accounts.length
        }
    }, [accounts])

    const filteredAccounts = useMemo(() => {
        return accounts.filter(a =>
            a.name.toLowerCase().includes(search.toLowerCase()) ||
            a.industry.toLowerCase().includes(search.toLowerCase()) ||
            a.location.toLowerCase().includes(search.toLowerCase())
        )
    }, [accounts, search])

    const handleDelete = async (id: number | string) => {
        try {
            await apiDeleteClient(String(id))
            setAccounts(prev => prev.filter(a => a.id !== id))
            toast({ title: "Account Removed", description: "The account record has been deleted." })
        } catch (err) {
            console.error("Delete failed:", err)
            // Still remove locally as fallback
            setAccounts(prev => prev.filter(a => a.id !== id))
            toast({ title: "Account Removed", description: "The account record has been deleted locally." })
        }
    }

    const handleSave = async () => {
        if (!formData.name || !formData.industry) return

        try {
            if (editingAccount) {
                await apiUpdateClient(String(editingAccount.id), formData)
                setAccounts(prev => prev.map(a => a.id === editingAccount.id ? { ...a, ...formData } as Account : a))
                toast({ title: "Account Updated", description: "The account details have been saved." })
            } else {
                const res = await apiAddClient(formData)
                const newClient = res?.data?.client || res?.data
                const newId = newClient?._id || (accounts.length > 0 ? Math.max(...accounts.map(a => typeof a.id === 'number' ? a.id : 0)) + 1 : 1)
                setAccounts(prev => [...prev, { ...formData, id: newId } as Account])
                toast({ title: "Account Created", description: "New account has been added successfully." })
            }
        } catch (err) {
            console.error("Save failed:", err)
            // Fallback to local operation
            if (editingAccount) {
                setAccounts(prev => prev.map(a => a.id === editingAccount.id ? { ...a, ...formData } as Account : a))
            } else {
                const newId = accounts.length > 0 ? Math.max(...accounts.map(a => typeof a.id === 'number' ? a.id : 0)) + 1 : 1
                setAccounts(prev => [...prev, { ...formData, id: newId } as Account])
            }
            toast({ title: "Saved Locally", description: "Changes saved locally. API sync pending." })
        }
        setIsDialogOpen(false)
        setEditingAccount(null)
        setFormData({ name: '', industry: '', location: '', size: 'Mid-Market', status: 'Active', value: 0, joinedDate: new Date().toISOString().split('T')[0] })
    }

    const openEdit = (account: Account) => {
        setEditingAccount(account)
        setFormData(account)
        setIsDialogOpen(true)
    }

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50 min-h-screen font-outfit">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-900 font-outfit tracking-tight">
                        Account <span className="text-blue-600">Overview</span>
                    </h1>
                    <p className="text-[15px] font-medium text-slate-500 font-outfit">
                        Manage your complete client portfolio, track account value, and monitor activation status.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open)
                    if (!open) { setEditingAccount(null); setFormData({ name: '', industry: '', location: '', size: 'Mid-Market', status: 'Active', value: 0, joinedDate: new Date().toISOString().split('T')[0] }) }
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 px-6 font-bold font-outfit shadow-lg shadow-blue-600/20 gap-2">
                            <Plus className="h-5 w-5" /> Add New Account
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px] font-outfit rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">{editingAccount ? 'Edit Account' : 'Add New Account'}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Account Name</Label>
                                    <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Acme Corp" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Industry</Label>
                                    <Input value={formData.industry} onChange={e => setFormData({ ...formData, industry: e.target.value })} placeholder="e.g. Technology" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Location</Label>
                                <Input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. London, UK" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Account Size</Label>
                                    <Select value={formData.size} onValueChange={(v: any) => setFormData({ ...formData, size: v })}>
                                        <SelectTrigger><SelectValue placeholder="Size" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Enterprise">Enterprise</SelectItem>
                                            <SelectItem value="Mid-Market">Mid-Market</SelectItem>
                                            <SelectItem value="SMB">SMB</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Status</Label>
                                    <Select value={formData.status} onValueChange={(v: any) => setFormData({ ...formData, status: v })}>
                                        <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Churned">Churned</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Annual Value ($)</Label>
                                    <Input type="number" value={formData.value} onChange={e => setFormData({ ...formData, value: Number(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Joined Date</Label>
                                    <Input type="date" value={formData.joinedDate} onChange={e => setFormData({ ...formData, joinedDate: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSave}>
                                <Save className="h-4 w-4 mr-2" /> Save Account
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Account Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <MetricBox title="Total Accounts" value={metrics.totalCount} subValue="Portfolio Size" icon={Building2} color="indigo" />
                <MetricBox title="Active Clients" value={metrics.active} subValue="Platform Utilization" icon={ShieldCheck} color="emerald" trend="+4%" />
                <MetricBox title="Portfolio Value" value={metrics.totalValue} subValue="Annual Recurring" icon={TrendingUp} color="blue" trend="+12%" />
                <MetricBox title="Enterprise" value={metrics.enterprise} subValue="High-Value Accounts" icon={Briefcase} color="violet" trend="+1" />
                <MetricBox title="Avg. Account" value={metrics.avgValue} subValue="Revenue Per Client" icon={Users} color="amber" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
                            <div className="flex items-center gap-3">
                                <h2 className="text-base font-bold text-slate-900 tracking-tight font-outfit">Portfolio Directory</h2>
                                <div className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[12px] font-bold font-outfit">{filteredAccounts.length} accounts</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Search accounts..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/10 w-full md:w-64 font-outfit"
                                    />
                                </div>
                                <Button variant="outline" size="icon" className="rounded-xl text-slate-400"><Filter className="h-4.5 w-4.5" /></Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[12px] font-bold text-slate-400 tracking-wider border-b border-slate-50 bg-slate-50/30">
                                        <th className="px-6 py-4">Account Details</th>
                                        <th className="px-6 py-4">Status & Size</th>
                                        <th className="px-6 py-4">Annual Value</th>
                                        <th className="px-6 py-4">Joining Date</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredAccounts.length > 0 ? filteredAccounts.map((account) => (
                                        <tr key={account.id} className="group hover:bg-slate-50/80 transition-all border-b border-slate-50/50">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:bg-blue-50 transition-colors">
                                                        <Building2 className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800 font-outfit">{account.name}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <Briefcase className="h-3 w-3 text-slate-400" />
                                                            <p className="text-[11px] font-medium text-slate-500 font-outfit">{account.industry}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <span className={cn(
                                                        "inline-flex items-center w-fit px-2.5 py-0.5 rounded-full text-[11px] font-bold font-outfit border",
                                                        account.status === 'Active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                            account.status === 'Churned' ? "bg-rose-50 text-rose-600 border-rose-100" :
                                                                "bg-slate-50 text-slate-600 border-slate-100"
                                                    )}>
                                                        {account.status}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-bold font-outfit ml-1">{account.size}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm font-bold text-slate-900 font-outfit">${account.value.toLocaleString()}</td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    <span className="text-[11px] font-bold font-outfit">{account.joinedDate}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-slate-300 hover:text-blue-600 transition-colors">
                                                            <MoreVertical className="h-5 w-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44 font-outfit rounded-xl">
                                                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => openEdit(account)}>
                                                            <PencilLine className="h-4 w-4" /> Edit Account
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                                            <Eye className="h-4 w-4" /> View Dashboard
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2 text-rose-500 cursor-pointer border-t mt-1" onClick={() => handleDelete(account.id)}>
                                                            <Trash2 className="h-4 w-4" /> Delete Record
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center">
                                                <p className="text-sm font-bold text-slate-500 font-outfit">No accounts found.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-base font-bold text-slate-900 font-outfit mb-4">Geographic Distribution</h3>
                            <div className="space-y-4">
                                {[
                                    { region: 'North America', count: 12, value: '$450k', color: 'bg-blue-600' },
                                    { region: 'Europe', count: 8, value: '$220k', color: 'bg-blue-400' },
                                    { region: 'Asia Pacific', count: 5, value: '$95k', color: 'bg-blue-200' },
                                ].map((reg) => (
                                    <div key={reg.region} className="flex items-center justify-between p-3 rounded-xl border border-slate-50">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("h-2.5 w-2.5 rounded-full", reg.color)} />
                                            <span className="text-[13px] font-bold text-slate-700 font-outfit">{reg.region}</span>
                                        </div>
                                        <span className="text-[13px] font-bold text-slate-900 font-outfit">{reg.value}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-base font-bold text-slate-900 font-outfit mb-4">Upcoming Renewals</h3>
                            <div className="space-y-4">
                                {[
                                    { name: 'Globex Corp', date: 'Oct 12', value: '$24k' },
                                    { name: 'Tesla Inc', date: 'Oct 28', value: '$85k' },
                                    { name: 'Netflix', date: 'Nov 05', value: '$12k' },
                                ].map((ren) => (
                                    <div key={ren.name} className="flex items-center justify-between p-3 rounded-xl border border-slate-50">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center text-[10px] font-bold text-orange-600">
                                                {ren.date}
                                            </div>
                                            <span className="text-[13px] font-bold text-slate-700 font-outfit">{ren.name}</span>
                                        </div>
                                        <span className="text-[13px] font-bold text-slate-900 font-outfit">{ren.value}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-2xl border-blue-100 bg-blue-50/10 p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-0 top-0 h-16 w-16 bg-blue-600/5 rounded-bl-full transition-transform group-hover:scale-150" />
                        <h3 className="text-xs font-bold text-blue-600 tracking-wider flex items-center gap-2 font-outfit">
                            <Globe className="h-4 w-4" /> Global Accounts Sync
                        </h3>
                        <div className="mt-6 space-y-4">
                            <div className="p-4 bg-white border border-blue-100 rounded-xl shadow-sm">
                                <p className="text-[13px] font-medium text-slate-600 leading-relaxed font-outfit">
                                    Your portfolio is expanding in <span className="text-blue-600 font-bold">EMEA</span> region. 4 new accounts added this month.
                                </p>
                            </div>
                        </div>
                        <Button className="w-full mt-6 py-6 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all font-outfit">
                            View Region Report
                        </Button>
                    </Card>

                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xs font-bold text-slate-400 tracking-wider font-outfit">Account Health</h3>
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: 'Health Score', value: '88/100', color: 'text-emerald-600' },
                                { name: 'Active Users', value: '1,240', color: 'text-slate-900' },
                                { name: 'Churn Risk', value: 'Low', color: 'text-emerald-600' },
                            ].map((stat) => (
                                <div key={stat.name} className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                    <span className="text-[13px] font-bold text-slate-500 font-outfit">{stat.name}</span>
                                    <span className={cn("text-[14px] font-bold font-outfit", stat.color)}>{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xs font-bold text-slate-400 tracking-wider font-outfit">Recent Wins</h3>
                            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="space-y-6 relative">
                            <div className="absolute left-[20px] top-2 bottom-0 w-0.5 bg-slate-50" />
                            {[
                                { company: 'Globex Corp', type: 'Migration', time: '2h ago', icon: <Globe className="h-3 w-3" /> },
                                { company: 'Tesla Inc', type: 'Expansion', time: '5h ago', icon: <TrendingUp className="h-3 w-3" /> },
                                { company: 'Apple', type: 'New Logo', time: '1d ago', icon: <Building2 className="h-3 w-3" /> },
                            ].map((win, i) => (
                                <div key={i} className="relative flex items-center gap-4 group">
                                    <div className="h-10 w-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 z-10 shadow-sm group-hover:border-blue-200 transition-colors">
                                        {win.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[13px] font-bold text-slate-700 font-outfit leading-tight">
                                            {win.company}
                                        </p>
                                        <p className="text-[11px] font-semibold text-slate-400 font-outfit mt-0.5">{win.type} • {win.time}</p>
                                    </div>
                                    <ExternalLink className="h-3 w-3 text-slate-300 group-hover:text-blue-500 cursor-pointer" />
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
