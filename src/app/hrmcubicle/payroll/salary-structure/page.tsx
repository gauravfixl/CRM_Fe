"use client"

import React, { useState, useMemo, useEffect } from "react"
import {
    Layers,
    Plus,
    Edit,
    Trash2,
    Eye,
    Download,
    Search,
    CheckCircle2,
    Users,
    Settings,
    Copy,
    X,
    MoreHorizontal,
    Package,
    TrendingUp,
    ChevronDown,
    RotateCcw,
    Calculator,
    Filter,
    Info,
    CircleDollarSign,
    ArrowDown,
    ArrowUp,
    Wallet,
    ArrowLeftRight,
    GitBranch,
    UserMinus,
    History,
    Check,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"
import { Textarea } from "@/shared/components/ui/textarea"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { useToast } from "@/shared/components/ui/use-toast"
import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/components/ui/table"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shared/components/ui/tabs"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/shared/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip"
import { useSalaryStore, type SalaryTemplate, type TemplateComponent } from "@/shared/data/salary-store"
import { usePayrollStore } from "@/shared/data/payroll-store"
import { getAllEmployees } from "@/modules/hrm/hooks/hrmHooks"
import { motion, AnimatePresence } from "framer-motion"

const formatINR = (amt: number) => `₹${Math.round(amt || 0).toLocaleString("en-IN")}`

const LEVELS = ["Intern", "Junior", "Mid", "Senior", "Executive", "Custom"]

const emptyTemplateForm: Omit<SalaryTemplate, "id"> = {
    name: "",
    description: "",
    level: "Junior",
    components: [],
    ctcRange: "",
    isDefault: false,
    isActive: true,
    assignedCount: 0,
}

const emptyComponentForm: Omit<TemplateComponent, "componentId"> = {
    name: "",
    type: "Earning",
    calculationType: "Fixed",
    value: 0,
    isActive: true,
    isTaxable: true,
    isStatutory: false,
    description: "",
}

// Given a template and a gross CTC, compute the breakup
const computeBreakup = (components: TemplateComponent[], ctc: number) => {
    const activeComps = components.filter((c) => c.isActive)
    // First compute basic (foundation) — usually a % of CTC
    const basicComp = activeComps.find((c) => c.name.toLowerCase().includes("basic"))
    let basic = 0
    if (basicComp) {
        if (basicComp.calculationType === "% of CTC") basic = (ctc * basicComp.value) / 100
        else if (basicComp.calculationType === "Fixed") basic = basicComp.value * 12 // annual
    }

    const lineItems = activeComps.map((c) => {
        let annual = 0
        if (c.calculationType === "Fixed") annual = c.value * 12
        else if (c.calculationType === "% of Basic") annual = (basic * c.value) / 100
        else if (c.calculationType === "% of CTC") annual = (ctc * c.value) / 100
        return { ...c, annual, monthly: annual / 12 }
    })

    const totalEarningsAnnual = lineItems.filter((c) => c.type === "Earning").reduce((s, c) => s + c.annual, 0)
    const totalDeductionsAnnual = lineItems.filter((c) => c.type === "Deduction").reduce((s, c) => s + c.annual, 0)
    const totalEmployerAnnual = lineItems.filter((c) => c.type === "Employer Contribution").reduce((s, c) => s + c.annual, 0)
    const grossAnnual = totalEarningsAnnual
    const netAnnual = grossAnnual - totalDeductionsAnnual

    return {
        lineItems,
        basic,
        totalEarningsAnnual,
        totalDeductionsAnnual,
        totalEmployerAnnual,
        grossAnnual,
        netAnnual,
        grossMonthly: grossAnnual / 12,
        netMonthly: netAnnual / 12,
    }
}

export default function SalaryStructurePage() {
    const {
        templates,
        componentLibrary,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        duplicateTemplate,
        addLibraryComponent,
        updateLibraryComponent,
        deleteLibraryComponent,
        cloneTemplateAsVersion,
        assignTemplateToEmployees,
        unassignTemplateFromEmployees,
        computeCtcBreakdown,
    } = useSalaryStore()
    const payrollEmployees = usePayrollStore((s) => s.payrollEmployees)
    const payRuns = usePayrollStore((s) => s.payRuns)
    const applyTemplateToPayRunEmployees = usePayrollStore((s) => s.applyTemplateToPayRunEmployees)
    const { toast } = useToast()

    // ─ Backend employees (real data) ─
    type BackendEmployee = { _id: string; employeeCode?: string; firstName?: string; lastName?: string; departmentId?: { name?: string } | string; positionId?: { name?: string } | string }
    const [backendEmployees, setBackendEmployees] = useState<BackendEmployee[]>([])
    useEffect(() => {
        let cancelled = false
        ;(async () => {
            try {
                const res: any = await getAllEmployees()
                const list: BackendEmployee[] = res?.data?.employees ?? res?.data?.data?.employees ?? res?.data ?? []
                if (!cancelled) setBackendEmployees(Array.isArray(list) ? list : [])
            } catch {
                // Silently ignore — fallback to store
            }
        })()
        return () => { cancelled = true }
    }, [])

    // Unique employees by empCode — backend preferred, store as fallback
    const uniqueEmployees = useMemo(() => {
        const seen = new Set<string>()
        const out: { id: string; empCode: string; name: string; dept: string; designation: string }[] = []
        // Backend employees first (real data)
        for (const e of backendEmployees) {
            const code = e.employeeCode ?? e._id
            if (seen.has(code)) continue
            const fullName = `${e.firstName ?? ""} ${e.lastName ?? ""}`.trim() || code
            const dept = typeof e.departmentId === "object" && e.departmentId ? e.departmentId.name ?? "—" : "—"
            const designation = typeof e.positionId === "object" && e.positionId ? e.positionId.name ?? "—" : "—"
            seen.add(code)
            out.push({ id: code, empCode: code, name: fullName, dept, designation })
        }
        // Fallback: store employees
        for (const e of payrollEmployees) {
            if (seen.has(e.empCode)) continue
            seen.add(e.empCode)
            out.push({ id: e.empCode, empCode: e.empCode, name: e.name, dept: e.dept, designation: e.designation })
        }
        return out
    }, [payrollEmployees, backendEmployees])

    // ── UI state ───────────────────────────────────────────
    const [activeTab, setActiveTab] = useState("templates")
    const [searchTerm, setSearchTerm] = useState("")
    const [levelFilter, setLevelFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")

    // Template dialogs
    const [templateFormOpen, setTemplateFormOpen] = useState(false)
    const [templateDetailOpen, setTemplateDetailOpen] = useState(false)
    const [templateDeleteOpen, setTemplateDeleteOpen] = useState(false)
    const [editingTemplate, setEditingTemplate] = useState<SalaryTemplate | null>(null)
    const [viewingTemplate, setViewingTemplate] = useState<SalaryTemplate | null>(null)
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
    const [templateForm, setTemplateForm] = useState<Omit<SalaryTemplate, "id">>(emptyTemplateForm)
    const [ctcPreview, setCtcPreview] = useState<number>(1000000)

    // Component dialogs
    const [componentFormOpen, setComponentFormOpen] = useState(false)
    const [componentDeleteOpen, setComponentDeleteOpen] = useState(false)
    const [editingComponent, setEditingComponent] = useState<TemplateComponent | null>(null)
    const [componentDeleteTarget, setComponentDeleteTarget] = useState<string | null>(null)
    const [componentForm, setComponentForm] = useState<Omit<TemplateComponent, "componentId">>(emptyComponentForm)
    const [libSearchTerm, setLibSearchTerm] = useState("")
    const [libTypeFilter, setLibTypeFilter] = useState<string>("all")

    // Round 2 — advanced dialogs state
    const [ctcCalcOpen, setCtcCalcOpen] = useState(false)
    const [ctcCalcTemplateId, setCtcCalcTemplateId] = useState<string>("")
    const [ctcCalcAmount, setCtcCalcAmount] = useState<number>(1200000)

    const [compareOpen, setCompareOpen] = useState(false)
    const [compareLeftId, setCompareLeftId] = useState<string>("")
    const [compareRightId, setCompareRightId] = useState<string>("")
    const [compareCtc, setCompareCtc] = useState<number>(1200000)

    const [versionOpen, setVersionOpen] = useState(false)
    const [versionTargetId, setVersionTargetId] = useState<string | null>(null)
    const [versionChangelog, setVersionChangelog] = useState("")

    const [assignOpen, setAssignOpen] = useState(false)
    const [assignTargetId, setAssignTargetId] = useState<string | null>(null)
    const [assignSearch, setAssignSearch] = useState("")
    const [assignSelected, setAssignSelected] = useState<string[]>([])

    const [assignedViewOpen, setAssignedViewOpen] = useState(false)
    const [assignedViewTargetId, setAssignedViewTargetId] = useState<string | null>(null)

    // ── Derived data ───────────────────────────────────────
    const stats = useMemo(() => {
        const active = templates.filter((t) => t.isActive).length
        const totalAssigned = templates.reduce((s, t) => s + t.assignedCount, 0)
        const uniqueComponents = new Set(templates.flatMap((t) => t.components.map((c) => c.name))).size
        return {
            activeTemplates: active,
            totalTemplates: templates.length,
            totalAssigned,
            uniqueComponents,
            libraryCount: componentLibrary.length,
        }
    }, [templates, componentLibrary])

    const filteredTemplates = useMemo(() => {
        return templates.filter((t) => {
            if (searchTerm) {
                const q = searchTerm.toLowerCase()
                if (
                    !t.name.toLowerCase().includes(q) &&
                    !(t.level ?? "").toLowerCase().includes(q) &&
                    !(t.description ?? "").toLowerCase().includes(q)
                ) return false
            }
            if (levelFilter !== "all" && t.level !== levelFilter) return false
            if (statusFilter === "active" && !t.isActive) return false
            if (statusFilter === "inactive" && t.isActive) return false
            return true
        })
    }, [templates, searchTerm, levelFilter, statusFilter])

    const filteredLibrary = useMemo(() => {
        return componentLibrary.filter((c) => {
            if (libSearchTerm) {
                const q = libSearchTerm.toLowerCase()
                if (!c.name.toLowerCase().includes(q) && !(c.description ?? "").toLowerCase().includes(q)) return false
            }
            if (libTypeFilter !== "all" && c.type !== libTypeFilter) return false
            return true
        })
    }, [componentLibrary, libSearchTerm, libTypeFilter])

    const hasActiveFilters = levelFilter !== "all" || statusFilter !== "all"
    const clearFilters = () => { setLevelFilter("all"); setStatusFilter("all"); setSearchTerm("") }

    // ── Template handlers ──────────────────────────────────
    const openAddTemplate = () => {
        setEditingTemplate(null)
        setTemplateForm(emptyTemplateForm)
        setCtcPreview(1000000)
        setTemplateFormOpen(true)
    }

    const openEditTemplate = (t: SalaryTemplate) => {
        setEditingTemplate(t)
        setTemplateForm({
            name: t.name,
            description: t.description,
            level: t.level,
            components: [...t.components],
            ctcRange: t.ctcRange,
            isDefault: t.isDefault,
            isActive: t.isActive,
            assignedCount: t.assignedCount,
        })
        setCtcPreview(1000000)
        setTemplateFormOpen(true)
    }

    const handleSubmitTemplate = () => {
        if (!templateForm.name.trim()) {
            toast({ title: "Name required", description: "Please provide a template name.", variant: "destructive" })
            return
        }
        if (templateForm.components.length === 0) {
            toast({ title: "No components", description: "Add at least one salary component.", variant: "destructive" })
            return
        }
        if (editingTemplate) {
            updateTemplate(editingTemplate.id, templateForm)
            toast({ title: "Template updated", description: `${templateForm.name} saved.` })
        } else {
            addTemplate(templateForm)
            toast({ title: "Template created", description: `${templateForm.name} ready to assign.` })
        }
        setTemplateFormOpen(false)
        setEditingTemplate(null)
    }

    const handleConfirmDelete = () => {
        if (!deleteTargetId) return
        const t = templates.find((x) => x.id === deleteTargetId)
        if (t && t.assignedCount > 0) {
            toast({
                title: "Cannot delete",
                description: `${t.assignedCount} employees assigned. Reassign first or deactivate.`,
                variant: "destructive",
            })
            setTemplateDeleteOpen(false)
            return
        }
        deleteTemplate(deleteTargetId)
        toast({ title: "Template deleted", variant: "destructive" })
        setTemplateDeleteOpen(false)
        setDeleteTargetId(null)
    }

    const handleDuplicate = (t: SalaryTemplate) => {
        duplicateTemplate(t.id)
        toast({ title: "Template duplicated", description: `${t.name} (Copy) created.` })
    }

    const handleToggleActive = (t: SalaryTemplate) => {
        updateTemplate(t.id, { isActive: !t.isActive })
        toast({ title: t.isActive ? "Template deactivated" : "Template activated" })
    }

    // Template: add/remove component inside form
    const addComponentToTemplate = (comp: TemplateComponent) => {
        if (templateForm.components.some((c) => c.componentId === comp.componentId)) {
            toast({ title: "Already added", description: `${comp.name} is in this template.`, variant: "destructive" })
            return
        }
        setTemplateForm({ ...templateForm, components: [...templateForm.components, comp] })
    }

    const removeComponentFromTemplate = (componentId: string) => {
        setTemplateForm({
            ...templateForm,
            components: templateForm.components.filter((c) => c.componentId !== componentId),
        })
    }

    const updateComponentInTemplate = (componentId: string, updates: Partial<TemplateComponent>) => {
        setTemplateForm({
            ...templateForm,
            components: templateForm.components.map((c) => c.componentId === componentId ? { ...c, ...updates } : c),
        })
    }

    // Live CTC breakup for preview
    const ctcBreakup = useMemo(() => computeBreakup(templateForm.components, ctcPreview), [templateForm.components, ctcPreview])

    // ── Component library handlers ─────────────────────────
    const openAddComponent = () => {
        setEditingComponent(null)
        setComponentForm(emptyComponentForm)
        setComponentFormOpen(true)
    }

    const openEditComponent = (c: TemplateComponent) => {
        setEditingComponent(c)
        setComponentForm({
            name: c.name,
            type: c.type,
            calculationType: c.calculationType,
            value: c.value,
            isActive: c.isActive,
            isTaxable: c.isTaxable,
            isStatutory: c.isStatutory,
            description: c.description,
        })
        setComponentFormOpen(true)
    }

    const handleSubmitComponent = () => {
        if (!componentForm.name.trim() || componentForm.value < 0) {
            toast({ title: "Invalid component", description: "Name and a non-negative value are required.", variant: "destructive" })
            return
        }
        if (editingComponent) {
            updateLibraryComponent(editingComponent.componentId, componentForm)
            toast({ title: "Component updated", description: `${componentForm.name} saved.` })
        } else {
            addLibraryComponent(componentForm)
            toast({ title: "Component added to library" })
        }
        setComponentFormOpen(false)
        setEditingComponent(null)
    }

    const handleDeleteComponent = () => {
        if (!componentDeleteTarget) return
        const inUse = templates.some((t) => t.components.some((c) => c.componentId === componentDeleteTarget))
        if (inUse) {
            toast({
                title: "Cannot delete",
                description: "This component is used by one or more templates. Remove it from templates first.",
                variant: "destructive",
            })
            setComponentDeleteOpen(false)
            return
        }
        deleteLibraryComponent(componentDeleteTarget)
        toast({ title: "Component removed", variant: "destructive" })
        setComponentDeleteOpen(false)
        setComponentDeleteTarget(null)
    }

    // ── Round 2: advanced handlers ────────────────────────
    const openCtcCalc = (prefillId?: string) => {
        const initial = prefillId ?? ctcCalcTemplateId ?? (templates[0]?.id ?? "")
        setCtcCalcTemplateId(initial)
        setCtcCalcOpen(true)
    }

    const ctcCalcBreakdown = useMemo(() => {
        if (!ctcCalcTemplateId || !ctcCalcAmount) return []
        return computeCtcBreakdown(ctcCalcTemplateId, ctcCalcAmount)
    }, [ctcCalcTemplateId, ctcCalcAmount, computeCtcBreakdown, templates])

    const ctcCalcTotals = useMemo(() => {
        let earnAnnual = 0, earnMonthly = 0, dedAnnual = 0, dedMonthly = 0, empAnnual = 0, empMonthly = 0
        for (const r of ctcCalcBreakdown) {
            if (r.type === "Earning") { earnAnnual += r.annual; earnMonthly += r.monthly }
            else if (r.type === "Deduction") { dedAnnual += r.annual; dedMonthly += r.monthly }
            else { empAnnual += r.annual; empMonthly += r.monthly }
        }
        return {
            earnAnnual, earnMonthly, dedAnnual, dedMonthly, empAnnual, empMonthly,
            netAnnual: earnAnnual - dedAnnual,
            netMonthly: earnMonthly - dedMonthly,
        }
    }, [ctcCalcBreakdown])

    const handleExportCtcBreakdown = () => {
        if (!ctcCalcBreakdown.length) {
            toast({ title: "Nothing to export", variant: "destructive" })
            return
        }
        const tpl = templates.find((t) => t.id === ctcCalcTemplateId)
        const headers = ["Component", "Type", "Monthly", "Annual"]
        const rows = ctcCalcBreakdown.map((r) => [
            `"${r.componentName}"`,
            r.type,
            r.monthly,
            r.annual,
        ].join(","))
        const csv = [
            `"Template","${tpl?.name ?? ""}"`,
            `"CTC",${ctcCalcAmount}`,
            "",
            headers.join(","),
            ...rows,
            "",
            `"Total Earnings",,${ctcCalcTotals.earnMonthly},${ctcCalcTotals.earnAnnual}`,
            `"Total Deductions",,${ctcCalcTotals.dedMonthly},${ctcCalcTotals.dedAnnual}`,
            `"Net Take-home",,${ctcCalcTotals.netMonthly},${ctcCalcTotals.netAnnual}`,
        ].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `ctc_breakdown_${tpl?.name?.replace(/\s+/g, "_") ?? "template"}_${ctcCalcAmount}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Breakdown exported", description: `${ctcCalcBreakdown.length} rows downloaded.` })
    }

    // Compare Templates diff
    const compareLeftBreakdown = useMemo(() =>
        compareLeftId ? computeCtcBreakdown(compareLeftId, compareCtc) : []
    , [compareLeftId, compareCtc, computeCtcBreakdown, templates])
    const compareRightBreakdown = useMemo(() =>
        compareRightId ? computeCtcBreakdown(compareRightId, compareCtc) : []
    , [compareRightId, compareCtc, computeCtcBreakdown, templates])

    const compareDiff = useMemo(() => {
        const leftMap = new Map(compareLeftBreakdown.map(r => [r.componentName, r]))
        const rightMap = new Map(compareRightBreakdown.map(r => [r.componentName, r]))
        const all = Array.from(new Set([...leftMap.keys(), ...rightMap.keys()]))
        let added = 0, removed = 0, changed = 0, same = 0
        for (const name of all) {
            const l = leftMap.get(name), r = rightMap.get(name)
            if (l && !r) removed++
            else if (!l && r) added++
            else if (l && r) {
                if (l.annual !== r.annual) changed++
                else same++
            }
        }
        return { added, removed, changed, same, names: all, leftMap, rightMap }
    }, [compareLeftBreakdown, compareRightBreakdown])

    // Version handler
    const openVersionDialog = (id: string) => {
        setVersionTargetId(id)
        setVersionChangelog("")
        setVersionOpen(true)
    }

    const handleConfirmVersion = () => {
        if (!versionTargetId) return
        if (!versionChangelog.trim()) {
            toast({ title: "Changelog required", description: "Please describe what changed in this version.", variant: "destructive" })
            return
        }
        const newId = cloneTemplateAsVersion(versionTargetId, versionChangelog.trim())
        if (!newId) {
            toast({ title: "Failed to create version", variant: "destructive" })
            return
        }
        const newTpl = useSalaryStore.getState().templates.find((t) => t.id === newId)
        toast({ title: "Version created", description: newTpl ? `${newTpl.name} ready.` : "New version ready." })
        setVersionOpen(false)
        setVersionTargetId(null)
        setVersionChangelog("")
    }

    // Assignment handlers
    const openAssignDialog = (id: string) => {
        const tpl = templates.find((t) => t.id === id)
        if (!tpl) return
        setAssignTargetId(id)
        setAssignSelected([...(tpl.assignedEmployeeIds ?? [])])
        setAssignSearch("")
        setAssignOpen(true)
    }

    const toggleAssignEmployee = (empId: string) => {
        setAssignSelected((prev) => prev.includes(empId) ? prev.filter((x) => x !== empId) : [...prev, empId])
    }

    const filteredAssignEmployees = useMemo(() => {
        const q = assignSearch.trim().toLowerCase()
        if (!q) return uniqueEmployees
        return uniqueEmployees.filter((e) =>
            e.name.toLowerCase().includes(q) ||
            e.empCode.toLowerCase().includes(q) ||
            e.dept.toLowerCase().includes(q) ||
            e.designation.toLowerCase().includes(q)
        )
    }, [uniqueEmployees, assignSearch])

    const handleConfirmAssign = () => {
        if (!assignTargetId) return
        const tpl = templates.find((t) => t.id === assignTargetId)
        if (!tpl) return
        const current = new Set(tpl.assignedEmployeeIds ?? [])
        const next = new Set(assignSelected)
        const toAssign: string[] = []
        const toUnassign: string[] = []
        next.forEach((id) => { if (!current.has(id)) toAssign.push(id) })
        current.forEach((id) => { if (!next.has(id)) toUnassign.push(id) })
        let assigned = 0, removed = 0
        if (toAssign.length) assigned = assignTemplateToEmployees(assignTargetId, toAssign).assigned
        if (toUnassign.length) removed = unassignTemplateFromEmployees(assignTargetId, toUnassign).removed
        toast({
            title: "Assignments updated",
            description: `${assigned} added · ${removed} removed · ${next.size} total.`,
        })
        setAssignOpen(false)
        setAssignTargetId(null)
    }

    // Apply template to active pay run (cross-page orchestration)
    const handleApplyToPayRun = (templateId: string) => {
        const tpl = templates.find((t) => t.id === templateId)
        if (!tpl) return
        if (!tpl.assignedEmployeeIds || tpl.assignedEmployeeIds.length === 0) {
            toast({
                title: "No assigned employees",
                description: "Assign this template to employees first.",
                variant: "destructive",
            })
            return
        }
        const activeRun = payRuns.find((r) => r.status === "Draft" || r.status === "Processing")
        if (!activeRun) {
            toast({
                title: "No active pay run",
                description: "Only Draft or Processing pay runs can accept template changes.",
                variant: "destructive",
            })
            return
        }
        const { updated } = applyTemplateToPayRunEmployees(templateId, activeRun.id)
        if (updated === 0) {
            toast({
                title: "No employees updated",
                description: `None of the ${tpl.assignedEmployeeIds.length} assigned employees are in ${activeRun.month}.`,
            })
        } else {
            toast({
                title: `Template applied to ${updated}`,
                description: `"${tpl.name}" rolled into ${activeRun.month}. Basic/HRA/PF/PT recomputed from CTC.`,
            })
        }
    }

    // Assigned view handlers
    const openAssignedView = (id: string) => {
        setAssignedViewTargetId(id)
        setAssignedViewOpen(true)
    }

    const handleUnassignOne = (empId: string) => {
        if (!assignedViewTargetId) return
        const { removed } = unassignTemplateFromEmployees(assignedViewTargetId, [empId])
        if (removed) toast({ title: "Employee unassigned" })
    }

    const handleUnassignAll = () => {
        if (!assignedViewTargetId) return
        const tpl = templates.find((t) => t.id === assignedViewTargetId)
        if (!tpl) return
        const all = tpl.assignedEmployeeIds ?? []
        if (!all.length) return
        const { removed } = unassignTemplateFromEmployees(assignedViewTargetId, [...all])
        toast({ title: "All unassigned", description: `${removed} employees removed.` })
    }

    // ── Exports ────────────────────────────────────────────
    const handleExport = () => {
        if (!templates.length) {
            toast({ title: "Nothing to export", variant: "destructive" })
            return
        }
        const headers = ["Template", "Level", "Description", "CTC Range", "Components", "Assigned", "Status", "Default"]
        const rows = templates.map((t) => [
            `"${t.name}"`,
            t.level ?? "",
            `"${(t.description ?? "").replace(/"/g, "'")}"`,
            t.ctcRange,
            t.components.length,
            t.assignedCount,
            t.isActive ? "Active" : "Inactive",
            t.isDefault ? "Yes" : "No",
        ].join(","))
        const csv = [headers.join(","), ...rows].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `salary_structures_${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Exported", description: `${templates.length} templates downloaded.` })
    }

    const handleExportComponents = () => {
        if (!componentLibrary.length) {
            toast({ title: "Nothing to export", variant: "destructive" })
            return
        }
        const headers = ["Component", "Type", "Calculation", "Value", "Taxable", "Statutory", "Active", "Description"]
        const rows = componentLibrary.map((c) => [
            `"${c.name}"`,
            c.type,
            c.calculationType,
            c.value,
            c.isTaxable ? "Yes" : "No",
            c.isStatutory ? "Yes" : "No",
            c.isActive ? "Active" : "Inactive",
            `"${(c.description ?? "").replace(/"/g, "'")}"`,
        ].join(","))
        const csv = [headers.join(","), ...rows].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `salary_components_${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Exported", description: `${componentLibrary.length} components downloaded.` })
    }

    // ── Render ─────────────────────────────────────────────
    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto">
                {/* Header */}
                <div className="h-auto min-h-[72px] bg-white border-b border-slate-200 px-6 lg:px-8 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] shrink-0">
                            <Layers size={20} />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight truncate">Salary Structure</h1>
                            <p className="text-xs font-medium text-slate-500">Templates, components & CTC blueprints</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => openCtcCalc()}
                            className="h-9 rounded-lg border-[#8B5CF6]/30 bg-white font-semibold text-xs gap-2 px-3 hover:bg-[#8B5CF6]/5 text-[#8B5CF6]"
                        >
                            <Calculator size={14} /> <span className="hidden md:inline">CTC Calculator</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setCompareLeftId(templates[0]?.id ?? "")
                                setCompareRightId(templates[1]?.id ?? templates[0]?.id ?? "")
                                setCompareOpen(true)
                            }}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <ArrowLeftRight size={14} /> <span className="hidden md:inline">Compare</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={activeTab === "templates" ? handleExport : handleExportComponents}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <Download size={14} /> <span className="hidden md:inline">Export CSV</span>
                        </Button>
                        {activeTab === "templates" ? (
                            <Button onClick={openAddTemplate} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2">
                                <Plus size={14} /> <span className="hidden md:inline">New template</span>
                            </Button>
                        ) : (
                            <Button onClick={openAddComponent} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2">
                                <Plus size={14} /> <span className="hidden md:inline">New component</span>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex-1">
                    <div className="p-6 lg:p-8 space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard label="Active templates" value={`${stats.activeTemplates}/${stats.totalTemplates}`} caption="Available to assign" icon={Layers} color="#8B5CF6" />
                            <StatCard label="Employees assigned" value={String(stats.totalAssigned)} caption="Across all templates" icon={Users} color="#0EA5E9" />
                            <StatCard label="Unique components" value={String(stats.uniqueComponents)} caption="In templates" icon={Package} color="#F59E0B" />
                            <StatCard label="Component library" value={String(stats.libraryCount)} caption="Master list" icon={Settings} color="#10B981" />
                        </div>

                        {/* Tabs */}
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="bg-slate-100 p-1 rounded-xl h-11">
                                <TabsTrigger value="templates" className="rounded-lg px-5 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm">
                                    Templates
                                </TabsTrigger>
                                <TabsTrigger value="components" className="rounded-lg px-5 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm">
                                    Components master
                                </TabsTrigger>
                            </TabsList>

                            {/* ── Templates tab ─────────────────── */}
                            <TabsContent value="templates" className="mt-6 space-y-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="relative flex-1 min-w-[240px] lg:w-80 lg:flex-none">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            placeholder="Search templates..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-9 h-9 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                                        />
                                    </div>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className={cn("h-9 rounded-lg font-semibold text-xs gap-2",
                                                    hasActiveFilters ? "border-[#8B5CF6] text-[#8B5CF6] bg-[#8B5CF6]/5" : "border-slate-200 text-slate-600")}
                                            >
                                                <Filter size={14} /> Filters
                                                {hasActiveFilters && (
                                                    <Badge className="bg-[#8B5CF6] text-white border-none text-[9px] font-bold h-4 px-1.5">
                                                        {[levelFilter !== "all", statusFilter !== "all"].filter(Boolean).length}
                                                    </Badge>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent align="end" className="w-60 p-4 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-bold text-slate-900">Filters</h4>
                                                {hasActiveFilters && (
                                                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs font-semibold text-rose-500 hover:text-rose-600 px-2">
                                                        <RotateCcw size={12} className="mr-1" /> Reset
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[11px] font-semibold text-slate-600">Level</Label>
                                                <Select value={levelFilter} onValueChange={setLevelFilter}>
                                                    <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All levels</SelectItem>
                                                        {LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[11px] font-semibold text-slate-600">Status</Label>
                                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                                    <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All</SelectItem>
                                                        <SelectItem value="active">Active only</SelectItem>
                                                        <SelectItem value="inactive">Inactive only</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {filteredTemplates.length === 0 ? (
                                    <Card className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                                        <p className="text-sm font-medium text-slate-400">
                                            {templates.length === 0 ? "No templates yet. Create your first one." : "No templates match the current filters."}
                                        </p>
                                    </Card>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {filteredTemplates.map((t) => {
                                            const earningsCount = t.components.filter((c) => c.type === "Earning").length
                                            const deductionsCount = t.components.filter((c) => c.type === "Deduction").length
                                            return (
                                                <Card
                                                    key={t.id}
                                                    className={cn("rounded-2xl border shadow-sm hover:shadow-md transition-all",
                                                        t.isActive ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50/60 opacity-80")}
                                                >
                                                    <CardContent className="p-5">
                                                        <div className="flex items-start justify-between gap-3 mb-3">
                                                            <div className="flex items-start gap-3 min-w-0">
                                                                <div className="h-11 w-11 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] shrink-0">
                                                                    <Layers size={20} />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <h3 className="text-base font-bold text-slate-900 truncate">{t.name}</h3>
                                                                        {(t.version ?? 1) > 1 && (
                                                                            <Badge className="bg-amber-50 text-amber-600 border border-amber-200 text-[9px] font-bold px-2 gap-1">
                                                                                <History size={9} /> v{t.version}
                                                                            </Badge>
                                                                        )}
                                                                        {t.isDefault && (
                                                                            <Badge className="bg-[#8B5CF6] text-white border-none text-[9px] font-bold px-2">Default</Badge>
                                                                        )}
                                                                        <Badge className={cn("border-none text-[9px] font-semibold px-2",
                                                                            t.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500")}>
                                                                            {t.isActive ? "Active" : "Inactive"}
                                                                        </Badge>
                                                                    </div>
                                                                    {t.parentTemplateId && (() => {
                                                                        const parent = templates.find((p) => p.id === t.parentTemplateId)
                                                                        return parent ? (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => { setViewingTemplate(parent); setTemplateDetailOpen(true) }}
                                                                                className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-[#8B5CF6] hover:underline"
                                                                            >
                                                                                <GitBranch size={10} /> Parent: {parent.name}
                                                                            </button>
                                                                        ) : null
                                                                    })()}
                                                                    {t.description && (
                                                                        <p className="text-[11px] font-medium text-slate-500 mt-1 line-clamp-2">{t.description}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-slate-700">
                                                                        <MoreHorizontal size={15} />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-52">
                                                                    <DropdownMenuItem onClick={() => { setViewingTemplate(t); setTemplateDetailOpen(true) }} className="cursor-pointer text-xs font-medium">
                                                                        <Eye size={13} className="mr-2" /> View breakup
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => openEditTemplate(t)} className="cursor-pointer text-xs font-medium">
                                                                        <Edit size={13} className="mr-2" /> Edit
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleDuplicate(t)} className="cursor-pointer text-xs font-medium">
                                                                        <Copy size={13} className="mr-2" /> Duplicate
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => openCtcCalc(t.id)} className="cursor-pointer text-xs font-medium">
                                                                        <Calculator size={13} className="mr-2" /> CTC preview
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem onClick={() => openVersionDialog(t.id)} className="cursor-pointer text-xs font-medium">
                                                                        <GitBranch size={13} className="mr-2" /> Create new version
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => openAssignDialog(t.id)} className="cursor-pointer text-xs font-medium">
                                                                        <Users size={13} className="mr-2" /> Assign to employees
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => openAssignedView(t.id)} className="cursor-pointer text-xs font-medium">
                                                                        <UserMinus size={13} className="mr-2" /> View assignments
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleApplyToPayRun(t.id)} className="cursor-pointer text-xs font-medium text-emerald-600 focus:text-emerald-600">
                                                                        <Check size={13} className="mr-2" /> Apply to active pay run
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem onClick={() => handleToggleActive(t)} className="cursor-pointer text-xs font-medium">
                                                                        {t.isActive ? "Deactivate" : "Activate"}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => { setDeleteTargetId(t.id); setTemplateDeleteOpen(true) }}
                                                                        className="cursor-pointer text-xs font-medium text-rose-600 focus:text-rose-600"
                                                                    >
                                                                        <Trash2 size={13} className="mr-2" /> Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>

                                                        <div className="grid grid-cols-4 gap-2 mb-3">
                                                            <TemplateStatBox label="Level" value={t.level ?? "—"} />
                                                            <TemplateStatBox label="CTC" value={t.ctcRange || "—"} small />
                                                            <TemplateStatBox label="Earnings" value={String(earningsCount)} color="text-emerald-600" />
                                                            <TemplateStatBox label="Deductions" value={String(deductionsCount)} color="text-rose-600" />
                                                        </div>

                                                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                                            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                                                                <Users size={12} />
                                                                <span className="font-bold text-slate-700">{t.assignedCount}</span> employees assigned
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => { setViewingTemplate(t); setTemplateDetailOpen(true) }}
                                                                className="h-7 text-[11px] font-semibold text-[#8B5CF6] hover:text-[#7c4dff] hover:bg-[#8B5CF6]/5 px-2"
                                                            >
                                                                View breakup
                                                            </Button>
                                                        </div>

                                                        <div className="mt-3 flex flex-wrap gap-1">
                                                            {t.components.slice(0, 4).map((c) => (
                                                                <Badge
                                                                    key={c.componentId}
                                                                    className={cn("border-none text-[9px] font-semibold px-1.5",
                                                                        c.type === "Earning" ? "bg-emerald-50 text-emerald-600" :
                                                                            c.type === "Deduction" ? "bg-rose-50 text-rose-600" :
                                                                                "bg-blue-50 text-blue-600")}
                                                                >
                                                                    {c.name}
                                                                </Badge>
                                                            ))}
                                                            {t.components.length > 4 && (
                                                                <Badge className="bg-slate-100 text-slate-500 border-none text-[9px] font-semibold px-1.5">
                                                                    +{t.components.length - 4} more
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                )}
                            </TabsContent>

                            {/* ── Components tab ─────────────────── */}
                            <TabsContent value="components" className="mt-6 space-y-4">
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                    <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 space-y-0">
                                        <div>
                                            <CardTitle className="text-base font-bold text-slate-900">Component library</CardTitle>
                                            <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                                {filteredLibrary.length} of {componentLibrary.length} components. Reusable across all templates.
                                            </CardDescription>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="relative flex-1 min-w-[200px] lg:w-60 lg:flex-none">
                                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <Input
                                                    placeholder="Search components..."
                                                    value={libSearchTerm}
                                                    onChange={(e) => setLibSearchTerm(e.target.value)}
                                                    className="pl-9 h-9 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                                                />
                                            </div>
                                            <Select value={libTypeFilter} onValueChange={setLibTypeFilter}>
                                                <SelectTrigger className="h-9 w-44 rounded-lg border-slate-200 bg-white text-xs font-semibold">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All types</SelectItem>
                                                    <SelectItem value="Earning">Earnings</SelectItem>
                                                    <SelectItem value="Deduction">Deductions</SelectItem>
                                                    <SelectItem value="Employer Contribution">Employer Contrib.</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader className="bg-slate-50/70">
                                                    <TableRow className="border-slate-100 hover:bg-transparent">
                                                        <TableHead className="pl-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Component</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Type</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Calculation</TableHead>
                                                        <TableHead className="text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Default value</TableHead>
                                                        <TableHead className="text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Taxable</TableHead>
                                                        <TableHead className="text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Statutory</TableHead>
                                                        <TableHead className="text-right pr-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredLibrary.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={7} className="text-center py-12 text-slate-400 text-sm font-medium">
                                                                {componentLibrary.length === 0 ? "Component library is empty. Add your first component." : "No matches."}
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        filteredLibrary.map((c) => {
                                                            const usedIn = templates.filter((t) => t.components.some((x) => x.componentId === c.componentId)).length
                                                            return (
                                                                <TableRow key={c.componentId} className="group border-slate-50 hover:bg-slate-50/70">
                                                                    <TableCell className="pl-6 py-3">
                                                                        <div>
                                                                            <div className="text-sm font-semibold text-slate-900">{c.name}</div>
                                                                            {c.description && <div className="text-[11px] font-medium text-slate-500 mt-0.5 line-clamp-1">{c.description}</div>}
                                                                            {usedIn > 0 && <div className="text-[10px] font-medium text-[#8B5CF6] mt-0.5">Used in {usedIn} template{usedIn > 1 ? "s" : ""}</div>}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="py-3">
                                                                        <Badge className={cn("border-none text-[10px] font-semibold px-2",
                                                                            c.type === "Earning" ? "bg-emerald-50 text-emerald-600" :
                                                                                c.type === "Deduction" ? "bg-rose-50 text-rose-600" :
                                                                                    "bg-blue-50 text-blue-600")}>
                                                                            {c.type}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="py-3 text-xs font-medium text-slate-600">{c.calculationType}</TableCell>
                                                                    <TableCell className="py-3 text-right text-sm font-bold text-slate-900 tabular-nums">
                                                                        {c.calculationType === "Fixed" ? formatINR(c.value) : `${c.value}%`}
                                                                    </TableCell>
                                                                    <TableCell className="py-3 text-center">
                                                                        {c.isTaxable ? <CheckCircle2 size={14} className="text-amber-500 mx-auto" /> : <span className="text-slate-300 text-xs">—</span>}
                                                                    </TableCell>
                                                                    <TableCell className="py-3 text-center">
                                                                        {c.isStatutory ? <CheckCircle2 size={14} className="text-blue-500 mx-auto" /> : <span className="text-slate-300 text-xs">—</span>}
                                                                    </TableCell>
                                                                    <TableCell className="text-right pr-6 py-3">
                                                                        <div className="flex justify-end gap-1">
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Button variant="ghost" size="sm" onClick={() => openEditComponent(c)} className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-[#8B5CF6] hover:bg-slate-100">
                                                                                        <Edit size={13} />
                                                                                    </Button>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>Edit</TooltipContent>
                                                                            </Tooltip>
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Button
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        onClick={() => { setComponentDeleteTarget(c.componentId); setComponentDeleteOpen(true) }}
                                                                                        className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                                                                                    >
                                                                                        <Trash2 size={13} />
                                                                                    </Button>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>Delete</TooltipContent>
                                                                            </Tooltip>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        })
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {/* ── Template add/edit Sheet ───────────── */}
                <Sheet open={templateFormOpen} onOpenChange={setTemplateFormOpen}>
                    <SheetContent className="sm:max-w-4xl p-0 font-sans">
                        <div className="h-full flex flex-col bg-white">
                            <SheetHeader className="bg-slate-950 p-6 text-white space-y-1">
                                <Badge className="bg-[#8B5CF6] text-white border-none font-semibold text-[10px] px-2 py-0.5 w-fit mb-2">
                                    {editingTemplate ? "Edit mode" : "New template"}
                                </Badge>
                                <SheetTitle className="text-xl font-bold text-white tracking-tight">
                                    {editingTemplate ? `Edit: ${editingTemplate.name}` : "Build a new salary template"}
                                </SheetTitle>
                                <SheetDescription className="text-slate-400 font-medium text-[11px]">
                                    Define identity, pick components from library, and preview the CTC breakup.
                                </SheetDescription>
                            </SheetHeader>
                            <ScrollArea className="flex-1">
                                <div className="p-6 space-y-6">
                                    {/* Identity */}
                                    <section className="space-y-3">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Identity</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <FormField label="Template name" required>
                                                <Input value={templateForm.name} onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })} className="h-10 text-sm font-medium" placeholder="e.g. Standard - Mid Level" />
                                            </FormField>
                                            <FormField label="Level">
                                                <Select value={templateForm.level} onValueChange={(v) => setTemplateForm({ ...templateForm, level: v })}>
                                                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        {LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </FormField>
                                            <FormField label="CTC range">
                                                <Input value={templateForm.ctcRange} onChange={(e) => setTemplateForm({ ...templateForm, ctcRange: e.target.value })} className="h-10 text-sm font-medium" placeholder="e.g. 12L - 25L" />
                                            </FormField>
                                            <FormField label="Assigned count (manual)">
                                                <Input type="number" value={templateForm.assignedCount} onChange={(e) => setTemplateForm({ ...templateForm, assignedCount: parseInt(e.target.value) || 0 })} className="h-10 text-sm font-semibold tabular-nums" />
                                            </FormField>
                                        </div>
                                        <FormField label="Description">
                                            <Textarea value={templateForm.description ?? ""} onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })} placeholder="Who should get this template?" className="min-h-[60px] text-xs font-medium" />
                                        </FormField>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                <div>
                                                    <Label className="text-xs font-bold text-slate-700">Active</Label>
                                                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">Available for assignment</p>
                                                </div>
                                                <Switch checked={templateForm.isActive} onCheckedChange={(v) => setTemplateForm({ ...templateForm, isActive: v })} className="data-[state=checked]:bg-[#8B5CF6]" />
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                <div>
                                                    <Label className="text-xs font-bold text-slate-700">Default template</Label>
                                                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">Used for new hires</p>
                                                </div>
                                                <Switch checked={templateForm.isDefault} onCheckedChange={(v) => setTemplateForm({ ...templateForm, isDefault: v })} className="data-[state=checked]:bg-[#8B5CF6]" />
                                            </div>
                                        </div>
                                    </section>

                                    {/* Components */}
                                    <section className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Components ({templateForm.components.length})</h4>
                                            <ComponentPickerPopover
                                                library={componentLibrary}
                                                excludeIds={templateForm.components.map((c) => c.componentId)}
                                                onPick={addComponentToTemplate}
                                            />
                                        </div>
                                        {templateForm.components.length === 0 ? (
                                            <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center">
                                                <Package size={28} className="text-slate-300 mx-auto mb-2" />
                                                <p className="text-xs font-medium text-slate-500">Click "Add component" to pick from your library.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {templateForm.components.map((c) => (
                                                    <div key={c.componentId} className="p-3 bg-white border border-slate-200 rounded-xl">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <Badge className={cn("border-none text-[10px] font-semibold shrink-0",
                                                                c.type === "Earning" ? "bg-emerald-50 text-emerald-600" :
                                                                    c.type === "Deduction" ? "bg-rose-50 text-rose-600" :
                                                                        "bg-blue-50 text-blue-600")}>
                                                                {c.type}
                                                            </Badge>
                                                            <span className="text-sm font-semibold text-slate-800 flex-1 truncate">{c.name}</span>
                                                            <Switch
                                                                checked={c.isActive}
                                                                onCheckedChange={(v) => updateComponentInTemplate(c.componentId, { isActive: v })}
                                                                className="data-[state=checked]:bg-[#8B5CF6]"
                                                            />
                                                            <Button variant="ghost" size="sm" onClick={() => removeComponentFromTemplate(c.componentId)} className="h-8 w-8 p-0 text-slate-400 hover:text-rose-500">
                                                                <X size={14} />
                                                            </Button>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <FormField label="Calculation">
                                                                <Select value={c.calculationType} onValueChange={(v) => updateComponentInTemplate(c.componentId, { calculationType: v as TemplateComponent["calculationType"] })}>
                                                                    <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="Fixed">Fixed amount (monthly)</SelectItem>
                                                                        <SelectItem value="% of Basic">% of Basic</SelectItem>
                                                                        <SelectItem value="% of CTC">% of CTC</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormField>
                                                            <FormField label={c.calculationType === "Fixed" ? "Amount (₹/month)" : "Value (%)"}>
                                                                <Input
                                                                    type="number"
                                                                    value={c.value}
                                                                    onChange={(e) => updateComponentInTemplate(c.componentId, { value: parseFloat(e.target.value) || 0 })}
                                                                    className="h-9 text-xs font-semibold tabular-nums"
                                                                />
                                                            </FormField>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </section>

                                    {/* CTC Preview */}
                                    <section className="p-4 rounded-xl bg-gradient-to-br from-[#8B5CF6]/5 to-[#EC4899]/5 border border-[#8B5CF6]/10 space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Calculator size={16} className="text-[#8B5CF6]" />
                                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Live CTC preview</h4>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-semibold text-slate-600">Sample annual CTC (₹)</Label>
                                            <Input
                                                type="number"
                                                value={ctcPreview}
                                                onChange={(e) => setCtcPreview(parseFloat(e.target.value) || 0)}
                                                className="h-10 text-sm font-bold tabular-nums"
                                            />
                                        </div>
                                        {templateForm.components.length > 0 ? (
                                            <>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <PreviewStat label="Gross (annual)" value={formatINR(ctcBreakup.grossAnnual)} color="text-emerald-600" />
                                                    <PreviewStat label="Deductions" value={formatINR(ctcBreakup.totalDeductionsAnnual)} color="text-rose-600" />
                                                    <PreviewStat label="Net take-home (annual)" value={formatINR(ctcBreakup.netAnnual)} color="text-slate-900" />
                                                    <PreviewStat label="Net monthly" value={formatINR(ctcBreakup.netMonthly)} color="text-[#8B5CF6]" />
                                                </div>
                                                <div className="pt-3 border-t border-slate-200/50">
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Breakdown (monthly)</div>
                                                    <div className="space-y-1 max-h-48 overflow-y-auto">
                                                        {ctcBreakup.lineItems.map((li) => (
                                                            <div key={li.componentId} className="flex justify-between items-center text-xs">
                                                                <span className="font-medium text-slate-700 truncate">{li.name}</span>
                                                                <span className={cn("font-bold tabular-nums ml-2",
                                                                    li.type === "Earning" ? "text-slate-800" :
                                                                        li.type === "Deduction" ? "text-rose-600" :
                                                                            "text-blue-600")}>
                                                                    {li.type === "Deduction" ? "−" : ""}{formatINR(li.monthly)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-[11px] font-medium text-slate-500 italic text-center py-3">Add components to see the breakup.</p>
                                        )}
                                    </section>
                                </div>
                            </ScrollArea>
                            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex gap-2">
                                <Button variant="ghost" onClick={() => setTemplateFormOpen(false)} className="flex-1 h-10 text-slate-500 font-semibold text-xs">
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmitTemplate} className="flex-[2] h-10 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg font-bold text-xs border-none">
                                    {editingTemplate ? "Save changes" : "Create template"}
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* ── Template Detail Dialog ───────────── */}
                <Dialog open={templateDetailOpen} onOpenChange={setTemplateDetailOpen}>
                    <DialogContent className="max-w-2xl bg-white rounded-2xl p-0 font-sans max-h-[90vh] overflow-hidden flex flex-col">
                        {viewingTemplate && (
                            <>
                                <DialogHeader className="p-6 border-b border-slate-100 space-y-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6]">
                                            <Layers size={20} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={cn("border-none text-[10px] font-semibold px-2", viewingTemplate.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500")}>
                                                {viewingTemplate.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                            {viewingTemplate.isDefault && <Badge className="bg-[#8B5CF6] text-white border-none text-[10px] font-semibold px-2">Default</Badge>}
                                        </div>
                                    </div>
                                    <DialogTitle className="text-lg font-bold text-slate-900">{viewingTemplate.name}</DialogTitle>
                                    <DialogDescription className="text-xs font-medium text-slate-500">
                                        {viewingTemplate.description ?? "No description"} • {viewingTemplate.level} • CTC {viewingTemplate.ctcRange}
                                    </DialogDescription>
                                </DialogHeader>
                                <ScrollArea className="flex-1 p-6">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-3 gap-3">
                                            <TemplateStatBox label="Components" value={String(viewingTemplate.components.length)} />
                                            <TemplateStatBox label="Assigned" value={String(viewingTemplate.assignedCount)} color="text-[#8B5CF6]" />
                                            <TemplateStatBox label="Earnings" value={String(viewingTemplate.components.filter((c) => c.type === "Earning").length)} color="text-emerald-600" />
                                        </div>

                                        {/* Compute preview at default CTC (midpoint of range OR 10L) */}
                                        <CtcPreviewPanel components={viewingTemplate.components} />
                                    </div>
                                </ScrollArea>
                                <DialogFooter className="p-4 border-t border-slate-100 bg-slate-50/50">
                                    <Button variant="ghost" onClick={() => setTemplateDetailOpen(false)} className="h-10 font-semibold text-xs">
                                        Close
                                    </Button>
                                    <Button
                                        onClick={() => { setTemplateDetailOpen(false); openEditTemplate(viewingTemplate) }}
                                        className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none"
                                    >
                                        <Edit size={13} className="mr-1.5" /> Edit template
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                {/* ── Template delete confirm ───────────── */}
                <Dialog open={templateDeleteOpen} onOpenChange={setTemplateDeleteOpen}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Trash2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Delete template?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                This will remove the template permanently. Templates with assigned employees cannot be deleted.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setTemplateDeleteOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleConfirmDelete} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Component add/edit dialog ─────────── */}
                <Dialog open={componentFormOpen} onOpenChange={setComponentFormOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                {editingComponent ? <Edit size={20} /> : <Plus size={20} />}
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                {editingComponent ? "Edit component" : "New component"}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Components are reusable pieces — add once, use in multiple templates.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <FormField label="Name" required>
                                <Input value={componentForm.name} onChange={(e) => setComponentForm({ ...componentForm, name: e.target.value })} className="h-10 text-sm font-medium" placeholder="e.g. Internet Allowance" />
                            </FormField>
                            <FormField label="Description">
                                <Textarea value={componentForm.description ?? ""} onChange={(e) => setComponentForm({ ...componentForm, description: e.target.value })} className="min-h-[60px] text-xs font-medium" placeholder="What does this cover?" />
                            </FormField>
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Type" required>
                                    <Select value={componentForm.type} onValueChange={(v) => setComponentForm({ ...componentForm, type: v as TemplateComponent["type"] })}>
                                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Earning">Earning</SelectItem>
                                            <SelectItem value="Deduction">Deduction</SelectItem>
                                            <SelectItem value="Employer Contribution">Employer Contribution</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="Calculation">
                                    <Select value={componentForm.calculationType} onValueChange={(v) => setComponentForm({ ...componentForm, calculationType: v as TemplateComponent["calculationType"] })}>
                                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Fixed">Fixed (monthly)</SelectItem>
                                            <SelectItem value="% of Basic">% of Basic</SelectItem>
                                            <SelectItem value="% of CTC">% of CTC</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>
                            </div>
                            <FormField label={componentForm.calculationType === "Fixed" ? "Default amount (₹/month)" : "Default value (%)"}>
                                <Input type="number" value={componentForm.value} onChange={(e) => setComponentForm({ ...componentForm, value: parseFloat(e.target.value) || 0 })} className="h-10 text-sm font-semibold tabular-nums" />
                            </FormField>
                            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                <div>
                                    <Label className="text-xs font-bold text-slate-700">Taxable</Label>
                                    <p className="text-[10px] font-medium text-slate-500 mt-0.5">Adds to taxable income</p>
                                </div>
                                <Switch checked={componentForm.isTaxable ?? false} onCheckedChange={(v) => setComponentForm({ ...componentForm, isTaxable: v })} className="data-[state=checked]:bg-[#8B5CF6]" />
                            </div>
                            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                <div>
                                    <Label className="text-xs font-bold text-slate-700">Statutory</Label>
                                    <p className="text-[10px] font-medium text-slate-500 mt-0.5">Required by law (PF, ESI, PT)</p>
                                </div>
                                <Switch checked={componentForm.isStatutory ?? false} onCheckedChange={(v) => setComponentForm({ ...componentForm, isStatutory: v })} className="data-[state=checked]:bg-[#8B5CF6]" />
                            </div>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setComponentFormOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleSubmitComponent} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                {editingComponent ? "Save" : "Add to library"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── CTC Calculator dialog ─────────── */}
                <Dialog open={ctcCalcOpen} onOpenChange={setCtcCalcOpen}>
                    <DialogContent className="max-w-3xl bg-white rounded-2xl p-0 font-sans max-h-[90vh] overflow-hidden flex flex-col">
                        <DialogHeader className="p-6 border-b border-slate-100 space-y-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6]">
                                    <Calculator size={20} />
                                </div>
                                <div>
                                    <DialogTitle className="text-lg font-bold text-slate-900">CTC Calculator</DialogTitle>
                                    <DialogDescription className="text-xs font-medium text-slate-500">
                                        Pick a template, set an annual CTC, see the full breakdown.
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField label="Template" required>
                                        <Select value={ctcCalcTemplateId} onValueChange={setCtcCalcTemplateId}>
                                            <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Select a template" /></SelectTrigger>
                                            <SelectContent>
                                                {templates.map((t) => (
                                                    <SelectItem key={t.id} value={t.id}>
                                                        {t.name}{(t.version ?? 1) > 1 ? ` (v${t.version})` : ""}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                    <FormField label="Annual CTC (₹)">
                                        <Input
                                            type="number"
                                            value={ctcCalcAmount}
                                            onChange={(e) => setCtcCalcAmount(parseFloat(e.target.value) || 0)}
                                            className="h-10 text-sm font-bold tabular-nums"
                                        />
                                    </FormField>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {[400000, 800000, 1200000, 2000000, 3000000].map((v) => (
                                        <Button
                                            key={v}
                                            type="button"
                                            variant="outline"
                                            onClick={() => setCtcCalcAmount(v)}
                                            className={cn(
                                                "h-8 rounded-lg text-xs font-semibold px-3",
                                                ctcCalcAmount === v
                                                    ? "border-[#8B5CF6] text-[#8B5CF6] bg-[#8B5CF6]/5"
                                                    : "border-slate-200 text-slate-600"
                                            )}
                                        >
                                            {v / 100000}L
                                        </Button>
                                    ))}
                                </div>

                                {ctcCalcBreakdown.length === 0 ? (
                                    <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center">
                                        <Calculator size={28} className="text-slate-300 mx-auto mb-2" />
                                        <p className="text-xs font-medium text-slate-500">
                                            {ctcCalcTemplateId ? "No active components in this template." : "Pick a template to see the breakdown."}
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="rounded-xl border border-slate-200 overflow-hidden">
                                            <Table>
                                                <TableHeader className="bg-slate-50">
                                                    <TableRow className="hover:bg-transparent">
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase">Component</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase">Type</TableHead>
                                                        <TableHead className="text-right text-[11px] font-bold text-slate-500 uppercase">Monthly ₹</TableHead>
                                                        <TableHead className="text-right text-[11px] font-bold text-slate-500 uppercase">Annual ₹</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {ctcCalcBreakdown.map((r, i) => (
                                                        <TableRow key={`${r.componentName}-${i}`} className="border-slate-100">
                                                            <TableCell className="py-2 text-xs font-semibold text-slate-800">{r.componentName}</TableCell>
                                                            <TableCell className="py-2">
                                                                <Badge className={cn("border-none text-[10px] font-semibold px-2",
                                                                    r.type === "Earning" ? "bg-emerald-50 text-emerald-600" :
                                                                        r.type === "Deduction" ? "bg-rose-50 text-rose-600" :
                                                                            "bg-blue-50 text-blue-600")}>
                                                                    {r.type}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="py-2 text-right text-xs font-semibold tabular-nums">{formatINR(r.monthly)}</TableCell>
                                                            <TableCell className="py-2 text-right text-xs font-bold tabular-nums">{formatINR(r.annual)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                    <TableRow className="bg-emerald-50/40 border-slate-200">
                                                        <TableCell colSpan={2} className="py-2 text-xs font-bold text-emerald-700">Total Earnings</TableCell>
                                                        <TableCell className="py-2 text-right text-xs font-bold tabular-nums text-emerald-700">{formatINR(ctcCalcTotals.earnMonthly)}</TableCell>
                                                        <TableCell className="py-2 text-right text-xs font-bold tabular-nums text-emerald-700">{formatINR(ctcCalcTotals.earnAnnual)}</TableCell>
                                                    </TableRow>
                                                    <TableRow className="bg-rose-50/40 border-slate-200">
                                                        <TableCell colSpan={2} className="py-2 text-xs font-bold text-rose-700">Total Deductions</TableCell>
                                                        <TableCell className="py-2 text-right text-xs font-bold tabular-nums text-rose-700">{formatINR(ctcCalcTotals.dedMonthly)}</TableCell>
                                                        <TableCell className="py-2 text-right text-xs font-bold tabular-nums text-rose-700">{formatINR(ctcCalcTotals.dedAnnual)}</TableCell>
                                                    </TableRow>
                                                    <TableRow className="bg-[#8B5CF6]/10 border-slate-200">
                                                        <TableCell colSpan={2} className="py-2 text-xs font-bold text-[#8B5CF6]">Net Take-home</TableCell>
                                                        <TableCell className="py-2 text-right text-xs font-bold tabular-nums text-[#8B5CF6]">{formatINR(ctcCalcTotals.netMonthly)}</TableCell>
                                                        <TableCell className="py-2 text-right text-xs font-bold tabular-nums text-[#8B5CF6]">{formatINR(ctcCalcTotals.netAnnual)}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </>
                                )}
                            </div>
                        </ScrollArea>
                        <DialogFooter className="p-4 border-t border-slate-100 bg-slate-50/50 gap-2">
                            <Button variant="ghost" onClick={() => setCtcCalcOpen(false)} className="h-10 font-semibold text-xs">Close</Button>
                            <Button
                                onClick={handleExportCtcBreakdown}
                                disabled={!ctcCalcBreakdown.length}
                                className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none gap-2"
                            >
                                <Download size={13} /> Export breakdown
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Compare Templates dialog ─────────── */}
                <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
                    <DialogContent className="max-w-5xl bg-white rounded-2xl p-0 font-sans max-h-[92vh] overflow-hidden flex flex-col">
                        <DialogHeader className="p-6 border-b border-slate-100 space-y-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6]">
                                    <ArrowLeftRight size={20} />
                                </div>
                                <div>
                                    <DialogTitle className="text-lg font-bold text-slate-900">Compare templates</DialogTitle>
                                    <DialogDescription className="text-xs font-medium text-slate-500">
                                        Side-by-side component diff at the same annual CTC.
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                        <ScrollArea className="flex-1 p-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <FormField label="Left template">
                                        <Select value={compareLeftId} onValueChange={setCompareLeftId}>
                                            <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent>
                                                {templates.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}{(t.version ?? 1) > 1 ? ` (v${t.version})` : ""}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                    <FormField label="Right template">
                                        <Select value={compareRightId} onValueChange={setCompareRightId}>
                                            <SelectTrigger className="h-10 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                                            <SelectContent>
                                                {templates.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}{(t.version ?? 1) > 1 ? ` (v${t.version})` : ""}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </FormField>
                                    <FormField label="Annual CTC (₹)">
                                        <Input
                                            type="number"
                                            value={compareCtc}
                                            onChange={(e) => setCompareCtc(parseFloat(e.target.value) || 0)}
                                            className="h-10 text-sm font-bold tabular-nums"
                                        />
                                    </FormField>
                                </div>

                                {compareLeftId && compareRightId && (
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-3 text-xs font-semibold">
                                        <span className="text-slate-500">Diff summary:</span>
                                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2">{compareDiff.added} added</Badge>
                                        <Badge className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] px-2">{compareDiff.removed} removed</Badge>
                                        <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] px-2">{compareDiff.changed} changed</Badge>
                                        <Badge className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] px-2">{compareDiff.same} same</Badge>
                                    </div>
                                )}

                                <div className="rounded-xl border border-slate-200 overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-slate-50">
                                            <TableRow className="hover:bg-transparent">
                                                <TableHead className="text-[11px] font-bold text-slate-500 uppercase">Component</TableHead>
                                                <TableHead className="text-right text-[11px] font-bold text-slate-500 uppercase">Left (monthly)</TableHead>
                                                <TableHead className="text-right text-[11px] font-bold text-slate-500 uppercase">Left (annual)</TableHead>
                                                <TableHead className="text-right text-[11px] font-bold text-slate-500 uppercase">Right (monthly)</TableHead>
                                                <TableHead className="text-right text-[11px] font-bold text-slate-500 uppercase">Right (annual)</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {compareDiff.names.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center text-slate-400 text-sm py-10">Pick two templates to compare.</TableCell>
                                                </TableRow>
                                            ) : (
                                                compareDiff.names.map((name) => {
                                                    const l = compareDiff.leftMap.get(name)
                                                    const r = compareDiff.rightMap.get(name)
                                                    let rowClass = "bg-white"
                                                    if (l && !r) rowClass = "bg-rose-50/50"
                                                    else if (!l && r) rowClass = "bg-rose-50/50"
                                                    else if (l && r && l.annual !== r.annual) rowClass = "bg-amber-50/50"
                                                    else if (l && r) rowClass = "bg-emerald-50/30"
                                                    return (
                                                        <TableRow key={name} className={cn("border-slate-100", rowClass)}>
                                                            <TableCell className="py-2 text-xs font-semibold text-slate-800">{name}</TableCell>
                                                            <TableCell className="py-2 text-right text-xs font-semibold tabular-nums">{l ? formatINR(l.monthly) : <span className="text-slate-300">—</span>}</TableCell>
                                                            <TableCell className="py-2 text-right text-xs font-bold tabular-nums">{l ? formatINR(l.annual) : <span className="text-slate-300">—</span>}</TableCell>
                                                            <TableCell className="py-2 text-right text-xs font-semibold tabular-nums">{r ? formatINR(r.monthly) : <span className="text-slate-300">—</span>}</TableCell>
                                                            <TableCell className="py-2 text-right text-xs font-bold tabular-nums">{r ? formatINR(r.annual) : <span className="text-slate-300">—</span>}</TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </ScrollArea>
                        <DialogFooter className="p-4 border-t border-slate-100 bg-slate-50/50">
                            <Button variant="ghost" onClick={() => setCompareOpen(false)} className="h-10 font-semibold text-xs">Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── New Version dialog ─────────── */}
                <Dialog open={versionOpen} onOpenChange={setVersionOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <GitBranch size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Create new version</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Clone this template as a new version. Employees stay on the current version until re-assigned.
                            </DialogDescription>
                        </DialogHeader>
                        {(() => {
                            const tpl = versionTargetId ? templates.find((t) => t.id === versionTargetId) : null
                            return (
                                <div className="mt-4 space-y-3">
                                    {tpl && (
                                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Parent template</div>
                                            <div className="text-sm font-bold text-slate-900 mt-0.5">{tpl.name}</div>
                                            <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                                Current version: v{tpl.version ?? 1} · Will become v{(tpl.version ?? 1) + 1}
                                            </div>
                                        </div>
                                    )}
                                    <FormField label="Changelog" required>
                                        <Textarea
                                            value={versionChangelog}
                                            onChange={(e) => setVersionChangelog(e.target.value)}
                                            className="min-h-[90px] text-xs font-medium"
                                            placeholder="e.g. Increased HRA to 50% of Basic; added food allowance."
                                        />
                                    </FormField>
                                </div>
                            )
                        })()}
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setVersionOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleConfirmVersion} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none gap-2">
                                <GitBranch size={13} /> Create version
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Assignment dialog ─────────── */}
                <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
                    <DialogContent className="max-w-2xl bg-white rounded-2xl p-0 font-sans max-h-[90vh] overflow-hidden flex flex-col">
                        <DialogHeader className="p-6 border-b border-slate-100 space-y-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6]">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <DialogTitle className="text-lg font-bold text-slate-900">
                                        Assign to employees
                                    </DialogTitle>
                                    <DialogDescription className="text-xs font-medium text-slate-500">
                                        {(() => {
                                            const tpl = assignTargetId ? templates.find((t) => t.id === assignTargetId) : null
                                            return tpl ? tpl.name : "Select employees to assign to this template."
                                        })()}
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                        <div className="p-6 pb-3 space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        placeholder="Search employees..."
                                        value={assignSearch}
                                        onChange={(e) => setAssignSearch(e.target.value)}
                                        className="pl-9 h-9 text-xs font-medium"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setAssignSelected(filteredAssignEmployees.map((e) => e.empCode))}
                                    className="h-9 rounded-lg border-slate-200 text-xs font-semibold"
                                >
                                    Select all
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setAssignSelected([])}
                                    className="h-9 rounded-lg border-slate-200 text-xs font-semibold"
                                >
                                    Clear
                                </Button>
                            </div>
                        </div>
                        <ScrollArea className="flex-1 px-6">
                            <div className="space-y-1 pb-3">
                                {filteredAssignEmployees.length === 0 ? (
                                    <div className="text-center text-slate-400 text-xs py-10">No employees match.</div>
                                ) : (
                                    filteredAssignEmployees.map((emp) => {
                                        const checked = assignSelected.includes(emp.empCode)
                                        return (
                                            <label
                                                key={emp.empCode}
                                                className={cn(
                                                    "flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors",
                                                    checked ? "border-[#8B5CF6]/40 bg-[#8B5CF6]/5" : "border-slate-200 bg-white hover:bg-slate-50"
                                                )}
                                            >
                                                <Checkbox
                                                    checked={checked}
                                                    onCheckedChange={() => toggleAssignEmployee(emp.empCode)}
                                                    className="data-[state=checked]:bg-[#8B5CF6] data-[state=checked]:border-[#8B5CF6]"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-xs font-bold text-slate-900 truncate">{emp.name}</div>
                                                    <div className="text-[10px] font-medium text-slate-500 truncate">
                                                        {emp.empCode} · {emp.designation} · {emp.dept}
                                                    </div>
                                                </div>
                                            </label>
                                        )
                                    })
                                )}
                            </div>
                        </ScrollArea>
                        <DialogFooter className="p-4 border-t border-slate-100 bg-slate-50/50 flex sm:flex-row items-center sm:justify-between gap-2">
                            <div className="text-[11px] font-semibold text-slate-500">
                                <span className="text-[#8B5CF6] font-bold">{assignSelected.length}</span> selected / {uniqueEmployees.length} total employees
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" onClick={() => setAssignOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                                <Button onClick={handleConfirmAssign} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none gap-2">
                                    <Check size={13} /> Save assignments
                                </Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Assigned employees view dialog ─────────── */}
                <Dialog open={assignedViewOpen} onOpenChange={setAssignedViewOpen}>
                    <DialogContent className="max-w-2xl bg-white rounded-2xl p-0 font-sans max-h-[88vh] overflow-hidden flex flex-col">
                        {(() => {
                            const tpl = assignedViewTargetId ? templates.find((t) => t.id === assignedViewTargetId) : null
                            const empCodes = tpl?.assignedEmployeeIds ?? []
                            const rows = empCodes
                                .map((code) => uniqueEmployees.find((e) => e.empCode === code) ?? { id: code, empCode: code, name: code, dept: "—", designation: "—" })
                            return (
                                <>
                                    <DialogHeader className="p-6 border-b border-slate-100 space-y-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6]">
                                                <UserMinus size={20} />
                                            </div>
                                            <div>
                                                <DialogTitle className="text-lg font-bold text-slate-900">Assigned employees</DialogTitle>
                                                <DialogDescription className="text-xs font-medium text-slate-500">
                                                    {tpl ? `${tpl.name} · ${rows.length} assigned` : "Assigned employees"}
                                                </DialogDescription>
                                            </div>
                                        </div>
                                    </DialogHeader>
                                    <ScrollArea className="flex-1 p-6">
                                        {rows.length === 0 ? (
                                            <div className="text-center py-10 text-slate-400 text-sm">No employees assigned to this template.</div>
                                        ) : (
                                            <div className="rounded-xl border border-slate-200 overflow-hidden">
                                                <Table>
                                                    <TableHeader className="bg-slate-50">
                                                        <TableRow className="hover:bg-transparent">
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase">Emp Code</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase">Name</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase">Designation</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase">Dept</TableHead>
                                                            <TableHead className="text-right text-[11px] font-bold text-slate-500 uppercase">Action</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {rows.map((emp) => (
                                                            <TableRow key={emp.empCode} className="border-slate-100">
                                                                <TableCell className="py-2 text-xs font-bold text-slate-900">{emp.empCode}</TableCell>
                                                                <TableCell className="py-2 text-xs font-semibold text-slate-800">{emp.name}</TableCell>
                                                                <TableCell className="py-2 text-xs font-medium text-slate-600">{emp.designation}</TableCell>
                                                                <TableCell className="py-2 text-xs font-medium text-slate-600">{emp.dept}</TableCell>
                                                                <TableCell className="py-2 text-right">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleUnassignOne(emp.empCode)}
                                                                        className="h-8 px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-semibold text-[11px] gap-1"
                                                                    >
                                                                        <UserMinus size={12} /> Remove
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        )}
                                    </ScrollArea>
                                    <DialogFooter className="p-4 border-t border-slate-100 bg-slate-50/50 gap-2">
                                        <Button variant="ghost" onClick={() => setAssignedViewOpen(false)} className="h-10 font-semibold text-xs">Close</Button>
                                        <Button
                                            onClick={handleUnassignAll}
                                            disabled={rows.length === 0}
                                            className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none gap-2"
                                        >
                                            <UserMinus size={13} /> Unassign all
                                        </Button>
                                    </DialogFooter>
                                </>
                            )
                        })()}
                    </DialogContent>
                </Dialog>

                {/* ── Component delete confirm ─────────── */}
                <Dialog open={componentDeleteOpen} onOpenChange={setComponentDeleteOpen}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Trash2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Delete component?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Components used in templates cannot be deleted. Remove them from templates first.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setComponentDeleteOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleDeleteComponent} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
    )
}

// ──────────────────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────────────────

const StatCard = ({ label, value, caption, icon: Icon, color }: { label: string; value: string; caption: string; icon: any; color: string }) => (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
        <CardContent className="p-4">
            <div className="flex justify-between items-start gap-2">
                <div className="space-y-1 min-w-0">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
                    <p className="text-xl font-bold text-slate-900 tracking-tight tabular-nums truncate">{value}</p>
                    <p className="text-[11px] font-medium text-slate-400 truncate">{caption}</p>
                </div>
                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}14`, color }}>
                    <Icon size={18} />
                </div>
            </div>
        </CardContent>
    </Card>
)

