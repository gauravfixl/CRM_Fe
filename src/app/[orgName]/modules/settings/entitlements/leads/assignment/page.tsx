"use client"

import React, { useState, useEffect, useMemo } from "react"
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
    Target,
    Loader2
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
import { Label } from "@/components/ui/label"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
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
import { fetchUsersApi } from "@/modules/crm/organizations/hooks/orgHooks"
import { getLeadListByOrg } from "@/hooks/leadHooks"

interface OrgUser {
    _id: string
    name: string
    email: string
    role?: string
}

interface Lead {
    _id: string
    name: string
    stage: string
    assignedTo?: { email: string; name: string }
    owner?: string
    source: string
    isDeleted: boolean
}

export default function LeadAssignmentRulesPage() {
    const params = useParams()
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [isRuleOpen, setIsRuleOpen] = useState(false)
    const [editingRule, setEditingRule] = useState<any>(null)
    const [orgUsers, setOrgUsers] = useState<OrgUser[]>([])
    const [leads, setLeads] = useState<Lead[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, leadsRes] = await Promise.all([
                    fetchUsersApi(),
                    getLeadListByOrg()
                ])
                setOrgUsers(usersRes?.users || usersRes || [])
                setLeads(leadsRes?.data?.data || [])
            } catch (error) {
                console.error("Failed to fetch assignment data:", error)
                toast.error("Failed to load assignment data")
            } finally {
                setIsFetching(false)
            }
        }
        fetchData()
    }, [])

    const assignmentStats = useMemo(() => {
        const assignedLeads = leads.filter(l => l.assignedTo?.name || l.owner)
        const unassignedLeads = leads.filter(l => !l.assignedTo?.name && !l.owner)
        const assignmentRate = leads.length > 0 ? Math.round((assignedLeads.length / leads.length) * 100) : 0
        return { assignedCount: assignedLeads.length, unassignedCount: unassignedLeads.length, assignmentRate }
    }, [leads])

    const [rules, setRules] = useState([
        { id: "1", name: "High Value Inbound (Us/Uk)", conditions: "Value > $10k, Country = US/UK", target: "Enterprise Sales Team", method: "Round Robin", priority: 1, status: "ACTIVE" },
        { id: "2", name: "Saas Industry Routing", conditions: "Industry = SaaS", target: "Tech Specialist Group", method: "Least Loaded", priority: 2, status: "ACTIVE" },
        { id: "3", name: "Website Direct Capture", conditions: "Source = Website", target: "Sarah Jain (Owner)", method: "Fixed User", priority: 3, status: "ACTIVE" },
        { id: "4", name: "Apac/Global Referral", conditions: "Region = APAC", target: "Global Hub Team", method: "Round Robin", priority: 4, status: "INACTIVE" },
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

    const saveRule = (e: React.FormEvent) => {
        e.preventDefault()
        const name = (editingRule?.name || "").trim()
        const conditions = (editingRule?.conditions || "").trim()
        const target = (editingRule?.target || "").trim()

        if (!name) {
            toast.error("Rule name is required")
            return
        }
        if (name.length < 3) {
            toast.error("Name must be at least 3 characters")
            return
        }
        if (name.length > 80) {
            toast.error("Name too long (max 80)")
            return
        }
        if (!conditions) {
            toast.error("Conditions expression is required")
            return
        }
        if (conditions.length < 3) {
            toast.error("Conditions too short")
            return
        }
        if (!target) {
            toast.error("Assignment target is required")
            return
        }
        const priority = Number(editingRule.priority)
        if (!Number.isInteger(priority) || priority < 1 || priority > 999) {
            toast.error("Priority must be a whole number between 1 and 999")
            return
        }

        setRules(prev => {
            const exists = prev.find(r => r.id === editingRule.id)
            const cleaned = { ...editingRule, name, conditions, target, priority }
            if (exists) {
                return prev.map(r => r.id === editingRule.id ? cleaned : r)
            }
            return [...prev, cleaned]
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
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-zinc-200 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg border-t border-white/20">
                        <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-semibold text-gray-900">Lead Assignment Logic</h1>
                            <Badge className="bg-zinc-100 text-zinc-500 hover:bg-zinc-100 border-none text-[9px] font-medium">Rule Engine</Badge>
                        </div>
                        <p className="text-xs text-zinc-500 font-medium">Control automated ownership distribution across teams and users.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleAction("Dry run successful: Lead assigned to Sarh J.")}
                        className="h-10 border-zinc-200 text-xs font-medium px-6 rounded-xl shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        <Play className="w-4 h-4 mr-2 text-blue-600" />
                        Test All Rules
                    </Button>
                    <Button
                        onClick={startAddRule}
                        className="h-10 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-6 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Define New Rule
                    </Button>
                </div>
            </div>

            {/* Assignment Insights */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex flex-row items-center justify-between">
                        <div>
                            <p className="text-white text-xs opacity-80">Active Logic</p>
                            <p className="text-white text-xl font-semibold">{isFetching ? "..." : `${rules.filter(r => r.status === 'ACTIVE').length} Rules`}</p>
                            <p className="text-[10px] text-white/80">Top Priority: High Value</p>
                        </div>
                        <Target className="w-4 h-4 text-white" />
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex flex-row items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Assignment Method</p>
                            <p className="text-xl font-semibold text-gray-900">Hybrid</p>
                            <p className="text-[10px] text-zinc-400 font-medium">Fixed + Round Robin</p>
                        </div>
                        <LayoutGrid className="w-4 h-4 text-blue-400" />
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex flex-row items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Automation Success</p>
                            <p className="text-xl font-semibold text-gray-900">{isFetching ? "..." : `${assignmentStats.assignmentRate}%`}</p>
                            <p className="text-[10px] text-emerald-600 font-medium">{isFetching ? "Loading..." : `${assignmentStats.assignedCount} assigned`}</p>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4 flex flex-row items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-600">Unassigned Leads</p>
                            <p className="text-xl font-semibold text-gray-900">{isFetching ? "..." : assignmentStats.unassignedCount}</p>
                            <p className="text-[10px] text-zinc-400 font-medium">Require manual review</p>
                        </div>
                        <Info className="w-4 h-4 text-amber-400" />
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Rule Engine Layout */}
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
                        <p className="text-[10px] font-medium text-zinc-400">
                            Rules are evaluated from Priority 1 downwards. First match wins.
                        </p>
                    </div>

                    <Table>
                        <TableHeader className="bg-zinc-50/50">
                            <TableRow className="hover:bg-transparent border-b-zinc-100">
                                <TableHead className="py-4 px-6 text-[11px] font-medium text-gray-500 w-12 text-center">Pri</TableHead>
                                <TableHead className="py-4 text-[11px] font-medium text-gray-500">Rule Identity</TableHead>
                                <TableHead className="py-4 text-[11px] font-medium text-gray-500">Logic/Conditions</TableHead>
                                <TableHead className="py-4 text-[11px] font-medium text-gray-500">Assignment Target</TableHead>
                                <TableHead className="py-4 text-[11px] font-medium text-gray-500">Method</TableHead>
                                <TableHead className="py-4 text-[11px] font-medium text-gray-500">Status</TableHead>
                                <TableHead className="py-4 text-right pr-6 text-[11px] font-medium text-gray-500">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rules.map((rule) => (
                                <TableRow key={rule.id} className="hover:bg-zinc-50/50 transition-colors group">
                                    <TableCell className="py-4 px-6 text-center">
                                        <div className="flex items-center justify-center">
                                            <GripVertical className="w-3.5 h-3.5 text-zinc-200 group-hover:text-blue-300 transition-colors mr-2 cursor-move" />
                                            <span className="text-xs font-semibold text-blue-600">{rule.priority}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">{rule.name}</span>
                                            <span className="text-[9px] font-medium text-zinc-300 mt-0.5">Rid: 0x{rule.id}</span>
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
                                            <span className="text-[11px] font-medium text-zinc-600">{rule.target}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <div className="flex items-center gap-2">
                                            <Settings2 className="w-3.5 h-3.5 text-blue-400" />
                                            <span className="text-[11px] font-medium text-zinc-500">{rule.method}</span>
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
                                                    <DropdownMenuLabel className="text-[10px] font-medium text-zinc-400 px-2 py-1.5">Rule Configuration</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleAction("Dry run executed successfully")} className="text-xs font-medium gap-2 focus:bg-blue-50 focus:text-blue-600 rounded-md cursor-pointer">
                                                        <Play className="w-3.5 h-3.5" />
                                                        Dry Run (Test Only)
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleAction("Rule cloned successfully")} className="text-xs font-medium gap-2 focus:bg-blue-50 focus:text-blue-600 rounded-md cursor-pointer">
                                                        <RefreshCcw className="w-3.5 h-3.5" />
                                                        Clone Rule
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-zinc-50" />
                                                    <DropdownMenuItem
                                                        className="text-xs font-medium gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600 rounded-md cursor-pointer"
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

            {/* Fallback Settings */}
            <div className="bg-white rounded-xl border border-zinc-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-8 border-b border-zinc-100 pb-6">
                    <Info className="w-5 h-5 text-amber-500" />
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">Global Fallback Strategy</h3>
                        <p className="text-[11px] text-zinc-400 font-medium">Applied when no active rules match incoming lead criteria.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex items-center justify-between p-4 bg-zinc-50/50 rounded-xl border border-zinc-100 group hover:border-blue-100 transition-all">
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-zinc-800">Default Owner</span>
                            <span className="text-[10px] text-zinc-400 font-medium mt-1">Admin (System)</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleAction("Default owner selection opened")} className="h-8 text-[10px] font-medium text-blue-600">Change</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-zinc-50/50 rounded-xl border border-zinc-100 group hover:border-blue-100 transition-all">
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-zinc-800">Alert Managers</span>
                            <span className="text-[10px] text-zinc-400 font-medium mt-1">On failure to assign</span>
                        </div>
                        <Switch
                            checked={fallbacks.alertManagers}
                            onCheckedChange={(v) => setFallbacks(p => ({ ...p, alertManagers: v }))}
                            className="data-[state=checked]:bg-blue-600"
                        />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-zinc-50/50 rounded-xl border border-zinc-100 group hover:border-blue-100 transition-all">
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-zinc-800">Auto-Decline</span>
                            <span className="text-[10px] text-zinc-400 font-medium mt-1">Out-of-territory leads</span>
                        </div>
                        <Switch
                            checked={fallbacks.autoDecline}
                            onCheckedChange={(v) => setFallbacks(p => ({ ...p, autoDecline: v }))}
                            className="data-[state=checked]:bg-blue-600"
                        />
                    </div>
                </div>
            </div>

            {/* Rule Configuration — side sheet */}
            <SideFormSheet
                open={isRuleOpen}
                onOpenChange={(o) => {
                    setIsRuleOpen(o)
                    if (!o) setEditingRule(null)
                }}
                title={editingRule && rules.some(r => r.id === editingRule.id) ? "Edit Rule" : "New Rule Definition"}
                description="Configure conditional logic to automate lead routing."
                icon={<Target className="w-5 h-5" />}
                width="md"
                onSubmit={saveRule}
                submitLabel="Save Logic"
            >
                {editingRule && (
                    <div className="space-y-4">
                        <Field
                            label="Rule Name"
                            required
                            hint="3-80 characters"
                        >
                            <Input
                                placeholder="e.g. Website Capture Round Robin"
                                value={editingRule.name || ""}
                                onChange={(e) => setEditingRule({ ...editingRule, name: e.target.value })}
                                className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary"
                                maxLength={80}
                            />
                        </Field>

                        <Field
                            label="Conditions (DSL)"
                            required
                            hint="e.g. Value > 1000 AND Region == 'EMEA'"
                        >
                            <Input
                                placeholder="Value > 1000 AND Region == 'EMEA'"
                                value={editingRule.conditions || ""}
                                onChange={(e) => setEditingRule({ ...editingRule, conditions: e.target.value })}
                                className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary font-mono text-[13px]"
                                maxLength={300}
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Assignment Target" required>
                                {orgUsers.length > 0 ? (
                                    <Select
                                        value={editingRule.target || undefined}
                                        onValueChange={(v) => setEditingRule({ ...editingRule, target: v })}
                                    >
                                        <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                                            <SelectValue placeholder="Select user or team" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {orgUsers.map((user) => (
                                                <SelectItem key={user._id} value={user.name || user.email}>
                                                    {user.name || user.email}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        placeholder="Team or User ID"
                                        value={editingRule.target || ""}
                                        onChange={(e) => setEditingRule({ ...editingRule, target: e.target.value })}
                                        className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary"
                                        maxLength={80}
                                    />
                                )}
                            </Field>
                            <Field label="Method" required>
                                <Select
                                    value={editingRule.method || "Round Robin"}
                                    onValueChange={(v) => setEditingRule({ ...editingRule, method: v })}
                                >
                                    <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                                        <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Round Robin">Round Robin</SelectItem>
                                        <SelectItem value="Least Loaded">Least Loaded</SelectItem>
                                        <SelectItem value="Fixed User">Fixed User</SelectItem>
                                        <SelectItem value="Random">Random</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </div>

                        <Field
                            label="Priority"
                            required
                            hint="Lower number = evaluated first (1-999)"
                        >
                            <Input
                                type="number"
                                min={1}
                                max={999}
                                value={editingRule.priority || 1}
                                onChange={(e) =>
                                    setEditingRule({
                                        ...editingRule,
                                        priority: e.target.value.replace(/[^0-9]/g, ""),
                                    })
                                }
                                className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary font-mono w-32"
                            />
                        </Field>

                        <div className="flex items-start gap-2 p-3 bg-[#F0F7FF] border border-[#DBEAFE] rounded-lg">
                            <Target className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <p className="text-[11.5px] text-[#475569] leading-relaxed">
                                Rules are evaluated in priority order. The first matching rule will assign the lead.
                            </p>
                        </div>
                    </div>
                )}
            </SideFormSheet>
        </div>
    )
}
