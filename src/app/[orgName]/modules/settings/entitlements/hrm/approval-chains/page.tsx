"use client"

import React, { useState } from "react"
import {
    GitBranch,
    Plus,
    Search,
    MoreHorizontal,
    Pencil,
    Trash2,
    ArrowRight,
    CheckCircle,
    Clock,
    Users,
    ShieldCheck,
    ChevronRight,
    AlertTriangle,
    Zap,
    ArrowUpDown,
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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

interface ApprovalStep {
    id: string
    order: number
    approverRole: string
    fallbackRole: string
    autoApproveAfterHours: number
    canSkip: boolean
}

interface ApprovalChain {
    id: string
    name: string
    module: string
    description: string
    isActive: boolean
    steps: ApprovalStep[]
    escalationEnabled: boolean
    escalationAfterHours: number
    escalationTo: string
    createdAt: string
}

const MODULES = [
    "Leave Requests",
    "Expense Claims",
    "Attendance Regularization",
    "Salary Advance",
    "Asset Requests",
    "Offer Letters",
    "Resignation",
    "Onboarding Tasks",
    "Performance Reviews",
    "Document Approvals",
    "Shift Changes",
    "Overtime Requests",
]

const APPROVER_ROLES = [
    "Reporting Manager",
    "Department Head",
    "HR Manager",
    "HR Admin",
    "HR Executive",
    "Finance Head",
    "CEO / Director",
    "Skip-level Manager",
    "Project Lead",
    "Payroll Admin",
]

const INITIAL_CHAINS: ApprovalChain[] = [
    {
        id: "chain-1",
        name: "Leave Request Approval",
        module: "Leave Requests",
        description: "Standard leave approval workflow with manager and HR review",
        isActive: true,
        steps: [
            { id: "s1", order: 1, approverRole: "Reporting Manager", fallbackRole: "Skip-level Manager", autoApproveAfterHours: 48, canSkip: false },
            { id: "s2", order: 2, approverRole: "HR Manager", fallbackRole: "HR Admin", autoApproveAfterHours: 72, canSkip: true },
        ],
        escalationEnabled: true,
        escalationAfterHours: 96,
        escalationTo: "Department Head",
        createdAt: "2026-01-15",
    },
    {
        id: "chain-2",
        name: "Expense Reimbursement",
        module: "Expense Claims",
        description: "Multi-level expense approval based on amount thresholds",
        isActive: true,
        steps: [
            { id: "s3", order: 1, approverRole: "Reporting Manager", fallbackRole: "Department Head", autoApproveAfterHours: 24, canSkip: false },
            { id: "s4", order: 2, approverRole: "Finance Head", fallbackRole: "HR Manager", autoApproveAfterHours: 48, canSkip: false },
        ],
        escalationEnabled: true,
        escalationAfterHours: 72,
        escalationTo: "CEO / Director",
        createdAt: "2026-01-20",
    },
    {
        id: "chain-3",
        name: "Attendance Regularization",
        module: "Attendance Regularization",
        description: "Regularization requests for missed or incorrect punches",
        isActive: true,
        steps: [
            { id: "s5", order: 1, approverRole: "Reporting Manager", fallbackRole: "HR Executive", autoApproveAfterHours: 24, canSkip: false },
        ],
        escalationEnabled: false,
        escalationAfterHours: 0,
        escalationTo: "",
        createdAt: "2026-02-01",
    },
    {
        id: "chain-4",
        name: "Offer Letter Approval",
        module: "Offer Letters",
        description: "Hiring approval chain for new offer letters",
        isActive: false,
        steps: [
            { id: "s6", order: 1, approverRole: "HR Manager", fallbackRole: "HR Admin", autoApproveAfterHours: 48, canSkip: false },
            { id: "s7", order: 2, approverRole: "Department Head", fallbackRole: "CEO / Director", autoApproveAfterHours: 72, canSkip: false },
            { id: "s8", order: 3, approverRole: "CEO / Director", fallbackRole: "", autoApproveAfterHours: 0, canSkip: false },
        ],
        escalationEnabled: true,
        escalationAfterHours: 120,
        escalationTo: "CEO / Director",
        createdAt: "2026-02-10",
    },
]

export default function ApprovalChainsPage() {
    const [chains, setChains] = useState<ApprovalChain[]>(INITIAL_CHAINS)
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingChain, setEditingChain] = useState<ApprovalChain | null>(null)
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

    // Create form
    const [newChain, setNewChain] = useState<{
        name: string
        module: string
        description: string
        escalationEnabled: boolean
        escalationAfterHours: number
        escalationTo: string
        steps: ApprovalStep[]
    }>({
        name: "",
        module: "",
        description: "",
        escalationEnabled: false,
        escalationAfterHours: 48,
        escalationTo: "",
        steps: [{ id: `ns-${Date.now()}`, order: 1, approverRole: "", fallbackRole: "", autoApproveAfterHours: 48, canSkip: false }],
    })

    const filtered = chains.filter(
        (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.module.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const activeCount = chains.filter((c) => c.isActive).length
    const totalSteps = chains.reduce((sum, c) => sum + c.steps.length, 0)
    const escalationCount = chains.filter((c) => c.escalationEnabled).length

    const addStep = (isEdit: boolean) => {
        const step: ApprovalStep = {
            id: `ns-${Date.now()}`,
            order: isEdit ? (editingChain?.steps.length || 0) + 1 : newChain.steps.length + 1,
            approverRole: "",
            fallbackRole: "",
            autoApproveAfterHours: 48,
            canSkip: false,
        }
        if (isEdit && editingChain) {
            setEditingChain({ ...editingChain, steps: [...editingChain.steps, step] })
        } else {
            setNewChain({ ...newChain, steps: [...newChain.steps, step] })
        }
    }

    const removeStep = (stepId: string, isEdit: boolean) => {
        if (isEdit && editingChain) {
            const steps = editingChain.steps.filter((s) => s.id !== stepId).map((s, i) => ({ ...s, order: i + 1 }))
            setEditingChain({ ...editingChain, steps })
        } else {
            const steps = newChain.steps.filter((s) => s.id !== stepId).map((s, i) => ({ ...s, order: i + 1 }))
            setNewChain({ ...newChain, steps })
        }
    }

    const updateStep = (stepId: string, field: string, value: any, isEdit: boolean) => {
        const updateFn = (steps: ApprovalStep[]) =>
            steps.map((s) => (s.id === stepId ? { ...s, [field]: value } : s))
        if (isEdit && editingChain) {
            setEditingChain({ ...editingChain, steps: updateFn(editingChain.steps) })
        } else {
            setNewChain({ ...newChain, steps: updateFn(newChain.steps) })
        }
    }

    const handleCreate = () => {
        if (!newChain.name.trim() || !newChain.module) return toast.error("Name and module are required")
        if (newChain.steps.some((s) => !s.approverRole)) return toast.error("All steps must have an approver role")

        const chain: ApprovalChain = {
            id: `chain-${Date.now()}`,
            name: newChain.name.trim(),
            module: newChain.module,
            description: newChain.description.trim(),
            isActive: true,
            steps: newChain.steps,
            escalationEnabled: newChain.escalationEnabled,
            escalationAfterHours: newChain.escalationAfterHours,
            escalationTo: newChain.escalationTo,
            createdAt: new Date().toISOString().split("T")[0],
        }
        setChains([...chains, chain])
        toast.success(`Approval chain "${chain.name}" created`)
        setIsCreateOpen(false)
        setNewChain({
            name: "", module: "", description: "", escalationEnabled: false,
            escalationAfterHours: 48, escalationTo: "",
            steps: [{ id: `ns-${Date.now()}`, order: 1, approverRole: "", fallbackRole: "", autoApproveAfterHours: 48, canSkip: false }],
        })
    }

    const handleEdit = () => {
        if (!editingChain) return
        if (!editingChain.name.trim()) return toast.error("Name is required")
        if (editingChain.steps.some((s) => !s.approverRole)) return toast.error("All steps must have an approver role")

        setChains(chains.map((c) => (c.id === editingChain.id ? editingChain : c)))
        toast.success("Approval chain updated")
        setIsEditOpen(false)
        setEditingChain(null)
    }

    const handleDelete = () => {
        if (!deleteConfirmId) return
        setChains(chains.filter((c) => c.id !== deleteConfirmId))
        toast.success("Approval chain deleted")
        setDeleteConfirmId(null)
    }

    const toggleActive = (id: string) => {
        setChains(chains.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)))
        const chain = chains.find((c) => c.id === id)
        toast.success(`${chain?.name} ${chain?.isActive ? "deactivated" : "activated"}`)
    }

    const openEdit = (chain: ApprovalChain) => {
        setEditingChain(JSON.parse(JSON.stringify(chain)))
        setIsEditOpen(true)
    }

    const renderStepForm = (steps: ApprovalStep[], isEdit: boolean) => (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-gray-700">Approval Steps</Label>
                <Button
                    type="button"
                    variant="ghost"
                    className="h-7 text-xs font-semibold text-blue-600 hover:bg-blue-50 gap-1 px-2"
                    onClick={() => addStep(isEdit)}
                >
                    <Plus className="w-3 h-3" /> Add Step
                </Button>
            </div>
            {steps.map((step, i) => (
                <div key={step.id} className="border border-gray-200 rounded-lg p-3 space-y-3 bg-gray-50/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                                {step.order}
                            </div>
                            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Step {step.order}</span>
                        </div>
                        {steps.length > 1 && (
                            <Button type="button" variant="ghost" className="h-6 w-6 p-0 hover:bg-rose-50" onClick={() => removeStep(step.id, isEdit)}>
                                <Trash2 className="w-3 h-3 text-rose-400" />
                            </Button>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-1.5">
                            <Label className="text-[10px] font-semibold text-gray-600">Approver Role</Label>
                            <Select value={step.approverRole} onValueChange={(v) => updateStep(step.id, "approverRole", v, isEdit)}>
                                <SelectTrigger className="h-8 rounded-md text-[11px]"><SelectValue placeholder="Select..." /></SelectTrigger>
                                <SelectContent>
                                    {APPROVER_ROLES.map((r) => (<SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-1.5">
                            <Label className="text-[10px] font-semibold text-gray-600">Fallback Role</Label>
                            <Select value={step.fallbackRole} onValueChange={(v) => updateStep(step.id, "fallbackRole", v, isEdit)}>
                                <SelectTrigger className="h-8 rounded-md text-[11px]"><SelectValue placeholder="Optional..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none" className="text-xs">None</SelectItem>
                                    {APPROVER_ROLES.map((r) => (<SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-1.5">
                            <Label className="text-[10px] font-semibold text-gray-600">Auto-approve after (hours)</Label>
                            <Input
                                type="number"
                                className="h-8 rounded-md text-[11px]"
                                value={step.autoApproveAfterHours}
                                onChange={(e) => updateStep(step.id, "autoApproveAfterHours", parseInt(e.target.value) || 0, isEdit)}
                                placeholder="0 = disabled"
                            />
                        </div>
                        <div className="flex items-end pb-1">
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={step.canSkip}
                                    onCheckedChange={(v) => updateStep(step.id, "canSkip", v, isEdit)}
                                    className="scale-90"
                                />
                                <Label className="text-[10px] font-semibold text-gray-600">Can be skipped</Label>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )

    return (
        <div className="font-outfit flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span>HR Governance</span>
                    <span>/</span>
                    <span className="text-gray-900 font-semibold">Approval Chains</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Approval Chains</h1>
                        <p className="text-xs text-gray-500 font-medium">
                            Configure multi-level approval workflows for HR processes.
                        </p>
                    </div>
                    <Button
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5"
                        onClick={() => setIsCreateOpen(true)}
                    >
                        <Plus className="w-4 h-4" />
                        New Chain
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SmallCard className="rounded-xl border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white/80">Total Chains</p>
                                <p className="text-xl font-semibold text-white tracking-tight">{chains.length}</p>
                                <p className="text-[10px] text-white/70">Approval workflows</p>
                            </div>
                            <GitBranch className="w-5 h-5 text-white/80" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Active</p>
                                <p className="text-xl font-semibold text-gray-900">{activeCount}</p>
                                <p className="text-[10px] text-gray-500">Currently enabled</p>
                            </div>
                            <CheckCircle className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Total Steps</p>
                                <p className="text-xl font-semibold text-gray-900">{totalSteps}</p>
                                <p className="text-[10px] text-gray-500">Across all chains</p>
                            </div>
                            <ArrowUpDown className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Escalations</p>
                                <p className="text-xl font-semibold text-gray-900">{escalationCount}</p>
                                <p className="text-[10px] text-gray-500">Escalation rules</p>
                            </div>
                            <AlertTriangle className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <Input
                        placeholder="Search chains..."
                        className="pl-9 h-9 rounded-lg text-xs font-medium bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Chains List */}
            <div className="space-y-4">
                {filtered.map((chain) => (
                    <div key={chain.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                        {/* Chain Header */}
                        <div className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                    chain.isActive ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                                }`}>
                                    <GitBranch className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-sm font-semibold text-gray-900">{chain.name}</h3>
                                        <Badge className={`text-[9px] px-1.5 py-0 rounded-full font-semibold border-none ${
                                            chain.isActive ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                                        }`}>
                                            {chain.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                        <Badge className="text-[9px] px-1.5 py-0 rounded-full font-semibold bg-blue-50 text-blue-600 border-none">
                                            {chain.module}
                                        </Badge>
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-0.5 truncate">{chain.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <Switch
                                    checked={chain.isActive}
                                    onCheckedChange={() => toggleActive(chain.id)}
                                    className="scale-90"
                                />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg">
                                            <MoreHorizontal className="h-4 w-4 text-gray-400" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 rounded-lg">
                                        <DropdownMenuItem onClick={() => openEdit(chain)}>
                                            <Pencil className="w-3.5 h-3.5 mr-2" /> Edit Chain
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-rose-600" onClick={() => setDeleteConfirmId(chain.id)}>
                                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Steps Visual */}
                        <div className="px-5 pb-5">
                            <div className="flex items-center gap-2 flex-wrap">
                                {chain.steps.map((step, i) => (
                                    <React.Fragment key={step.id}>
                                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50">
                                            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[9px] font-bold shrink-0">
                                                {step.order}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-semibold text-gray-900">{step.approverRole}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    {step.autoApproveAfterHours > 0 && (
                                                        <span className="text-[9px] text-gray-400 font-medium flex items-center gap-0.5">
                                                            <Clock className="w-2.5 h-2.5" /> {step.autoApproveAfterHours}h auto
                                                        </span>
                                                    )}
                                                    {step.canSkip && (
                                                        <span className="text-[9px] text-amber-500 font-medium">Skippable</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {i < chain.steps.length - 1 && (
                                            <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
                                        )}
                                    </React.Fragment>
                                ))}
                                {chain.escalationEnabled && (
                                    <>
                                        <ArrowRight className="w-4 h-4 text-rose-300 shrink-0" />
                                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-rose-200 bg-rose-50/50">
                                            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                                            <div>
                                                <p className="text-[10px] font-semibold text-rose-700">Escalation</p>
                                                <p className="text-[9px] text-rose-500 font-medium">
                                                    {chain.escalationTo} · after {chain.escalationAfterHours}h
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filtered.length === 0 && (
                    <div className="bg-white rounded-xl border p-12 text-center">
                        <GitBranch className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-xs font-medium text-gray-500">No approval chains found</p>
                        <p className="text-[10px] text-gray-400 mt-1">Create your first approval workflow above</p>
                    </div>
                )}
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-lg rounded-xl p-0 overflow-hidden max-h-[85vh]">
                    <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 shrink-0">
                        <DialogTitle className="text-white font-semibold text-sm">Create Approval Chain</DialogTitle>
                        <DialogDescription className="text-blue-100 text-xs">Define a multi-step approval workflow</DialogDescription>
                    </DialogHeader>
                    <div className="overflow-y-auto px-5 py-4 space-y-4">
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">Chain Name</Label>
                            <Input className="h-9 rounded-lg text-xs" value={newChain.name} onChange={(e) => setNewChain({ ...newChain, name: e.target.value })} placeholder="e.g. Leave Request Approval" />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">Module / Process</Label>
                            <Select value={newChain.module} onValueChange={(v) => setNewChain({ ...newChain, module: v })}>
                                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue placeholder="Select module..." /></SelectTrigger>
                                <SelectContent>
                                    {MODULES.map((m) => (<SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">Description</Label>
                            <Textarea className="rounded-lg text-xs min-h-[56px] resize-none" value={newChain.description} onChange={(e) => setNewChain({ ...newChain, description: e.target.value })} placeholder="Briefly describe this workflow" />
                        </div>

                        {renderStepForm(newChain.steps, false)}

                        {/* Escalation */}
                        <div className="border border-gray-200 rounded-lg p-3 space-y-3 bg-rose-50/30">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Escalation Rule
                                </Label>
                                <Switch
                                    checked={newChain.escalationEnabled}
                                    onCheckedChange={(v) => setNewChain({ ...newChain, escalationEnabled: v })}
                                    className="scale-90"
                                />
                            </div>
                            {newChain.escalationEnabled && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="grid gap-1.5">
                                        <Label className="text-[10px] font-semibold text-gray-600">Escalate after (hours)</Label>
                                        <Input type="number" className="h-8 rounded-md text-[11px]" value={newChain.escalationAfterHours} onChange={(e) => setNewChain({ ...newChain, escalationAfterHours: parseInt(e.target.value) || 0 })} />
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label className="text-[10px] font-semibold text-gray-600">Escalate to</Label>
                                        <Select value={newChain.escalationTo} onValueChange={(v) => setNewChain({ ...newChain, escalationTo: v })}>
                                            <SelectTrigger className="h-8 rounded-md text-[11px]"><SelectValue placeholder="Select..." /></SelectTrigger>
                                            <SelectContent>
                                                {APPROVER_ROLES.map((r) => (<SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="px-5 pb-4 shrink-0">
                        <Button onClick={handleCreate} className="rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-xs">Create Chain</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-lg rounded-xl p-0 overflow-hidden max-h-[85vh]">
                    <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 shrink-0">
                        <DialogTitle className="text-white font-semibold text-sm">Edit Approval Chain</DialogTitle>
                    </DialogHeader>
                    {editingChain && (
                        <>
                            <div className="overflow-y-auto px-5 py-4 space-y-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold text-gray-700">Chain Name</Label>
                                    <Input className="h-9 rounded-lg text-xs" value={editingChain.name} onChange={(e) => setEditingChain({ ...editingChain, name: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold text-gray-700">Module / Process</Label>
                                    <Select value={editingChain.module} onValueChange={(v) => setEditingChain({ ...editingChain, module: v })}>
                                        <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {MODULES.map((m) => (<SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold text-gray-700">Description</Label>
                                    <Textarea className="rounded-lg text-xs min-h-[56px] resize-none" value={editingChain.description} onChange={(e) => setEditingChain({ ...editingChain, description: e.target.value })} />
                                </div>

                                {renderStepForm(editingChain.steps, true)}

                                {/* Escalation */}
                                <div className="border border-gray-200 rounded-lg p-3 space-y-3 bg-rose-50/30">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Escalation Rule
                                        </Label>
                                        <Switch
                                            checked={editingChain.escalationEnabled}
                                            onCheckedChange={(v) => setEditingChain({ ...editingChain, escalationEnabled: v })}
                                            className="scale-90"
                                        />
                                    </div>
                                    {editingChain.escalationEnabled && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="grid gap-1.5">
                                                <Label className="text-[10px] font-semibold text-gray-600">Escalate after (hours)</Label>
                                                <Input type="number" className="h-8 rounded-md text-[11px]" value={editingChain.escalationAfterHours} onChange={(e) => setEditingChain({ ...editingChain, escalationAfterHours: parseInt(e.target.value) || 0 })} />
                                            </div>
                                            <div className="grid gap-1.5">
                                                <Label className="text-[10px] font-semibold text-gray-600">Escalate to</Label>
                                                <Select value={editingChain.escalationTo} onValueChange={(v) => setEditingChain({ ...editingChain, escalationTo: v })}>
                                                    <SelectTrigger className="h-8 rounded-md text-[11px]"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        {APPROVER_ROLES.map((r) => (<SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <DialogFooter className="px-5 pb-4 shrink-0">
                                <Button onClick={handleEdit} className="rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-xs">Save Changes</Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
                <DialogContent className="max-w-sm rounded-xl">
                    <DialogHeader>
                        <DialogTitle className="text-sm font-semibold text-gray-900">Delete Approval Chain?</DialogTitle>
                        <DialogDescription className="text-xs text-gray-500">
                            This will permanently remove this approval workflow. Pending requests using this chain may be affected.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" className="rounded-lg text-xs font-semibold" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
                        <Button className="rounded-lg bg-rose-600 hover:bg-rose-700 text-xs font-semibold" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
