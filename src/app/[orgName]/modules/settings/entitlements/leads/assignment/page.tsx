"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    UserCheck,
    Plus,
    MoreVertical,
    Search,
    Filter,
    GripVertical,
    ArrowRight,
    Play,
    CheckCircle2,
    XCircle,
    Info,
    RefreshCcw,
    Edit3,
    Trash2,
    Lock,
    Users,
    Settings2,
    LayoutGrid,
    Target
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export default function LeadAssignmentRulesPage() {
    const params = useParams()
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isRuleOpen, setIsRuleOpen] = useState(false)
    const [editingRule, setEditingRule] = useState<any>(null)

    const [rules, setRules] = useState([
        { id: "1", name: "High Value Inbound (US/UK)", conditions: "Value > $10k, Country = US/UK", target: "Enterprise Sales Team", method: "Round Robin", priority: 1, status: "ACTIVE" },
        { id: "2", name: "SaaS Industry Routing", conditions: "Industry = SaaS", target: "Tech Specialist Group", method: "Least Loaded", priority: 2, status: "ACTIVE" },
        { id: "3", name: "Website Direct Capture", conditions: "Source = Website", target: "Sarah Jain (Owner)", method: "Fixed User", priority: 3, status: "ACTIVE" },
        { id: "4", name: "APAC/Global Referral", conditions: "Region = APAC", target: "Global Hub Team", method: "Round Robin", priority: 4, status: "INACTIVE" },
    ])

    const [fallbacks, setFallbacks] = useState({
        defaultOwner: "Admin (System)",
        alertManagers: true,
        autoDecline: false
    })

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 1200)
    }

    const toggleRuleStatus = (id: string) => {
        setRules(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : r))
        toast.success("Rule status updated")
    }

    const startAddRule = () => {
        setEditingRule({ id: Math.random().toString(36).substr(2, 9), name: "", conditions: "", target: "", method: "Round Robin", priority: rules.length + 1, status: "ACTIVE" })
        setIsRuleOpen(true)
    }

    const startEditRule = (rule: any) => {
        setEditingRule({ ...rule })
        setIsRuleOpen(true)
    }

    const saveRule = () => {
        if (!editingRule.name || !editingRule.conditions) {
            toast.error("Please fill all fields")
            return
        }
        setRules(prev => {
            const exists = prev.find(r => r.id === editingRule.id)
            if (exists) {
                return prev.map(r => r.id === editingRule.id ? editingRule : r)
            }
            return [...prev, editingRule]
        })
        setIsRuleOpen(false)
        toast.success("Rule saved successfully")
    }

    const deleteRule = (id: string) => {
        setRules(prev => prev.filter(r => r.id !== id))
        toast.success("Rule discarded")
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-zinc-200 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg border-t border-white/20">
                        <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-black text-zinc-900 tracking-tight uppercase italic">Lead Assignment Logic</h1>
                            <Badge className="bg-zinc-100 text-zinc-500 hover:bg-zinc-100 border-none text-[9px] font-bold uppercase tracking-widest">Rule Engine</Badge>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium tracking-tight">Control automated ownership distribution across teams and users.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleAction("Dry run successful: Lead assigned to Sarh J.")}
                        className="h-10 border-zinc-200 text-xs font-black uppercase tracking-widest px-6 rounded-xl shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        <Play className="w-4 h-4 mr-2 text-blue-600" />
                        Test All Rules
                    </Button>
                    <Button
                        onClick={startAddRule}
                        className="h-10 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest px-6 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Define New Rule
                    </Button>
                </div>
            </div>

            {/* ASSIGNMENT INSIGHTS - 3D STYLE */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-blue-500 to-blue-700 border-none text-white shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transform transition-all duration-300 border-t border-white/20">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Active Logic</p>
                        <Target className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-black text-white drop-shadow-md">08 Rules</p>
                        <p className="text-[10px] text-white">Top Priority: High Value</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Assignment Method</p>
                        <LayoutGrid className="w-4 h-4 text-blue-400" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">Hybrid</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Fixed + Round Robin</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Automation Success</p>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">92%</p>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">Minimal unassigned</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-tight">Unassigned Leads</p>
                        <Info className="w-4 h-4 text-amber-400" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">14</p>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Require manual review</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* RULE ENGINE LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-2">
                <div className="md:col-span-12 bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-50/20">
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            <Input
                                placeholder="Search rules..."
                                className="pl-10 h-10 bg-white border-zinc-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-blue-100 shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">
                            Rules are evaluated from Priority 1 downwards. First match wins.
                        </p>
                    </div>

                    <Table>
                        <TableHeader className="bg-zinc-50/50">
                            <TableRow className="hover:bg-transparent border-b-zinc-100">
                                <TableHead className="py-4 px-6 font-black text-[10px] text-zinc-400 uppercase tracking-widest w-12 text-center">Pri</TableHead>
                                <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Rule Identity</TableHead>
                                <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Logic/Conditions</TableHead>
                                <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Assignment Target</TableHead>
                                <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Method</TableHead>
                                <TableHead className="py-4 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Status</TableHead>
                                <TableHead className="py-4 text-right pr-6 font-black text-[10px] text-zinc-400 uppercase tracking-widest">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rules.map((rule) => (
                                <TableRow key={rule.id} className="hover:bg-zinc-50/50 transition-colors group">
                                    <TableCell className="py-4 px-6 text-center">
                                        <div className="flex items-center justify-center">
                                            <GripVertical className="w-3.5 h-3.5 text-zinc-200 group-hover:text-blue-300 transition-colors mr-2 cursor-move" />
                                            <span className="text-xs font-black text-blue-600">{rule.priority}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-zinc-900 uppercase tracking-tight italic group-hover:text-blue-600 transition-colors">{rule.name}</span>
                                            <span className="text-[9px] font-black uppercase text-zinc-300 tracking-tighter mt-0.5">RID: 0X{rule.id}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <Badge variant="outline" className="text-[10px] font-medium border-zinc-100 text-zinc-500 bg-zinc-50 px-2 py-0.5 rounded shadow-none max-w-[200px] truncate">
                                            {rule.conditions}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-3.5 h-3.5 text-zinc-300" />
                                            <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-tighter">{rule.target}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-2">
                                            <Settings2 className="w-3.5 h-3.5 text-blue-400" />
                                            <span className="text-[11px] font-bold text-zinc-500">{rule.method}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 text-center">
                                        <Switch
                                            checked={rule.status === 'ACTIVE'}
                                            onCheckedChange={() => toggleRuleStatus(rule.id)}
                                            className="data-[state=checked]:bg-emerald-500 scale-75"
                                        />
                                    </TableCell>
                                    <TableCell className="py-4 text-right pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => startEditRule(rule)}
                                                className="h-8 w-8 p-0 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-90"
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-100 rounded-lg">
                                                        <MoreVertical className="h-4 w-4 text-zinc-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 shadow-xl border-zinc-100 p-2">
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase text-zinc-400 px-2 py-1.5">Rule Configuration</DropdownMenuLabel>
                                                    <DropdownMenuItem className="text-xs font-bold gap-2 focus:bg-blue-50 focus:text-blue-600 rounded-md cursor-pointer">
                                                        <Play className="w-3.5 h-3.5" />
                                                        Dry Run (Test Only)
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-xs font-bold gap-2 focus:bg-blue-50 focus:text-blue-600 rounded-md cursor-pointer">
                                                        <RefreshCcw className="w-3.5 h-3.5" />
                                                        Clone Rule
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-zinc-50" />
                                                    <DropdownMenuItem
                                                        className="text-xs font-bold gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600 rounded-md cursor-pointer"
                                                        onClick={() => deleteRule(rule.id)}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        Discard Rule
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* FALLBACK SETTINGS - 3D GLASS STYLE */}
            <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-8 border-b border-zinc-100 pb-6">
                    <Info className="w-5 h-5 text-amber-500" />
                    <div>
                        <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest italic">Global Fallback Strategy</h3>
                        <p className="text-[11px] text-zinc-400 font-medium tracking-tight">Applied when no active rules match incoming lead criteria.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex items-center justify-between p-4 bg-zinc-50/50 rounded-xl border border-zinc-100 group hover:border-blue-100 transition-all">
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-zinc-800 uppercase italic tracking-tighter">Default Owner</span>
                            <span className="text-[10px] text-zinc-400 font-bold mt-1">Admin (System)</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest text-blue-600">Change</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-zinc-50/50 rounded-xl border border-zinc-100 group hover:border-blue-100 transition-all">
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-zinc-800 uppercase italic tracking-tighter">Alert Managers</span>
                            <span className="text-[10px] text-zinc-400 font-bold mt-1">On failure to assign</span>
                        </div>
                        <Switch
                            checked={fallbacks.alertManagers}
                            onCheckedChange={(v) => setFallbacks(p => ({ ...p, alertManagers: v }))}
                            className="data-[state=checked]:bg-blue-600"
                        />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-zinc-50/50 rounded-xl border border-zinc-100 group hover:border-blue-100 transition-all">
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-zinc-800 uppercase italic tracking-tighter">Auto-Decline</span>
                            <span className="text-[10px] text-zinc-400 font-bold mt-1">Out-of-territory leads</span>
                        </div>
                        <Switch
                            checked={fallbacks.autoDecline}
                            onCheckedChange={(v) => setFallbacks(p => ({ ...p, autoDecline: v }))}
                            className="data-[state=checked]:bg-blue-600"
                        />
                    </div>
                </div>
            </div>

            {/* RULE CONFIGURATION DIALOG */}
            <Dialog open={isRuleOpen} onOpenChange={setIsRuleOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-2xl border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase italic tracking-tight flex items-center gap-2">
                            <Target className="w-5 h-5 text-blue-600" />
                            {editingRule?.id.startsWith('0x') ? 'Edit Rule' : 'New Rule Definition'}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-medium text-zinc-400">
                            Configure conditional logic to automate lead routing.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-5 py-4">
                        <div className="grid gap-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Rule Name</Label>
                            <Input
                                placeholder="e.g. Website Capture Round Robin"
                                value={editingRule?.name}
                                onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                                className="rounded-xl bg-zinc-50 border-zinc-100 focus:ring-blue-100 h-11 text-sm font-bold"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Conditions (DSL)</Label>
                            <Input
                                placeholder="e.g. Value > 1000 AND Region == 'EMEA'"
                                value={editingRule?.conditions}
                                onChange={(e) => setEditingRule({ ...editingRule, conditions: e.target.value })}
                                className="rounded-xl bg-zinc-50 border-zinc-100 focus:ring-blue-100 h-11 text-sm font-medium"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Assignment Target</Label>
                                <Input
                                    placeholder="Team or User ID"
                                    value={editingRule?.target}
                                    onChange={(e) => setEditingRule({ ...editingRule, target: e.target.value })}
                                    className="rounded-xl bg-zinc-50 border-zinc-100 focus:ring-blue-100 h-11 text-sm font-bold"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Method</Label>
                                <Select
                                    value={editingRule?.method}
                                    onValueChange={(v) => setEditingRule({ ...editingRule, method: v })}
                                >
                                    <SelectTrigger className="h-11 rounded-xl bg-zinc-50 border-zinc-100">
                                        <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Round Robin">Round Robin</SelectItem>
                                        <SelectItem value="Least Loaded">Least Loaded</SelectItem>
                                        <SelectItem value="Fixed User">Fixed User</SelectItem>
                                        <SelectItem value="Random">Random</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsRuleOpen(false)} className="rounded-xl font-bold uppercase text-[10px]">Cancel</Button>
                        <Button onClick={saveRule} className="bg-blue-600 hover:bg-blue-700 rounded-xl px-10 font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-blue-200">
                            Save Logic
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
