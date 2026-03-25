"use client"

import React, { useState, useMemo } from 'react'
import {
    Search,
    Plus,
    Download,
    Edit,
    Trash2,
    Eye,
    Settings,
    Calculator,
    FileText,
    AlertTriangle,
    RefreshCw,
    Globe,
    ShieldCheck,
    Clock,
    CheckCircle2,
    Calendar,
    ChevronDown,
    Lock,
    SearchCheck
} from 'lucide-react'
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Progress } from "@/shared/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Switch } from "@/shared/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/shared/components/ui/dialog"
import { Label } from "@/shared/components/ui/label"
import { toast } from "@/shared/utils/toast"

// --- Mock Data ---
const INITIAL_RULES = [
    { id: "TAX-001", name: "US Sales Tax (CA)", type: "Sales Tax", rate: 8.25, region: "United States", status: "Active" },
    { id: "TAX-002", name: "UK VAT Standard", type: "VAT", rate: 20.0, region: "United Kingdom", status: "Active" },
    { id: "TAX-003", name: "Canada GST", type: "GST", rate: 5.0, region: "Canada", status: "Active" }
]

const RETURNS = [
    { period: "Q3 2024", region: "United States", due: "Oct 31, 2024", liability: 45200, status: "Pending" },
    { period: "Q3 2024", region: "United Kingdom", due: "Nov 07, 2024", liability: 62300, status: "Draft" }
]

