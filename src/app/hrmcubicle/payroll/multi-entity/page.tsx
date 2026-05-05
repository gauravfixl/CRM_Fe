"use client"

import React, { useState, useMemo, useEffect } from "react"
import {
    Building2,
    Plus,
    Edit,
    Trash2,
    MapPin,
    Users,
    CheckCircle2,
    Eye,
    Download,
    ShieldCheck,
    FileText,
    MoreHorizontal,
    Search,
    Filter,
    Wallet,
    Activity,
    Briefcase,
    ArrowLeftRight,
    GitBranch,
    Copy,
    Check,
    X,
    Target,
    Gauge,
    Shield,
    AlertTriangle,
    Calendar,
    RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Switch } from "@/shared/components/ui/switch"
import { Textarea } from "@/shared/components/ui/textarea"
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/shared/components/ui/sheet"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip"
import { useToast } from "@/shared/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Progress } from "@/shared/components/ui/progress"
import {
    useSalaryStore,
    type Entity,
    type EntityLocation,
    type StatutoryRegistration,
    type EntityPayrollStatus,
    type EntityTransfer,
    type EntityComplianceSummary,
} from "@/shared/data/salary-store"
import { usePayrollStore } from "@/shared/data/payroll-store"
import { getAllEmployees } from "@/modules/hrm/hooks/hrmHooks"
import { motion } from "framer-motion"

const formatINR = (amt: number) => `₹${Math.round(amt || 0).toLocaleString("en-IN")}`

const STATES = ["Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Gujarat", "Telangana", "Haryana", "Uttar Pradesh", "West Bengal", "Andhra Pradesh"]
const LOCATION_TYPES: EntityLocation["type"][] = ["HQ", "Branch", "Regional", "Remote"]
const REGISTRATION_TYPES = [
    "PF Establishment Code",
    "ESI Code",
    "PT Registration",
    "Shops & Establishment",
    "Contract Labour Act",
    "Gratuity Registration",
    "Factory License",
]

const emptyEntityForm: Omit<Entity, "id"> = {
    name: "",
    legalName: "",
    gstin: "",
    pan: "",
    address: "",
    state: "Karnataka",
    isActive: true,
    employeeCount: 0,
}

const emptyLocationForm: Omit<EntityLocation, "id"> = {
    entityId: "",
    name: "",
    address: "",
    city: "",
    state: "Karnataka",
    pincode: "",
    type: "Branch",
    employeeCount: 0,
    isActive: true,
}

const emptyRegistrationForm: Omit<StatutoryRegistration, "id"> = {
    entityId: "",
    type: "PF Establishment Code",
    registrationNumber: "",
    state: "",
    issuedDate: "",
    expiryDate: "",
    status: "Active",
    notes: "",
}

const emptyStatusForm: Omit<EntityPayrollStatus, "id"> = {
    entityId: "",
    month: "",
    status: "Draft",
    employeeCount: 0,
    totalCost: 0,
    notes: "",
}

