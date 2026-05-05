"use client"

import React, { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import {
    UserCheck,
    Plus,
    MoreVertical,
    GripVertical,
    Search,
    RefreshCcw,
    Edit3,
    Trash2,
    Users,
    ShieldCheck,
    Target,
    Activity,
    Settings,
    Zap,
    CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ClientOwnershipRulesPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [showRuleDialog, setShowRuleDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [currentRuleId, setCurrentRuleId] = useState<string | null>(null)

    const [rules, setRules] = useState([
        { id: "1", name: "Enterprise Account Manager", criteria: "Tier = Enterprise", assignTo: "Senior AM Team", priority: 1, status: "ACTIVE" },
        { id: "2", name: "Regional Distribution", criteria: "Location = North America", assignTo: "NA Sales Team", priority: 2, status: "ACTIVE" },
        { id: "3", name: "Revenue-Based Assignment", criteria: "Annual Revenue > $100K", assignTo: "Key Account Managers", priority: 3, status: "ACTIVE" },
        { id: "4", name: "Industry Specialist", criteria: "Industry = Technology", assignTo: "Tech Vertical Team", priority: 4, status: "INACTIVE" },
    ])

    const [formData, setFormData] = useState({
        name: "",
        criteria: "",
        assignTo: "",
        priority: "",
        status: "ACTIVE"
    })
    const [touched, setTouched] = useState<Record<string, boolean>>({})

    const formErrors = useMemo(() => {
        const e: Record<string, string> = {}
        if (touched.name) {
            const n = formData.name.trim()
            if (!n) e.name = "Rule name is required"
            else if (n.length < 3) e.name = "Name too short (min 3 chars)"
            else if (n.length > 80) e.name = "Name too long (max 80 chars)"
            else if (!/^[A-Za-z0-9\s&()./-]+$/.test(n))
                e.name = "Only letters, numbers, spaces and & ( ) . / -"
        }
        if (touched.criteria && !formData.criteria.trim()) e.criteria = "Criteria is required"
        if (touched.criteria && formData.criteria.length > 300) e.criteria = "Criteria too long (max 300 chars)"
        if (touched.assignTo && !formData.assignTo) e.assignTo = "Select an assignee"
        if (touched.priority && formData.priority) {
            const p = parseInt(formData.priority)
            if (isNaN(p) || p < 1) e.priority = "Must be 1 or higher"
            else if (p > 999) e.priority = "Priority too high"
        }
        return e
    }, [formData, touched])

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 1000)
    }

    const toggleRuleStatus = (id: string) => {
        setRules(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : r))
        toast.success("Ownership rule status updated")
    }

    const handleOpenCreate = () => {
        setIsEditing(false)
        setFormData({ name: "", criteria: "", assignTo: "", priority: "", status: "ACTIVE" })
        setTouched({})
        setShowRuleDialog(true)
    }

    const handleOpenEdit = (rule: any) => {
        setIsEditing(true)
        setCurrentRuleId(rule.id)
        setFormData({
            name: rule.name,
            criteria: rule.criteria,
            assignTo: rule.assignTo,
            priority: rule.priority.toString(),
            status: rule.status
        })
        setTouched({})
        setShowRuleDialog(true)
    }

    const handleSaveRule = (e: React.FormEvent) => {
        e.preventDefault()
        setTouched({ name: true, criteria: true, assignTo: true, priority: true })

        const name = formData.name.trim()
        const criteria = formData.criteria.trim()
        if (!name) return toast.error("Rule name is required")
        if (name.length < 3) return toast.error("Name too short (min 3 chars)")
        if (!/^[A-Za-z0-9\s&()./-]+$/.test(name))
            return toast.error("Name contains invalid characters")
        if (!criteria) return toast.error("Criteria is required")
        if (criteria.length > 300) return toast.error("Criteria too long")
        if (!formData.assignTo) return toast.error("Please select an assignee")
        if (formData.priority) {
            const p = parseInt(formData.priority)
            if (isNaN(p) || p < 1) return toast.error("Priority must be 1 or higher")
        }

        setIsLoading(true)
        setTimeout(() => {
            if (isEditing && currentRuleId) {
                setRules(prev => prev.map(r => r.id === currentRuleId ? {
                    ...r,
                    name,
                    criteria,
                    assignTo: formData.assignTo,
                    priority: parseInt(formData.priority) || 1,
                    status: formData.status
                } : r))
                toast.success("Rule updated successfully")
            } else {
                const newRule = {
                    id: Math.random().toString(36).substr(2, 9),
                    name,
                    criteria,
                    assignTo: formData.assignTo,
                    priority: parseInt(formData.priority) || (rules.length + 1),
                    status: formData.status
                }
                setRules(prev => [...prev, newRule])
                toast.success("New rule created successfully")
            }
            setIsLoading(false)
            setShowRuleDialog(false)
        }, 600)
    }

    const handleDeleteClick = (id: string) => {
        setCurrentRuleId(id)
        setShowDeleteDialog(true)
    }

    const confirmDelete = () => {
        if (currentRuleId) {
            setRules(prev => prev.filter(r => r.id !== currentRuleId))
            toast.success("Rule deleted successfully")
            setShowDeleteDialog(false)
            setCurrentRuleId(null)
        }
    }

    const addCriteriaSuggestion = (suggestion: string) => {
        const current = formData.criteria
        const newCriteria = current ? `${current} AND ${suggestion}` : suggestion
        setFormData({ ...formData, criteria: newCriteria })
        toast.info(`Added "${suggestion}" to criteria`)
    }

    return (
        <div className="flex flex-col gap-4 p-4 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl border shadow-sm gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary/70 to-primary flex items-center justify-center text-white">
                        <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <h1 className="text-sm font-semibold text-zinc-900">Client Ownership Rules</h1>
                            <Badge className="bg-blue-50 text-blue-600 border-none text-[10px] font-medium rounded-md px-2">Auto-Assignment</Badge>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-medium">Define automated rules for client account manager assignment.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleAction("Rules validated successfully")}
                        className="h-8 border-zinc-200 text-xs font-medium px-4 rounded-lg shadow-sm bg-white hover:bg-zinc-50 transition-all"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Test All Rules
                    </Button>
                    <Button
                        onClick={handleOpenCreate}
                        className="h-8 bg-primary hover:bg-primary/90 text-white text-xs font-medium px-4 rounded-lg shadow-sm transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Define New Rule
                    </Button>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-r from-primary/70 to-primary border-none text-white rounded-xl shadow-sm">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white font-medium">Active Rules</p>
                                <p className="text-xl font-semibold text-white mt-1">{rules.filter(r => r.status === 'ACTIVE').length} Rules</p>
                                <p className="text-[10px] text-white/80 mt-1">Automated assignment</p>
                            </div>
                            <Zap className="w-4 h-4 text-white" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-sm rounded-xl">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Assigned Today</p>
                                <p className="text-xl font-semibold text-zinc-900 mt-1">24 Clients</p>
                                <p className="text-[10px] text-zinc-400 font-medium mt-1">Via automation</p>
                            </div>
                            <Users className="w-4 h-4 text-zinc-300" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-sm rounded-xl">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Unassigned</p>
                                <p className="text-xl font-semibold text-zinc-900 mt-1">8 Accounts</p>
                                <p className="text-[10px] text-zinc-400 font-medium mt-1">Pending assignment</p>
                            </div>
                            <Target className="w-4 h-4 text-zinc-300" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-sm rounded-xl">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Success Rate</p>
                                <p className="text-xl font-semibold text-zinc-900 mt-1">98.5%</p>
                                <p className="text-[10px] text-zinc-400 font-medium mt-1">Last 30 days</p>
                            </div>
                            <Activity className="w-4 h-4 text-zinc-300" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* RULES TABLE - single copy */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-80 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                        <Input
                            placeholder="Search ownership rules..."
                            className="pl-10 h-8 bg-white border-zinc-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-100"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow className="hover:bg-transparent border-b-zinc-100">
                            <TableHead className="px-4 py-3 font-medium text-[10px] text-slate-500 w-12"></TableHead>
                            <TableHead className="px-4 py-3 font-medium text-[10px] text-slate-500">Rule Name</TableHead>
                            <TableHead className="px-4 py-3 font-medium text-[10px] text-slate-500">Criteria</TableHead>
                            <TableHead className="px-4 py-3 font-medium text-[10px] text-slate-500">Assign To</TableHead>
                            <TableHead className="px-4 py-3 font-medium text-[10px] text-slate-500 text-center">Status</TableHead>
                            <TableHead className="px-4 py-3 text-right font-medium text-[10px] text-slate-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rules.map((rule, idx) => (
                            <TableRow key={rule.id} className="hover:bg-zinc-50/50 transition-colors group">
                                <TableCell className="px-4 py-3">
                                    <GripVertical className="w-4 h-4 text-zinc-300 cursor-grab active:cursor-grabbing" />
                                </TableCell>
                                <TableCell className="px-4 py-3">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-medium text-zinc-900 group-hover:text-blue-600 transition-colors">{rule.name}</span>
                                        <span className="text-[10px] text-zinc-400 font-medium">Priority #{rule.priority}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3">
                                    <code className="text-[10px] font-mono text-zinc-600 bg-zinc-50 px-2 py-1 rounded-md border border-zinc-200">{rule.criteria}</code>
                                </TableCell>
                                <TableCell className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-3.5 h-3.5 text-blue-500" />
                                        <span className="text-xs font-medium text-zinc-700">{rule.assignTo}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-center">
                                    <Switch
                                        checked={rule.status === 'ACTIVE'}
                                        onCheckedChange={() => toggleRuleStatus(rule.id)}
                                        className="scale-75 data-[state=checked]:bg-blue-600"
                                    />
                                </TableCell>
                                <TableCell className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100"
                                            onClick={() => handleOpenEdit(rule)}
                                        >
                                            <Edit3 className="w-3.5 h-3.5" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-50 rounded-lg">
                                                    <MoreVertical className="h-4 w-4 text-zinc-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-52 shadow-sm border-zinc-100 p-2 rounded-xl">
                                                <DropdownMenuItem
                                                    onClick={() => handleOpenEdit(rule)}
                                                    className="text-xs font-medium gap-2 focus:bg-blue-50 focus:text-blue-600 rounded-lg cursor-pointer"
                                                >
                                                    <Settings className="w-3.5 h-3.5" /> Configure Rule
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleAction(`Simulating assignment for ${rule.name}...`)}
                                                    className="text-xs font-medium gap-2 focus:bg-blue-50 focus:text-blue-600 rounded-lg cursor-pointer"
                                                >
                                                    <Activity className="w-3.5 h-3.5" /> Test Rule
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-xs font-medium gap-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600 rounded-lg cursor-pointer"
                                                    onClick={() => handleDeleteClick(rule.id)}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" /> Delete Rule
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

            {/* Create/Edit Ownership Rule — side sheet */}
            <SideFormSheet
                open={showRuleDialog}
                onOpenChange={(o) => {
                    setShowRuleDialog(o)
                    if (!o) setTouched({})
                }}
                title={isEditing ? "Configure Rule" : "Create Ownership Rule"}
                description={
                    isEditing
                        ? "Modify existing assignment logic and criteria."
                        : "Define new logic for automated account distribution."
                }
                icon={isEditing ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                width="lg"
                onSubmit={handleSaveRule}
                submitLabel={isEditing ? "Update Rule" : "Create Rule"}
                loading={isLoading}
            >
                <div className="space-y-4">
                    <Field
                        label="Rule Name"
                        required
                        error={formErrors.name}
                        hint="3–80 chars. Letters, numbers, spaces and & ( ) . / -"
                    >
                        <Input
                            placeholder="e.g. Enterprise North Allocation"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value.slice(0, 80) })}
                            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                            className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary"
                            maxLength={80}
                        />
                    </Field>

                    <div className="grid grid-cols-3 gap-3">
                        <Field label="Assign To" required error={formErrors.assignTo} className="col-span-2">
                            <Select value={formData.assignTo} onValueChange={(val) => {
                                setFormData({ ...formData, assignTo: val })
                                setTouched((t) => ({ ...t, assignTo: true }))
                            }}>
                                <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                                    <SelectValue placeholder="Select assignee" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Senior AM Team">Senior AM Team</SelectItem>
                                    <SelectItem value="NA Sales Team">NA Sales Team</SelectItem>
                                    <SelectItem value="Key Account Managers">Key Account Managers</SelectItem>
                                    <SelectItem value="Tech Vertical Team">Tech Vertical Team</SelectItem>
                                    <SelectItem value="Support Team">Support Team</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Priority" error={formErrors.priority} hint="Lower = higher priority">
                            <Input
                                type="number"
                                placeholder="1"
                                min={1}
                                max={999}
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value.replace(/[^0-9]/g, "") })}
                                onBlur={() => setTouched((t) => ({ ...t, priority: true }))}
                                className="h-11 rounded-lg bg-white border-[#E5E7EB] focus:border-primary font-mono"
                            />
                        </Field>
                    </div>

                    <Field
                        label="Assignment Criteria"
                        required
                        error={formErrors.criteria}
                        hint={`${formData.criteria.length}/300 — click a chip below to add`}
                    >
                        <Input
                            placeholder="e.g. Tier = Enterprise AND Revenue > 50000"
                            value={formData.criteria}
                            onChange={(e) => setFormData({ ...formData, criteria: e.target.value.slice(0, 300) })}
                            onBlur={() => setTouched((t) => ({ ...t, criteria: true }))}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary font-mono text-[12.5px]"
                        />
                        <div className="flex flex-wrap gap-2 pt-2">
                            {["Tier = ", "Region = ", "Revenue > ", "Employees > "].map((s) => (
                                <Badge
                                    key={s}
                                    variant="outline"
                                    className="text-[11px] font-medium rounded-md bg-white cursor-pointer hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-colors"
                                    onClick={() => addCriteriaSuggestion(s)}
                                >
                                    {s.trim()}
                                </Badge>
                            ))}
                        </div>
                    </Field>

                    <div className="flex items-center justify-between p-3.5 bg-[#FAFBFC] rounded-xl border border-[#EEF1F6]">
                        <div className="flex-1">
                            <p className="text-[13px] font-semibold text-zinc-900">Activate Rule Immediately</p>
                            <p className="text-[11.5px] text-zinc-500 mt-0.5 leading-relaxed">
                                New clients will be processed by this rule upon creation.
                            </p>
                        </div>
                        <Switch
                            checked={formData.status === 'ACTIVE'}
                            onCheckedChange={(c) => setFormData({ ...formData, status: c ? 'ACTIVE' : 'INACTIVE' })}
                            className="data-[state=checked]:bg-primary"
                        />
                    </div>
                </div>
            </SideFormSheet>

            {/* DELETE CONFIRMATION */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="rounded-xl p-5">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-sm font-semibold text-rose-600 flex items-center gap-2">
                            <Trash2 className="w-4 h-4" />
                            Delete Ownership Rule?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-600 font-medium text-xs">
                            This action cannot be undone. This rule will effectively stop processing new client assignments immediately. Active clients assigned by this rule will NOT be reassigned automatically.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="text-xs font-medium rounded-lg border-none bg-zinc-100 hover:bg-zinc-200 h-8">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="text-xs font-medium rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm h-8"
                        >
                            Yes, Delete Rule
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