const TemplateStatBox = ({ label, value, color, small }: { label: string; value: string; color?: string; small?: boolean }) => (
    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
        <div className={cn("font-bold mt-0.5", small ? "text-[11px]" : "text-xs", color ?? "text-slate-800")}>{value}</div>
    </div>
)

const FormField = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
    <div className="space-y-1.5">
        <Label className="text-[11px] font-semibold text-slate-600">
            {label} {required && <span className="text-rose-500">*</span>}
        </Label>
        {children}
    </div>
)

const PreviewStat = ({ label, value, color }: { label: string; value: string; color: string }) => (
    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
        <div className={cn("text-sm font-bold tabular-nums mt-0.5", color)}>{value}</div>
    </div>
)

const ComponentPickerPopover = ({
    library,
    excludeIds,
    onPick,
}: {
    library: TemplateComponent[]
    excludeIds: string[]
    onPick: (c: TemplateComponent) => void
}) => {
    const [open, setOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const available = library.filter((c) => !excludeIds.includes(c.componentId))
    const filtered = available.filter((c) =>
        searchQuery ? c.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
    )

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button size="sm" className="h-8 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg font-semibold text-xs border-none gap-1 px-3">
                    <Plus size={12} /> Add component
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-3 space-y-2">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Search library..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 text-xs font-medium"
                        autoFocus
                    />
                </div>
                <ScrollArea className="h-64">
                    <div className="space-y-1">
                        {filtered.length === 0 ? (
                            <p className="text-xs text-slate-400 italic text-center py-6">
                                {available.length === 0 ? "All library components added." : "No matches."}
                            </p>
                        ) : (
                            filtered.map((c) => (
                                <button
                                    key={c.componentId}
                                    onClick={() => { onPick(c); setOpen(false); setSearchQuery("") }}
                                    className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 flex items-center gap-2 group"
                                >
                                    <Badge className={cn("border-none text-[10px] font-semibold px-1.5 shrink-0",
                                        c.type === "Earning" ? "bg-emerald-50 text-emerald-600" :
                                            c.type === "Deduction" ? "bg-rose-50 text-rose-600" :
                                                "bg-blue-50 text-blue-600")}>
                                        {c.type[0]}
                                    </Badge>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-semibold text-slate-800 truncate">{c.name}</div>
                                        <div className="text-[10px] font-medium text-slate-500 truncate">
                                            {c.calculationType === "Fixed" ? formatINR(c.value) : `${c.value}%`} • {c.calculationType}
                                        </div>
                                    </div>
                                    <Plus size={12} className="text-[#8B5CF6] opacity-0 group-hover:opacity-100" />
                                </button>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}

const CtcPreviewPanel = ({ components }: { components: TemplateComponent[] }) => {
    const [ctc, setCtc] = useState(1000000)
    const breakup = useMemo(() => computeBreakup(components, ctc), [components, ctc])
    return (
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#8B5CF6]/5 to-[#EC4899]/5 border border-[#8B5CF6]/10 space-y-3">
            <div className="flex items-center gap-2">
                <Calculator size={16} className="text-[#8B5CF6]" />
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">CTC breakup simulator</h4>
            </div>
            <div>
                <Label className="text-[11px] font-semibold text-slate-600">Sample annual CTC (₹)</Label>
                <Input
                    type="number"
                    value={ctc}
                    onChange={(e) => setCtc(parseFloat(e.target.value) || 0)}
                    className="h-10 text-sm font-bold tabular-nums mt-1.5"
                />
            </div>
            <div className="grid grid-cols-2 gap-2">
                <PreviewStat label="Gross (annual)" value={formatINR(breakup.grossAnnual)} color="text-emerald-600" />
                <PreviewStat label="Deductions" value={formatINR(breakup.totalDeductionsAnnual)} color="text-rose-600" />
                <PreviewStat label="Net annual" value={formatINR(breakup.netAnnual)} color="text-slate-900" />
                <PreviewStat label="Net monthly" value={formatINR(breakup.netMonthly)} color="text-[#8B5CF6]" />
            </div>
            <div className="pt-3 border-t border-slate-200/50">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Full monthly breakdown</div>
                <div className="space-y-1 max-h-56 overflow-y-auto">
                    {breakup.lineItems.map((li) => (
                        <div key={li.componentId} className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className={cn("h-1.5 w-1.5 rounded-full shrink-0",
                                    li.type === "Earning" ? "bg-emerald-500" :
                                        li.type === "Deduction" ? "bg-rose-500" :
                                            "bg-blue-500")} />
                                <span className="font-medium text-slate-700 truncate">{li.name}</span>
                            </div>
                            <span className={cn("font-bold tabular-nums ml-2 shrink-0",
                                li.type === "Earning" ? "text-slate-800" :
                                    li.type === "Deduction" ? "text-rose-600" :
                                        "text-blue-600")}>
                                {li.type === "Deduction" ? "−" : ""}{formatINR(li.monthly)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