const MultiEntityPage = () => {
    const { toast } = useToast()
    const {
        entities,
        locations,
        registrations,
        entityPayrollStatus,
        entityTransfers,
        addEntity,
        updateEntity,
        deleteEntity,
        addLocation,
        updateLocation,
        deleteLocation,
        addRegistration,
        updateRegistration,
        deleteRegistration,
        addEntityPayrollStatus,
        updateEntityPayrollStatus,
        deleteEntityPayrollStatus,
        cloneEntity,
        transferEmployee,
        completeEntityTransfer,
        cancelEntityTransfer,
        bulkUpdateRegistrationStatus,
        getEntityComplianceSummary,
        getAllEntityComplianceSummaries,
    } = useSalaryStore()

    const payrollEmployees = usePayrollStore((s) => s.payrollEmployees)

    // ─ Backend employees (real data) ─
    type BackendEmployee = { _id: string; employeeCode?: string; firstName?: string; lastName?: string; email?: string; departmentId?: { name?: string } | string; positionId?: { name?: string } | string }
    const [backendEmployees, setBackendEmployees] = useState<BackendEmployee[]>([])
    useEffect(() => {
        let cancelled = false
        ;(async () => {
            try {
                const res: any = await getAllEmployees()
                const list: BackendEmployee[] = res?.data?.employees ?? res?.data?.data?.employees ?? res?.data ?? []
                if (!cancelled) setBackendEmployees(Array.isArray(list) ? list : [])
            } catch {
                // Silently ignore — fallback to store employees
            }
        })()
        return () => { cancelled = true }
    }, [])

    // ── UI state ───────────────────────────────────────────
    const [activeTab, setActiveTab] = useState<"entities" | "locations" | "registrations" | "payroll-status" | "transfers">("entities")
    const [searchTerm, setSearchTerm] = useState("")

    // Round 2 dialog state
    const [cloneEntOpen, setCloneEntOpen] = useState(false)
    const [cloneSource, setCloneSource] = useState<Entity | null>(null)
    const [cloneName, setCloneName] = useState("")
    const [cloneLegalName, setCloneLegalName] = useState("")

    const [transferOpen, setTransferOpen] = useState(false)
    const [transferEmpQuery, setTransferEmpQuery] = useState("")
    const [transferEmpId, setTransferEmpId] = useState<string>("")
    const [transferEmpName, setTransferEmpName] = useState<string>("")
    const [transferFromId, setTransferFromId] = useState<string>("")
    const [transferToId, setTransferToId] = useState<string>("")
    const [transferDate, setTransferDate] = useState<string>(new Date().toISOString().split("T")[0])
    const [transferReason, setTransferReason] = useState<string>("")
    const [transferPreservePF, setTransferPreservePF] = useState(true)
    const [transferPreserveESI, setTransferPreserveESI] = useState(true)
    const [transferPreserveGratuity, setTransferPreserveGratuity] = useState(true)

    const [complianceOpen, setComplianceOpen] = useState(false)
    const [entityComplianceOpen, setEntityComplianceOpen] = useState(false)
    const [complianceEntityId, setComplianceEntityId] = useState<string | null>(null)

    const [transferDetailOpen, setTransferDetailOpen] = useState(false)
    const [viewingTransfer, setViewingTransfer] = useState<EntityTransfer | null>(null)

    const [selectedRegIds, setSelectedRegIds] = useState<string[]>([])

    // Entity dialogs
    const [entityFormOpen, setEntityFormOpen] = useState(false)
    const [entityDetailOpen, setEntityDetailOpen] = useState(false)
    const [entityDeleteOpen, setEntityDeleteOpen] = useState(false)
    const [editingEntity, setEditingEntity] = useState<Entity | null>(null)
    const [viewingEntity, setViewingEntity] = useState<Entity | null>(null)
    const [entityDeleteTarget, setEntityDeleteTarget] = useState<string | null>(null)
    const [entityForm, setEntityForm] = useState(emptyEntityForm)

    // Location dialogs
    const [locationFormOpen, setLocationFormOpen] = useState(false)
    const [editingLocation, setEditingLocation] = useState<EntityLocation | null>(null)
    const [locationForm, setLocationForm] = useState(emptyLocationForm)

    // Registration dialogs
    const [registrationFormOpen, setRegistrationFormOpen] = useState(false)
    const [editingRegistration, setEditingRegistration] = useState<StatutoryRegistration | null>(null)
    const [registrationForm, setRegistrationForm] = useState(emptyRegistrationForm)

    // Status dialogs
    const [statusFormOpen, setStatusFormOpen] = useState(false)
    const [editingStatus, setEditingStatus] = useState<EntityPayrollStatus | null>(null)
    const [statusForm, setStatusForm] = useState(emptyStatusForm)

    // ── Derived ────────────────────────────────────────────
    const totalEmployees = useMemo(() => locations.reduce((s, l) => s + l.employeeCount, 0), [locations])
    const totalCurrentCost = useMemo(
        () => entityPayrollStatus
            .filter((s) => s.status === "Paid" || s.status === "Processed")
            .reduce((s, p) => s + p.totalCost, 0),
        [entityPayrollStatus]
    )
    const activeEntities = useMemo(() => entities.filter((e) => e.isActive).length, [entities])

    const filteredEntities = useMemo(() => {
        return entities.filter((e) => {
            if (!searchTerm) return true
            const q = searchTerm.toLowerCase()
            return (
                e.name.toLowerCase().includes(q) ||
                e.legalName.toLowerCase().includes(q) ||
                (e.gstin ?? "").toLowerCase().includes(q) ||
                e.state.toLowerCase().includes(q)
            )
        })
    }, [entities, searchTerm])

    const filteredLocations = useMemo(() => {
        return locations.filter((l) => {
            if (!searchTerm) return true
            const q = searchTerm.toLowerCase()
            const entity = entities.find((e) => e.id === l.entityId)
            return (
                l.name.toLowerCase().includes(q) ||
                l.address.toLowerCase().includes(q) ||
                (l.city ?? "").toLowerCase().includes(q) ||
                (entity?.name ?? "").toLowerCase().includes(q)
            )
        })
    }, [locations, entities, searchTerm])

    const filteredRegistrations = useMemo(() => {
        return registrations.filter((r) => {
            if (!searchTerm) return true
            const q = searchTerm.toLowerCase()
            const entity = entities.find((e) => e.id === r.entityId)
            return (
                r.type.toLowerCase().includes(q) ||
                r.registrationNumber.toLowerCase().includes(q) ||
                (entity?.name ?? "").toLowerCase().includes(q)
            )
        })
    }, [registrations, entities, searchTerm])

    const filteredStatus = useMemo(() => {
        return entityPayrollStatus.filter((s) => {
            if (!searchTerm) return true
            const q = searchTerm.toLowerCase()
            const entity = entities.find((e) => e.id === s.entityId)
            return s.month.toLowerCase().includes(q) || (entity?.name ?? "").toLowerCase().includes(q)
        })
    }, [entityPayrollStatus, entities, searchTerm])

    // ── Entity handlers ────────────────────────────────────
    const openAddEntity = () => {
        setEditingEntity(null)
        setEntityForm(emptyEntityForm)
        setEntityFormOpen(true)
    }

    const openEditEntity = (e: Entity) => {
        setEditingEntity(e)
        setEntityForm({
            name: e.name,
            legalName: e.legalName,
            gstin: e.gstin,
            pan: e.pan,
            address: e.address,
            state: e.state,
            isActive: e.isActive,
            employeeCount: e.employeeCount ?? 0,
            pfCode: e.pfCode,
            esiCode: e.esiCode,
            ptRegistration: e.ptRegistration,
            payrollProcessed: e.payrollProcessed,
        })
        setEntityFormOpen(true)
    }

    const handleSaveEntity = () => {
        if (!entityForm.name.trim() || !entityForm.legalName.trim()) {
            toast({ title: "Missing fields", description: "Display name and legal name required.", variant: "destructive" })
            return
        }
        if (editingEntity) {
            updateEntity(editingEntity.id, entityForm)
            toast({ title: "Entity updated", description: entityForm.name })
        } else {
            addEntity(entityForm)
            toast({ title: "Entity created", description: entityForm.name })
        }
        setEntityFormOpen(false)
        setEditingEntity(null)
    }

    const handleDeleteEntity = () => {
        if (!entityDeleteTarget) return
        const e = entities.find((x) => x.id === entityDeleteTarget)
        deleteEntity(entityDeleteTarget)
        toast({ title: "Entity removed", description: `${e?.name ?? "Record"} + all associated data deleted.`, variant: "destructive" })
        setEntityDeleteOpen(false)
        setEntityDeleteTarget(null)
    }

    // ── Location handlers ──────────────────────────────────
    const openAddLocation = () => {
        if (entities.length === 0) {
            toast({ title: "No entities", description: "Create an entity first.", variant: "destructive" })
            return
        }
        setEditingLocation(null)
        setLocationForm({ ...emptyLocationForm, entityId: entities[0].id })
        setLocationFormOpen(true)
    }

    const openEditLocation = (l: EntityLocation) => {
        setEditingLocation(l)
        setLocationForm({
            entityId: l.entityId,
            name: l.name,
            address: l.address,
            city: l.city ?? "",
            state: l.state ?? "",
            pincode: l.pincode ?? "",
            type: l.type,
            employeeCount: l.employeeCount,
            isActive: l.isActive,
        })
        setLocationFormOpen(true)
    }

    const handleSaveLocation = () => {
        if (!locationForm.name.trim() || !locationForm.entityId) {
            toast({ title: "Missing fields", description: "Location name and entity required.", variant: "destructive" })
            return
        }
        if (editingLocation) {
            updateLocation(editingLocation.id, locationForm)
            toast({ title: "Location updated", description: locationForm.name })
        } else {
            addLocation(locationForm)
            toast({ title: "Location added", description: locationForm.name })
        }
        setLocationFormOpen(false)
        setEditingLocation(null)
    }

    const handleDeleteLocation = (id: string) => {
        const l = locations.find((x) => x.id === id)
        deleteLocation(id)
        toast({ title: "Location removed", description: l?.name ?? "", variant: "destructive" })
    }

    // ── Registration handlers ──────────────────────────────
    const openAddRegistration = () => {
        if (entities.length === 0) {
            toast({ title: "No entities", description: "Create an entity first.", variant: "destructive" })
            return
        }
        setEditingRegistration(null)
        setRegistrationForm({ ...emptyRegistrationForm, entityId: entities[0].id })
        setRegistrationFormOpen(true)
    }

    const openEditRegistration = (r: StatutoryRegistration) => {
        setEditingRegistration(r)
        setRegistrationForm({
            entityId: r.entityId,
            type: r.type,
            registrationNumber: r.registrationNumber,
            state: r.state ?? "",
            issuedDate: r.issuedDate ?? "",
            expiryDate: r.expiryDate ?? "",
            status: r.status,
            notes: r.notes ?? "",
        })
        setRegistrationFormOpen(true)
    }

    const handleSaveRegistration = () => {
        if (!registrationForm.type.trim() || !registrationForm.entityId) {
            toast({ title: "Missing fields", description: "Registration type and entity required.", variant: "destructive" })
            return
        }
        if (editingRegistration) {
            updateRegistration(editingRegistration.id, registrationForm)
            toast({ title: "Registration updated", description: registrationForm.type })
        } else {
            addRegistration(registrationForm)
            toast({ title: "Registration added", description: registrationForm.type })
        }
        setRegistrationFormOpen(false)
        setEditingRegistration(null)
    }

    const handleDeleteRegistration = (id: string) => {
        deleteRegistration(id)
        toast({ title: "Registration removed", variant: "destructive" })
    }

    // ── Status handlers ────────────────────────────────────
    const openAddStatus = () => {
        if (entities.length === 0) {
            toast({ title: "No entities", description: "Create an entity first.", variant: "destructive" })
            return
        }
        setEditingStatus(null)
        setStatusForm({ ...emptyStatusForm, entityId: entities[0].id })
        setStatusFormOpen(true)
    }

    const openEditStatus = (s: EntityPayrollStatus) => {
        setEditingStatus(s)
        setStatusForm({
            entityId: s.entityId,
            month: s.month,
            status: s.status,
            employeeCount: s.employeeCount,
            totalCost: s.totalCost,
            processedDate: s.processedDate,
            notes: s.notes ?? "",
        })
        setStatusFormOpen(true)
    }

    const handleSaveStatus = () => {
        if (!statusForm.month.trim() || !statusForm.entityId) {
            toast({ title: "Missing fields", description: "Month and entity required.", variant: "destructive" })
            return
        }
        if (editingStatus) {
            updateEntityPayrollStatus(editingStatus.id, statusForm)
            toast({ title: "Status updated", description: `${statusForm.month}` })
        } else {
            addEntityPayrollStatus(statusForm)
            toast({ title: "Status added", description: `${statusForm.month}` })
        }
        setStatusFormOpen(false)
        setEditingStatus(null)
    }

    const handleDeleteStatus = (id: string) => {
        deleteEntityPayrollStatus(id)
        toast({ title: "Status removed", variant: "destructive" })
    }

    // ── Exports ──────────────────────────────────────────
    const handleExport = () => {
        let csv: string
        let filename: string
        if (activeTab === "entities") {
            const headers = ["Name", "Legal Name", "GSTIN", "PAN", "State", "Address", "Active", "Employees"]
            const rows = entities.map((e) => [
                `"${e.name}"`, `"${e.legalName}"`, e.gstin, e.pan, e.state, `"${e.address}"`,
                e.isActive ? "Yes" : "No", e.employeeCount ?? 0,
            ].join(","))
            csv = [headers.join(","), ...rows].join("\n")
            filename = "entities"
        } else if (activeTab === "locations") {
            const headers = ["Location", "Entity", "Type", "City", "State", "Pincode", "Employees", "Active"]
            const rows = locations.map((l) => [
                `"${l.name}"`,
                `"${entities.find((e) => e.id === l.entityId)?.name ?? "—"}"`,
                l.type, l.city ?? "", l.state ?? "", l.pincode ?? "", l.employeeCount,
                l.isActive ? "Yes" : "No",
            ].join(","))
            csv = [headers.join(","), ...rows].join("\n")
            filename = "locations"
        } else if (activeTab === "registrations") {
            const headers = ["Entity", "Type", "Registration Number", "State", "Issued Date", "Expiry Date", "Status"]
            const rows = registrations.map((r) => [
                `"${entities.find((e) => e.id === r.entityId)?.name ?? "—"}"`,
                r.type, r.registrationNumber, r.state ?? "", r.issuedDate ?? "", r.expiryDate ?? "", r.status,
            ].join(","))
            csv = [headers.join(","), ...rows].join("\n")
            filename = "statutory_registrations"
        } else {
            const headers = ["Entity", "Month", "Status", "Employees", "Total Cost", "Processed Date"]
            const rows = entityPayrollStatus.map((s) => [
                `"${entities.find((e) => e.id === s.entityId)?.name ?? "—"}"`,
                s.month, s.status, s.employeeCount, s.totalCost, s.processedDate ?? "",
            ].join(","))
            csv = [headers.join(","), ...rows].join("\n")
            filename = "entity_payroll_status"
        }
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Exported" })
    }

    // ── Round 2 handlers ───────────────────────────────────
    const openCloneEntity = (src: Entity) => {
        setCloneSource(src)
        setCloneName(`${src.name} (Subsidiary)`)
        setCloneLegalName(`${src.legalName} (Subsidiary)`)
        setCloneEntOpen(true)
    }

    const handleConfirmClone = () => {
        if (!cloneSource || !cloneName.trim() || !cloneLegalName.trim()) {
            toast({ title: "Missing fields", description: "New name and legal name required.", variant: "destructive" })
            return
        }
        const regCount = registrations.filter((r) => r.entityId === cloneSource.id).length
        const newId = cloneEntity(cloneSource.id, cloneName.trim(), cloneLegalName.trim())
        if (newId) {
            toast({ title: "Entity cloned", description: `New entity ${newId} • ${regCount} registration(s) duplicated as Pending.` })
            setCloneEntOpen(false)
            setCloneSource(null)
        } else {
            toast({ title: "Clone failed", description: "Source entity could not be cloned.", variant: "destructive" })
        }
    }

    const openTransferDialog = (prefillToEntity?: Entity) => {
        if (entities.length < 2) {
            toast({ title: "Need 2+ entities", description: "You need at least two entities for transfers.", variant: "destructive" })
            return
        }
        setTransferEmpQuery("")
        setTransferEmpId("")
        setTransferEmpName("")
        setTransferFromId(prefillToEntity ? entities.find((e) => e.id !== prefillToEntity.id)?.id ?? "" : entities[0]?.id ?? "")
        setTransferToId(prefillToEntity?.id ?? entities[1]?.id ?? "")
        setTransferDate(new Date().toISOString().split("T")[0])
        setTransferReason("")
        setTransferPreservePF(true)
        setTransferPreserveESI(true)
        setTransferPreserveGratuity(true)
        setTransferOpen(true)
    }

    const employeeMatches = useMemo(() => {
        if (!transferEmpQuery.trim()) return [] as { empCode: string; name: string; dept?: string }[]
        const q = transferEmpQuery.toLowerCase()
        const seen = new Set<string>()
        const out: { empCode: string; name: string; dept?: string }[] = []
        // Prefer backend employees (real data)
        for (const e of backendEmployees) {
            const code = e.employeeCode ?? e._id
            if (seen.has(code)) continue
            const fullName = `${e.firstName ?? ""} ${e.lastName ?? ""}`.trim()
            if (!fullName) continue
            const dept = typeof e.departmentId === "object" && e.departmentId ? e.departmentId.name : undefined
            if (fullName.toLowerCase().includes(q) || code.toLowerCase().includes(q)) {
                seen.add(code)
                out.push({ empCode: code, name: fullName, dept })
                if (out.length >= 8) break
            }
        }
        // Fallback: payroll store employees (for dev-mode when backend empty)
        if (out.length < 8) {
            for (const e of payrollEmployees) {
                if (seen.has(e.empCode)) continue
                if (e.name.toLowerCase().includes(q) || e.empCode.toLowerCase().includes(q)) {
                    seen.add(e.empCode)
                    out.push({ empCode: e.empCode, name: e.name, dept: e.dept })
                    if (out.length >= 8) break
                }
            }
        }
        return out
    }, [transferEmpQuery, payrollEmployees, backendEmployees])

    const handleConfirmTransfer = () => {
        if (!transferEmpId || !transferEmpName) {
            toast({ title: "Select employee", description: "Pick an employee from the list.", variant: "destructive" })
            return
        }
        if (!transferFromId || !transferToId || transferFromId === transferToId) {
            toast({ title: "Invalid entities", description: "From and To entities must differ.", variant: "destructive" })
            return
        }
        if (!transferDate) {
            toast({ title: "Missing date", description: "Effective date required.", variant: "destructive" })
            return
        }
        const id = transferEmployee(transferEmpId, transferEmpName, transferFromId, transferToId, transferDate, {
            reason: transferReason.trim() || undefined,
            preservePF: transferPreservePF,
            preserveESI: transferPreserveESI,
            preserveGratuity: transferPreserveGratuity,
        })
        const toName = entities.find((e) => e.id === transferToId)?.name ?? ""
        toast({ title: "Transfer scheduled", description: `${transferEmpName} → ${toName} on ${transferDate} (${id}).` })
        setTransferOpen(false)
    }

    const openEntityCompliance = (entityId: string) => {
        setComplianceEntityId(entityId)
        setEntityComplianceOpen(true)
    }

    const openTransferDetail = (t: EntityTransfer) => {
        setViewingTransfer(t)
        setTransferDetailOpen(true)
    }

    const handleCompleteTransfer = (id: string) => {
        completeEntityTransfer(id)
        toast({ title: "Transfer completed", description: "Employee moved and entity counts updated." })
        setTransferDetailOpen(false)
    }

    const handleCancelTransfer = (id: string) => {
        cancelEntityTransfer(id)
        toast({ title: "Transfer cancelled", variant: "destructive" })
        setTransferDetailOpen(false)
    }

    const toggleRegSelect = (id: string) => {
        setSelectedRegIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
    }

    const toggleAllRegs = () => {
        if (selectedRegIds.length === filteredRegistrations.length) {
            setSelectedRegIds([])
        } else {
            setSelectedRegIds(filteredRegistrations.map((r) => r.id))
        }
    }

    const handleBulkRegStatus = (status: StatutoryRegistration["status"]) => {
        if (selectedRegIds.length === 0) return
        bulkUpdateRegistrationStatus(selectedRegIds, status)
        toast({ title: `Marked ${status}`, description: `${selectedRegIds.length} registration(s) updated.` })
        setSelectedRegIds([])
    }

    const handleRenewRegistration = (regId: string) => {
        updateRegistration(regId, { status: "Active" })
        toast({ title: "Registration renewed", description: "Status set to Active." })
    }

    // Per-entity summary lookups
    const allSummaries: EntityComplianceSummary[] = useMemo(
        () => getAllEntityComplianceSummaries(),
        // recompute whenever inputs change
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [entities, locations, registrations, entityPayrollStatus]
    )
    const singleSummary: EntityComplianceSummary | null = useMemo(
        () => complianceEntityId ? getEntityComplianceSummary(complianceEntityId) : null,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [complianceEntityId, entities, locations, registrations, entityPayrollStatus]
    )

    const handleExportComplianceSummary = () => {
        const headers = ["Entity", "Registrations", "Active", "Expired", "Locations", "Employees", "Last Payroll Month", "Last Payroll Status", "Health Score"]
        const rows = allSummaries.map((s) => [
            `"${s.entityName}"`,
            s.registrationCount,
            s.activeRegistrations,
            s.expiredCount,
            s.locationsCount,
            s.employeeCount,
            s.lastPayrollMonth ?? "",
            s.lastPayrollStatus ?? "",
            s.healthScore,
        ].join(","))
        const csv = [headers.join(","), ...rows].join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `entity_compliance_summary_${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        URL.revokeObjectURL(url)
        toast({ title: "Compliance summary exported" })
    }

    const filteredTransfers = useMemo(() => {
        return entityTransfers.filter((t) => {
            if (!searchTerm) return true
            const q = searchTerm.toLowerCase()
            return (
                t.employeeName.toLowerCase().includes(q) ||
                t.fromEntityName.toLowerCase().includes(q) ||
                t.toEntityName.toLowerCase().includes(q) ||
                (t.reason ?? "").toLowerCase().includes(q)
            )
        })
    }, [entityTransfers, searchTerm])

    // ── Render ─────────────────────────────────────────────
    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex flex-col h-full bg-[#f8fafc] font-sans overflow-y-auto">
                {/* Header */}
                <div className="h-auto min-h-[72px] bg-white border-b border-slate-200 px-6 lg:px-8 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] shrink-0">
                            <Building2 size={20} />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-lg lg:text-xl font-bold text-slate-900 tracking-tight truncate">Multi-Entity Payroll</h1>
                            <p className="text-xs font-medium text-slate-500">Legal entities, locations & statutory registrations</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setComplianceOpen(true)}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <ShieldCheck size={14} /> <span className="hidden md:inline">Compliance summary</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => openTransferDialog()}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <ArrowLeftRight size={14} /> <span className="hidden md:inline">Transfer employee</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleExport}
                            className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600"
                        >
                            <Download size={14} /> <span className="hidden md:inline">Export</span>
                        </Button>
                        {activeTab === "entities" && (
                            <Button onClick={openAddEntity} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2">
                                <Plus size={14} /> <span className="hidden md:inline">Add entity</span>
                            </Button>
                        )}
                        {activeTab === "locations" && (
                            <Button onClick={openAddLocation} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2">
                                <Plus size={14} /> <span className="hidden md:inline">Add location</span>
                            </Button>
                        )}
                        {activeTab === "registrations" && (
                            <Button onClick={openAddRegistration} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2">
                                <Plus size={14} /> <span className="hidden md:inline">Add registration</span>
                            </Button>
                        )}
                        {activeTab === "payroll-status" && (
                            <Button onClick={openAddStatus} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-9 px-4 font-bold text-xs border-none gap-2">
                                <Plus size={14} /> <span className="hidden md:inline">Add status</span>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex-1">
                    <div className="p-6 lg:p-8 space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard label="Entities" value={`${activeEntities}/${entities.length}`} caption="Active / total" icon={Building2} color="#8B5CF6" />
                            <StatCard label="Employees" value={String(totalEmployees)} caption="Across all locations" icon={Users} color="#0EA5E9" />
                            <StatCard label="Payroll cost" value={formatINR(totalCurrentCost)} caption="Processed + paid" icon={Wallet} color="#10B981" />
                            <StatCard label="Locations" value={String(locations.length)} caption={`${registrations.length} registrations`} icon={MapPin} color="#F59E0B" />
                        </div>

                        {/* Tabs */}
                        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                                <TabsList className="bg-slate-100 p-1 rounded-xl h-11">
                                    <TabsTrigger value="entities" className="rounded-lg px-4 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm">
                                        Entities ({entities.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="locations" className="rounded-lg px-4 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm">
                                        Locations ({locations.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="registrations" className="rounded-lg px-4 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm">
                                        Registrations ({registrations.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="payroll-status" className="rounded-lg px-4 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm">
                                        Payroll status
                                    </TabsTrigger>
                                    <TabsTrigger value="transfers" className="rounded-lg px-4 h-9 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-[#8B5CF6] data-[state=active]:shadow-sm">
                                        Transfers ({entityTransfers.length})
                                    </TabsTrigger>
                                </TabsList>
                                <div className="relative flex-1 min-w-[220px] lg:w-72 lg:flex-none">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        placeholder="Search across current tab..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9 h-9 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                                    />
                                </div>
                            </div>

                            {/* ── Entities tab ───────────────── */}
                            <TabsContent value="entities" className="mt-5">
                                {filteredEntities.length === 0 ? (
                                    <Card className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                                        <p className="text-sm font-medium text-slate-400">No entities found.</p>
                                    </Card>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        {filteredEntities.map((entity) => {
                                            const entityLocations = locations.filter((l) => l.entityId === entity.id)
                                            const entityRegistrations = registrations.filter((r) => r.entityId === entity.id)
                                            const entityEmpCount = entityLocations.reduce((s, l) => s + l.employeeCount, 0)
                                            const summary = getEntityComplianceSummary(entity.id)
                                            const healthColor = summary.healthScore >= 80 ? "bg-emerald-50 text-emerald-600" : summary.healthScore >= 60 ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                                            return (
                                                <Card
                                                    key={entity.id}
                                                    className={cn("rounded-2xl border shadow-sm hover:shadow-md transition-all",
                                                        entity.isActive ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50/70 opacity-75")}
                                                >
                                                    <CardContent className="p-5">
                                                        <div className="flex items-start justify-between gap-3 mb-3">
                                                            <div className="flex items-start gap-3 min-w-0">
                                                                <div className="h-11 w-11 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] shrink-0">
                                                                    <Building2 size={20} />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <h3 className="text-base font-bold text-slate-900 truncate">{entity.name}</h3>
                                                                        <Badge className={cn("border-none text-[9px] font-semibold px-2",
                                                                            entity.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500")}>
                                                                            {entity.isActive ? "Active" : "Inactive"}
                                                                        </Badge>
                                                                        <Badge className={cn("border-none text-[9px] font-semibold px-2 gap-1", healthColor)}>
                                                                            <Gauge size={9} /> Health: {summary.healthScore}
                                                                        </Badge>
                                                                        {summary.expiredCount > 0 && (
                                                                            <Badge className="bg-rose-50 text-rose-600 border-none text-[9px] font-semibold px-2 gap-1">
                                                                                <AlertTriangle size={9} /> {summary.expiredCount} expired
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-[11px] font-medium text-slate-500 mt-0.5 truncate">{entity.legalName}</p>
                                                                </div>
                                                            </div>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-slate-700">
                                                                        <MoreHorizontal size={15} />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-52">
                                                                    <DropdownMenuItem onClick={() => { setViewingEntity(entity); setEntityDetailOpen(true) }} className="cursor-pointer text-xs font-medium">
                                                                        <Eye size={13} className="mr-2" /> View details
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => openEditEntity(entity)} className="cursor-pointer text-xs font-medium">
                                                                        <Edit size={13} className="mr-2" /> Edit
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => openEntityCompliance(entity.id)} className="cursor-pointer text-xs font-medium">
                                                                        <Shield size={13} className="mr-2" /> View compliance
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem onClick={() => openCloneEntity(entity)} className="cursor-pointer text-xs font-medium">
                                                                        <Copy size={13} className="mr-2" /> Clone entity
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => openTransferDialog(entity)} className="cursor-pointer text-xs font-medium">
                                                                        <ArrowLeftRight size={13} className="mr-2" /> Transfer employees to
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem onClick={() => updateEntity(entity.id, { isActive: !entity.isActive })} className="cursor-pointer text-xs font-medium">
                                                                        {entity.isActive ? "Deactivate" : "Activate"}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => { setEntityDeleteTarget(entity.id); setEntityDeleteOpen(true) }}
                                                                        className="cursor-pointer text-xs font-medium text-rose-600 focus:text-rose-600"
                                                                    >
                                                                        <Trash2 size={13} className="mr-2" /> Delete
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                        <div className="grid grid-cols-4 gap-2 mb-3">
                                                            <StatBox label="GSTIN" value={entity.gstin || "—"} small />
                                                            <StatBox label="PAN" value={entity.pan || "—"} small />
                                                            <StatBox label="State" value={entity.state} small />
                                                            <StatBox label="Employees" value={String(entityEmpCount)} color="text-[#8B5CF6]" />
                                                        </div>
                                                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                                            <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
                                                                <div className="flex items-center gap-1">
                                                                    <MapPin size={11} /> {entityLocations.length} locations
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <ShieldCheck size={11} /> {entityRegistrations.length} registrations
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => { setViewingEntity(entity); setEntityDetailOpen(true) }}
                                                                className="h-7 text-[11px] font-semibold text-[#8B5CF6] hover:bg-[#8B5CF6]/5 px-2"
                                                            >
                                                                View <Eye size={11} className="ml-1" />
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                )}
                            </TabsContent>

                            {/* ── Locations tab ───────────────── */}
                            <TabsContent value="locations" className="mt-5">
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader className="bg-slate-50/70">
                                                    <TableRow className="border-slate-100 hover:bg-transparent">
                                                        <TableHead className="pl-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Location</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Entity</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Type</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Address</TableHead>
                                                        <TableHead className="text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Employees</TableHead>
                                                        <TableHead className="text-right pr-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredLocations.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={6} className="text-center py-12 text-slate-400 text-sm font-medium">
                                                                No locations yet. Click "Add location".
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        filteredLocations.map((l) => {
                                                            const entity = entities.find((e) => e.id === l.entityId)
                                                            return (
                                                                <TableRow key={l.id} className="border-slate-50 hover:bg-slate-50/70">
                                                                    <TableCell className="pl-6 py-3">
                                                                        <div className="flex items-center gap-2.5">
                                                                            <MapPin size={15} className="text-[#8B5CF6] shrink-0" />
                                                                            <div>
                                                                                <div className="text-sm font-semibold text-slate-900">{l.name}</div>
                                                                                <div className="text-[11px] font-medium text-slate-500">{l.city ?? ""}{l.state ? ` • ${l.state}` : ""}{l.pincode ? ` • ${l.pincode}` : ""}</div>
                                                                            </div>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="py-3 text-xs font-semibold text-slate-700">{entity?.name ?? "—"}</TableCell>
                                                                    <TableCell className="py-3">
                                                                        <Badge className="bg-slate-100 text-slate-600 border-none text-[10px] font-semibold">{l.type}</Badge>
                                                                    </TableCell>
                                                                    <TableCell className="py-3 text-xs font-medium text-slate-600 max-w-[280px] truncate">{l.address}</TableCell>
                                                                    <TableCell className="py-3 text-right text-sm font-bold text-slate-900 tabular-nums">{l.employeeCount}</TableCell>
                                                                    <TableCell className="text-right pr-6 py-3">
                                                                        <div className="flex justify-end gap-1">
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Button variant="ghost" size="sm" onClick={() => openEditLocation(l)} className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-[#8B5CF6] hover:bg-slate-100">
                                                                                        <Edit size={13} />
                                                                                    </Button>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>Edit</TooltipContent>
                                                                            </Tooltip>
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteLocation(l.id)} className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50">
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

                            {/* ── Registrations tab ───────────── */}
                            <TabsContent value="registrations" className="mt-5 space-y-3">
                                {selectedRegIds.length > 0 && (
                                    <div className="flex items-center justify-between gap-2 bg-[#8B5CF6]/5 border border-[#8B5CF6]/20 rounded-xl p-3">
                                        <div className="flex items-center gap-2 text-xs font-bold text-[#8B5CF6]">
                                            <Check size={14} /> {selectedRegIds.length} selected
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Button size="sm" onClick={() => handleBulkRegStatus("Active")} className="h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold gap-1 px-3 border-none">
                                                <CheckCircle2 size={12} /> Mark Active
                                            </Button>
                                            <Button size="sm" onClick={() => handleBulkRegStatus("Pending")} className="h-8 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold gap-1 px-3 border-none">
                                                <RefreshCw size={12} /> Mark Pending
                                            </Button>
                                            <Button size="sm" onClick={() => handleBulkRegStatus("Expired")} className="h-8 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-bold gap-1 px-3 border-none">
                                                <AlertTriangle size={12} /> Mark Expired
                                            </Button>
                                            <Button size="sm" onClick={() => handleBulkRegStatus("Suspended")} className="h-8 rounded-lg bg-slate-500 hover:bg-slate-600 text-white text-[11px] font-bold gap-1 px-3 border-none">
                                                <X size={12} /> Mark Suspended
                                            </Button>
                                            <Button size="sm" variant="ghost" onClick={() => setSelectedRegIds([])} className="h-8 text-[11px] font-semibold text-slate-600">
                                                Clear
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader className="bg-slate-50/70">
                                                    <TableRow className="border-slate-100 hover:bg-transparent">
                                                        <TableHead className="pl-6 w-10 h-10">
                                                            <Checkbox
                                                                checked={filteredRegistrations.length > 0 && selectedRegIds.length === filteredRegistrations.length}
                                                                onCheckedChange={toggleAllRegs}
                                                                aria-label="Select all"
                                                            />
                                                        </TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Entity</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Type</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Registration Number</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">State</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Issued / Expiry</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Status</TableHead>
                                                        <TableHead className="text-right pr-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredRegistrations.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={8} className="text-center py-12 text-slate-400 text-sm font-medium">
                                                                No registrations yet.
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        filteredRegistrations.map((r) => {
                                                            const entity = entities.find((e) => e.id === r.entityId)
                                                            return (
                                                                <TableRow key={r.id} className="border-slate-50 hover:bg-slate-50/70">
                                                                    <TableCell className="pl-6 py-3">
                                                                        <Checkbox
                                                                            checked={selectedRegIds.includes(r.id)}
                                                                            onCheckedChange={() => toggleRegSelect(r.id)}
                                                                            aria-label={`Select ${r.type}`}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell className="py-3 text-xs font-semibold text-slate-800">{entity?.name ?? "—"}</TableCell>
                                                                    <TableCell className="py-3 text-xs font-semibold text-slate-700">{r.type}</TableCell>
                                                                    <TableCell className="py-3 text-xs font-mono text-slate-800">{r.registrationNumber || "—"}</TableCell>
                                                                    <TableCell className="py-3 text-xs font-medium text-slate-600">{r.state ?? "—"}</TableCell>
                                                                    <TableCell className="py-3 text-[11px] font-medium text-slate-500">
                                                                        {r.issuedDate ?? "—"}{r.expiryDate ? ` → ${r.expiryDate}` : ""}
                                                                    </TableCell>
                                                                    <TableCell className="py-3">
                                                                        <Badge className={cn("border-none text-[10px] font-semibold px-2",
                                                                            r.status === "Active" ? "bg-emerald-50 text-emerald-600" :
                                                                                r.status === "Pending" ? "bg-amber-50 text-amber-600" :
                                                                                    r.status === "Expired" ? "bg-rose-50 text-rose-600" :
                                                                                        "bg-slate-100 text-slate-500")}>
                                                                            {r.status}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="text-right pr-6 py-3">
                                                                        <div className="flex justify-end gap-1">
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Button variant="ghost" size="sm" onClick={() => openEditRegistration(r)} className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-[#8B5CF6] hover:bg-slate-100">
                                                                                        <Edit size={13} />
                                                                                    </Button>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>Edit</TooltipContent>
                                                                            </Tooltip>
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteRegistration(r.id)} className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50">
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

                            {/* ── Payroll status tab ──────────── */}
                            <TabsContent value="payroll-status" className="mt-5 space-y-4">
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader className="bg-slate-50/70">
                                                    <TableRow className="border-slate-100 hover:bg-transparent">
                                                        <TableHead className="pl-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Entity</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Month</TableHead>
                                                        <TableHead className="text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Employees</TableHead>
                                                        <TableHead className="text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Total Cost</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Status</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Processed</TableHead>
                                                        <TableHead className="text-right pr-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredStatus.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={7} className="text-center py-12 text-slate-400 text-sm font-medium">
                                                                No payroll status records.
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        filteredStatus.map((s) => {
                                                            const entity = entities.find((e) => e.id === s.entityId)
                                                            return (
                                                                <TableRow key={s.id} className="border-slate-50 hover:bg-slate-50/70">
                                                                    <TableCell className="pl-6 py-3 text-sm font-semibold text-slate-900">{entity?.name ?? "—"}</TableCell>
                                                                    <TableCell className="py-3 text-xs font-semibold text-slate-700">{s.month}</TableCell>
                                                                    <TableCell className="py-3 text-right text-sm font-bold text-slate-900 tabular-nums">{s.employeeCount}</TableCell>
                                                                    <TableCell className="py-3 text-right text-sm font-bold text-[#8B5CF6] tabular-nums">{formatINR(s.totalCost)}</TableCell>
                                                                    <TableCell className="py-3">
                                                                        <Badge className={cn("border-none text-[10px] font-semibold px-2",
                                                                            s.status === "Paid" ? "bg-emerald-50 text-emerald-600" :
                                                                                s.status === "Processed" ? "bg-blue-50 text-blue-600" :
                                                                                    s.status === "Locked" ? "bg-[#8B5CF6]/10 text-[#8B5CF6]" :
                                                                                        s.status === "Processing" ? "bg-amber-50 text-amber-600" :
                                                                                            "bg-slate-100 text-slate-500")}>
                                                                            {s.status}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="py-3 text-[11px] font-medium text-slate-500">{s.processedDate ?? "—"}</TableCell>
                                                                    <TableCell className="text-right pr-6 py-3">
                                                                        <div className="flex justify-end gap-1">
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Button variant="ghost" size="sm" onClick={() => openEditStatus(s)} className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-[#8B5CF6] hover:bg-slate-100">
                                                                                        <Edit size={13} />
                                                                                    </Button>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>Edit</TooltipContent>
                                                                            </Tooltip>
                                                                            <Tooltip>
                                                                                <TooltipTrigger asChild>
                                                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteStatus(s.id)} className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50">
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

                                {/* Entity cost comparison */}
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <CardHeader className="p-4 lg:p-5 border-b border-slate-100">
                                        <CardTitle className="text-base font-bold text-slate-900">Entity cost distribution</CardTitle>
                                        <CardDescription className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                            Latest processed/paid payrolls per entity
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 lg:p-5">
                                        {(() => {
                                            const latestPerEntity = entities.map((e) => {
                                                const records = entityPayrollStatus
                                                    .filter((s) => s.entityId === e.id && (s.status === "Paid" || s.status === "Processed"))
                                                    .sort((a, b) => (b.month || "").localeCompare(a.month || ""))
                                                return { entity: e, latest: records[0] }
                                            }).filter((x) => x.latest)

                                            const maxCost = Math.max(1, ...latestPerEntity.map((x) => x.latest.totalCost))
                                            if (latestPerEntity.length === 0) {
                                                return <p className="text-xs font-medium text-slate-400 italic text-center py-6">No processed/paid payrolls yet.</p>
                                            }
                                            return (
                                                <div className="space-y-3">
                                                    {latestPerEntity.map((x) => (
                                                        <div key={x.entity.id} className="space-y-1.5">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <div className="flex items-center gap-2 min-w-0">
                                                                    <Building2 size={14} className="text-[#8B5CF6] shrink-0" />
                                                                    <span className="text-xs font-bold text-slate-700 truncate">{x.entity.name}</span>
                                                                    <span className="text-[10px] font-medium text-slate-400">• {x.latest.month}</span>
                                                                </div>
                                                                <span className="text-xs font-bold text-slate-900 tabular-nums">{formatINR(x.latest.totalCost)}</span>
                                                            </div>
                                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    className="h-full bg-[#8B5CF6] rounded-full"
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${(x.latest.totalCost / maxCost) * 100}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )
                                        })()}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* ── Transfers tab ───────────────── */}
                            <TabsContent value="transfers" className="mt-5">
                                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader className="bg-slate-50/70">
                                                    <TableRow className="border-slate-100 hover:bg-transparent">
                                                        <TableHead className="pl-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Employee</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">From → To</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Effective</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Preserve</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Status</TableHead>
                                                        <TableHead className="text-right pr-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider h-10">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredTransfers.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={6} className="text-center py-12 text-slate-400 text-sm font-medium">
                                                                No employee transfers yet. Click "Transfer employee" to create one.
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        filteredTransfers.map((t) => (
                                                            <TableRow key={t.id} className="border-slate-50 hover:bg-slate-50/70">
                                                                <TableCell className="pl-6 py-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="h-8 w-8 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] text-[11px] font-bold shrink-0">
                                                                            {t.employeeName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-xs font-semibold text-slate-900">{t.employeeName}</div>
                                                                            <div className="text-[10px] font-mono text-slate-500">{t.employeeId}</div>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="py-3 text-xs font-semibold text-slate-700">
                                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                                        <span className="text-slate-600">{t.fromEntityName}</span>
                                                                        <ArrowLeftRight size={11} className="text-[#8B5CF6]" />
                                                                        <span className="text-[#8B5CF6]">{t.toEntityName}</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="py-3 text-xs font-medium text-slate-700">
                                                                    <div className="flex items-center gap-1">
                                                                        <Calendar size={11} className="text-slate-400" /> {t.effectiveDate}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="py-3">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <div className={cn("h-6 px-2 rounded-md text-[10px] font-bold flex items-center gap-1",
                                                                                    t.preservePF ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400")}>
                                                                                    PF {t.preservePF ? <Check size={10} /> : <X size={10} />}
                                                                                </div>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>Provident Fund continuity</TooltipContent>
                                                                        </Tooltip>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <div className={cn("h-6 px-2 rounded-md text-[10px] font-bold flex items-center gap-1",
                                                                                    t.preserveESI ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400")}>
                                                                                    ESI {t.preserveESI ? <Check size={10} /> : <X size={10} />}
                                                                                </div>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>ESI continuity</TooltipContent>
                                                                        </Tooltip>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <div className={cn("h-6 px-2 rounded-md text-[10px] font-bold flex items-center gap-1",
                                                                                    t.preserveGratuity ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400")}>
                                                                                    GRT {t.preserveGratuity ? <Check size={10} /> : <X size={10} />}
                                                                                </div>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>Gratuity tenure</TooltipContent>
                                                                        </Tooltip>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="py-3">
                                                                    <Badge className={cn("border-none text-[10px] font-semibold px-2",
                                                                        t.status === "Completed" ? "bg-emerald-50 text-emerald-600" :
                                                                            t.status === "Scheduled" ? "bg-amber-50 text-amber-600" :
                                                                                "bg-rose-50 text-rose-600")}>
                                                                        {t.status}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-right pr-6 py-3">
                                                                    <div className="flex justify-end gap-1">
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Button variant="ghost" size="sm" onClick={() => openTransferDetail(t)} className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-[#8B5CF6] hover:bg-slate-100">
                                                                                    <Eye size={13} />
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>View detail</TooltipContent>
                                                                        </Tooltip>
                                                                        {t.status === "Scheduled" && (
                                                                            <>
                                                                                <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                        <Button variant="ghost" size="sm" onClick={() => handleCompleteTransfer(t.id)} className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-emerald-50">
                                                                                            <Check size={13} />
                                                                                        </Button>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent>Complete</TooltipContent>
                                                                                </Tooltip>
                                                                                <Tooltip>
                                                                                    <TooltipTrigger asChild>
                                                                                        <Button variant="ghost" size="sm" onClick={() => handleCancelTransfer(t.id)} className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50">
                                                                                            <X size={13} />
                                                                                        </Button>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent>Cancel</TooltipContent>
                                                                                </Tooltip>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
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

                {/* ── Entity Form Dialog ────────────── */}
                <Dialog open={entityFormOpen} onOpenChange={setEntityFormOpen}>
                    <DialogContent className="max-w-xl bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                {editingEntity ? <Edit size={20} /> : <Plus size={20} />}
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                {editingEntity ? "Edit entity" : "Add legal entity"}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Configure the legal entity used for payroll processing and statutory filings.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Display name" required>
                                    <Input value={entityForm.name} onChange={(e) => setEntityForm({ ...entityForm, name: e.target.value })} className="h-10 text-sm font-medium" placeholder="e.g. Fixl India" />
                                </FormField>
                                <FormField label="Legal name" required>
                                    <Input value={entityForm.legalName} onChange={(e) => setEntityForm({ ...entityForm, legalName: e.target.value })} className="h-10 text-sm font-medium" placeholder="Fixl Solutions Pvt. Ltd." />
                                </FormField>
                                <FormField label="GSTIN">
                                    <Input value={entityForm.gstin} onChange={(e) => setEntityForm({ ...entityForm, gstin: e.target.value.toUpperCase() })} className="h-10 text-sm font-mono font-semibold" placeholder="29AABCF1234D1ZF" maxLength={15} />
                                </FormField>
                                <FormField label="PAN">
                                    <Input value={entityForm.pan} onChange={(e) => setEntityForm({ ...entityForm, pan: e.target.value.toUpperCase() })} className="h-10 text-sm font-mono font-semibold" placeholder="AABCF1234D" maxLength={10} />
                                </FormField>
                                <FormField label="State" required>
                                    <Select value={entityForm.state} onValueChange={(v) => setEntityForm({ ...entityForm, state: v })}>
                                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="Employee count">
                                    <Input type="number" value={entityForm.employeeCount ?? 0} onChange={(e) => setEntityForm({ ...entityForm, employeeCount: parseInt(e.target.value) || 0 })} className="h-10 text-sm font-semibold tabular-nums" />
                                </FormField>
                            </div>
                            <FormField label="Registered address">
                                <Textarea value={entityForm.address} onChange={(e) => setEntityForm({ ...entityForm, address: e.target.value })} className="min-h-[60px] text-xs font-medium" placeholder="Full registered address" />
                            </FormField>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <div>
                                    <Label className="text-xs font-bold text-slate-700">Active</Label>
                                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">Inactive entities don't appear in payroll dropdowns</p>
                                </div>
                                <Switch checked={entityForm.isActive} onCheckedChange={(v) => setEntityForm({ ...entityForm, isActive: v })} className="data-[state=checked]:bg-[#8B5CF6]" />
                            </div>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setEntityFormOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleSaveEntity} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                {editingEntity ? "Save" : "Add entity"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Entity Delete Confirm ──────────── */}
                <Dialog open={entityDeleteOpen} onOpenChange={setEntityDeleteOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mb-2">
                                <Trash2 size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Delete entity?</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                This will also delete all associated locations, registrations, and payroll status records. Cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setEntityDeleteOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleDeleteEntity} className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                Delete everything
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Entity Detail Sheet ────────────── */}
                <Sheet open={entityDetailOpen} onOpenChange={setEntityDetailOpen}>
                    <SheetContent className="sm:max-w-lg p-0 font-sans">
                        {viewingEntity && (
                            <div className="h-full flex flex-col bg-white">
                                <SheetHeader className="bg-slate-50 p-6 border-b border-slate-100 space-y-2">
                                    <div className="flex items-start gap-3">
                                        <div className="h-14 w-14 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] shrink-0">
                                            <Building2 size={26} />
                                        </div>
                                        <div className="min-w-0">
                                            <Badge className={cn("border-none text-[10px] font-semibold px-2 py-0.5 mb-1",
                                                viewingEntity.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500")}>
                                                {viewingEntity.isActive ? "Active" : "Inactive"}
                                            </Badge>
                                            <SheetTitle className="text-lg font-bold text-slate-900 tracking-tight truncate">{viewingEntity.name}</SheetTitle>
                                            <SheetDescription className="text-[11px] font-medium text-slate-500 truncate">{viewingEntity.legalName}</SheetDescription>
                                        </div>
                                    </div>
                                </SheetHeader>
                                <ScrollArea className="flex-1">
                                    <div className="p-6 space-y-5">
                                        <section className="grid grid-cols-2 gap-3">
                                            <MetricCard label="GSTIN" value={viewingEntity.gstin || "—"} />
                                            <MetricCard label="PAN" value={viewingEntity.pan || "—"} />
                                            <MetricCard label="State" value={viewingEntity.state} />
                                            <MetricCard label="Employees" value={String(viewingEntity.employeeCount ?? 0)} />
                                        </section>

                                        <section>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Registered address</div>
                                            <p className="text-xs text-slate-700 leading-relaxed p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                {viewingEntity.address || "Not specified"}
                                            </p>
                                        </section>

                                        <section>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                Locations ({locations.filter((l) => l.entityId === viewingEntity.id).length})
                                            </div>
                                            <div className="space-y-1.5">
                                                {locations.filter((l) => l.entityId === viewingEntity.id).length === 0 ? (
                                                    <p className="text-xs text-slate-400 italic">No locations yet.</p>
                                                ) : (
                                                    locations.filter((l) => l.entityId === viewingEntity.id).map((l) => (
                                                        <div key={l.id} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg">
                                                            <MapPin size={13} className="text-[#8B5CF6] shrink-0" />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-xs font-semibold text-slate-800 truncate">{l.name}</div>
                                                                <div className="text-[10px] font-medium text-slate-500 truncate">{l.address}</div>
                                                            </div>
                                                            <Badge className="bg-white text-slate-600 border border-slate-200 text-[9px] font-semibold">{l.type}</Badge>
                                                            <span className="text-[10px] font-bold text-slate-500">{l.employeeCount}</span>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </section>

                                        <section>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                Registrations ({registrations.filter((r) => r.entityId === viewingEntity.id).length})
                                            </div>
                                            <div className="space-y-1.5">
                                                {registrations.filter((r) => r.entityId === viewingEntity.id).length === 0 ? (
                                                    <p className="text-xs text-slate-400 italic">No registrations yet.</p>
                                                ) : (
                                                    registrations.filter((r) => r.entityId === viewingEntity.id).map((r) => (
                                                        <div key={r.id} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg">
                                                            <ShieldCheck size={13} className="text-[#8B5CF6] shrink-0" />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-xs font-semibold text-slate-800 truncate">{r.type}</div>
                                                                <div className="text-[10px] font-mono text-slate-500 truncate">{r.registrationNumber || "—"}</div>
                                                            </div>
                                                            <Badge className={cn("border-none text-[9px] font-semibold",
                                                                r.status === "Active" ? "bg-emerald-50 text-emerald-600" :
                                                                    r.status === "Pending" ? "bg-amber-50 text-amber-600" :
                                                                        "bg-slate-100 text-slate-500")}>
                                                                {r.status}
                                                            </Badge>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </section>

                                        <section>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                                Payroll history ({entityPayrollStatus.filter((s) => s.entityId === viewingEntity.id).length})
                                            </div>
                                            <div className="space-y-1.5">
                                                {entityPayrollStatus.filter((s) => s.entityId === viewingEntity.id).length === 0 ? (
                                                    <p className="text-xs text-slate-400 italic">No payroll runs logged.</p>
                                                ) : (
                                                    entityPayrollStatus.filter((s) => s.entityId === viewingEntity.id).map((s) => (
                                                        <div key={s.id} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg">
                                                            <Activity size={13} className="text-[#8B5CF6] shrink-0" />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-xs font-semibold text-slate-800 truncate">{s.month}</div>
                                                                <div className="text-[10px] font-medium text-slate-500">{s.employeeCount} emp • {formatINR(s.totalCost)}</div>
                                                            </div>
                                                            <Badge className={cn("border-none text-[9px] font-semibold",
                                                                s.status === "Paid" ? "bg-emerald-50 text-emerald-600" :
                                                                    s.status === "Processed" ? "bg-blue-50 text-blue-600" :
                                                                        s.status === "Locked" ? "bg-[#8B5CF6]/10 text-[#8B5CF6]" :
                                                                            "bg-slate-100 text-slate-500")}>
                                                                {s.status}
                                                            </Badge>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </section>
                                    </div>
                                </ScrollArea>
                                <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex gap-2">
                                    <Button
                                        onClick={() => { openEditEntity(viewingEntity); setEntityDetailOpen(false) }}
                                        className="flex-1 h-10 bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg font-bold text-xs border-none"
                                    >
                                        <Edit size={13} className="mr-1.5" /> Edit entity
                                    </Button>
                                </div>
                            </div>
                        )}
                    </SheetContent>
                </Sheet>

                {/* ── Location Dialog ─────────────── */}
                <Dialog open={locationFormOpen} onOpenChange={setLocationFormOpen}>
                    <DialogContent className="max-w-lg bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <MapPin size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                {editingLocation ? "Edit location" : "Add location"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <FormField label="Entity" required>
                                <Select value={locationForm.entityId} onValueChange={(v) => setLocationForm({ ...locationForm, entityId: v })}>
                                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {entities.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </FormField>
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Location name" required>
                                    <Input value={locationForm.name} onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })} className="h-10 text-sm font-medium" placeholder="e.g. Bangalore HQ" />
                                </FormField>
                                <FormField label="Type">
                                    <Select value={locationForm.type} onValueChange={(v) => setLocationForm({ ...locationForm, type: v as EntityLocation["type"] })}>
                                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {LOCATION_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="City">
                                    <Input value={locationForm.city ?? ""} onChange={(e) => setLocationForm({ ...locationForm, city: e.target.value })} className="h-10 text-sm font-medium" />
                                </FormField>
                                <FormField label="State">
                                    <Select value={locationForm.state ?? ""} onValueChange={(v) => setLocationForm({ ...locationForm, state: v })}>
                                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="Pincode">
                                    <Input value={locationForm.pincode ?? ""} onChange={(e) => setLocationForm({ ...locationForm, pincode: e.target.value })} className="h-10 text-sm font-medium font-mono" maxLength={6} />
                                </FormField>
                                <FormField label="Employee count">
                                    <Input type="number" value={locationForm.employeeCount} onChange={(e) => setLocationForm({ ...locationForm, employeeCount: parseInt(e.target.value) || 0 })} className="h-10 text-sm font-semibold tabular-nums" />
                                </FormField>
                            </div>
                            <FormField label="Address">
                                <Textarea value={locationForm.address} onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })} className="min-h-[60px] text-xs font-medium" />
                            </FormField>
                            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                <Label className="text-xs font-bold text-slate-700">Active</Label>
                                <Switch checked={locationForm.isActive} onCheckedChange={(v) => setLocationForm({ ...locationForm, isActive: v })} className="data-[state=checked]:bg-[#8B5CF6]" />
                            </div>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setLocationFormOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleSaveLocation} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                {editingLocation ? "Save" : "Add location"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Registration Dialog ─────────── */}
                <Dialog open={registrationFormOpen} onOpenChange={setRegistrationFormOpen}>
                    <DialogContent className="max-w-lg bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <ShieldCheck size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                {editingRegistration ? "Edit registration" : "Add statutory registration"}
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Track regulatory registration numbers per entity.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <FormField label="Entity" required>
                                <Select value={registrationForm.entityId} onValueChange={(v) => setRegistrationForm({ ...registrationForm, entityId: v })}>
                                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {entities.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </FormField>
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Type" required>
                                    <Select value={registrationForm.type} onValueChange={(v) => setRegistrationForm({ ...registrationForm, type: v })}>
                                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {REGISTRATION_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="State">
                                    <Select value={registrationForm.state ?? ""} onValueChange={(v) => setRegistrationForm({ ...registrationForm, state: v })}>
                                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="Registration number">
                                    <Input value={registrationForm.registrationNumber} onChange={(e) => setRegistrationForm({ ...registrationForm, registrationNumber: e.target.value })} className="h-10 text-sm font-mono font-semibold" />
                                </FormField>
                                <FormField label="Status">
                                    <Select value={registrationForm.status} onValueChange={(v) => setRegistrationForm({ ...registrationForm, status: v as StatutoryRegistration["status"] })}>
                                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Expired">Expired</SelectItem>
                                            <SelectItem value="Suspended">Suspended</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="Issued date">
                                    <Input type="date" value={registrationForm.issuedDate ?? ""} onChange={(e) => setRegistrationForm({ ...registrationForm, issuedDate: e.target.value })} className="h-10 text-sm font-medium" />
                                </FormField>
                                <FormField label="Expiry date">
                                    <Input type="date" value={registrationForm.expiryDate ?? ""} onChange={(e) => setRegistrationForm({ ...registrationForm, expiryDate: e.target.value })} className="h-10 text-sm font-medium" />
                                </FormField>
                            </div>
                            <FormField label="Notes">
                                <Textarea value={registrationForm.notes ?? ""} onChange={(e) => setRegistrationForm({ ...registrationForm, notes: e.target.value })} className="min-h-[50px] text-xs font-medium" />
                            </FormField>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setRegistrationFormOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleSaveRegistration} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                {editingRegistration ? "Save" : "Add registration"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Status Dialog ────────────────── */}
                <Dialog open={statusFormOpen} onOpenChange={setStatusFormOpen}>
                    <DialogContent className="max-w-lg bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <Activity size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">
                                {editingStatus ? "Edit payroll status" : "Add entity payroll status"}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <FormField label="Entity" required>
                                <Select value={statusForm.entityId} onValueChange={(v) => setStatusForm({ ...statusForm, entityId: v })}>
                                    <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {entities.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </FormField>
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Month" required>
                                    <Input value={statusForm.month} onChange={(e) => setStatusForm({ ...statusForm, month: e.target.value })} className="h-10 text-sm font-medium" placeholder="April 2026" />
                                </FormField>
                                <FormField label="Status">
                                    <Select value={statusForm.status} onValueChange={(v) => setStatusForm({ ...statusForm, status: v as EntityPayrollStatus["status"] })}>
                                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Draft">Draft</SelectItem>
                                            <SelectItem value="Processing">Processing</SelectItem>
                                            <SelectItem value="Processed">Processed</SelectItem>
                                            <SelectItem value="Locked">Locked</SelectItem>
                                            <SelectItem value="Paid">Paid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="Employee count">
                                    <Input type="number" value={statusForm.employeeCount} onChange={(e) => setStatusForm({ ...statusForm, employeeCount: parseInt(e.target.value) || 0 })} className="h-10 text-sm font-semibold tabular-nums" />
                                </FormField>
                                <FormField label="Total cost (₹)">
                                    <Input type="number" value={statusForm.totalCost} onChange={(e) => setStatusForm({ ...statusForm, totalCost: parseFloat(e.target.value) || 0 })} className="h-10 text-sm font-semibold tabular-nums" />
                                </FormField>
                                <FormField label="Processed date">
                                    <Input type="date" value={statusForm.processedDate ?? ""} onChange={(e) => setStatusForm({ ...statusForm, processedDate: e.target.value })} className="h-10 text-sm font-medium" />
                                </FormField>
                            </div>
                            <FormField label="Notes">
                                <Textarea value={statusForm.notes ?? ""} onChange={(e) => setStatusForm({ ...statusForm, notes: e.target.value })} className="min-h-[50px] text-xs font-medium" />
                            </FormField>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setStatusFormOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleSaveStatus} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none">
                                {editingStatus ? "Save" : "Add status"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Clone Entity Dialog ─────────── */}
                <Dialog open={cloneEntOpen} onOpenChange={setCloneEntOpen}>
                    <DialogContent className="max-w-md bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <Copy size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Clone legal entity</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Duplicates the entity and its statutory registrations. New registrations are created in Pending status.
                            </DialogDescription>
                        </DialogHeader>
                        {cloneSource && (
                            <div className="mt-4 space-y-3">
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Source</div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Building2 size={14} className="text-[#8B5CF6]" />
                                        <div>
                                            <div className="text-sm font-bold text-slate-900">{cloneSource.name}</div>
                                            <div className="text-[11px] font-medium text-slate-500">{cloneSource.legalName}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 mt-2 text-[11px] font-semibold text-slate-600">
                                        <span className="flex items-center gap-1"><ShieldCheck size={11} /> {registrations.filter((r) => r.entityId === cloneSource.id).length} registration(s) will be cloned</span>
                                    </div>
                                </div>
                                <FormField label="New display name" required>
                                    <Input value={cloneName} onChange={(e) => setCloneName(e.target.value)} className="h-10 text-sm font-medium" placeholder="Fixl India (Subsidiary)" />
                                </FormField>
                                <FormField label="New legal name" required>
                                    <Input value={cloneLegalName} onChange={(e) => setCloneLegalName(e.target.value)} className="h-10 text-sm font-medium" placeholder="Fixl India Subsidiary Pvt. Ltd." />
                                </FormField>
                            </div>
                        )}
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setCloneEntOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleConfirmClone} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none gap-2">
                                <Copy size={13} /> Clone entity
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Transfer Employee Dialog ────── */}
                <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
                    <DialogContent className="max-w-xl bg-white rounded-2xl p-6 font-sans">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <ArrowLeftRight size={20} />
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900">Transfer employee between entities</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500">
                                Schedule an inter-entity transfer. Configure statutory continuity for PF, ESI, and gratuity tenure.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 space-y-3">
                            <FormField label="Employee" required>
                                <div className="relative">
                                    <Input
                                        value={transferEmpQuery}
                                        onChange={(e) => { setTransferEmpQuery(e.target.value); setTransferEmpId(""); setTransferEmpName("") }}
                                        className="h-10 text-sm font-medium"
                                        placeholder="Search by name or emp code..."
                                    />
                                    {transferEmpQuery && !transferEmpId && employeeMatches.length > 0 && (
                                        <div className="absolute z-40 left-0 right-0 top-[44px] bg-white border border-slate-200 rounded-xl shadow-lg max-h-[240px] overflow-y-auto">
                                            {employeeMatches.map((emp) => (
                                                <button
                                                    key={emp.empCode}
                                                    type="button"
                                                    onClick={() => { setTransferEmpId(emp.empCode); setTransferEmpName(emp.name); setTransferEmpQuery(`${emp.empCode} — ${emp.name}`) }}
                                                    className="w-full text-left px-3 py-2 hover:bg-slate-50 border-b border-slate-100 last:border-none flex items-center gap-2"
                                                >
                                                    <div className="h-7 w-7 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] text-[10px] font-bold shrink-0">
                                                        {emp.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="text-xs font-semibold text-slate-900 truncate">{emp.name}</div>
                                                        <div className="text-[10px] font-mono text-slate-500">{emp.empCode} • {emp.dept}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </FormField>
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="From entity" required>
                                    <Select value={transferFromId} onValueChange={setTransferFromId}>
                                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {entities.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="To entity" required>
                                    <Select value={transferToId} onValueChange={setTransferToId}>
                                        <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {entities.map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                                <FormField label="Effective date" required>
                                    <Input type="date" value={transferDate} onChange={(e) => setTransferDate(e.target.value)} className="h-10 text-sm font-medium" />
                                </FormField>
                            </div>
                            <FormField label="Reason">
                                <Textarea value={transferReason} onChange={(e) => setTransferReason(e.target.value)} className="min-h-[60px] text-xs font-medium" placeholder="Promotion, relocation, subsidiary move, etc." />
                            </FormField>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Preserve statutory continuity</div>
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-xs font-semibold text-slate-700">Preserve PF account</span>
                                    <Checkbox checked={transferPreservePF} onCheckedChange={(v) => setTransferPreservePF(!!v)} />
                                </label>
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-xs font-semibold text-slate-700">Preserve ESI</span>
                                    <Checkbox checked={transferPreserveESI} onCheckedChange={(v) => setTransferPreserveESI(!!v)} />
                                </label>
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-xs font-semibold text-slate-700">Preserve gratuity tenure</span>
                                    <Checkbox checked={transferPreserveGratuity} onCheckedChange={(v) => setTransferPreserveGratuity(!!v)} />
                                </label>
                            </div>
                        </div>
                        <DialogFooter className="mt-4 gap-2">
                            <Button variant="ghost" onClick={() => setTransferOpen(false)} className="h-10 font-semibold text-xs">Cancel</Button>
                            <Button onClick={handleConfirmTransfer} className="bg-[#8B5CF6] hover:bg-[#7c4dff] text-white rounded-lg h-10 px-5 font-bold text-xs border-none gap-2">
                                <ArrowLeftRight size={13} /> Schedule transfer
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Compliance Summary Dashboard ── */}
                <Dialog open={complianceOpen} onOpenChange={setComplianceOpen}>
                    <DialogContent className="max-w-4xl bg-white rounded-2xl p-6 font-sans max-h-[90vh] overflow-y-auto">
                        <DialogHeader className="space-y-1">
                            <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                <ShieldCheck size={20} />
                            </div>
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <DialogTitle className="text-lg font-bold text-slate-900">Entity compliance dashboard</DialogTitle>
                                    <DialogDescription className="text-xs font-medium text-slate-500">
                                        Health score aggregates registrations, locations, employees, and last payroll.
                                    </DialogDescription>
                                </div>
                                <Button variant="outline" onClick={handleExportComplianceSummary} className="h-9 rounded-lg border-slate-200 bg-white font-semibold text-xs gap-2 px-3 hover:bg-slate-50 text-slate-600 shrink-0">
                                    <Download size={14} /> Export summary CSV
                                </Button>
                            </div>
                        </DialogHeader>
                        <div className="mt-5">
                            {allSummaries.length === 0 ? (
                                <p className="text-sm font-medium text-slate-400 italic text-center py-12">No entities configured yet.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {allSummaries.map((s) => {
                                        const healthRing = s.healthScore >= 80 ? "#10B981" : s.healthScore >= 60 ? "#F59E0B" : "#F43F5E"
                                        const size = 60
                                        const stroke = 6
                                        const radius = (size - stroke) / 2
                                        const circ = 2 * Math.PI * radius
                                        const dash = (s.healthScore / 100) * circ
                                        return (
                                            <button
                                                key={s.entityId}
                                                type="button"
                                                onClick={() => openEntityCompliance(s.entityId)}
                                                className="text-left rounded-2xl border border-slate-200 bg-white hover:shadow-md transition-all p-4 space-y-3"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-start gap-2.5 min-w-0">
                                                        <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] shrink-0">
                                                            <Building2 size={18} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-sm font-bold text-slate-900 truncate">{s.entityName}</div>
                                                            <div className="text-[11px] font-medium text-slate-500">Compliance posture</div>
                                                        </div>
                                                    </div>
                                                    <div className="relative shrink-0" style={{ width: size, height: size }}>
                                                        <svg width={size} height={size} className="-rotate-90">
                                                            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E5E7EB" strokeWidth={stroke} />
                                                            <circle
                                                                cx={size / 2}
                                                                cy={size / 2}
                                                                r={radius}
                                                                fill="none"
                                                                stroke={healthRing}
                                                                strokeWidth={stroke}
                                                                strokeDasharray={`${dash} ${circ - dash}`}
                                                                strokeLinecap="round"
                                                            />
                                                        </svg>
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <span className="text-[11px] font-bold tabular-nums" style={{ color: healthRing }}>{s.healthScore}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <div className="p-2 bg-slate-50 rounded-lg">
                                                        <div className="text-[9px] font-bold text-slate-400 uppercase">Registrations</div>
                                                        <div className="text-xs font-bold text-slate-800 mt-0.5">
                                                            <span className="text-emerald-600">{s.activeRegistrations}</span>
                                                            <span className="text-slate-400"> / </span>
                                                            <span className="text-rose-600">{s.expiredCount}</span>
                                                        </div>
                                                        <div className="text-[9px] font-medium text-slate-400">active / expired</div>
                                                    </div>
                                                    <div className="p-2 bg-slate-50 rounded-lg">
                                                        <div className="text-[9px] font-bold text-slate-400 uppercase">Locations</div>
                                                        <div className="text-xs font-bold text-slate-800 mt-0.5 tabular-nums">{s.locationsCount}</div>
                                                    </div>
                                                    <div className="p-2 bg-slate-50 rounded-lg">
                                                        <div className="text-[9px] font-bold text-slate-400 uppercase">Employees</div>
                                                        <div className="text-xs font-bold text-slate-800 mt-0.5 tabular-nums">{s.employeeCount}</div>
                                                    </div>
                                                </div>
                                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-600">
                                                    <span className="flex items-center gap-1">
                                                        <Activity size={11} /> {s.lastPayrollMonth ?? "No payroll yet"}
                                                    </span>
                                                    {s.lastPayrollStatus && (
                                                        <Badge className={cn("border-none text-[9px] font-semibold",
                                                            s.lastPayrollStatus === "Paid" ? "bg-emerald-50 text-emerald-600" :
                                                                s.lastPayrollStatus === "Processed" ? "bg-blue-50 text-blue-600" :
                                                                    "bg-slate-100 text-slate-500")}>
                                                            {s.lastPayrollStatus}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* ── Per-Entity Compliance Detail ── */}
                <Dialog open={entityComplianceOpen} onOpenChange={setEntityComplianceOpen}>
                    <DialogContent className="max-w-2xl bg-white rounded-2xl p-6 font-sans max-h-[90vh] overflow-y-auto">
                        {singleSummary && (() => {
                            const s = singleSummary
                            const healthRing = s.healthScore >= 80 ? "#10B981" : s.healthScore >= 60 ? "#F59E0B" : "#F43F5E"
                            const regPct = s.registrationCount > 0 ? Math.round((s.activeRegistrations / s.registrationCount) * 100) : 0
                            const entityRegs = registrations.filter((r) => r.entityId === s.entityId)
                            return (
                                <>
                                    <DialogHeader className="space-y-1">
                                        <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                            <Target size={20} />
                                        </div>
                                        <DialogTitle className="text-lg font-bold text-slate-900">{s.entityName} — Compliance detail</DialogTitle>
                                        <DialogDescription className="text-xs font-medium text-slate-500">
                                            Per-entity health breakdown and registration renewals.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-5 space-y-5">
                                        <div className="flex items-center gap-5 p-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white">
                                            <div className="relative shrink-0" style={{ width: 100, height: 100 }}>
                                                {(() => {
                                                    const size = 100
                                                    const stroke = 10
                                                    const radius = (size - stroke) / 2
                                                    const circ = 2 * Math.PI * radius
                                                    const dash = (s.healthScore / 100) * circ
                                                    return (
                                                        <svg width={size} height={size} className="-rotate-90">
                                                            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E5E7EB" strokeWidth={stroke} />
                                                            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={healthRing} strokeWidth={stroke} strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
                                                        </svg>
                                                    )
                                                })()}
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className="text-2xl font-bold tabular-nums" style={{ color: healthRing }}>{s.healthScore}</span>
                                                    <span className="text-[9px] font-semibold text-slate-500 uppercase">/ 100</span>
                                                </div>
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-sm font-bold text-slate-900">Health score</div>
                                                <div className="text-xs font-medium text-slate-500 mt-0.5">
                                                    {s.healthScore >= 80 ? "Excellent compliance posture" : s.healthScore >= 60 ? "Some gaps to address" : "Immediate action required"}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                                                    <span>Active registrations</span>
                                                    <span className="tabular-nums text-[#8B5CF6]">{s.activeRegistrations} / {s.registrationCount}</span>
                                                </div>
                                                <Progress value={regPct} className="h-2" />
                                            </div>
                                            <div>
                                                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                                                    <span>Locations coverage</span>
                                                    <span className="tabular-nums text-[#8B5CF6]">{s.locationsCount}</span>
                                                </div>
                                                <Progress value={Math.min(100, s.locationsCount * 20)} className="h-2" />
                                            </div>
                                            <div>
                                                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                                                    <span>Employee coverage</span>
                                                    <span className="tabular-nums text-[#8B5CF6]">{s.employeeCount}</span>
                                                </div>
                                                <Progress value={Math.min(100, (s.employeeCount / 100) * 100)} className="h-2" />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                                                Registrations ({entityRegs.length})
                                            </div>
                                            <div className="space-y-1.5 max-h-[260px] overflow-y-auto">
                                                {entityRegs.length === 0 ? (
                                                    <p className="text-xs text-slate-400 italic">No registrations yet.</p>
                                                ) : (
                                                    entityRegs.map((r) => (
                                                        <div key={r.id} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg">
                                                            <ShieldCheck size={13} className="text-[#8B5CF6] shrink-0" />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-xs font-semibold text-slate-800 truncate">{r.type}</div>
                                                                <div className="text-[10px] font-mono text-slate-500 truncate">{r.registrationNumber || "—"} {r.expiryDate ? `• exp ${r.expiryDate}` : ""}</div>
                                                            </div>
                                                            <Badge className={cn("border-none text-[9px] font-semibold",
                                                                r.status === "Active" ? "bg-emerald-50 text-emerald-600" :
                                                                    r.status === "Pending" ? "bg-amber-50 text-amber-600" :
                                                                        r.status === "Expired" ? "bg-rose-50 text-rose-600" :
                                                                            "bg-slate-100 text-slate-500")}>
                                                                {r.status}
                                                            </Badge>
                                                            {r.status !== "Active" && (
                                                                <Button size="sm" variant="ghost" onClick={() => handleRenewRegistration(r.id)} className="h-7 text-[10px] font-bold text-[#8B5CF6] hover:bg-[#8B5CF6]/5 px-2 gap-1">
                                                                    <RefreshCw size={10} /> Renew
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )
                        })()}
                    </DialogContent>
                </Dialog>

                {/* ── Transfer Detail Dialog ──────── */}
                <Dialog open={transferDetailOpen} onOpenChange={setTransferDetailOpen}>
                    <DialogContent className="max-w-lg bg-white rounded-2xl p-6 font-sans">
                        {viewingTransfer && (
                            <>
                                <DialogHeader className="space-y-1">
                                    <div className="h-10 w-10 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center text-[#8B5CF6] mb-2">
                                        <GitBranch size={20} />
                                    </div>
                                    <DialogTitle className="text-lg font-bold text-slate-900">Transfer detail</DialogTitle>
                                    <DialogDescription className="text-xs font-medium text-slate-500">
                                        Reference: <span className="font-mono text-slate-700">{viewingTransfer.id}</span>
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4 space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                                        <div className="h-11 w-11 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] text-sm font-bold shrink-0">
                                            {viewingTransfer.employeeName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-bold text-slate-900">{viewingTransfer.employeeName}</div>
                                            <div className="text-[11px] font-mono text-slate-500">{viewingTransfer.employeeId}</div>
                                        </div>
                                        <Badge className={cn("ml-auto border-none text-[10px] font-semibold px-2",
                                            viewingTransfer.status === "Completed" ? "bg-emerald-50 text-emerald-600" :
                                                viewingTransfer.status === "Scheduled" ? "bg-amber-50 text-amber-600" :
                                                    "bg-rose-50 text-rose-600")}>
                                            {viewingTransfer.status}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">From</div>
                                            <div className="text-xs font-bold text-slate-900 mt-0.5">{viewingTransfer.fromEntityName}</div>
                                        </div>
                                        <div className="p-3 bg-[#8B5CF6]/5 rounded-xl border border-[#8B5CF6]/20">
                                            <div className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider">To</div>
                                            <div className="text-xs font-bold text-slate-900 mt-0.5">{viewingTransfer.toEntityName}</div>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Effective date</div>
                                            <div className="text-xs font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                                                <Calendar size={11} className="text-slate-400" /> {viewingTransfer.effectiveDate}
                                            </div>
                                        </div>
                                        {viewingTransfer.processedDate && (
                                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Processed</div>
                                                <div className="text-xs font-bold text-slate-900 mt-0.5">{viewingTransfer.processedDate}</div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Statutory continuity</div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge className={cn("border-none text-[10px] font-semibold gap-1",
                                                viewingTransfer.preservePF ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500")}>
                                                PF {viewingTransfer.preservePF ? <Check size={10} /> : <X size={10} />}
                                            </Badge>
                                            <Badge className={cn("border-none text-[10px] font-semibold gap-1",
                                                viewingTransfer.preserveESI ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500")}>
                                                ESI {viewingTransfer.preserveESI ? <Check size={10} /> : <X size={10} />}
                                            </Badge>
                                            <Badge className={cn("border-none text-[10px] font-semibold gap-1",
                                                viewingTransfer.preserveGratuity ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500")}>
                                                Gratuity {viewingTransfer.preserveGratuity ? <Check size={10} /> : <X size={10} />}
                                            </Badge>
                                        </div>
                                    </div>
                                    {viewingTransfer.reason && (
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Reason</div>
                                            <p className="text-xs text-slate-700 leading-relaxed p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                {viewingTransfer.reason}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <DialogFooter className="mt-4 gap-2">
                                    {viewingTransfer.status === "Scheduled" ? (
                                        <>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleCancelTransfer(viewingTransfer.id)}
                                                className="h-10 rounded-lg border-rose-200 bg-white text-rose-600 hover:bg-rose-50 font-bold text-xs gap-2"
                                            >
                                                <X size={13} /> Cancel transfer
                                            </Button>
                                            <Button
                                                onClick={() => handleCompleteTransfer(viewingTransfer.id)}
                                                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg h-10 px-5 font-bold text-xs border-none gap-2"
                                            >
                                                <Check size={13} /> Complete transfer
                                            </Button>
                                        </>
                                    ) : (
                                        <Button variant="ghost" onClick={() => setTransferDetailOpen(false)} className="h-10 font-semibold text-xs">Close</Button>
                                    )}
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
    )
}

// Subcomponents
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

const StatBox = ({ label, value, color, small }: { label: string; value: string; color?: string; small?: boolean }) => (
    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
        <div className={cn("font-bold mt-0.5", small ? "text-[11px]" : "text-xs", color ?? "text-slate-800", small && "truncate")}>{value}</div>
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

const MetricCard = ({ label, value, color }: { label: string; value: string; color?: string }) => (
    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
        <div className={cn("text-sm font-bold tabular-nums mt-0.5 font-mono", color ?? "text-slate-900")}>{value}</div>
    </div>
)

export default MultiEntityPage
