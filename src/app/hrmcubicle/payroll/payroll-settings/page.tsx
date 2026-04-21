"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
    Settings,
    ShieldCheck,
    Calendar,
    Building2,
    Plus,
    Save,
    Undo2,
    Trash2,
    Edit,
    Activity,
    Scale,
    Landmark,
    Banknote,
    Clock,
    Check,
    AlertCircle,
    Star,
    History,
    Download,
    Upload,
    MoreHorizontal,
    FileText,
    CheckCircle2,
    User,
    X,
    Camera,
    BookmarkPlus,
    Shield,
    Lock,
    Unlock,
    RefreshCw,
    FileCheck,
    Eye,
    Pencil,
    Copy,
    Users,
    Zap,
    AlertTriangle,
    Layers,
    KeyRound,
    Briefcase,
    CalendarDays,
} from "lucide-react"
import {
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getAllPositions,
    createPosition,
    updatePosition,
    deletePosition,
    getHolidaysByYear,
    createHoliday,
    updateHoliday,
    deleteHoliday,
} from "@/modules/hrm/hooks/hrmHooks"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/shared/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Switch } from "@/shared/components/ui/switch"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import { useToast } from "@/shared/components/ui/use-toast"
import {
    usePayrollStore,
    type SalaryComponent,
    type BankAccount,
    type PayrollCycle,
    type SettingsSnapshot,
    type PolicyTemplate,
    type SettingValidationRule,
    type SettingsPermission,
} from "@/shared/data/payroll-store"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const formatINR = (amt: number) => `₹${Math.round(amt || 0).toLocaleString("en-IN")}`

const BANK_ACCOUNT_PURPOSES: BankAccount["purpose"][] = [
    "Salary Disbursement",
    "Reimbursement",
    "Statutory",
    "General",
]

const emptyComponentForm: Omit<SalaryComponent, "id"> = {
    name: "",
    type: "Earning",
    amountType: "Fixed",
    value: 0,
    isTaxable: true,
    isStatutory: false,
}

const emptyBankForm: Omit<BankAccount, "id"> = {
    bankName: "",
    accountName: "",
    accountNumber: "",
    ifsc: "",
    branch: "",
    accountType: "Current",
    purpose: "Salary Disbursement",
    isPrimary: false,
    isActive: true,
    balance: 0,
    notes: "",
    addedDate: new Date().toISOString().split("T")[0],
}