export default function TaxModule() {
    const [rules, setRules] = useState(INITIAL_RULES)
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateRuleOpen, setIsCreateRuleOpen] = useState(false)
    const [newRule, setNewRule] = useState({ name: '', region: 'North America', rate: '5.0', authority: '' })
    const [selectedRule, setSelectedRule] = useState<any>(null)

    const handleAction = (msg: string) => {
        toast.promise(new Promise(r => setTimeout(r, 1000)), {
            loading: 'Recalculating global tax liabilities...',
            success: msg,
            error: 'Calculation failed'
        })
    }

    const handleCreateRule = () => {
        if (!newRule.name || !newRule.rate || !newRule.authority) {
            toast.error("Please fill in all required fields")
            return
        }
        const rule = {
            id: `TAX-00${rules.length + 1}`,
            name: newRule.name,
            type: 'Custom', // Default type for new rules
            rate: parseFloat(newRule.rate),
            region: newRule.region || 'Global',
            status: 'Active',
            authority: newRule.authority
        }
        setRules([...rules, rule])
        setIsCreateRuleOpen(false)
        setNewRule({ name: '', region: 'North America', rate: '5.0', authority: '' })
        toast.success(`Rule ${rule.id} provisioned`)
    }

    const handleToggleRule = (id: string) => {
        setRules(rules.map(r => r.id === id ? { ...r, status: r.status === 'Active' ? 'Inactive' : 'Active' } : r))
        toast.success("Nexus status updated")
    }

    const handleDelete = (id: string) => {
        setRules(rules.filter(r => r.id !== id))
        toast.success("Rule deleted successfully")
    }

    const filteredRules = useMemo(() => {
        return rules.filter(r =>
            r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.region.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [rules, searchQuery])

    const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

    return (
        <div className="px-8 py-8 space-y-8 bg-slate-50/50 min-h-screen font-outfit">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-semibold text-slate-900 tracking-tight">Tax <span className="text-indigo-600">Compliance</span></h1>
                    <p className="text-[15px] font-medium text-slate-500 mt-1">Multi-jurisdictional tax rules, liability tracking, and structural reporting</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 bg-white font-semibold shadow-sm gap-2 text-slate-700 hover:bg-slate-50" onClick={() => handleAction("Global tax nexus synchronized")}>
                        <Globe className="w-4 h-4 text-slate-400" /> Nexus Sync
                    </Button>
                    <Dialog open={isCreateRuleOpen} onOpenChange={setIsCreateRuleOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm gap-2">
                                <Plus className="w-4 h-4" /> Add Tax Rule
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-semibold text-slate-900 tracking-tight">Tax <span className="text-indigo-600">Architect</span></DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-6 py-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Rule Name</Label>
                                    <Input value={newRule.name} onChange={(e) => setNewRule({ ...newRule, name: e.target.value })} placeholder="e.g. EU Digital VAT" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Tax Rate (%)</Label>
                                    <Input type="number" value={newRule.rate} onChange={(e) => setNewRule({ ...newRule, rate: e.target.value })} placeholder="20.0" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Jurisdiction</Label>
                                    <Input value={newRule.region} onChange={(e) => setNewRule({ ...newRule, region: e.target.value })} placeholder="e.g. European Union" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Filing Authority</Label>
                                    <Input value={newRule.authority} onChange={(e) => setNewRule({ ...newRule, authority: e.target.value })} placeholder="e.g. HM Revenue & Customs" className="h-11 rounded-xl bg-slate-50 border-slate-100 font-medium" />
                                </div>
                            </div>
                            <Button className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/20" onClick={handleCreateRule}>Deploy Rule</Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Liability (Mtd)", value: "$45.2k", change: "+8.3%", trend: "up", icon: Calculator, color: "bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-100/50 text-rose-600" },
                    { label: "Tax Collected", value: "$67.8k", change: "+12.1%", trend: "up", icon: FileText, color: "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-100/50 text-emerald-600" },
                    { label: "Compliance Index", value: "98.5%", icon: ShieldCheck, color: "bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-indigo-100/50 text-indigo-600" },
                    { label: "Pending Returns", value: "03 Nodes", icon: AlertTriangle, color: "bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-100/50 text-amber-600" }
                ].map((stat, i) => (
                    <Card key={i} className={`${stat.color} p-6 rounded-3xl border shadow-sm group hover:shadow-md transition-all`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-11 w-11 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-current opacity-20">
                                <stat.icon className="w-5 h-5" />
                            </div>
                            {stat.change && (
                                <Badge variant="outline" className="font-semibold text-[10px] bg-white border-emerald-100 text-emerald-600 tracking-tight">{stat.change} ↑</Badge>
                            )}
                        </div>
                        <p className="text-[12px] font-medium text-slate-500 leading-none mb-1">{stat.label}</p>
                        <h4 className="text-xl font-semibold text-slate-900">{stat.value}</h4>
                    </Card>
                ))}
            </div>

            <Tabs defaultValue="rules" className="space-y-6">
                <TabsList className="bg-white border border-slate-200 p-1.5 rounded-2xl h-14 w-fit shadow-sm">
                    <TabsTrigger value="rules" className="px-8 rounded-xl data-[state=active]:bg-slate-50 data-[state=active]:text-indigo-600 font-semibold text-sm h-full text-slate-500 transition-all">Jurisdiction Rules</TabsTrigger>
                    <TabsTrigger value="returns" className="px-8 rounded-xl data-[state=active]:bg-slate-50 data-[state=active]:text-indigo-600 font-semibold text-sm h-full text-slate-500 transition-all">Returns & Filing</TabsTrigger>
                </TabsList>

                <TabsContent value="rules">
                    <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 bg-white border border-slate-100">
                        <CardHeader className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <CardTitle className="text-xl font-semibold text-slate-900">Tax Rule Engine</CardTitle>
                            <div className="relative w-full md:w-80 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors w-4 h-4" />
                                <Input
                                    placeholder="Search rules or region..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 h-11 bg-slate-50 border-slate-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4 text-slate-900">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredRules.map((rule, idx) => (
                                    <div key={idx} className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-lg hover:border-indigo-100 transition-all group">
                                        <div className="space-y-1.5 flex-1">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-md font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{rule.name}</h4>
                                                <Badge className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border-0 ${rule.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                                                    }`}>{rule.status}</Badge>
                                            </div>
                                            <div className="flex items-center gap-6 text-[11px] font-medium text-slate-400">
                                                <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Region: {rule.region}</span>
                                                <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> Type: {rule.type}</span>
                                            </div>
                                        </div>
                                        <div className="text-right flex items-center gap-6">
                                            <div className="flex items-center justify-end gap-1 pt-1 text-slate-900">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600" onClick={() => setSelectedRule(rule)}><Eye className="w-3.5 h-3.5" /></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-600" onClick={() => handleDelete(rule.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                                            </div>
                                            <div className="space-y-0.5" onClick={() => handleAction("Editing tax parameters")}>
                                                <p className="text-2xl font-semibold text-indigo-600 tracking-tight cursor-pointer hover:scale-105 transition-transform">{rule.rate}%</p>
                                                <p className="text-[10px] font-medium text-slate-400">Set Rate</p>
                                            </div>
                                            <div className="flex flex-col items-center gap-2 border-l border-slate-200 pl-6">
                                                <Switch checked={rule.status === 'Active'} onCheckedChange={() => handleToggleRule(rule.id)} className="data-[state=checked]:bg-indigo-600 scale-90" />
                                                <span className="text-[9px] font-medium text-slate-400">Toggle</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="returns">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card className="lg:col-span-2 rounded-3xl border-0 shadow-xl shadow-slate-200/50 bg-white border border-slate-100 text-slate-900">
                            <CardHeader className="px-8 py-6 border-b border-slate-100">
                                <CardTitle className="text-xl font-semibold text-slate-900">Upcoming Filing Deadlines</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-4">
                                {RETURNS.map((ret, idx) => (
                                    <div key={idx} className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all">
                                        <div className="space-y-1.5 flex-1">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                    <Calendar className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="text-md font-semibold text-slate-900 tracking-tight leading-none mb-1">{ret.region} • {ret.period}</h4>
                                                    <p className="text-[11px] font-medium text-rose-500 flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5" /> Deadline: {ret.due}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right flex items-center gap-8">
                                            <div className="space-y-0.5 text-right">
                                                <p className="text-xl font-semibold text-slate-900 tracking-tight">{fmt(ret.liability)}</p>
                                                <p className="text-[10px] font-medium text-slate-400">Accrued Liability</p>
                                            </div>
                                            <Button className="h-10 px-6 rounded-xl bg-slate-900 text-white font-semibold text-xs transition-all hover:bg-slate-800" onClick={() => handleAction(`Filing sequence for ${ret.region} initiated`)}>File Return</Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <div className="space-y-8">
                            <Card className="rounded-3xl border-0 shadow-xl shadow-slate-200/50 p-8 space-y-6 bg-white border border-slate-100 text-slate-900">
                                <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h4 className="text-xl font-semibold text-slate-900 tracking-tight leading-none">Compliance Health</h4>
                                <div className="space-y-5">
                                    {[
                                        { label: "Us Federal", value: 98 },
                                        { label: "Uk Vat Nexus", value: 92 },
                                        { label: "Canada Gst", value: 100 }
                                    ].map((c, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between text-[12px] font-medium text-slate-500">
                                                <span>{c.label}</span>
                                                <span className="text-slate-900">{c.value}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500" style={{ width: `${c.value}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* View Tax Rule Modal */}
            <Dialog open={!!selectedRule} onOpenChange={() => setSelectedRule(null)}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl border-slate-100 bg-white shadow-2xl p-8 font-outfit">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-semibold text-slate-900 tracking-tight">Rule <span className="text-indigo-600">Nexus Audit</span></DialogTitle>
                    </DialogHeader>
                    {selectedRule && (
                        <div className="space-y-6 py-4 text-slate-900">
                            <div className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Logic ID</p>
                                    <p className="text-xl font-bold text-indigo-600">{selectedRule.id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Compliance Rate</p>
                                    <p className="text-xl font-bold text-slate-900">{selectedRule.rate}%</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-slate-400">Policy Name</p>
                                        <p className="text-sm font-bold text-slate-900">{selectedRule.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-semibold text-slate-400">Jurisdiction</p>
                                        <Badge className="bg-indigo-50 text-indigo-600 font-bold text-[10px] border-0">{selectedRule.region}</Badge>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-slate-400">Filing Authority</p>
                                    <div className="flex items-center gap-2 p-3 bg-white border border-slate-100 rounded-xl">
                                        <Calculator className="w-4 h-4 text-slate-400" />
                                        <p className="text-sm font-semibold text-slate-700">{selectedRule.authority}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-slate-400">Operational Status</p>
                                    <Badge className={`text-[10px] font-bold border-0 ${selectedRule.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{selectedRule.status}</Badge>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