const PayrollSettingsPage = () => {
    const { toast } = useToast()
    const {
        salaryComponents,
        addComponent,
        updateComponent,
        deleteComponent,
        statutorySettings,
        updateStatutorySettings,
        payrollCycle,
        updatePayrollCycle,
        bankAccounts,
        addBankAccount,
        updateBankAccount,
        deleteBankAccount,
        setPrimaryBankAccount,
        settingsAuditLog,
        addSettingsAudit,
        clearSettingsAudit,
        // Round 2
        settingsSnapshots,
        captureSettingsSnapshot,
        restoreSettingsSnapshot,
        deleteSettingsSnapshot,
        lockSettingsSnapshot,
        policyTemplates,
        addPolicyTemplate,
        updatePolicyTemplate,
        deletePolicyTemplate,
        applyPolicyTemplate,
        settingValidationRules,
        addSettingValidationRule,
        updateSettingValidationRule,
        deleteSettingValidationRule,
        runSettingValidation,
        settingsPermissions,
        addSettingsPermission,
        updateSettingsPermission,
        deleteSettingsPermission,
    } = usePayrollStore()

    // ── Draft state for tabs ───────────────────────────────
    const [statutoryForm, setStatutoryForm] = useState(statutorySettings)
    const [cycleForm, setCycleForm] = useState<PayrollCycle>(payrollCycle)

    // Detect dirty state
    const statutoryDirty = useMemo(
        () => JSON.stringify(statutoryForm) !== JSON.stringify(statutorySettings),
        [statutoryForm, statutorySettings]
    )
    const cycleDirty = useMemo(
        () => JSON.stringify(cycleForm) !== JSON.stringify(payrollCycle),
        [cycleForm, payrollCycle]
    )

    // Sync when store changes (e.g. after save)
    useEffect(() => { setStatutoryForm(statutorySettings) }, [statutorySettings])
    useEffect(() => { setCycleForm(payrollCycle) }, [payrollCycle])

    // ── UI state ───────────────────────────────────────────
    const [activeTab, setActiveTab] = useState<
        "structure" | "statutory" | "cycle" | "masters" | "bank" | "audit" | "snapshots" | "policies" | "validation" | "permissions"
    >("structure")

    // ── Masters (Backend-integrated) state ─────────────────
    type DeptRow = { _id: string; name: string; description?: string; head?: string }
    type PosRow = { _id: string; title: string; department?: any; level?: string; description?: string }
    type HolidayRow = { _id: string; name: string; date: string; type: "National" | "Optional"; isPaid?: boolean; isMandatory?: boolean }

    const [departments, setDepartments] = useState<DeptRow[]>([])
    const [deptLoading, setDeptLoading] = useState(false)
    const [deptFormOpen, setDeptFormOpen] = useState(false)
    const [editingDept, setEditingDept] = useState<DeptRow | null>(null)
    const [deptForm, setDeptForm] = useState<{ name: string; description: string; head: string }>({ name: "", description: "", head: "" })
    const [deptDeleteOpen, setDeptDeleteOpen] = useState(false)
    const [deptDeleteTarget, setDeptDeleteTarget] = useState<DeptRow | null>(null)

    const [positions, setPositions] = useState<PosRow[]>([])
    const [posLoading, setPosLoading] = useState(false)
    const [posFormOpen, setPosFormOpen] = useState(false)
    const [editingPos, setEditingPos] = useState<PosRow | null>(null)
    const [posForm, setPosForm] = useState<{ title: string; department: string; level: string; description: string }>({ title: "", department: "", level: "", description: "" })
    const [posDeleteOpen, setPosDeleteOpen] = useState(false)
    const [posDeleteTarget, setPosDeleteTarget] = useState<PosRow | null>(null)

    const [holidays, setHolidays] = useState<HolidayRow[]>([])
    const [holidayLoading, setHolidayLoading] = useState(false)
    const [holidayYear, setHolidayYear] = useState<string>(String(new Date().getFullYear()))
    const [holidayFormOpen, setHolidayFormOpen] = useState(false)
    const [editingHoliday, setEditingHoliday] = useState<HolidayRow | null>(null)
    const [holidayForm, setHolidayForm] = useState<{ name: string; date: string; type: "National" | "Optional"; isPaid: boolean; isMandatory: boolean }>({ name: "", date: new Date().toISOString().split("T")[0], type: "National", isPaid: true, isMandatory: true })
    const [holidayDeleteOpen, setHolidayDeleteOpen] = useState(false)
    const [holidayDeleteTarget, setHolidayDeleteTarget] = useState<HolidayRow | null>(null)

    // Fetch helpers
    const fetchDepartments = async () => {
        setDeptLoading(true)
        try {
            const res: any = await getAllDepartments()
            const data = res?.data?.data ?? res?.data ?? []
            setDepartments(Array.isArray(data) ? data : [])
        } catch (err) {
            toast({ title: "Failed to load departments", variant: "destructive" })
        } finally {
            setDeptLoading(false)
        }
    }

    const fetchPositions = async () => {
        setPosLoading(true)
        try {
            const res: any = await getAllPositions()
            const data = res?.data?.data ?? res?.data ?? []
            setPositions(Array.isArray(data) ? data : [])
        } catch (err) {
            toast({ title: "Failed to load positions", variant: "destructive" })
        } finally {
            setPosLoading(false)
        }
    }

    const fetchHolidays = async (year: string) => {
        setHolidayLoading(true)
        try {
            const res: any = await getHolidaysByYear(year)
            const data = res?.data?.data ?? res?.data ?? []
            setHolidays(Array.isArray(data) ? data : [])
        } catch (err) {
            toast({ title: "Failed to load holidays", variant: "destructive" })
        } finally {
            setHolidayLoading(false)
        }
    }

    // Initial fetch on mount
    useEffect(() => {
        fetchDepartments()
        fetchPositions()
    }, [])

    useEffect(() => {
        fetchHolidays(holidayYear)
    }, [holidayYear])

    // Department handlers
    const openAddDept = () => {
        setEditingDept(null)
        setDeptForm({ name: "", description: "", head: "" })
        setDeptFormOpen(true)
    }
    const openEditDept = (d: DeptRow) => {
        setEditingDept(d)
        setDeptForm({ name: d.name || "", description: d.description || "", head: d.head || "" })
        setDeptFormOpen(true)
    }
    const handleSaveDept = async () => {
        if (!deptForm.name.trim()) {
            toast({ title: "Name required", variant: "destructive" })
            return
        }
        try {
            if (editingDept) {
                await updateDepartment(editingDept._id, {
                    name: deptForm.name,
                    description: deptForm.description || undefined,
                    head: deptForm.head || undefined,
                })
                toast({ title: "Department updated" })
            } else {
                await createDepartment({
                    name: deptForm.name,
                    description: deptForm.description || undefined,
                    head: deptForm.head || undefined,
                })
                toast({ title: "Department created" })
            }
            setDeptFormOpen(false)
            fetchDepartments()
        } catch (err: any) {
            toast({ title: "Operation failed", description: err?.response?.data?.message || "Error", variant: "destructive" })
        }
    }
    const handleDeleteDept = async () => {
        if (!deptDeleteTarget) return
        try {
            await deleteDepartment(deptDeleteTarget._id)
            toast({ title: "Department deleted", variant: "destructive" })
            setDeptDeleteOpen(false)
            setDeptDeleteTarget(null)
            fetchDepartments()
        } catch (err: any) {
            toast({ title: "Delete failed", description: err?.response?.data?.message || "Error", variant: "destructive" })
        }
    }

    // Position handlers
    const openAddPos = () => {
        setEditingPos(null)
        setPosForm({ title: "", department: "", level: "", description: "" })
        setPosFormOpen(true)
    }
    const openEditPos = (p: PosRow) => {
        setEditingPos(p)
        setPosForm({
            title: p.title || "",
            department: typeof p.department === "object" ? (p.department?._id || "") : (p.department || ""),
            level: p.level || "",
            description: p.description || "",
        })
        setPosFormOpen(true)
    }
    const handleSavePos = async () => {
        if (!posForm.title.trim()) {
            toast({ title: "Title required", variant: "destructive" })
            return
        }
        try {
            if (editingPos) {
                await updatePosition(editingPos._id, {
                    title: posForm.title,
                    department: posForm.department || undefined,
                    level: posForm.level || undefined,
                    description: posForm.description || undefined,
                })
                toast({ title: "Position updated" })
            } else {
                if (!posForm.department) {
                    toast({ title: "Department required", variant: "destructive" })
                    return
                }
                await createPosition({
                    title: posForm.title,
                    department: posForm.department,
                    level: posForm.level || undefined,
                    description: posForm.description || undefined,
                })
                toast({ title: "Position created" })
            }
            setPosFormOpen(false)
            fetchPositions()
        } catch (err: any) {
            toast({ title: "Operation failed", description: err?.response?.data?.message || "Error", variant: "destructive" })
        }
    }
    const handleDeletePos = async () => {
        if (!posDeleteTarget) return
        try {
            await deletePosition(posDeleteTarget._id)
            toast({ title: "Position deleted", variant: "destructive" })
            setPosDeleteOpen(false)
            setPosDeleteTarget(null)
            fetchPositions()
        } catch (err: any) {
            toast({ title: "Delete failed", description: err?.response?.data?.message || "Error", variant: "destructive" })
        }
    }

    // Holiday handlers
    const openAddHoliday = () => {
        setEditingHoliday(null)
        setHolidayForm({ name: "", date: `${holidayYear}-01-01`, type: "National", isPaid: true, isMandatory: true })
        setHolidayFormOpen(true)
    }
    const openEditHoliday = (h: HolidayRow) => {
        setEditingHoliday(h)
        setHolidayForm({
            name: h.name || "",
            date: (h.date || "").split("T")[0],
            type: (h.type as "National" | "Optional") || "National",
            isPaid: h.isPaid ?? true,
            isMandatory: h.isMandatory ?? true,
        })
        setHolidayFormOpen(true)
    }
    const handleSaveHoliday = async () => {
        if (!holidayForm.name.trim() || !holidayForm.date) {
            toast({ title: "Name & date required", variant: "destructive" })
            return
        }
        try {
            if (editingHoliday) {
                await updateHoliday(editingHoliday._id, {
                    name: holidayForm.name,
                    type: holidayForm.type,
                    isPaid: holidayForm.isPaid,
                    isMandatory: holidayForm.isMandatory,
                })
                toast({ title: "Holiday updated" })
            } else {
                await createHoliday({
                    name: holidayForm.name,
                    date: holidayForm.date,
                    type: holidayForm.type,
                    isPaid: holidayForm.isPaid,
                    isMandatory: holidayForm.isMandatory,
                })
                toast({ title: "Holiday created" })
            }
            setHolidayFormOpen(false)
            fetchHolidays(holidayYear)
        } catch (err: any) {
            toast({ title: "Operation failed", description: err?.response?.data?.message || "Error", variant: "destructive" })
        }
    }
    const handleDeleteHoliday = async () => {
        if (!holidayDeleteTarget) return
        try {
            await deleteHoliday(holidayDeleteTarget._id)
            toast({ title: "Holiday deleted", variant: "destructive" })
            setHolidayDeleteOpen(false)
            setHolidayDeleteTarget(null)
            fetchHolidays(holidayYear)
        } catch (err: any) {
            toast({ title: "Delete failed", description: err?.response?.data?.message || "Error", variant: "destructive" })
        }
    }

    // Component dialogs
    const [compFormOpen, setCompFormOpen] = useState(false)
    const [compDeleteOpen, setCompDeleteOpen] = useState(false)
    const [editingComp, setEditingComp] = useState<SalaryComponent | null>(null)
    const [compDeleteTarget, setCompDeleteTarget] = useState<string | null>(null)
    const [compForm, setCompForm] = useState(emptyComponentForm)

    // Bank dialogs
    const [bankFormOpen, setBankFormOpen] = useState(false)
    const [bankDeleteOpen, setBankDeleteOpen] = useState(false)
    const [editingBank, setEditingBank] = useState<BankAccount | null>(null)
    const [bankDeleteTarget, setBankDeleteTarget] = useState<string | null>(null)
    const [bankForm, setBankForm] = useState(emptyBankForm)

    // Audit clear confirm
    const [clearAuditOpen, setClearAuditOpen] = useState(false)

    // ── Round 2 state ──────────────────────────────────────
    // Capture snapshot dialog
    const [captureOpen, setCaptureOpen] = useState(false)
    const [captureForm, setCaptureForm] = useState<{ name: string; description: string; reason: string }>({
        name: "",
        description: "",
        reason: "",
    })

    // Snapshot detail / compare
    const [snapshotDetailOpen, setSnapshotDetailOpen] = useState(false)
    const [activeSnapshot, setActiveSnapshot] = useState<SettingsSnapshot | null>(null)
    const [snapshotRestoreConfirm, setSnapshotRestoreConfirm] = useState(false)
    const [snapshotDeleteOpen, setSnapshotDeleteOpen] = useState(false)
    const [snapshotDeleteTarget, setSnapshotDeleteTarget] = useState<SettingsSnapshot | null>(null)

    // Policy template form
    const [policyFormOpen, setPolicyFormOpen] = useState(false)
    const [editingPolicy, setEditingPolicy] = useState<PolicyTemplate | null>(null)
    const emptyPolicyForm: Omit<PolicyTemplate, "id"> = {
        name: "",
        description: "",
        category: "Custom",
        statutoryOverride: {
            pfEnabled: true, pfRate: 12, esiEnabled: true, esiRate: 0.75, tdsEnabled: true, ptEnabled: true,
        },
        cycleOverride: {
            frequency: "Monthly", payoutDay: 5, cutoffDay: 25, autoRunEnabled: false,
        },
        createdBy: "HR Manager",
        createdDate: new Date().toISOString().split("T")[0],
        usageCount: 0,
    }
    const [policyForm, setPolicyForm] = useState<Omit<PolicyTemplate, "id">>(emptyPolicyForm)

    // Apply policy confirm
    const [applyPolicyOpen, setApplyPolicyOpen] = useState(false)
    const [applyPolicyTarget, setApplyPolicyTarget] = useState<PolicyTemplate | null>(null)

    // Policy delete
    const [policyDeleteOpen, setPolicyDeleteOpen] = useState(false)
    const [policyDeleteTarget, setPolicyDeleteTarget] = useState<PolicyTemplate | null>(null)

    // Validation
    const [validationOpen, setValidationOpen] = useState(false)
    const [validationResult, setValidationResult] = useState<{
        issues: { ruleId: string; settingKey: string; currentValue: string; message: string; severity: "warning" | "error" }[]
    }>({ issues: [] })
    const [ruleFormOpen, setRuleFormOpen] = useState(false)
    const [editingRule, setEditingRule] = useState<SettingValidationRule | null>(null)
    const emptyRuleForm: Omit<SettingValidationRule, "id"> = {
        settingKey: "pfRate",
        label: "PF Rate",
        operator: "range",
        minValue: 0,
        maxValue: 20,
        severity: "warning",
        message: "",
        active: true,
    }
    const [ruleForm, setRuleForm] = useState<Omit<SettingValidationRule, "id">>(emptyRuleForm)
    const [ruleDeleteOpen, setRuleDeleteOpen] = useState(false)
    const [ruleDeleteTarget, setRuleDeleteTarget] = useState<SettingValidationRule | null>(null)

    // Permissions
    const [permFormOpen, setPermFormOpen] = useState(false)
    const [editingPerm, setEditingPerm] = useState<SettingsPermission | null>(null)
    const emptyPermForm: Omit<SettingsPermission, "id"> = {
        role: "",
        scope: "Structure",
        canView: true,
        canEdit: false,
        canApprove: false,
    }
    const [permForm, setPermForm] = useState<Omit<SettingsPermission, "id">>(emptyPermForm)
    const [permDeleteOpen, setPermDeleteOpen] = useState(false)
    const [permDeleteTarget, setPermDeleteTarget] = useState<SettingsPermission | null>(null)

    // ── Round 2 handlers ───────────────────────────────────
    const openCaptureDialog = () => {
        setCaptureForm({
            name: `Snapshot ${new Date().toISOString().split("T")[0]}`,
            description: "",
            reason: "",
        })
        setCaptureOpen(true)
    }

    const handleCaptureSnapshot = () => {
        if (!captureForm.name.trim()) {
            toast({ title: "Name required", description: "Please provide a snapshot name.", variant: "destructive" })
            return
        }
        captureSettingsSnapshot(captureForm.name, "HR Manager", captureForm.reason || undefined)
        addSettingsAudit({
            actor: "HR Manager",
            area: "Other",
            action: "Captured settings snapshot",
            details: captureForm.name,
        })
        toast({ title: "Snapshot captured", description: captureForm.name })
        setCaptureOpen(false)
    }

    const openSnapshotDetail = (s: SettingsSnapshot) => {
        setActiveSnapshot(s)
        setSnapshotDetailOpen(true)
    }

    const handleRestoreSnapshot = () => {
        if (!activeSnapshot) return
        restoreSettingsSnapshot(activeSnapshot.id, "HR Manager")
        addSettingsAudit({
            actor: "HR Manager",
            area: "Other",
            action: "Restored settings from snapshot",
            details: activeSnapshot.name,
        })
        toast({ title: "Settings restored", description: `Restored from "${activeSnapshot.name}"` })
        setSnapshotRestoreConfirm(false)
        setSnapshotDetailOpen(false)
    }

    const handleToggleSnapshotLock = (s: SettingsSnapshot) => {
        lockSettingsSnapshot(s.id, !s.isLocked)
        toast({ title: s.isLocked ? "Snapshot unlocked" : "Snapshot locked", description: s.name })
        if (activeSnapshot?.id === s.id) {
            setActiveSnapshot({ ...s, isLocked: !s.isLocked })
        }
    }

    const handleDeleteSnapshot = () => {
        if (!snapshotDeleteTarget) return
        if (snapshotDeleteTarget.isLocked) {
            toast({ title: "Cannot delete", description: "Unlock the snapshot first.", variant: "destructive" })
            setSnapshotDeleteOpen(false)
            return
        }
        deleteSettingsSnapshot(snapshotDeleteTarget.id)
        toast({ title: "Snapshot deleted", description: snapshotDeleteTarget.name, variant: "destructive" })
        setSnapshotDeleteOpen(false)
        setSnapshotDeleteTarget(null)
    }

    // Policies
    const openAddPolicy = () => {
        setEditingPolicy(null)
        setPolicyForm({ ...emptyPolicyForm })
        setPolicyFormOpen(true)
    }

    const openEditPolicy = (p: PolicyTemplate) => {
        setEditingPolicy(p)
        setPolicyForm({
            name: p.name,
            description: p.description ?? "",
            category: p.category,
            statutoryOverride: { ...p.statutoryOverride },
            cycleOverride: { ...p.cycleOverride },
            createdBy: p.createdBy,
            createdDate: p.createdDate,
            lastAppliedDate: p.lastAppliedDate,
            lastAppliedBy: p.lastAppliedBy,
            usageCount: p.usageCount,
        })
        setPolicyFormOpen(true)
    }

    const handleDuplicatePolicy = (p: PolicyTemplate) => {
        addPolicyTemplate({
            name: `${p.name} (Copy)`,
            description: p.description,
            category: "Custom",
            statutoryOverride: { ...p.statutoryOverride },
            cycleOverride: { ...p.cycleOverride },
            createdBy: "HR Manager",
            createdDate: new Date().toISOString().split("T")[0],
            usageCount: 0,
        })
        toast({ title: "Policy duplicated", description: `${p.name} (Copy)` })
    }

    const handleSavePolicy = () => {
        if (!policyForm.name.trim()) {
            toast({ title: "Name required", variant: "destructive" })
            return
        }
        if (editingPolicy) {
            updatePolicyTemplate(editingPolicy.id, policyForm)
            toast({ title: "Policy updated", description: policyForm.name })
        } else {
            addPolicyTemplate(policyForm)
            toast({ title: "Policy added", description: policyForm.name })
        }
        setPolicyFormOpen(false)
        setEditingPolicy(null)
    }

    const handleApplyPolicy = () => {
        if (!applyPolicyTarget) return
        applyPolicyTemplate(applyPolicyTarget.id, "HR Manager")
        addSettingsAudit({
            actor: "HR Manager",
            area: "Other",
            action: "Applied policy template",
            details: applyPolicyTarget.name,
        })
        toast({ title: "Policy applied", description: applyPolicyTarget.name })
        setApplyPolicyOpen(false)
        setApplyPolicyTarget(null)
    }

    const handleConfirmDeletePolicy = () => {
        if (!policyDeleteTarget) return
        deletePolicyTemplate(policyDeleteTarget.id)
        toast({ title: "Policy deleted", description: policyDeleteTarget.name, variant: "destructive" })
        setPolicyDeleteOpen(false)
        setPolicyDeleteTarget(null)
    }

    // Validation
    const handleRunValidation = () => {
        const result = runSettingValidation()
        setValidationResult(result)
        setValidationOpen(true)
    }

    const handleRunValidationInline = () => {
        const result = runSettingValidation()
        setValidationResult(result)
        toast({
            title: `Validation run: ${result.issues.length} issues`,
            description: result.issues.length === 0 ? "All settings pass validation." : undefined,
        })
    }

    const openAddRule = () => {
        setEditingRule(null)
        setRuleForm({ ...emptyRuleForm })
        setRuleFormOpen(true)
    }

    const openEditRule = (r: SettingValidationRule) => {
        setEditingRule(r)
        setRuleForm({
            settingKey: r.settingKey,
            label: r.label,
            operator: r.operator,
            minValue: r.minValue,
            maxValue: r.maxValue,
            allowedValues: r.allowedValues,
            severity: r.severity,
            message: r.message,
            active: r.active,
        })
        setRuleFormOpen(true)
    }

    const handleSaveRule = () => {
        if (!ruleForm.message.trim() || !ruleForm.label.trim()) {
            toast({ title: "Label and message required", variant: "destructive" })
            return
        }
        if (editingRule) {
            updateSettingValidationRule(editingRule.id, ruleForm)
            toast({ title: "Rule updated", description: ruleForm.label })
        } else {
            addSettingValidationRule(ruleForm)
            toast({ title: "Rule added", description: ruleForm.label })
        }
        setRuleFormOpen(false)
        setEditingRule(null)
    }

    const handleConfirmDeleteRule = () => {
        if (!ruleDeleteTarget) return
        deleteSettingValidationRule(ruleDeleteTarget.id)
        toast({ title: "Rule deleted", description: ruleDeleteTarget.label, variant: "destructive" })
        setRuleDeleteOpen(false)
        setRuleDeleteTarget(null)
    }

    // Permissions
    const openAddPerm = () => {
        setEditingPerm(null)
        setPermForm({ ...emptyPermForm })
        setPermFormOpen(true)
    }

    const openEditPerm = (p: SettingsPermission) => {
        setEditingPerm(p)
        setPermForm({
            role: p.role,
            scope: p.scope,
            canView: p.canView,
            canEdit: p.canEdit,
            canApprove: p.canApprove ?? false,
        })
        setPermFormOpen(true)
    }

    const handleSavePerm = () => {
        if (!permForm.role.trim()) {
            toast({ title: "Role required", variant: "destructive" })
            return
        }
        if (editingPerm) {
            updateSettingsPermission(editingPerm.id, permForm)
            toast({ title: "Permission updated", description: `${permForm.role} • ${permForm.scope}` })
        } else {
            addSettingsPermission(permForm)
            toast({ title: "Permission added", description: `${permForm.role} • ${permForm.scope}` })
        }
        setPermFormOpen(false)
        setEditingPerm(null)
    }

    const handleConfirmDeletePerm = () => {
        if (!permDeleteTarget) return
        deleteSettingsPermission(permDeleteTarget.id)
        toast({ title: "Permission deleted", variant: "destructive" })
        setPermDeleteOpen(false)
        setPermDeleteTarget(null)
    }

    // Derived maps
    const permissionMatrix = useMemo(() => {
        const roles = Array.from(new Set(settingsPermissions.map(p => p.role)))
        const scopes: SettingsPermission["scope"][] = ["Structure", "Statutory", "Cycle", "Bank", "Audit", "All"]
        const map: Record<string, Record<string, SettingsPermission | undefined>> = {}
        roles.forEach(r => {
            map[r] = {}
            scopes.forEach(s => {
                map[r][s] = settingsPermissions.find(p => p.role === r && p.scope === s)
            })
        })
        return { roles, scopes, map }
    }, [settingsPermissions])

    // ── Handlers: Components ───────────────────────────────
    const openAddComp = () => {
        setEditingComp(null)
        setCompForm(emptyComponentForm)
        setCompFormOpen(true)
    }

    const openEditComp = (c: SalaryComponent) => {
        setEditingComp(c)
        setCompForm({
            name: c.name,
            type: c.type,
            amountType: c.amountType,
            value: c.value,
            isTaxable: c.isTaxable,
            isStatutory: c.isStatutory,
        })
        setCompFormOpen(true)
    }

    const handleSaveComp = () => {
        if (!compForm.name.trim() || compForm.value < 0) {
            toast({ title: "Invalid component", description: "Name and non-negative value required.", variant: "destructive" })
            return
        }
        if (editingComp) {
            updateComponent(editingComp.id, compForm)
            addSettingsAudit({
                actor: "HR Admin",
                area: "Components",
                action: "Updated component",
                details: `${compForm.name} → ${compForm.amountType === "Fixed" ? formatINR(compForm.value) : `${compForm.value}%`}`,
            })
            toast({ title: "Component updated", description: compForm.name })
        } else {
            addComponent(compForm)
            addSettingsAudit({
                actor: "HR Admin",
                area: "Components",
                action: "Added component",
                details: `${compForm.name} (${compForm.type})`,
            })
            toast({ title: "Component added", description: compForm.name })
        }
        setCompFormOpen(false)
        setEditingComp(null)
    }

    const handleConfirmDeleteComp = () => {
        if (!compDeleteTarget) return
        const comp = salaryComponents.find((c) => c.id === compDeleteTarget)
        deleteComponent(compDeleteTarget)
        addSettingsAudit({
            actor: "HR Admin",
            area: "Components",
            action: "Deleted component",
            details: comp?.name ?? "Unknown",
        })
        toast({ title: "Component deleted", variant: "destructive" })
        setCompDeleteOpen(false)
        setCompDeleteTarget(null)
    }

    // ── Handlers: Statutory ────────────────────────────────
    const handleSaveStatutory = () => {
        updateStatutorySettings(statutoryForm)
        addSettingsAudit({
            actor: "HR Admin",
            area: "Statutory",
            action: "Updated statutory rates",
            details: `PF ${statutoryForm.pfRate}% • ESI ${statutoryForm.esiRate}% • PF ${statutoryForm.pfEnabled ? "on" : "off"} • ESI ${statutoryForm.esiEnabled ? "on" : "off"}`,
        })
        toast({ title: "Statutory settings saved", description: "Rates applied to future calculations." })
    }

    const handleRevertStatutory = () => {
        setStatutoryForm(statutorySettings)
        toast({ title: "Reverted", description: "Unsaved statutory changes discarded." })
    }

    // ── Handlers: Cycle ────────────────────────────────────
    const handleSaveCycle = () => {
        if (cycleForm.cycleStart >= cycleForm.cycleEnd) {
            toast({ title: "Invalid cycle", description: "Start day must be before end day.", variant: "destructive" })
            return
        }
        updatePayrollCycle(cycleForm)
        addSettingsAudit({
            actor: "HR Admin",
            area: "Cycle",
            action: "Updated payroll cycle",
            details: `Cycle ${cycleForm.cycleStart}-${cycleForm.cycleEnd}, payout day ${cycleForm.payoutDay}, cutoff ${cycleForm.cutoffDay}, ${cycleForm.frequency}`,
        })
        toast({ title: "Cycle saved", description: "Cycle applies from next run." })
    }

    const handleRevertCycle = () => {
        setCycleForm(payrollCycle)
        toast({ title: "Reverted", description: "Cycle changes discarded." })
    }

    // ── Handlers: Bank ────────────────────────────────────
    const openAddBank = () => {
        setEditingBank(null)
        setBankForm(emptyBankForm)
        setBankFormOpen(true)
    }

    const openEditBank = (b: BankAccount) => {
        setEditingBank(b)
        setBankForm({
            bankName: b.bankName,
            accountName: b.accountName,
            accountNumber: b.accountNumber,
            ifsc: b.ifsc,
            branch: b.branch ?? "",
            accountType: b.accountType,
            purpose: b.purpose,
            isPrimary: b.isPrimary,
            isActive: b.isActive,
            balance: b.balance ?? 0,
            notes: b.notes ?? "",
            addedDate: b.addedDate,
        })
        setBankFormOpen(true)
    }

    const handleSaveBank = () => {
        if (!bankForm.bankName.trim() || !bankForm.accountNumber.trim() || !bankForm.ifsc.trim()) {
            toast({ title: "Missing fields", description: "Bank name, account number, IFSC required.", variant: "destructive" })
            return
        }
        if (editingBank) {
            // If isPrimary flipped to true, unflag others
            if (bankForm.isPrimary && !editingBank.isPrimary) {
                bankAccounts.forEach((a) => { if (a.id !== editingBank.id && a.isPrimary) updateBankAccount(a.id, { isPrimary: false }) })
            }
            updateBankAccount(editingBank.id, bankForm)
            addSettingsAudit({
                actor: "Payroll Admin",
                area: "Bank",
                action: "Updated bank account",
                details: `${bankForm.bankName} • ${bankForm.accountNumber} • ${bankForm.purpose}`,
            })
            toast({ title: "Account updated", description: bankForm.bankName })
        } else {
            if (bankForm.isPrimary) {
                bankAccounts.forEach((a) => { if (a.isPrimary) updateBankAccount(a.id, { isPrimary: false }) })
            }
            addBankAccount(bankForm)
            addSettingsAudit({
                actor: "Payroll Admin",
                area: "Bank",
                action: "Added bank account",
                details: `${bankForm.bankName} (${bankForm.purpose})`,
            })
            toast({ title: "Account added", description: bankForm.bankName })
        }
        setBankFormOpen(false)
        setEditingBank(null)
    }

    const handleConfirmDeleteBank = () => {
        if (!bankDeleteTarget) return
        const account = bankAccounts.find((a) => a.id === bankDeleteTarget)
        if (account?.isPrimary) {
            toast({ title: "Cannot delete primary", description: "Set another account as primary first.", variant: "destructive" })
            setBankDeleteOpen(false)
            return
        }
        deleteBankAccount(bankDeleteTarget)
        addSettingsAudit({
            actor: "Payroll Admin",
            area: "Bank",
            action: "Deleted bank account",
            details: account?.bankName ?? "Unknown",
        })
        toast({ title: "Account deleted", variant: "destructive" })
        setBankDeleteOpen(false)
        setBankDeleteTarget(null)
    }

    const handleSetPrimary = (b: BankAccount) => {
        setPrimaryBankAccount(b.id)
        addSettingsAudit({
            actor: "Payroll Admin",
            area: "Bank",
            action: "Changed primary account",
            details: `${b.bankName} now primary`,
        })
        toast({ title: "Primary account updated", description: b.bankName })
    }

    const handleToggleBankActive = (b: BankAccount) => {
        updateBankAccount(b.id, { isActive: !b.isActive })
        addSettingsAudit({
            actor: "Payroll Admin",
            area: "Bank",
            action: `${b.isActive ? "Deactivated" : "Activated"} bank account`,
            details: b.bankName,
        })
        toast({ title: b.isActive ? "Deactivated" : "Activated", description: b.bankName })
    }

    // ── Handlers: Audit ───────────────────────────────────
    const handleClearAudit = () => {
        clearSettingsAudit()
        toast({ title: "Audit log cleared", variant: "destructive" })
        setClearAuditOpen(false)
    }

    const handleExportAudit = () => {
        if (!settingsAuditLog.length) {
            toast({ title: "Nothing to export", variant: "destructive" })
            return
        }
        const headers = ["Timestamp", "Actor", "Area", "Action", "Details"]
        const rows = settingsAuditLog.map((e) => [
            new Date(e.timestamp).toISOString(),
            e.actor,
            e.area,
            e.action,
            `"${e.details.replace(/"/g, "'")}"`,
        ].join(","))
        const csv = [headers.join(","), ...rows].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `settings_audit_log_${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Audit log exported" })
    }

    // ── Handlers: Import/Export Config ────────────────────
    const handleExportConfig = () => {
        const config = {
            salaryComponents,
            statutorySettings,
            payrollCycle,
            bankAccounts: bankAccounts.map((b) => ({ ...b, accountNumber: b.accountNumber.replace(/.(?=.{4})/g, "X") })), // mask
            exportedAt: new Date().toISOString(),
            version: 1,
        }
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `payroll_config_${new Date().toISOString().split("T")[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Configuration exported", description: "JSON file downloaded (account numbers masked)." })
    }

    // ── Derived data ─────────────────────────────────────
    const stats = useMemo(() => {
        const earnings = salaryComponents.filter((c) => c.type === "Earning").length
        const deductions = salaryComponents.filter((c) => c.type === "Deduction").length
        const taxable = salaryComponents.filter((c) => c.isTaxable).length
        const statutory = salaryComponents.filter((c) => c.isStatutory).length
        const primaryBank = bankAccounts.find((b) => b.isPrimary)
        const activeBanks = bankAccounts.filter((b) => b.isActive).length
        const totalBalance = bankAccounts.filter((b) => b.isActive).reduce((s, b) => s + (b.balance ?? 0), 0)
        return { earnings, deductions, taxable, statutory, primaryBank, activeBanks, totalBalance }
    }, [salaryComponents, bankAccounts])

    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto">
                {/* Header */}
                <div className="h-auto min-h-[72px] bg-white border-b border-slate-200 px-6 lg:px-8 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] shrink-0">
                            <Settings size={20} />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight truncate">Payroll Settings</h1>
                            <p className="text-xs font-medium text-slate-500">System configuration, statutory rates & bank accounts</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={handleRunValidation}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <ShieldCheck size={14} /> <span className="hidden md:inline">Run validation</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={openCaptureDialog}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <Camera size={14} /> <span className="hidden md:inline">Capture snapshot</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleExportConfig}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <Download size={14} /> <span className="hidden md:inline">Export config</span>
                        </Button>
                        <Badge className={cn("border-none text-[10px] font-semibold px-2 h-7 gap-1",
                            activeTab === "statutory" && statutoryDirty ? "bg-amber-50 text-amber-600" :
                                activeTab === "cycle" && cycleDirty ? "bg-amber-50 text-amber-600" :
                                    "bg-emerald-50 text-emerald-600")}>
                            {((activeTab === "statutory" && statutoryDirty) || (activeTab === "cycle" && cycleDirty))
                                ? <><AlertCircle size={12} /> Unsaved changes</>
                                : <><CheckCircle2 size={12} /> All saved</>}
                        </Badge>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="p-6 lg:p-8 space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard label="Components" value={`${stats.earnings}+${stats.deductions}`} caption={`${stats.taxable} taxable, ${stats.statutory} statutory`} icon={Scale} color="#8B5CF6" />
                            <StatCard label="PF rate" value={`${statutoryForm.pfRate}%`} caption={statutoryForm.pfEnabled ? "Enabled" : "Disabled"} icon={Landmark} color="#EC4899" />
                            <StatCard label="Bank accounts" value={String(stats.activeBanks)} caption={stats.primaryBank?.bankName ?? "No primary"} icon={Banknote} color="#10B981" />
                            <StatCard label="Total balance" value={formatINR(stats.totalBalance)} caption="Across active accounts" icon={Activity} color="#F59E0B" />
                        </div>

                        {/* Tabs */}
                        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                            <TabsList className="bg-slate-100 p-1 rounded-xl h-auto flex flex-wrap gap-1 justify-start">
                                <TabsTrigger value="structure" className="rounded-lg px-4 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm gap-1.5">
                                    <Scale size={13} /> Structure
                                </TabsTrigger>
                                <TabsTrigger value="statutory" className="rounded-lg px-4 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm gap-1.5 relative">
                                    <ShieldCheck size={13} /> Statutory
                                    {statutoryDirty && <span className="h-1.5 w-1.5 rounded-full bg-amber-500 absolute top-1.5 right-1.5" />}
                                </TabsTrigger>
                                <TabsTrigger value="cycle" className="rounded-lg px-4 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm gap-1.5 relative">
                                    <Calendar size={13} /> Cycle
                                    {cycleDirty && <span className="h-1.5 w-1.5 rounded-full bg-amber-500 absolute top-1.5 right-1.5" />}
                                </TabsTrigger>
                                <TabsTrigger value="masters" className="rounded-lg px-4 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm gap-1.5">
                                    <Building2 size={13} /> Masters
                                </TabsTrigger>
                                <TabsTrigger value="bank" className="rounded-lg px-4 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm gap-1.5">
                                    <Banknote size={13} /> Bank ({bankAccounts.length})
                                </TabsTrigger>
                                <TabsTrigger value="audit" className="rounded-lg px-4 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm gap-1.5">
                                    <History size={13} /> Audit ({settingsAuditLog.length})
                                </TabsTrigger>
                                <TabsTrigger value="snapshots" className="rounded-lg px-4 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm gap-1.5">
                                    <Camera size={13} /> Snapshots ({settingsSnapshots.length})
                                </TabsTrigger>
                                <TabsTrigger value="policies" className="rounded-lg px-4 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm gap-1.5">
                                    <Layers size={13} /> Policies ({policyTemplates.length})
                                </TabsTrigger>
                                <TabsTrigger value="validation" className="rounded-lg px-4 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm gap-1.5">
                                    <FileCheck size={13} /> Validation ({settingValidationRules.length})
                                </TabsTrigger>
                                <TabsTrigger value="permissions" className="rounded-lg px-4 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm gap-1.5">
                                    <KeyRound size={13} /> Permissions ({settingsPermissions.length})
                                </TabsTrigger>
                            </TabsList>

                            {/* ── Structure Tab ─────────────── */}
                            <TabsContent value="structure" className="mt-5 space-y-4">
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                    <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 space-y-0">
                                        <div>
                                            <CardTitle className="text-base font-bold text-slate-900">Salary components</CardTitle>
                                            <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                                Global earnings & deductions used across all salary templates.
                                            </CardDescription>
                                        </div>
                                        <Button onClick={openAddComp} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2">
                                            <Plus size={14} /> Add component
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader className="bg-slate-50/70">
                                                    <TableRow className="border-slate-100 hover:bg-transparent">
                                                        <TableHead className="pl-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Component</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Type</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Calculation</TableHead>
                                                        <TableHead className="text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Value</TableHead>
                                                        <TableHead className="text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Taxable</TableHead>
                                                        <TableHead className="text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Statutory</TableHead>
                                                        <TableHead className="text-right pr-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {salaryComponents.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={7} className="text-center py-12 text-slate-400 text-sm font-medium">
                                                                No components yet. Add your first component.
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        <AnimatePresence>
                                                            {salaryComponents.map((comp) => (
                                                                <motion.tr
                                                                    key={comp.id}
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    exit={{ opacity: 0 }}
                                                                    className="border-slate-50 hover:bg-slate-50/70"
                                                                >
                                                                    <TableCell className="pl-6 py-3">
                                                                        <div className="text-sm font-semibold text-slate-900">{comp.name}</div>
                                                                    </TableCell>
                                                                    <TableCell className="py-3">
                                                                        <Badge className={cn("border-none text-[10px] font-semibold px-2",
                                                                            comp.type === "Earning" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
                                                                            {comp.type}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="py-3 text-xs font-medium text-slate-600">{comp.amountType}</TableCell>
                                                                    <TableCell className="py-3 text-right text-sm font-bold text-slate-900 tabular-nums">
                                                                        {comp.amountType === "Fixed" ? formatINR(comp.value) : `${comp.value}%`}
                                                                    </TableCell>
                                                                    <TableCell className="py-3 text-center">
                                                                        {comp.isTaxable ? <CheckCircle2 size={14} className="text-amber-500 mx-auto" /> : <span className="text-slate-300 text-xs">—</span>}
                                                                    </TableCell>
                                                                    <TableCell className="py-3 text-center">
                                                                        {comp.isStatutory ? <CheckCircle2 size={14} className="text-blue-500 mx-auto" /> : <span className="text-slate-300 text-xs">—</span>}
                                                                    </TableCell>
                                                                    <TableCell className="text-right pr-6 py-3">
                                                                        <div className="flex justify-end gap-1">
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Button variant="ghost" size="sm" onClick={() => openEditComp(comp)} className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-[#8B5CF6] hover:bg-slate-100">
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
                                                                                        onClick={() => { setCompDeleteTarget(comp.id); setCompDeleteOpen(true) }}
                                                                                        className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                                                                                    >
                                                                                        <Trash2 size={13} />
                                                                                    </Button>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>Delete</TooltipContent>
                                                                            </Tooltip>
                                                                        </div>
                                                                    </TableCell>
                                                                </motion.tr>
                                                            ))}
                                                        </AnimatePresence>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* ── Statutory Tab ─────────────── */}
                            <TabsContent value="statutory" className="mt-5 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <StatutoryCard
                                        label="Provident Fund (EPF)"
                                        icon={Landmark}
                                        desc="Statutory retirement contribution. 12% of basic is the standard rate."
                                        enabled={statutoryForm.pfEnabled}
                                        rate={statutoryForm.pfRate}
                                        rateLabel="Rate (%)"
                                        color="#8B5CF6"
                                        onEnable={(v) => setStatutoryForm({ ...statutoryForm, pfEnabled: v })}
                                        onRate={(v) => setStatutoryForm({ ...statutoryForm, pfRate: v })}
                                    />
                                    <StatutoryCard
                                        label="ESI"
                                        icon={Activity}
                                        desc="Employee State Insurance. Applies to employees earning ≤ ₹21,000/mo gross."
                                        enabled={statutoryForm.esiEnabled}
                                        rate={statutoryForm.esiRate}
                                        rateLabel="Rate (%)"
                                        color="#EC4899"
                                        onEnable={(v) => setStatutoryForm({ ...statutoryForm, esiEnabled: v })}
                                        onRate={(v) => setStatutoryForm({ ...statutoryForm, esiRate: v })}
                                    />
                                    <StatutoryCard
                                        label="TDS (Income Tax)"
                                        icon={Scale}
                                        desc="Auto-computed from tax declaration and slab rates. Rate not configurable."
                                        enabled={statutoryForm.tdsEnabled}
                                        color="#F59E0B"
                                        onEnable={(v) => setStatutoryForm({ ...statutoryForm, tdsEnabled: v })}
                                    />
                                    <StatutoryCard
                                        label="Professional Tax (PT)"
                                        icon={Building2}
                                        desc="State-level professional tax. Slabs configured per state in your profile."
                                        enabled={statutoryForm.ptEnabled}
                                        color="#10B981"
                                        onEnable={(v) => setStatutoryForm({ ...statutoryForm, ptEnabled: v })}
                                    />
                                </div>

                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 flex items-center justify-between gap-3 flex-wrap">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <AlertCircle size={14} className={cn(statutoryDirty ? "text-amber-600" : "text-emerald-600")} />
                                        <span className="text-xs font-semibold text-slate-700">
                                            {statutoryDirty ? "You have unsaved changes" : "All statutory settings are saved"}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={handleRevertStatutory} disabled={!statutoryDirty} className="h-9 font-semibold text-xs gap-1 border-slate-200">
                                            <Undo2 size={13} /> Revert
                                        </Button>
                                        <Button onClick={handleSaveStatutory} disabled={!statutoryDirty} className="h-9 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg font-bold text-xs border-none gap-1 px-4 disabled:opacity-50">
                                            <Save size={13} /> Save statutory
                                        </Button>
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* ── Cycle Tab ─────────────── */}
                            <TabsContent value="cycle" className="mt-5 space-y-4">
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <CardHeader className="p-4 lg:p-5 border-b border-slate-100">
                                        <CardTitle className="text-base font-bold text-slate-900">Processing cycle</CardTitle>
                                        <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                            Define how payroll cycles open, close, cutoff, and disburse.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 lg:p-5 space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                            <FormField label="Frequency">
                                                <Select value={cycleForm.frequency} onValueChange={(v) => setCycleForm({ ...cycleForm, frequency: v as PayrollCycle["frequency"] })}>
                                                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Monthly">Monthly</SelectItem>
                                                        <SelectItem value="Bi-Weekly">Bi-Weekly</SelectItem>
                                                        <SelectItem value="Weekly">Weekly</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormField>
                                            <FormField label="Cycle start day">
                                                <Select value={String(cycleForm.cycleStart)} onValueChange={(v) => setCycleForm({ ...cycleForm, cycleStart: parseInt(v) })}>
                                                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        {Array.from({ length: 28 }, (_, i) => (
                                                            <SelectItem key={i + 1} value={String(i + 1)}>Day {i + 1}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormField>
                                            <FormField label="Cycle end day">
                                                <Select value={String(cycleForm.cycleEnd)} onValueChange={(v) => setCycleForm({ ...cycleForm, cycleEnd: parseInt(v) })}>
                                                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        {Array.from({ length: 31 }, (_, i) => (
                                                            <SelectItem key={i + 1} value={String(i + 1)}>Day {i + 1}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormField>
                                            <FormField label="Attendance cutoff day">
                                                <Select value={String(cycleForm.cutoffDay)} onValueChange={(v) => setCycleForm({ ...cycleForm, cutoffDay: parseInt(v) })}>
                                                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        {Array.from({ length: 28 }, (_, i) => (
                                                            <SelectItem key={i + 1} value={String(i + 1)}>Day {i + 1}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormField>
                                            <FormField label="Payout day (next month)">
                                                <Select value={String(cycleForm.payoutDay)} onValueChange={(v) => setCycleForm({ ...cycleForm, payoutDay: parseInt(v) })}>
                                                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        {Array.from({ length: 15 }, (_, i) => (
                                                            <SelectItem key={i + 1} value={String(i + 1)}>Day {i + 1}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormField>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                            <div>
                                                <Label className="text-xs font-bold text-slate-700">Allow overlapping cycles</Label>
                                                <p className="text-[11px] font-medium text-slate-500 mt-0.5">E.g. bi-weekly cycles that share days</p>
                                            </div>
                                            <Switch checked={cycleForm.allowOverlap} onCheckedChange={(v) => setCycleForm({ ...cycleForm, allowOverlap: v })} className="data-[state=checked]:bg-[#8B5CF6]" />
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                            <div>
                                                <Label className="text-xs font-bold text-slate-700">Auto-start next cycle</Label>
                                                <p className="text-[11px] font-medium text-slate-500 mt-0.5">Create a Draft pay run automatically on cycle start day</p>
                                            </div>
                                            <Switch checked={cycleForm.autoRunEnabled} onCheckedChange={(v) => setCycleForm({ ...cycleForm, autoRunEnabled: v })} className="data-[state=checked]:bg-[#8B5CF6]" />
                                        </div>

                                        {/* Timeline preview */}
                                        <div className="p-4 bg-gradient-to-br from-[#8B5CF6]/5 to-[#EC4899]/5 border border-[#8B5CF6]/10 rounded-xl space-y-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Clock size={14} className="text-[#8B5CF6]" />
                                                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Cycle timeline preview</span>
                                            </div>
                                            <div className="text-xs font-medium text-slate-700 leading-relaxed">
                                                Cycle opens <strong>day {cycleForm.cycleStart}</strong> of month →
                                                attendance locked on <strong>day {cycleForm.cutoffDay}</strong> →
                                                cycle closes on <strong>day {cycleForm.cycleEnd}</strong> →
                                                salary disbursed on <strong>day {cycleForm.payoutDay}</strong> of next month
                                                ({cycleForm.frequency.toLowerCase()}).
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 flex items-center justify-between gap-3 flex-wrap">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <AlertCircle size={14} className={cn(cycleDirty ? "text-amber-600" : "text-emerald-600")} />
                                        <span className="text-xs font-semibold text-slate-700">
                                            {cycleDirty ? "You have unsaved changes" : "Cycle settings saved"}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={handleRevertCycle} disabled={!cycleDirty} className="h-9 font-semibold text-xs gap-1 border-slate-200">
                                            <Undo2 size={13} /> Revert
                                        </Button>
                                        <Button onClick={handleSaveCycle} disabled={!cycleDirty} className="h-9 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg font-bold text-xs border-none gap-1 px-4 disabled:opacity-50">
                                            <Save size={13} /> Save cycle
                                        </Button>
                                    </div>
                                </Card>
                            </TabsContent>

                            {/* ── Masters Tab (Backend-integrated) ─────────────── */}
                            <TabsContent value="masters" className="mt-5 space-y-4">
                                {/* Departments Section */}
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                    <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 space-y-0">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-violet-100 flex items-center justify-center">
                                                <Building2 className="text-[#8B5CF6]" size={18} />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base font-bold text-slate-900">Departments</CardTitle>
                                                <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                                    Organization departments used across HR & payroll.
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                onClick={fetchDepartments}
                                                disabled={deptLoading}
                                                variant="outline"
                                                className="h-9 px-3 rounded-lg font-bold text-xs border-slate-200 gap-2"
                                            >
                                                <RefreshCw size={13} className={cn(deptLoading && "animate-spin")} /> Refresh
                                            </Button>
                                            <Button onClick={openAddDept} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2">
                                                <Plus size={14} /> Add department
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {deptLoading ? (
                                            <div className="p-10 text-center text-slate-400 text-sm font-semibold">Loading departments...</div>
                                        ) : departments.length === 0 ? (
                                            <div className="p-10 text-center text-slate-400 text-sm font-medium">
                                                No departments yet. Click "Add department" to create one.
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                                                            <TableHead className="text-[11px] font-bold text-slate-600 uppercase">Name</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-600 uppercase">Description</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-600 uppercase">Head</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-600 uppercase text-right">Actions</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {departments.map((d) => (
                                                            <TableRow key={d._id} className="hover:bg-slate-50/60">
                                                                <TableCell className="text-sm font-bold text-slate-900">{d.name}</TableCell>
                                                                <TableCell className="text-sm font-medium text-slate-600">{d.description || "—"}</TableCell>
                                                                <TableCell className="text-sm font-medium text-slate-600">{d.head || "—"}</TableCell>
                                                                <TableCell className="text-right">
                                                                    <div className="inline-flex gap-1">
                                                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-violet-50 hover:text-[#8B5CF6]" onClick={() => openEditDept(d)}>
                                                                            <Edit size={14} />
                                                                        </Button>
                                                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-rose-50 hover:text-rose-600" onClick={() => { setDeptDeleteTarget(d); setDeptDeleteOpen(true) }}>
                                                                            <Trash2 size={14} />
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Positions Section */}
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                    <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 space-y-0">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-violet-100 flex items-center justify-center">
                                                <Briefcase className="text-[#8B5CF6]" size={18} />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base font-bold text-slate-900">Positions</CardTitle>
                                                <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                                    Job titles and levels mapped to departments.
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                onClick={fetchPositions}
                                                disabled={posLoading}
                                                variant="outline"
                                                className="h-9 px-3 rounded-lg font-bold text-xs border-slate-200 gap-2"
                                            >
                                                <RefreshCw size={13} className={cn(posLoading && "animate-spin")} /> Refresh
                                            </Button>
                                            <Button onClick={openAddPos} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2">
                                                <Plus size={14} /> Add position
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {posLoading ? (
                                            <div className="p-10 text-center text-slate-400 text-sm font-semibold">Loading positions...</div>
                                        ) : positions.length === 0 ? (
                                            <div className="p-10 text-center text-slate-400 text-sm font-medium">
                                                No positions yet. Click "Add position" to create one.
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                                                            <TableHead className="text-[11px] font-bold text-slate-600 uppercase">Title</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-600 uppercase">Department</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-600 uppercase">Level</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-600 uppercase text-right">Actions</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {positions.map((p) => {
                                                            const deptName = typeof p.department === "object" ? (p.department?.name || "—") : (departments.find(d => d._id === p.department)?.name || "—")
                                                            return (
                                                                <TableRow key={p._id} className="hover:bg-slate-50/60">
                                                                    <TableCell className="text-sm font-bold text-slate-900">{p.title}</TableCell>
                                                                    <TableCell className="text-sm font-medium text-slate-600">{deptName}</TableCell>
                                                                    <TableCell className="text-sm font-medium text-slate-600">{p.level || "—"}</TableCell>
                                                                    <TableCell className="text-right">
                                                                        <div className="inline-flex gap-1">
                                                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-violet-50 hover:text-[#8B5CF6]" onClick={() => openEditPos(p)}>
                                                                                <Edit size={14} />
                                                                            </Button>
                                                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-rose-50 hover:text-rose-600" onClick={() => { setPosDeleteTarget(p); setPosDeleteOpen(true) }}>
                                                                                <Trash2 size={14} />
                                                                            </Button>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Holidays Section */}
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                    <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 space-y-0">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-violet-100 flex items-center justify-center">
                                                <CalendarDays className="text-[#8B5CF6]" size={18} />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base font-bold text-slate-900">Holidays</CardTitle>
                                                <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                                    Annual company holidays. Filter by year.
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Select value={holidayYear} onValueChange={(v) => setHolidayYear(v)}>
                                                <SelectTrigger className="h-9 w-28 rounded-lg text-xs font-bold border-slate-200">
                                                    <SelectValue placeholder="Year" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="2025">2025</SelectItem>
                                                    <SelectItem value="2026">2026</SelectItem>
                                                    <SelectItem value="2027">2027</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                onClick={() => fetchHolidays(holidayYear)}
                                                disabled={holidayLoading}
                                                variant="outline"
                                                className="h-9 px-3 rounded-lg font-bold text-xs border-slate-200 gap-2"
                                            >
                                                <RefreshCw size={13} className={cn(holidayLoading && "animate-spin")} /> Refresh
                                            </Button>
                                            <Button onClick={openAddHoliday} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2">
                                                <Plus size={14} /> Add holiday
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {holidayLoading ? (
                                            <div className="p-10 text-center text-slate-400 text-sm font-semibold">Loading holidays...</div>
                                        ) : holidays.length === 0 ? (
                                            <div className="p-10 text-center text-slate-400 text-sm font-medium">
                                                No holidays registered for {holidayYear}.
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                                                            <TableHead className="text-[11px] font-bold text-slate-600 uppercase">Date</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-600 uppercase">Name</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-600 uppercase">Type</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-600 uppercase">Paid?</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-600 uppercase text-right">Actions</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {holidays.map((h) => {
                                                            const dateStr = (h.date || "").split("T")[0]
                                                            return (
                                                                <TableRow key={h._id} className="hover:bg-slate-50/60">
                                                                    <TableCell className="text-sm font-bold text-slate-900 tabular-nums">{dateStr}</TableCell>
                                                                    <TableCell className="text-sm font-medium text-slate-700">{h.name}</TableCell>
                                                                    <TableCell>
                                                                        <Badge className={cn(
                                                                            "text-[10px] font-bold rounded-md px-2 py-0.5",
                                                                            h.type === "National"
                                                                                ? "bg-violet-100 text-[#8B5CF6] border-violet-200"
                                                                                : "bg-slate-100 text-slate-700 border-slate-200"
                                                                        )}>
                                                                            {h.type}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {h.isPaid ? (
                                                                            <Badge className="bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-md px-2 py-0.5 border-emerald-200">Paid</Badge>
                                                                        ) : (
                                                                            <Badge className="bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md px-2 py-0.5 border-slate-200">Unpaid</Badge>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        <div className="inline-flex gap-1">
                                                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-violet-50 hover:text-[#8B5CF6]" onClick={() => openEditHoliday(h)}>
                                                                                <Edit size={14} />
                                                                            </Button>
                                                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-rose-50 hover:text-rose-600" onClick={() => { setHolidayDeleteTarget(h); setHolidayDeleteOpen(true) }}>
                                                                                <Trash2 size={14} />
                                                                            </Button>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* ── Bank Tab ─────────────── */}
                            <TabsContent value="bank" className="mt-5 space-y-4">
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                    <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 space-y-0">
                                        <div>
                                            <CardTitle className="text-base font-bold text-slate-900">Bank accounts</CardTitle>
                                            <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                                Company bank accounts used for payroll, reimbursements, and statutory payouts.
                                            </CardDescription>
                                        </div>
                                        <Button onClick={openAddBank} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2">
                                            <Plus size={14} /> Add account
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-4 lg:p-5">
                                        {bankAccounts.length === 0 ? (
                                            <div className="p-12 text-center text-slate-400 text-sm font-medium">
                                                No bank accounts yet. Add one to enable payroll disbursement.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                {bankAccounts.map((b) => (
                                                    <Card
                                                        key={b.id}
                                                        className={cn("rounded-xl border shadow-sm transition-all",
                                                            b.isPrimary ? "border-[#8B5CF6] bg-[#8B5CF6]/5 ring-1 ring-[#8B5CF6]/20" :
                                                                b.isActive ? "border-slate-200 bg-white hover:shadow-md" :
                                                                    "border-slate-100 bg-slate-50/60 opacity-75")}
                                                    >
                                                        <CardContent className="p-4">
                                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                                <div className="flex items-start gap-3 min-w-0">
                                                                    <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                                                                        b.isPrimary ? "bg-[#8B5CF6] text-white" : "bg-slate-100 text-slate-600")}>
                                                                        <Landmark size={18} />
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <div className="flex items-center gap-2 flex-wrap">
                                                                            <h4 className="text-sm font-bold text-slate-900 truncate">{b.bankName}</h4>
                                                                            {b.isPrimary && (
                                                                                <Badge className="bg-[#8B5CF6] text-white border-none text-[9px] font-bold px-1.5 gap-1">
                                                                                    <Star size={9} /> Primary
                                                                                </Badge>
                                                                            )}
                                                                            <Badge className={cn("border-none text-[9px] font-semibold px-1.5",
                                                                                b.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500")}>
                                                                                {b.isActive ? "Active" : "Inactive"}
                                                                            </Badge>
                                                                        </div>
                                                                        <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">{b.accountName}</p>
                                                                    </div>
                                                                </div>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-slate-700">
                                                                            <MoreHorizontal size={15} />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end" className="w-44">
                                                                        <DropdownMenuItem onClick={() => openEditBank(b)} className="cursor-pointer text-xs font-medium">
                                                                            <Edit size={13} className="mr-2" /> Edit
                                                                        </DropdownMenuItem>
                                                                        {!b.isPrimary && b.isActive && (
                                                                            <DropdownMenuItem onClick={() => handleSetPrimary(b)} className="cursor-pointer text-xs font-medium">
                                                                                <Star size={13} className="mr-2" /> Set as primary
                                                                            </DropdownMenuItem>
                                                                        )}
                                                                        <DropdownMenuItem onClick={() => handleToggleBankActive(b)} className="cursor-pointer text-xs font-medium">
                                                                            {b.isActive ? "Deactivate" : "Activate"}
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem
                                                                            onClick={() => { setBankDeleteTarget(b.id); setBankDeleteOpen(true) }}
                                                                            className="cursor-pointer text-xs font-medium text-rose-600 focus:text-rose-600"
                                                                        >
                                                                            <Trash2 size={13} className="mr-2" /> Delete
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2 mb-3">
                                                                <StatBox label="Account #" value={b.accountNumber} mono />
                                                                <StatBox label="IFSC" value={b.ifsc} mono />
                                                                <StatBox label="Type" value={b.accountType} />
                                                                <StatBox label="Purpose" value={b.purpose} />
                                                            </div>
                                                            {b.branch && (
                                                                <div className="text-[10px] font-medium text-slate-500 mb-2">📍 {b.branch}</div>
                                                            )}
                                                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                                                <div className="text-[10px] font-medium text-slate-500">Added {b.addedDate}</div>
                                                                <div className="text-sm font-bold text-slate-900 tabular-nums">{formatINR(b.balance ?? 0)}</div>
                                                            </div>
                                                            {b.notes && (
                                                                <div className="text-[11px] font-medium text-slate-600 italic mt-2 pt-2 border-t border-slate-100">
                                                                    {b.notes}
                                                                </div>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* ── Audit Tab ─────────────── */}
                            <TabsContent value="audit" className="mt-5 space-y-4">
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                    <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 space-y-0">
                                        <div>
                                            <CardTitle className="text-base font-bold text-slate-900">Settings audit log</CardTitle>
                                            <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                                Every config change tracked with actor, area, and timestamp. Last 100 entries.
                                            </CardDescription>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                variant="outline"
                                                onClick={handleExportAudit}
                                                className="h-9 rounded-lg border-slate-200 font-semibold text-xs gap-2 px-3"
                                            >
                                                <Download size={13} /> Export
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setClearAuditOpen(true)}
                                                disabled={!settingsAuditLog.length}
                                                className="h-9 rounded-lg border-rose-200 text-rose-600 font-semibold text-xs gap-2 px-3 hover:bg-rose-50 disabled:opacity-50"
                                            >
                                                <Trash2 size={13} /> Clear log
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <ScrollArea className="h-[500px]">
                                            {settingsAuditLog.length === 0 ? (
                                                <div className="p-12 text-center text-slate-400 text-sm font-medium">
                                                    No audit entries. Changes will appear here.
                                                </div>
                                            ) : (
                                                <div className="p-4 space-y-2">
                                                    {settingsAuditLog.map((entry) => (
                                                        <div key={entry.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50/60 border border-slate-100 hover:bg-slate-50">
                                                            <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                                                                entry.area === "Components" ? "bg-[#8B5CF6]/10 text-[#8B5CF6]" :
                                                                    entry.area === "Statutory" ? "bg-emerald-50 text-emerald-600" :
                                                                        entry.area === "Cycle" ? "bg-blue-50 text-blue-600" :
                                                                            entry.area === "Bank" ? "bg-amber-50 text-amber-600" :
                                                                                "bg-slate-100 text-slate-500")}>
                                                                {entry.area === "Components" ? <Scale size={14} /> :
                                                                    entry.area === "Statutory" ? <ShieldCheck size={14} /> :
                                                                        entry.area === "Cycle" ? <Calendar size={14} /> :
                                                                            entry.area === "Bank" ? <Banknote size={14} /> :
                                                                                <Settings size={14} />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                                                    <Badge className="bg-white text-slate-600 border border-slate-200 text-[9px] font-bold px-1.5">
                                                                        {entry.area}
                                                                    </Badge>
                                                                    <span className="text-xs font-bold text-slate-800">{entry.action}</span>
                                                                </div>
                                                                <p className="text-[11px] font-medium text-slate-600 leading-snug">{entry.details}</p>
                                                                <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-400">
                                                                    <div className="flex items-center gap-1">
                                                                        <User size={10} /> {entry.actor}
                                                                    </div>
                                                                    <span>•</span>
                                                                    <span>{new Date(entry.timestamp).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* ── Snapshots Tab ─────────────── */}
                            <TabsContent value="snapshots" className="mt-5 space-y-4">
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 space-y-0">
                                        <div>
                                            <CardTitle className="text-base font-bold text-slate-900">Settings snapshots</CardTitle>
                                            <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                                Point-in-time captures of statutory + cycle settings. Restore anytime.
                                            </CardDescription>
                                        </div>
                                        <Button onClick={openCaptureDialog} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2">
                                            <Plus size={14} /> New snapshot
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-4 lg:p-5">
                                        {settingsSnapshots.length === 0 ? (
                                            <div className="p-12 text-center text-slate-400 text-sm font-medium">
                                                No snapshots yet. Capture one to bookmark current settings.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {settingsSnapshots.map((s) => (
                                                    <Card key={s.id} className="rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all">
                                                        <CardContent className="p-4">
                                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                                <div className="flex items-start gap-2 min-w-0">
                                                                    <div className="h-9 w-9 bg-[#8B5CF6]/10 rounded-lg flex items-center justify-center text-[#8B5CF6] shrink-0">
                                                                        <Camera size={16} />
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <h4 className="text-sm font-bold text-slate-900 truncate">{s.name}</h4>
                                                                        <p className="text-[10px] font-medium text-slate-500">{s.capturedDate} • {s.capturedBy}</p>
                                                                    </div>
                                                                </div>
                                                                {s.isLocked && (
                                                                    <Badge className="bg-amber-50 text-amber-600 border-none text-[9px] font-bold px-1.5 gap-1">
                                                                        <Lock size={9} /> Locked
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            {s.description && (
                                                                <p className="text-[11px] font-medium text-slate-600 mb-2 line-clamp-2">{s.description}</p>
                                                            )}
                                                            <div className="grid grid-cols-2 gap-2 mb-3">
                                                                <StatBox label="PF" value={`${s.statutorySettings.pfRate}% ${s.statutorySettings.pfEnabled ? "on" : "off"}`} />
                                                                <StatBox label="ESI" value={`${s.statutorySettings.esiRate}% ${s.statutorySettings.esiEnabled ? "on" : "off"}`} />
                                                                <StatBox label="Payout" value={`Day ${s.payrollCycle.payoutDay}`} />
                                                                <StatBox label="Freq" value={s.payrollCycle.frequency} />
                                                            </div>
                                                            {s.reason && (
                                                                <p className="text-[10px] font-medium text-slate-500 italic mb-2">Reason: {s.reason}</p>
                                                            )}
                                                            <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100">
                                                                <Button variant="outline" size="sm" onClick={() => openSnapshotDetail(s)} className="h-7 text-[10px] font-semibold gap-1 border-slate-200">
                                                                    <Eye size={11} /> View
                                                                </Button>
                                                                <Button variant="outline" size="sm" onClick={() => { setActiveSnapshot(s); setSnapshotRestoreConfirm(true) }} className="h-7 text-[10px] font-semibold gap-1 border-slate-200">
                                                                    <RefreshCw size={11} /> Restore
                                                                </Button>
                                                                <Button variant="outline" size="sm" onClick={() => handleToggleSnapshotLock(s)} className="h-7 text-[10px] font-semibold gap-1 border-slate-200">
                                                                    {s.isLocked ? <><Unlock size={11} /> Unlock</> : <><Lock size={11} /> Lock</>}
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    disabled={s.isLocked}
                                                                    onClick={() => { setSnapshotDeleteTarget(s); setSnapshotDeleteOpen(true) }}
                                                                    className="h-7 text-[10px] font-semibold gap-1 border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-40"
                                                                >
                                                                    <Trash2 size={11} /> Delete
                                                                </Button>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* ── Policies Tab ─────────────── */}
                            <TabsContent value="policies" className="mt-5 space-y-4">
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 space-y-0">
                                        <div>
                                            <CardTitle className="text-base font-bold text-slate-900">Policy templates</CardTitle>
                                            <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                                Reusable setting bundles for different company sizes. Apply to replace current.
                                            </CardDescription>
                                        </div>
                                        <Button onClick={openAddPolicy} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2">
                                            <Plus size={14} /> New policy template
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-4 lg:p-5">
                                        {policyTemplates.length === 0 ? (
                                            <div className="p-12 text-center text-slate-400 text-sm font-medium">
                                                No policy templates yet.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {policyTemplates.map((p) => (
                                                    <Card key={p.id} className="rounded-xl border border-slate-200 bg-white hover:shadow-md transition-all">
                                                        <CardContent className="p-4">
                                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                                <div className="min-w-0 flex-1">
                                                                    <h4 className="text-sm font-bold text-slate-900 truncate">{p.name}</h4>
                                                                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                                                        <Badge className={cn("border-none text-[9px] font-bold px-1.5",
                                                                            p.category === "Small Business" ? "bg-emerald-50 text-emerald-600" :
                                                                                p.category === "Mid-Market" ? "bg-violet-50 text-violet-600" :
                                                                                    p.category === "Enterprise" ? "bg-indigo-50 text-indigo-600" :
                                                                                        "bg-slate-100 text-slate-600")}>
                                                                            {p.category}
                                                                        </Badge>
                                                                        <span className="text-[10px] font-medium text-slate-500">Used {p.usageCount}x</span>
                                                                    </div>
                                                                </div>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg text-slate-400 hover:text-slate-700">
                                                                            <MoreHorizontal size={14} />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end" className="w-44">
                                                                        <DropdownMenuItem onClick={() => openEditPolicy(p)} className="cursor-pointer text-xs font-medium">
                                                                            <Edit size={13} className="mr-2" /> Edit
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => handleDuplicatePolicy(p)} className="cursor-pointer text-xs font-medium">
                                                                            <Copy size={13} className="mr-2" /> Duplicate
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem onClick={() => { setPolicyDeleteTarget(p); setPolicyDeleteOpen(true) }} className="cursor-pointer text-xs font-medium text-rose-600 focus:text-rose-600">
                                                                            <Trash2 size={13} className="mr-2" /> Delete
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                            {p.description && (
                                                                <p className="text-[11px] font-medium text-slate-600 mb-3 line-clamp-2">{p.description}</p>
                                                            )}
                                                            <div className="space-y-2 mb-3">
                                                                {p.statutoryOverride && (
                                                                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                                                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Statutory</div>
                                                                        <div className="text-[10px] font-medium text-slate-700 flex flex-wrap gap-x-2 gap-y-0.5">
                                                                            {p.statutoryOverride.pfEnabled !== undefined && <span>PF: {p.statutoryOverride.pfRate ?? "-"}%</span>}
                                                                            {p.statutoryOverride.esiEnabled !== undefined && <span>ESI: {p.statutoryOverride.esiRate ?? "-"}%</span>}
                                                                            {p.statutoryOverride.tdsEnabled !== undefined && <span>TDS: {p.statutoryOverride.tdsEnabled ? "on" : "off"}</span>}
                                                                            {p.statutoryOverride.ptEnabled !== undefined && <span>PT: {p.statutoryOverride.ptEnabled ? "on" : "off"}</span>}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                                {p.cycleOverride && (
                                                                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                                                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cycle</div>
                                                                        <div className="text-[10px] font-medium text-slate-700 flex flex-wrap gap-x-2 gap-y-0.5">
                                                                            {p.cycleOverride.frequency && <span>{p.cycleOverride.frequency}</span>}
                                                                            {p.cycleOverride.payoutDay !== undefined && <span>Payout: Day {p.cycleOverride.payoutDay}</span>}
                                                                            {p.cycleOverride.cutoffDay !== undefined && <span>Cutoff: Day {p.cycleOverride.cutoffDay}</span>}
                                                                            {p.cycleOverride.autoRunEnabled !== undefined && <span>Auto: {p.cycleOverride.autoRunEnabled ? "on" : "off"}</span>}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                                                <div className="text-[10px] font-medium text-slate-500">
                                                                    {p.lastAppliedDate ? `Last: ${p.lastAppliedDate}` : "Never applied"}
                                                                </div>
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => { setApplyPolicyTarget(p); setApplyPolicyOpen(true) }}
                                                                    className="h-7 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white text-[10px] font-bold gap-1"
                                                                >
                                                                    <Zap size={11} /> Apply
                                                                </Button>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* ── Validation Tab ─────────────── */}
                            <TabsContent value="validation" className="mt-5 space-y-4">
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 space-y-0">
                                        <div>
                                            <CardTitle className="text-base font-bold text-slate-900">Validation rules</CardTitle>
                                            <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                                Guardrails applied to statutory + cycle settings.
                                            </CardDescription>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Button variant="outline" onClick={handleRunValidationInline} className="h-9 rounded-lg border-slate-200 font-semibold text-xs gap-2 px-3">
                                                <ShieldCheck size={13} /> Run validation now
                                            </Button>
                                            <Button onClick={openAddRule} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2">
                                                <Plus size={14} /> Add rule
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {settingValidationRules.length === 0 ? (
                                            <div className="p-12 text-center text-slate-400 text-sm font-medium">
                                                No validation rules defined.
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader className="bg-slate-50/70">
                                                        <TableRow className="border-slate-100 hover:bg-transparent">
                                                            <TableHead className="pl-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Setting</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Operator</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Thresholds</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Severity</TableHead>
                                                            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Message</TableHead>
                                                            <TableHead className="text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Active</TableHead>
                                                            <TableHead className="text-right pr-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Actions</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {settingValidationRules.map((r) => (
                                                            <TableRow key={r.id} className="border-slate-50 hover:bg-slate-50/70">
                                                                <TableCell className="pl-6 py-3">
                                                                    <div className="text-sm font-semibold text-slate-900">{r.label}</div>
                                                                    <div className="text-[10px] font-mono text-slate-500">{r.settingKey}</div>
                                                                </TableCell>
                                                                <TableCell className="py-3 text-xs font-medium text-slate-600">{r.operator}</TableCell>
                                                                <TableCell className="py-3 text-xs font-medium text-slate-700 tabular-nums">
                                                                    {r.operator === "range" ? `${r.minValue ?? "-"} → ${r.maxValue ?? "-"}` :
                                                                        r.operator === "min" ? `≥ ${r.minValue ?? "-"}` :
                                                                            r.operator === "max" ? `≤ ${r.maxValue ?? "-"}` :
                                                                                (r.allowedValues ?? []).join(", ")}
                                                                </TableCell>
                                                                <TableCell className="py-3">
                                                                    <Badge className={cn("border-none text-[10px] font-semibold px-2 gap-1",
                                                                        r.severity === "error" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600")}>
                                                                        {r.severity === "error" ? <AlertTriangle size={10} /> : <AlertCircle size={10} />}
                                                                        {r.severity}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="py-3 text-xs font-medium text-slate-600 max-w-[240px] truncate" title={r.message}>{r.message}</TableCell>
                                                                <TableCell className="py-3 text-center">
                                                                    <Switch
                                                                        checked={r.active}
                                                                        onCheckedChange={(v) => updateSettingValidationRule(r.id, { active: v })}
                                                                        className="data-[state=checked]:bg-[#8B5CF6]"
                                                                    />
                                                                </TableCell>
                                                                <TableCell className="text-right pr-6 py-3">
                                                                    <div className="flex justify-end gap-1">
                                                                        <Button variant="ghost" size="sm" onClick={() => openEditRule(r)} className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-[#8B5CF6] hover:bg-slate-100">
                                                                            <Edit size={13} />
                                                                        </Button>
                                                                        <Button variant="ghost" size="sm" onClick={() => { setRuleDeleteTarget(r); setRuleDeleteOpen(true) }} className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50">
                                                                            <Trash2 size={13} />
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Inline results */}
                                {validationResult.issues.length > 0 && (
                                    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                        <CardHeader className="p-4 border-b border-slate-100">
                                            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                                <AlertTriangle size={14} className="text-amber-500" />
                                                Latest issues ({validationResult.issues.length})
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 space-y-2">
                                            {validationResult.issues.map((i, idx) => (
                                                <div key={`${i.ruleId}-${idx}`} className={cn("flex items-start gap-3 p-3 rounded-lg border",
                                                    i.severity === "error" ? "bg-rose-50/60 border-rose-100" : "bg-amber-50/60 border-amber-100")}>
                                                    <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                                                        i.severity === "error" ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600")}>
                                                        {i.severity === "error" ? <AlertTriangle size={14} /> : <AlertCircle size={14} />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-xs font-bold text-slate-800">{i.settingKey}: <span className="font-mono">{i.currentValue}</span></div>
                                                        <p className="text-[11px] font-medium text-slate-600 mt-0.5">{i.message}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            {/* ── Permissions Tab ─────────────── */}
                            <TabsContent value="permissions" className="mt-5 space-y-4">
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <CardHeader className="p-4 lg:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 space-y-0">
                                        <div>
                                            <CardTitle className="text-base font-bold text-slate-900">Role permissions</CardTitle>
                                            <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                                Matrix: who can view, edit, approve changes for each settings scope.
                                            </CardDescription>
                                        </div>
                                        <Button onClick={openAddPerm} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2">
                                            <Plus size={14} /> Add role permission
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {permissionMatrix.roles.length === 0 ? (
                                            <div className="p-12 text-center text-slate-400 text-sm font-medium">
                                                No permissions configured.
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader className="bg-slate-50/70">
                                                        <TableRow className="border-slate-100 hover:bg-transparent">
                                                            <TableHead className="pl-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Role</TableHead>
                                                            {permissionMatrix.scopes.map(s => (
                                                                <TableHead key={s} className="text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">{s}</TableHead>
                                                            ))}
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {permissionMatrix.roles.map(role => (
                                                            <TableRow key={role} className="border-slate-50 hover:bg-slate-50/70">
                                                                <TableCell className="pl-6 py-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="h-7 w-7 bg-[#8B5CF6]/10 rounded-lg flex items-center justify-center text-[#8B5CF6]">
                                                                            <Users size={13} />
                                                                        </div>
                                                                        <span className="text-sm font-bold text-slate-900">{role}</span>
                                                                    </div>
                                                                </TableCell>
                                                                {permissionMatrix.scopes.map(scope => {
                                                                    const perm = permissionMatrix.map[role][scope]
                                                                    return (
                                                                        <TableCell key={scope} className="py-3 text-center">
                                                                            {perm ? (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => openEditPerm(perm)}
                                                                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                                                                                >
                                                                                    {perm.canView && <Eye size={12} className="text-slate-500" />}
                                                                                    {perm.canEdit && <Pencil size={12} className="text-[#8B5CF6]" />}
                                                                                    {perm.canApprove && <CheckCircle2 size={12} className="text-emerald-600" />}
                                                                                    {!perm.canView && !perm.canEdit && !perm.canApprove && <span className="text-[10px] text-slate-400">—</span>}
                                                                                </button>
                                                                            ) : (
                                                                                <span className="text-slate-300 text-xs">—</span>
                                                                            )}
                                                                        </TableCell>
                                                                    )
                                                                })}
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Legend */}
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
                                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium text-slate-600">
                                        <div className="flex items-center gap-1.5"><Eye size={12} className="text-slate-500" /> View</div>
                                        <div className="flex items-center gap-1.5"><Pencil size={12} className="text-[#8B5CF6]" /> Edit</div>
                                        <div className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-600" /> Approve</div>
                                        <div className="ml-auto text-[10px] text-slate-500">Click any cell to edit the permission row.</div>
                                    </div>
                                </Card>

                                {/* Row list for delete */}
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                                    <CardHeader className="p-4 border-b border-slate-100">
                                        <CardTitle className="text-sm font-bold text-slate-900">All permission rows</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader className="bg-slate-50/70">
                                                    <TableRow className="border-slate-100 hover:bg-transparent">
                                                        <TableHead className="pl-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Role</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Scope</TableHead>
                                                        <TableHead className="text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">View</TableHead>
                                                        <TableHead className="text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Edit</TableHead>
                                                        <TableHead className="text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Approve</TableHead>
                                                        <TableHead className="text-right pr-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {settingsPermissions.map(p => (
                                                        <TableRow key={p.id} className="border-slate-50 hover:bg-slate-50/70">
                                                            <TableCell className="pl-6 py-3 text-sm font-semibold text-slate-900">{p.role}</TableCell>
                                                            <TableCell className="py-3 text-xs font-medium text-slate-600">{p.scope}</TableCell>
                                                            <TableCell className="py-3 text-center">{p.canView ? <Check size={14} className="text-emerald-500 mx-auto" /> : <span className="text-slate-300 text-xs">—</span>}</TableCell>
                                                            <TableCell className="py-3 text-center">{p.canEdit ? <Check size={14} className="text-[#8B5CF6] mx-auto" /> : <span className="text-slate-300 text-xs">—</span>}</TableCell>
                                                            <TableCell className="py-3 text-center">{p.canApprove ? <Check size={14} className="text-amber-500 mx-auto" /> : <span className="text-slate-300 text-xs">—</span>}</TableCell>
                                                            <TableCell className="text-right pr-6 py-3">
                                                                <div className="flex justify-end gap-1">
                                                                    <Button variant="ghost" size="sm" onClick={() => openEditPerm(p)} className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-[#8B5CF6] hover:bg-slate-100">
                                                                        <Edit size={13} />
                                                                    </Button>
                                                                    <Button variant="ghost" size="sm" onClick={() => { setPermDeleteTarget(p); setPermDeleteOpen(true) }} className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50">
                                                                        <Trash2 size={13} />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {/* ── Component Dialog ───────────── */}
                <Dialog open={compFormOpen} onOpenChange={setCompFormOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                {editingComp ? <Edit size={20} /> : <Plus size={20} />}
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                {editingComp ? "Edit component" : "New component"}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Used across all salary templates and pay runs.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <FormField label="Name" required>
                                <Input value={compForm.name} onChange={(e) => setCompForm({ ...compForm, name: e.target.value })} className="h-10 text-sm font-medium" placeholder="e.g. Special Allowance" />
                            </FormField>
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Type" required>
                                    <Select value={compForm.type} onValueChange={(v) => setCompForm({ ...compForm, type: v as SalaryComponent["type"] })}>
                                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Earning">Earning</SelectItem>
                                            <SelectItem value="Deduction">Deduction</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="Calculation">
                                    <Select value={compForm.amountType} onValueChange={(v) => setCompForm({ ...compForm, amountType: v as SalaryComponent["amountType"] })}>
                                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Fixed">Fixed amount</SelectItem>
                                            <SelectItem value="Percentage of Basic">% of Basic</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>
                            </div>
                            <FormField label={compForm.amountType === "Fixed" ? "Default amount (₹/month)" : "Default rate (%)"}>
                                <Input type="number" value={compForm.value} onChange={(e) => setCompForm({ ...compForm, value: parseFloat(e.target.value) || 0 })} className="h-10 text-sm font-semibold tabular-nums" />
                            </FormField>
                            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                <div>
                                    <Label className="text-xs font-bold text-slate-700">Taxable</Label>
                                    <p className="text-[10px] font-medium text-slate-500 mt-0.5">Adds to taxable income</p>
                                </div>
                                <Switch checked={compForm.isTaxable} onCheckedChange={(v) => setCompForm({ ...compForm, isTaxable: v })} className="data-[state=checked]:bg-[#8B5CF6]" />
                            </div>
                            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                <div>
                                    <Label className="text-xs font-bold text-slate-700">Statutory</Label>
                                    <p className="text-[10px] font-medium text-slate-500 mt-0.5">Required by law</p>
                                </div>
                                <Switch checked={compForm.isStatutory} onCheckedChange={(v) => setCompForm({ ...compForm, isStatutory: v })} className="data-[state=checked]:bg-[#8B5CF6]" />
                            </div>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setCompFormOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleSaveComp} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                {editingComp ? "Save" : "Add component"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Component Delete Confirm ───────── */}
                <Dialog open={compDeleteOpen} onOpenChange={setCompDeleteOpen}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Trash2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Delete component?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">This may impact existing salary templates.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setCompDeleteOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleConfirmDeleteComp} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Bank Dialog ───────────── */}
                <Dialog open={bankFormOpen} onOpenChange={setBankFormOpen}>
                    <DialogContent className="max-w-xl bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <Banknote size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                {editingBank ? "Edit bank account" : "Add bank account"}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Company account used for disbursement or statutory payouts.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Bank name" required>
                                    <Input value={bankForm.bankName} onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })} className="h-10 text-sm font-medium" placeholder="HDFC Bank" />
                                </FormField>
                                <FormField label="Account type">
                                    <Select value={bankForm.accountType} onValueChange={(v) => setBankForm({ ...bankForm, accountType: v as BankAccount["accountType"] })}>
                                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Current">Current</SelectItem>
                                            <SelectItem value="Savings">Savings</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>
                            </div>
                            <FormField label="Account holder name" required>
                                <Input value={bankForm.accountName} onChange={(e) => setBankForm({ ...bankForm, accountName: e.target.value })} className="h-10 text-sm font-medium" placeholder="Fixl Solutions Pvt. Ltd." />
                            </FormField>
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Account number" required>
                                    <Input value={bankForm.accountNumber} onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })} className="h-10 text-sm font-mono" />
                                </FormField>
                                <FormField label="IFSC code" required>
                                    <Input value={bankForm.ifsc} onChange={(e) => setBankForm({ ...bankForm, ifsc: e.target.value.toUpperCase() })} className="h-10 text-sm font-mono font-semibold" maxLength={11} />
                                </FormField>
                                <FormField label="Branch">
                                    <Input value={bankForm.branch ?? ""} onChange={(e) => setBankForm({ ...bankForm, branch: e.target.value })} className="h-10 text-sm font-medium" placeholder="Whitefield, Bangalore" />
                                </FormField>
                                <FormField label="Purpose" required>
                                    <Select value={bankForm.purpose} onValueChange={(v) => setBankForm({ ...bankForm, purpose: v as BankAccount["purpose"] })}>
                                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {BANK_ACCOUNT_PURPOSES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="Current balance (₹)">
                                    <Input type="number" value={bankForm.balance ?? 0} onChange={(e) => setBankForm({ ...bankForm, balance: parseFloat(e.target.value) || 0 })} className="h-10 text-sm font-semibold tabular-nums" />
                                </FormField>
                                <FormField label="Added date">
                                    <Input type="date" value={bankForm.addedDate} onChange={(e) => setBankForm({ ...bankForm, addedDate: e.target.value })} className="h-10 text-sm font-medium" />
                                </FormField>
                            </div>
                            <FormField label="Notes">
                                <Textarea value={bankForm.notes ?? ""} onChange={(e) => setBankForm({ ...bankForm, notes: e.target.value })} className="min-h-[50px] text-xs font-medium" placeholder="E.g. NEFT/RTGS enabled, contact details..." />
                            </FormField>
                            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                <div>
                                    <Label className="text-xs font-bold text-slate-700">Primary account</Label>
                                    <p className="text-[10px] font-medium text-slate-500 mt-0.5">Default for salary disbursement</p>
                                </div>
                                <Switch checked={bankForm.isPrimary} onCheckedChange={(v) => setBankForm({ ...bankForm, isPrimary: v })} className="data-[state=checked]:bg-[#8B5CF6]" />
                            </div>
                            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                <div>
                                    <Label className="text-xs font-bold text-slate-700">Active</Label>
                                    <p className="text-[10px] font-medium text-slate-500 mt-0.5">Available for use</p>
                                </div>
                                <Switch checked={bankForm.isActive} onCheckedChange={(v) => setBankForm({ ...bankForm, isActive: v })} className="data-[state=checked]:bg-[#8B5CF6]" />
                            </div>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setBankFormOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleSaveBank} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                {editingBank ? "Save" : "Add account"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Bank Delete Confirm ───────── */}
                <Dialog open={bankDeleteOpen} onOpenChange={setBankDeleteOpen}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Trash2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Delete bank account?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Primary accounts cannot be deleted. Set another account as primary first.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setBankDeleteOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleConfirmDeleteBank} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Clear Audit Confirm ───────── */}
                <Dialog open={clearAuditOpen} onOpenChange={setClearAuditOpen}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Trash2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Clear audit log?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                All {settingsAuditLog.length} entries will be deleted. Export first if you need a copy.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setClearAuditOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleClearAudit} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">Clear all</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Capture Snapshot Dialog ─────── */}
                <Dialog open={captureOpen} onOpenChange={setCaptureOpen}>
                    <DialogContent className="max-w-lg bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <Camera size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Capture settings snapshot</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Save the current statutory + cycle settings for future restore.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <FormField label="Snapshot name" required>
                                <Input value={captureForm.name} onChange={(e) => setCaptureForm({ ...captureForm, name: e.target.value })} className="h-10 text-sm font-medium" placeholder="e.g. Pre-FY close snapshot" />
                            </FormField>
                            <FormField label="Description">
                                <Textarea value={captureForm.description} onChange={(e) => setCaptureForm({ ...captureForm, description: e.target.value })} className="min-h-[60px] text-xs font-medium" placeholder="Optional context" />
                            </FormField>
                            <FormField label="Reason">
                                <Textarea value={captureForm.reason} onChange={(e) => setCaptureForm({ ...captureForm, reason: e.target.value })} className="min-h-[50px] text-xs font-medium" placeholder="Why are you capturing this?" />
                            </FormField>
                            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current state preview</div>
                                <div className="grid grid-cols-2 gap-2">
                                    <StatBox label="PF" value={`${statutorySettings.pfRate}% ${statutorySettings.pfEnabled ? "on" : "off"}`} />
                                    <StatBox label="ESI" value={`${statutorySettings.esiRate}% ${statutorySettings.esiEnabled ? "on" : "off"}`} />
                                    <StatBox label="TDS" value={statutorySettings.tdsEnabled ? "on" : "off"} />
                                    <StatBox label="PT" value={statutorySettings.ptEnabled ? "on" : "off"} />
                                    <StatBox label="Frequency" value={payrollCycle.frequency} />
                                    <StatBox label="Payout day" value={`Day ${payrollCycle.payoutDay}`} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setCaptureOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleCaptureSnapshot} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none gap-1">
                                <Camera size={13} /> Capture
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Snapshot Detail / Compare Dialog ─────── */}
                <Dialog open={snapshotDetailOpen} onOpenChange={setSnapshotDetailOpen}>
                    <DialogContent className="max-w-3xl bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <Eye size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                {activeSnapshot?.name ?? "Snapshot"}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Compare current settings with this snapshot.
                            </DialogDescription>
                        </DialogHeader>
                        {activeSnapshot && (
                            <div className="mt-4 space-y-3">
                                <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-500">
                                    <span>Captured {activeSnapshot.capturedDate} by {activeSnapshot.capturedBy}</span>
                                    {activeSnapshot.isLocked && (
                                        <Badge className="bg-amber-50 text-amber-600 border-none text-[9px] font-bold px-1.5 gap-1">
                                            <Lock size={9} /> Locked
                                        </Badge>
                                    )}
                                </div>
                                <ScrollArea className="max-h-[420px]">
                                    <div className="space-y-2 pr-2">
                                        {(() => {
                                            const rows: { label: string; current: string; snap: string }[] = [
                                                { label: "PF enabled", current: String(statutorySettings.pfEnabled), snap: String(activeSnapshot.statutorySettings.pfEnabled) },
                                                { label: "PF rate", current: `${statutorySettings.pfRate}%`, snap: `${activeSnapshot.statutorySettings.pfRate}%` },
                                                { label: "ESI enabled", current: String(statutorySettings.esiEnabled), snap: String(activeSnapshot.statutorySettings.esiEnabled) },
                                                { label: "ESI rate", current: `${statutorySettings.esiRate}%`, snap: `${activeSnapshot.statutorySettings.esiRate}%` },
                                                { label: "TDS enabled", current: String(statutorySettings.tdsEnabled), snap: String(activeSnapshot.statutorySettings.tdsEnabled) },
                                                { label: "PT enabled", current: String(statutorySettings.ptEnabled), snap: String(activeSnapshot.statutorySettings.ptEnabled) },
                                                { label: "Frequency", current: payrollCycle.frequency, snap: activeSnapshot.payrollCycle.frequency },
                                                { label: "Cycle start", current: `Day ${payrollCycle.cycleStart}`, snap: `Day ${activeSnapshot.payrollCycle.cycleStart}` },
                                                { label: "Cycle end", current: `Day ${payrollCycle.cycleEnd}`, snap: `Day ${activeSnapshot.payrollCycle.cycleEnd}` },
                                                { label: "Cutoff day", current: `Day ${payrollCycle.cutoffDay}`, snap: `Day ${activeSnapshot.payrollCycle.cutoffDay}` },
                                                { label: "Payout day", current: `Day ${payrollCycle.payoutDay}`, snap: `Day ${activeSnapshot.payrollCycle.payoutDay}` },
                                                { label: "Auto-run", current: String(payrollCycle.autoRunEnabled), snap: String(activeSnapshot.payrollCycle.autoRunEnabled) },
                                            ]
                                            return rows.map(r => {
                                                const diff = r.current !== r.snap
                                                return (
                                                    <div key={r.label} className={cn("grid grid-cols-3 gap-3 p-2 rounded-lg border",
                                                        diff ? "bg-amber-50/60 border-amber-100" : "bg-slate-50/50 border-slate-100")}>
                                                        <div className="text-xs font-semibold text-slate-700">{r.label}</div>
                                                        <div className={cn("text-xs font-medium tabular-nums", diff ? "text-slate-900 font-bold" : "text-slate-600")}>
                                                            <span className="text-[9px] text-slate-400 mr-1 uppercase">Current</span> {r.current}
                                                        </div>
                                                        <div className={cn("text-xs font-medium tabular-nums", diff ? "text-amber-700 font-bold" : "text-slate-600")}>
                                                            <span className="text-[9px] text-slate-400 mr-1 uppercase">Snap</span> {r.snap}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        })()}
                                    </div>
                                </ScrollArea>
                            </div>
                        )}
                        <DialogFooter className="mt-4 gap-2 flex-wrap">
                            {activeSnapshot && (
                                <Button variant="outline" onClick={() => handleToggleSnapshotLock(activeSnapshot)} className="h-10 font-semibold text-xs gap-1 border-slate-200">
                                    {activeSnapshot.isLocked ? <><Unlock size={13} /> Unlock</> : <><Lock size={13} /> Lock</>}
                                </Button>
                            )}
                            <Button variant="ghost" onClick={() => setSnapshotDetailOpen(false)} className="h-10 font-semibold text-xs">Close</Button>
                            <Button onClick={() => setSnapshotRestoreConfirm(true)} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none gap-1">
                                <RefreshCw size={13} /> Restore from this snapshot
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Snapshot Restore Confirm ────── */}
                <Dialog open={snapshotRestoreConfirm} onOpenChange={setSnapshotRestoreConfirm}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-2">
                                <RefreshCw size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Restore snapshot?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                This will overwrite your current statutory + cycle settings with the snapshot values.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setSnapshotRestoreConfirm(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleRestoreSnapshot} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none">Restore</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Snapshot Delete Confirm ─────── */}
                <Dialog open={snapshotDeleteOpen} onOpenChange={setSnapshotDeleteOpen}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Trash2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Delete snapshot?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                This cannot be undone. Locked snapshots must be unlocked first.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setSnapshotDeleteOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleDeleteSnapshot} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Policy Template Form Dialog ─────── */}
                <Dialog open={policyFormOpen} onOpenChange={setPolicyFormOpen}>
                    <DialogContent className="max-w-2xl bg-white rounded-2xl p-6 font-sans max-h-[90vh] overflow-y-auto">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <Layers size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                {editingPolicy ? "Edit policy template" : "New policy template"}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Bundle statutory + cycle overrides for quick application.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Name" required>
                                    <Input value={policyForm.name} onChange={(e) => setPolicyForm({ ...policyForm, name: e.target.value })} className="h-10 text-sm font-medium" placeholder="e.g. Mid-Market Standard" />
                                </FormField>
                                <FormField label="Category">
                                    <Select value={policyForm.category} onValueChange={(v) => setPolicyForm({ ...policyForm, category: v as PolicyTemplate["category"] })}>
                                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Small Business">Small Business</SelectItem>
                                            <SelectItem value="Mid-Market">Mid-Market</SelectItem>
                                            <SelectItem value="Enterprise">Enterprise</SelectItem>
                                            <SelectItem value="Custom">Custom</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>
                            </div>
                            <FormField label="Description">
                                <Textarea value={policyForm.description ?? ""} onChange={(e) => setPolicyForm({ ...policyForm, description: e.target.value })} className="min-h-[50px] text-xs font-medium" />
                            </FormField>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Statutory overrides */}
                                <Card className="rounded-xl border border-slate-200 bg-slate-50/50">
                                    <CardHeader className="p-3 border-b border-slate-100">
                                        <CardTitle className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                            <ShieldCheck size={12} /> Statutory overrides
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-[11px] font-semibold text-slate-600">PF enabled</Label>
                                            <Switch
                                                checked={policyForm.statutoryOverride?.pfEnabled ?? false}
                                                onCheckedChange={(v) => setPolicyForm({ ...policyForm, statutoryOverride: { ...policyForm.statutoryOverride, pfEnabled: v } })}
                                                className="data-[state=checked]:bg-[#8B5CF6]"
                                            />
                                        </div>
                                        <FormField label="PF rate %">
                                            <Input
                                                type="number"
                                                step="0.1"
                                                value={policyForm.statutoryOverride?.pfRate ?? 0}
                                                onChange={(e) => setPolicyForm({ ...policyForm, statutoryOverride: { ...policyForm.statutoryOverride, pfRate: parseFloat(e.target.value) || 0 } })}
                                                className="h-9 text-xs font-semibold tabular-nums"
                                            />
                                        </FormField>
                                        <div className="flex items-center justify-between">
                                            <Label className="text-[11px] font-semibold text-slate-600">ESI enabled</Label>
                                            <Switch
                                                checked={policyForm.statutoryOverride?.esiEnabled ?? false}
                                                onCheckedChange={(v) => setPolicyForm({ ...policyForm, statutoryOverride: { ...policyForm.statutoryOverride, esiEnabled: v } })}
                                                className="data-[state=checked]:bg-[#8B5CF6]"
                                            />
                                        </div>
                                        <FormField label="ESI rate %">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={policyForm.statutoryOverride?.esiRate ?? 0}
                                                onChange={(e) => setPolicyForm({ ...policyForm, statutoryOverride: { ...policyForm.statutoryOverride, esiRate: parseFloat(e.target.value) || 0 } })}
                                                className="h-9 text-xs font-semibold tabular-nums"
                                            />
                                        </FormField>
                                        <div className="flex items-center justify-between">
                                            <Label className="text-[11px] font-semibold text-slate-600">TDS enabled</Label>
                                            <Switch
                                                checked={policyForm.statutoryOverride?.tdsEnabled ?? false}
                                                onCheckedChange={(v) => setPolicyForm({ ...policyForm, statutoryOverride: { ...policyForm.statutoryOverride, tdsEnabled: v } })}
                                                className="data-[state=checked]:bg-[#8B5CF6]"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label className="text-[11px] font-semibold text-slate-600">PT enabled</Label>
                                            <Switch
                                                checked={policyForm.statutoryOverride?.ptEnabled ?? false}
                                                onCheckedChange={(v) => setPolicyForm({ ...policyForm, statutoryOverride: { ...policyForm.statutoryOverride, ptEnabled: v } })}
                                                className="data-[state=checked]:bg-[#8B5CF6]"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Cycle overrides */}
                                <Card className="rounded-xl border border-slate-200 bg-slate-50/50">
                                    <CardHeader className="p-3 border-b border-slate-100">
                                        <CardTitle className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                            <Calendar size={12} /> Cycle overrides
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3 space-y-2">
                                        <FormField label="Frequency">
                                            <Select
                                                value={policyForm.cycleOverride?.frequency ?? "Monthly"}
                                                onValueChange={(v) => setPolicyForm({ ...policyForm, cycleOverride: { ...policyForm.cycleOverride, frequency: v as PayrollCycle["frequency"] } })}
                                            >
                                                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                                    <SelectItem value="Bi-Weekly">Bi-Weekly</SelectItem>
                                                    <SelectItem value="Weekly">Weekly</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormField>
                                        <FormField label="Payout day">
                                            <Input
                                                type="number"
                                                min={1}
                                                max={15}
                                                value={policyForm.cycleOverride?.payoutDay ?? 5}
                                                onChange={(e) => setPolicyForm({ ...policyForm, cycleOverride: { ...policyForm.cycleOverride, payoutDay: parseInt(e.target.value) || 1 } })}
                                                className="h-9 text-xs font-semibold tabular-nums"
                                            />
                                        </FormField>
                                        <FormField label="Cutoff day">
                                            <Input
                                                type="number"
                                                min={1}
                                                max={31}
                                                value={policyForm.cycleOverride?.cutoffDay ?? 25}
                                                onChange={(e) => setPolicyForm({ ...policyForm, cycleOverride: { ...policyForm.cycleOverride, cutoffDay: parseInt(e.target.value) || 1 } })}
                                                className="h-9 text-xs font-semibold tabular-nums"
                                            />
                                        </FormField>
                                        <div className="flex items-center justify-between">
                                            <Label className="text-[11px] font-semibold text-slate-600">Auto-run</Label>
                                            <Switch
                                                checked={policyForm.cycleOverride?.autoRunEnabled ?? false}
                                                onCheckedChange={(v) => setPolicyForm({ ...policyForm, cycleOverride: { ...policyForm.cycleOverride, autoRunEnabled: v } })}
                                                className="data-[state=checked]:bg-[#8B5CF6]"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setPolicyFormOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleSavePolicy} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                {editingPolicy ? "Save" : "Add template"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Apply Policy Confirm Dialog ─────── */}
                <Dialog open={applyPolicyOpen} onOpenChange={setApplyPolicyOpen}>
                    <DialogContent className="max-w-lg bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-2">
                                <Zap size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                Apply "{applyPolicyTarget?.name}"?
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                This will change your current statutory and cycle settings.
                            </DialogDescription>
                        </DialogHeader>
                        {applyPolicyTarget && (
                            <div className="mt-4 space-y-3">
                                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg flex items-start gap-2">
                                    <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                                    <p className="text-[11px] font-medium text-amber-700">
                                        Existing components and bank accounts are not affected. Only statutory + cycle settings will be replaced.
                                    </p>
                                </div>
                                <ScrollArea className="max-h-[260px]">
                                    <div className="space-y-1.5 pr-2">
                                        {(() => {
                                            type Row = { label: string; current: string; next: string }
                                            const rows: Row[] = []
                                            const so = applyPolicyTarget.statutoryOverride
                                            const co = applyPolicyTarget.cycleOverride
                                            if (so?.pfEnabled !== undefined) rows.push({ label: "PF enabled", current: String(statutorySettings.pfEnabled), next: String(so.pfEnabled) })
                                            if (so?.pfRate !== undefined) rows.push({ label: "PF rate", current: `${statutorySettings.pfRate}%`, next: `${so.pfRate}%` })
                                            if (so?.esiEnabled !== undefined) rows.push({ label: "ESI enabled", current: String(statutorySettings.esiEnabled), next: String(so.esiEnabled) })
                                            if (so?.esiRate !== undefined) rows.push({ label: "ESI rate", current: `${statutorySettings.esiRate}%`, next: `${so.esiRate}%` })
                                            if (so?.tdsEnabled !== undefined) rows.push({ label: "TDS", current: String(statutorySettings.tdsEnabled), next: String(so.tdsEnabled) })
                                            if (so?.ptEnabled !== undefined) rows.push({ label: "PT", current: String(statutorySettings.ptEnabled), next: String(so.ptEnabled) })
                                            if (co?.frequency) rows.push({ label: "Frequency", current: payrollCycle.frequency, next: co.frequency })
                                            if (co?.payoutDay !== undefined) rows.push({ label: "Payout day", current: `Day ${payrollCycle.payoutDay}`, next: `Day ${co.payoutDay}` })
                                            if (co?.cutoffDay !== undefined) rows.push({ label: "Cutoff day", current: `Day ${payrollCycle.cutoffDay}`, next: `Day ${co.cutoffDay}` })
                                            if (co?.autoRunEnabled !== undefined) rows.push({ label: "Auto-run", current: String(payrollCycle.autoRunEnabled), next: String(co.autoRunEnabled) })
                                            return rows.map((r, i) => {
                                                const diff = r.current !== r.next
                                                return (
                                                    <div key={i} className={cn("grid grid-cols-3 gap-3 p-2 rounded-lg border",
                                                        diff ? "bg-amber-50/60 border-amber-100" : "bg-slate-50/50 border-slate-100")}>
                                                        <div className="text-[11px] font-semibold text-slate-700">{r.label}</div>
                                                        <div className="text-[11px] font-medium text-slate-600 tabular-nums">{r.current}</div>
                                                        <div className={cn("text-[11px] font-bold tabular-nums", diff ? "text-amber-700" : "text-slate-600")}>→ {r.next}</div>
                                                    </div>
                                                )
                                            })
                                        })()}
                                    </div>
                                </ScrollArea>
                            </div>
                        )}
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setApplyPolicyOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleApplyPolicy} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none gap-1">
                                <Zap size={13} /> Apply policy
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Policy Delete Confirm ─────── */}
                <Dialog open={policyDeleteOpen} onOpenChange={setPolicyDeleteOpen}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Trash2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Delete policy template?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                {policyDeleteTarget?.name} will be permanently removed.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setPolicyDeleteOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleConfirmDeletePolicy} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Validation Issues Dialog ─────── */}
                <Dialog open={validationOpen} onOpenChange={setValidationOpen}>
                    <DialogContent className="max-w-xl bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <ShieldCheck size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Validation results</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                {validationResult.issues.length === 0
                                    ? "All settings pass validation."
                                    : `${validationResult.issues.length} issue${validationResult.issues.length === 1 ? "" : "s"} found: ${validationResult.issues.filter(i => i.severity === "error").length} errors, ${validationResult.issues.filter(i => i.severity === "warning").length} warnings.`
                                }
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-2">
                            {validationResult.issues.length === 0 ? (
                                <div className="p-8 flex flex-col items-center gap-2 text-center bg-emerald-50/60 rounded-xl border border-emerald-100">
                                    <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div className="text-sm font-bold text-emerald-700">All settings pass validation ✓</div>
                                    <div className="text-[11px] font-medium text-emerald-600/80">No rules triggered.</div>
                                </div>
                            ) : (
                                <ScrollArea className="max-h-[400px]">
                                    <div className="space-y-2 pr-2">
                                        {validationResult.issues.map((i, idx) => (
                                            <div key={`${i.ruleId}-${idx}`} className={cn("flex items-start gap-3 p-3 rounded-lg border",
                                                i.severity === "error" ? "bg-rose-50/60 border-rose-100" : "bg-amber-50/60 border-amber-100")}>
                                                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                                                    i.severity === "error" ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600")}>
                                                    {i.severity === "error" ? <AlertTriangle size={14} /> : <AlertCircle size={14} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="text-xs font-bold text-slate-800 font-mono">{i.settingKey}</span>
                                                        <Badge className={cn("border-none text-[9px] font-semibold px-1.5",
                                                            i.severity === "error" ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600")}>
                                                            {i.severity}
                                                        </Badge>
                                                        <span className="text-[11px] text-slate-500">current: <span className="font-mono font-semibold text-slate-700">{i.currentValue}</span></span>
                                                    </div>
                                                    <p className="text-[11px] font-medium text-slate-600 leading-snug">{i.message}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            )}
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setValidationOpen(false)} className="h-10 font-semibold text-xs">Close</Button>
                            <Button onClick={handleRunValidation} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none gap-1">
                                <RefreshCw size={13} /> Re-run
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Validation Rule Form Dialog ─────── */}
                <Dialog open={ruleFormOpen} onOpenChange={setRuleFormOpen}>
                    <DialogContent className="max-w-lg bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <FileCheck size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                {editingRule ? "Edit validation rule" : "New validation rule"}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Guardrails against bad configuration values.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Setting key" required>
                                    <Select value={ruleForm.settingKey} onValueChange={(v) => setRuleForm({ ...ruleForm, settingKey: v })}>
                                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pfRate">pfRate</SelectItem>
                                            <SelectItem value="esiRate">esiRate</SelectItem>
                                            <SelectItem value="payoutDay">payoutDay</SelectItem>
                                            <SelectItem value="cutoffDay">cutoffDay</SelectItem>
                                            <SelectItem value="tdsEnabled">tdsEnabled</SelectItem>
                                            <SelectItem value="pfEnabled">pfEnabled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="Label" required>
                                    <Input value={ruleForm.label} onChange={(e) => setRuleForm({ ...ruleForm, label: e.target.value })} className="h-10 text-sm font-medium" />
                                </FormField>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <FormField label="Operator">
                                    <Select value={ruleForm.operator} onValueChange={(v) => setRuleForm({ ...ruleForm, operator: v as SettingValidationRule["operator"] })}>
                                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="min">min</SelectItem>
                                            <SelectItem value="max">max</SelectItem>
                                            <SelectItem value="range">range</SelectItem>
                                            <SelectItem value="enum">enum</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                {(ruleForm.operator === "min" || ruleForm.operator === "range") && (
                                    <FormField label="Min">
                                        <Input
                                            type="number"
                                            value={ruleForm.minValue ?? 0}
                                            onChange={(e) => setRuleForm({ ...ruleForm, minValue: parseFloat(e.target.value) || 0 })}
                                            className="h-10 text-sm tabular-nums"
                                        />
                                    </FormField>
                                )}
                                {(ruleForm.operator === "max" || ruleForm.operator === "range") && (
                                    <FormField label="Max">
                                        <Input
                                            type="number"
                                            value={ruleForm.maxValue ?? 0}
                                            onChange={(e) => setRuleForm({ ...ruleForm, maxValue: parseFloat(e.target.value) || 0 })}
                                            className="h-10 text-sm tabular-nums"
                                        />
                                    </FormField>
                                )}
                                {ruleForm.operator === "enum" && (
                                    <FormField label="Allowed (comma-sep)">
                                        <Input
                                            value={(ruleForm.allowedValues ?? []).join(", ")}
                                            onChange={(e) => setRuleForm({ ...ruleForm, allowedValues: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                                            className="h-10 text-sm"
                                            placeholder="Monthly, Weekly"
                                        />
                                    </FormField>
                                )}
                            </div>
                            <FormField label="Severity">
                                <Select value={ruleForm.severity} onValueChange={(v) => setRuleForm({ ...ruleForm, severity: v as SettingValidationRule["severity"] })}>
                                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="warning">Warning</SelectItem>
                                        <SelectItem value="error">Error</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormField>
                            <FormField label="Message" required>
                                <Textarea value={ruleForm.message} onChange={(e) => setRuleForm({ ...ruleForm, message: e.target.value })} className="min-h-[50px] text-xs font-medium" placeholder="What's wrong if this triggers?" />
                            </FormField>
                            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                <div>
                                    <Label className="text-xs font-bold text-slate-700">Active</Label>
                                    <p className="text-[10px] font-medium text-slate-500 mt-0.5">Inactive rules are skipped.</p>
                                </div>
                                <Switch checked={ruleForm.active} onCheckedChange={(v) => setRuleForm({ ...ruleForm, active: v })} className="data-[state=checked]:bg-[#8B5CF6]" />
                            </div>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setRuleFormOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleSaveRule} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                {editingRule ? "Save" : "Add rule"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Rule Delete Confirm ─────── */}
                <Dialog open={ruleDeleteOpen} onOpenChange={setRuleDeleteOpen}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Trash2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Delete rule?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                {ruleDeleteTarget?.label} will be permanently removed.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setRuleDeleteOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleConfirmDeleteRule} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Permission Form Dialog ─────── */}
                <Dialog open={permFormOpen} onOpenChange={setPermFormOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <KeyRound size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                {editingPerm ? "Edit permission" : "Add role permission"}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Role + scope → view / edit / approve flags.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Role" required>
                                    <Input value={permForm.role} onChange={(e) => setPermForm({ ...permForm, role: e.target.value })} className="h-10 text-sm font-medium" placeholder="HR Manager" />
                                </FormField>
                                <FormField label="Scope" required>
                                    <Select value={permForm.scope} onValueChange={(v) => setPermForm({ ...permForm, scope: v as SettingsPermission["scope"] })}>
                                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Structure">Structure</SelectItem>
                                            <SelectItem value="Statutory">Statutory</SelectItem>
                                            <SelectItem value="Cycle">Cycle</SelectItem>
                                            <SelectItem value="Bank">Bank</SelectItem>
                                            <SelectItem value="Audit">Audit</SelectItem>
                                            <SelectItem value="All">All</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>
                            </div>
                            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="flex items-center gap-2">
                                    <Eye size={13} className="text-slate-500" />
                                    <Label className="text-xs font-bold text-slate-700">Can view</Label>
                                </div>
                                <Checkbox checked={permForm.canView} onCheckedChange={(v) => setPermForm({ ...permForm, canView: !!v })} />
                            </div>
                            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="flex items-center gap-2">
                                    <Pencil size={13} className="text-[#8B5CF6]" />
                                    <Label className="text-xs font-bold text-slate-700">Can edit</Label>
                                </div>
                                <Checkbox checked={permForm.canEdit} onCheckedChange={(v) => setPermForm({ ...permForm, canEdit: !!v })} />
                            </div>
                            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={13} className="text-emerald-600" />
                                    <Label className="text-xs font-bold text-slate-700">Can approve</Label>
                                </div>
                                <Checkbox checked={permForm.canApprove ?? false} onCheckedChange={(v) => setPermForm({ ...permForm, canApprove: !!v })} />
                            </div>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setPermFormOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleSavePerm} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                {editingPerm ? "Save" : "Add permission"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Permission Delete Confirm ─────── */}
                <Dialog open={permDeleteOpen} onOpenChange={setPermDeleteOpen}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Trash2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Delete permission?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                {permDeleteTarget?.role} • {permDeleteTarget?.scope} will be removed.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setPermDeleteOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleConfirmDeletePerm} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Department Form Dialog ──────────── */}
                <Dialog open={deptFormOpen} onOpenChange={setDeptFormOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <Building2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                {editingDept ? "Edit department" : "Add department"}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Organization department used for grouping employees.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 mt-3">
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-semibold text-slate-600">Name *</Label>
                                <Input
                                    value={deptForm.name}
                                    onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                                    placeholder="e.g. Engineering"
                                    className="h-10 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-semibold text-slate-600">Description</Label>
                                <Textarea
                                    value={deptForm.description}
                                    onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                                    placeholder="Short description"
                                    rows={2}
                                    className="text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-semibold text-slate-600">Head</Label>
                                <Input
                                    value={deptForm.head}
                                    onChange={(e) => setDeptForm({ ...deptForm, head: e.target.value })}
                                    placeholder="Head of department"
                                    className="h-10 text-sm"
                                />
                            </div>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setDeptFormOpen(false)} className="h-10 font-semibold text-xs gap-1">
                                <X size={13} /> Cancel
                            </Button>
                            <Button onClick={handleSaveDept} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                {editingDept ? "Save changes" : "Create"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Department Delete Confirm ──────── */}
                <Dialog open={deptDeleteOpen} onOpenChange={setDeptDeleteOpen}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Trash2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Delete department?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                {deptDeleteTarget?.name} will be removed. This may affect employees & positions.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setDeptDeleteOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleDeleteDept} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Position Form Dialog ──────────── */}
                <Dialog open={posFormOpen} onOpenChange={setPosFormOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <Briefcase size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                {editingPos ? "Edit position" : "Add position"}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Job title linked to a department.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 mt-3">
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-semibold text-slate-600">Title *</Label>
                                <Input
                                    value={posForm.title}
                                    onChange={(e) => setPosForm({ ...posForm, title: e.target.value })}
                                    placeholder="e.g. Senior Engineer"
                                    className="h-10 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-semibold text-slate-600">Department {!editingPos && "*"}</Label>
                                <Select value={posForm.department} onValueChange={(v) => setPosForm({ ...posForm, department: v })}>
                                    <SelectTrigger className="h-10 text-sm">
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((d) => (
                                            <SelectItem key={d._id} value={d._id}>{d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-semibold text-slate-600">Level</Label>
                                <Input
                                    value={posForm.level}
                                    onChange={(e) => setPosForm({ ...posForm, level: e.target.value })}
                                    placeholder="e.g. L3, Senior"
                                    className="h-10 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-semibold text-slate-600">Description</Label>
                                <Textarea
                                    value={posForm.description}
                                    onChange={(e) => setPosForm({ ...posForm, description: e.target.value })}
                                    placeholder="Optional role description"
                                    rows={2}
                                    className="text-sm"
                                />
                            </div>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setPosFormOpen(false)} className="h-10 font-semibold text-xs gap-1">
                                <X size={13} /> Cancel
                            </Button>
                            <Button onClick={handleSavePos} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                {editingPos ? "Save changes" : "Create"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Position Delete Confirm ──────── */}
                <Dialog open={posDeleteOpen} onOpenChange={setPosDeleteOpen}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Trash2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Delete position?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                {posDeleteTarget?.title} will be removed.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setPosDeleteOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleDeletePos} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Holiday Form Dialog ──────────── */}
                <Dialog open={holidayFormOpen} onOpenChange={setHolidayFormOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <CalendarDays size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                {editingHoliday ? "Edit holiday" : "Add holiday"}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Company holiday calendar entry.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 mt-3">
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-semibold text-slate-600">Name *</Label>
                                <Input
                                    value={holidayForm.name}
                                    onChange={(e) => setHolidayForm({ ...holidayForm, name: e.target.value })}
                                    placeholder="e.g. Independence Day"
                                    className="h-10 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-semibold text-slate-600">Date *</Label>
                                <Input
                                    type="date"
                                    value={holidayForm.date}
                                    onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })}
                                    disabled={!!editingHoliday}
                                    className="h-10 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-semibold text-slate-600">Type</Label>
                                <Select value={holidayForm.type} onValueChange={(v) => setHolidayForm({ ...holidayForm, type: v as "National" | "Optional" })}>
                                    <SelectTrigger className="h-10 text-sm">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="National">National</SelectItem>
                                        <SelectItem value="Optional">Optional</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Paid holiday</p>
                                    <p className="text-[11px] font-medium text-slate-500">Employees are paid for this day.</p>
                                </div>
                                <Switch checked={holidayForm.isPaid} onCheckedChange={(c) => setHolidayForm({ ...holidayForm, isPaid: c })} className="data-[state=checked]:bg-[#8B5CF6]" />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Mandatory</p>
                                    <p className="text-[11px] font-medium text-slate-500">Cannot be swapped by employees.</p>
                                </div>
                                <Switch checked={holidayForm.isMandatory} onCheckedChange={(c) => setHolidayForm({ ...holidayForm, isMandatory: c })} className="data-[state=checked]:bg-[#8B5CF6]" />
                            </div>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setHolidayFormOpen(false)} className="h-10 font-semibold text-xs gap-1">
                                <X size={13} /> Cancel
                            </Button>
                            <Button onClick={handleSaveHoliday} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                {editingHoliday ? "Save changes" : "Create"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Holiday Delete Confirm ──────── */}
                <Dialog open={holidayDeleteOpen} onOpenChange={setHolidayDeleteOpen}>
                    <DialogContent className="max-w-sm bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Trash2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Delete holiday?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                {holidayDeleteTarget?.name} ({(holidayDeleteTarget?.date || "").split("T")[0]}) will be removed.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setHolidayDeleteOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleDeleteHoliday} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
    )
}

// ── Subcomponents ─────────────────────────────────────────
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

const StatBox = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (
    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
        <div className={cn("text-[11px] font-semibold text-slate-800 mt-0.5 truncate", mono && "font-mono")}>{value}</div>
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

const StatutoryCard = ({
    label,
    icon: Icon,
    desc,
    enabled,
    rate,
    rateLabel,
    color,
    onEnable,
    onRate,
}: {
    label: string
    icon: any
    desc: string
    enabled: boolean
    rate?: number
    rateLabel?: string
    color: string
    onEnable: (v: boolean) => void
    onRate?: (v: number) => void
}) => (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}14`, color }}>
                        <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900">{label}</h4>
                        <p className="text-[11px] font-medium text-slate-500 mt-0.5 leading-snug">{desc}</p>
                    </div>
                </div>
                <Switch checked={enabled} onCheckedChange={onEnable} className="data-[state=checked]:bg-[#8B5CF6]" />
            </div>
            {rate !== undefined && onRate && (
                <div className="space-y-1.5">
                    <Label className="text-[11px] font-semibold text-slate-600">{rateLabel}</Label>
                    <Input
                        type="number"
                        step="0.1"
                        value={rate}
                        onChange={(e) => onRate(parseFloat(e.target.value) || 0)}
                        disabled={!enabled}
                        className="h-10 text-sm font-bold tabular-nums disabled:opacity-50"
                    />
                </div>
            )}
        </CardContent>
    </Card>
)

export default PayrollSettingsPage
