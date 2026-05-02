"use client"

import { useState, useEffect, useCallback } from "react"
import { DollarSign, Search, Plus, MoreVertical, Percent, Wallet, Loader2, Users, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Switch } from "@/shared/components/ui/switch"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/shared/components/ui/select"
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { showSuccess, showWarning } from "@/utils/toast"
import { getAllEmployees, getSalaryConfigs } from "@/modules/hrm/hooks/hrmHooks"
import { salaryComponentsApi, extractApiError } from "@/shared/api/settings-api"

interface SalaryComponent {
    id: string
    name: string
    code: string
    type: "Earning" | "Deduction" | "Employer Contribution"
    calculationType: "Fixed" | "Percentage"
    percentageOf: string
    value: number
    isTaxable: boolean
    isActive: boolean
}

const DEFAULT_COMPONENTS: SalaryComponent[] = [
    { id: "default-1", name: "Basic Salary", code: "BASIC", type: "Earning", calculationType: "Percentage", percentageOf: "CTC", value: 40, isTaxable: true, isActive: true },
    { id: "default-2", name: "House Rent Allowance", code: "HRA", type: "Earning", calculationType: "Percentage", percentageOf: "Basic", value: 50, isTaxable: true, isActive: true },
    { id: "default-3", name: "Dearness Allowance", code: "DA", type: "Earning", calculationType: "Percentage", percentageOf: "Basic", value: 10, isTaxable: true, isActive: true },
    { id: "default-4", name: "Provident Fund", code: "PF", type: "Deduction", calculationType: "Percentage", percentageOf: "Basic", value: 12, isTaxable: false, isActive: true },
    { id: "default-5", name: "Employer PF", code: "EPF", type: "Employer Contribution", calculationType: "Percentage", percentageOf: "Basic", value: 12, isTaxable: false, isActive: true },
    { id: "default-6", name: "Professional Tax", code: "PT", type: "Deduction", calculationType: "Fixed", percentageOf: "", value: 200, isTaxable: false, isActive: true },
    { id: "default-7", name: "Special Allowance", code: "SA", type: "Earning", calculationType: "Fixed", percentageOf: "", value: 0, isTaxable: true, isActive: true },
]

function mapComponentType(backendType: string): SalaryComponent["type"] {
    if (backendType === "DEDUCTION") return "Deduction"
    return "Earning"
}

function labelFromKey(key: string, label?: string): string {
    if (label) return label
    const map: Record<string, string> = {
        basic: "Basic Salary", hra: "House Rent Allowance", da: "Dearness Allowance",
        pf: "Provident Fund", epf: "Employer PF", pt: "Professional Tax",
        sa: "Special Allowance", conveyance: "Conveyance Allowance", medical: "Medical Allowance",
        bonus: "Bonus", esi: "ESI", tds: "TDS", gratuity: "Gratuity",
    }
    return map[key.toLowerCase()] || key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")
}

function extractComponentsFromConfigs(configs: any[]): SalaryComponent[] {
    const componentMap = new Map<string, SalaryComponent>()
    for (const config of configs) {
        const comps = config.components || []
        for (const comp of comps) {
            const key = (comp.key || "").toLowerCase()
            if (!key) continue
            if (!componentMap.has(key)) {
                const value = typeof comp.value === "object" && comp.value?.$numberDecimal
                    ? parseFloat(comp.value.$numberDecimal)
                    : parseFloat(comp.value?.toString() || "0")
                componentMap.set(key, {
                    id: comp._id || `config-${key}-${config._id}`,
                    name: labelFromKey(key, comp.label),
                    code: key.toUpperCase(),
                    type: mapComponentType(comp.type),
                    calculationType: comp.mode === "PERCENT" ? "Percentage" : "Fixed",
                    percentageOf: comp.mode === "PERCENT" ? "Basic" : "",
                    value,
                    isTaxable: comp.isTaxable !== false,
                    isActive: config.status === "Active",
                })
            }
        }
    }
    return Array.from(componentMap.values())
}

function deriveComponentsFromEmployees(employees: any[]): { components: SalaryComponent[]; totalCtc: number; avgCtc: number } {
    const employeesWithCtc = employees.filter((e: any) => e.salary?.ctc && e.salary.ctc > 0)
    const totalCtc = employeesWithCtc.reduce((sum: number, e: any) => sum + (e.salary?.ctc || 0), 0)
    const avgCtc = employeesWithCtc.length > 0 ? totalCtc / employeesWithCtc.length : 0
    if (employeesWithCtc.length > 0) {
        const avgMonthly = avgCtc / 12
        const basic = avgMonthly * 0.4
        return {
            components: [
                { id: "derived-1", name: "Basic Salary", code: "BASIC", type: "Earning", calculationType: "Percentage", percentageOf: "CTC", value: 40, isTaxable: true, isActive: true },
                { id: "derived-2", name: "House Rent Allowance", code: "HRA", type: "Earning", calculationType: "Percentage", percentageOf: "Basic", value: 50, isTaxable: true, isActive: true },
                { id: "derived-3", name: "Dearness Allowance", code: "DA", type: "Earning", calculationType: "Percentage", percentageOf: "Basic", value: 10, isTaxable: true, isActive: true },
                { id: "derived-4", name: "Provident Fund", code: "PF", type: "Deduction", calculationType: "Percentage", percentageOf: "Basic", value: 12, isTaxable: false, isActive: true },
                { id: "derived-5", name: "Employer PF", code: "EPF", type: "Employer Contribution", calculationType: "Percentage", percentageOf: "Basic", value: 12, isTaxable: false, isActive: true },
                { id: "derived-6", name: "Professional Tax", code: "PT", type: "Deduction", calculationType: "Fixed", percentageOf: "", value: 200, isTaxable: false, isActive: true },
                { id: "derived-7", name: "Special Allowance", code: "SA", type: "Earning", calculationType: "Fixed", percentageOf: "", value: Math.round(avgMonthly - basic - basic * 0.5 - basic * 0.1 - basic * 0.12 - 200), isTaxable: true, isActive: true },
            ],
            totalCtc,
            avgCtc,
        }
    }
    return { components: [], totalCtc: 0, avgCtc: 0 }
}

const DEFAULT_NEW = {
    name: "", code: "", type: "Earning" as SalaryComponent["type"],
    calculationType: "Fixed" as "Fixed" | "Percentage", percentageOf: "", value: 0, isTaxable: true,
}

export default function SalaryComponentsPage() {
    const [pageLoading, setPageLoading] = useState(true)
    const [components, setComponents] = useState<SalaryComponent[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editItem, setEditItem] = useState<SalaryComponent | null>(null)
    const [employeeCount, setEmployeeCount] = useState(0)
    const [newItem, setNewItem] = useState(DEFAULT_NEW)

    const fetchData = useCallback(async () => {
        try {
            const [employeeRes, salaryConfigRes] = await Promise.allSettled([
                getAllEmployees(),
                getSalaryConfigs({ status: "Active" }),
            ])
            let employees: any[] = []
            if (employeeRes.status === "fulfilled") {
                const empData = employeeRes.value?.data?.data || employeeRes.value?.data?.employees || []
                employees = Array.isArray(empData) ? empData : []
                setEmployeeCount(employees.length)
            }
            if (salaryConfigRes.status === "fulfilled") {
                const configs = salaryConfigRes.value?.data?.configs || salaryConfigRes.value?.data?.data || []
                if (Array.isArray(configs) && configs.length > 0) {
                    const extracted = extractComponentsFromConfigs(configs)
                    if (extracted.length > 0) {
                        setComponents(extracted)
                        return
                    }
                }
            }
            if (employees.length > 0) {
                const { components: derived } = deriveComponentsFromEmployees(employees)
                if (derived.length > 0) {
                    setComponents(derived)
                    return
                }
            }
            setComponents(DEFAULT_COMPONENTS)
        } catch {
            setComponents(DEFAULT_COMPONENTS)
        } finally {
            setPageLoading(false)
        }
    }, [])

    useEffect(() => { fetchData() }, [fetchData])

    const filtered = components.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const earnings = components.filter((c) => c.type === "Earning" && c.isActive).length
    const deductions = components.filter((c) => c.type === "Deduction" && c.isActive).length

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newItem.name.trim() || !newItem.code.trim()) return showWarning("Name and code are required")
        if (components.some((c) => c.code === newItem.code.toUpperCase())) return showWarning("Component code already exists")
        setComponents([...components, { ...newItem, id: Date.now().toString(), isActive: true }])
        setIsCreateOpen(false)
        setNewItem(DEFAULT_NEW)
        showSuccess("Salary component created")
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editItem) return
        setComponents(components.map((c) => (c.id === editItem.id ? editItem : c)))
        setIsEditOpen(false)
        setEditItem(null)
        showSuccess("Component updated")
    }

    const handleDelete = (id: string) => {
        const confirmed = window.confirm("Remove this component?")
        if (!confirmed) return
        setComponents(components.filter((c) => c.id !== id))
        showSuccess("Component removed")
    }

    if (pageLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-transparent">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Salary Components</h1>
                        <p className="text-sm text-zinc-500 mt-1">Define earnings, deductions, and employer contributions for payroll.</p>
                    </div>
                    <Button
                        onClick={() => { setNewItem(DEFAULT_NEW); setIsCreateOpen(true) }}
                        className="rounded-none bg-primary hover:bg-primary/90 font-medium text-xs h-8 gap-2 shadow-md shadow-primary/20 px-5"
                    >
                        <Plus size={14} /> New Component
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Total Components</p>
                        <p className="text-white text-xl font-semibold mt-1">{components.length}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Active in payroll</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Earnings</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{earnings}</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Pay components</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Deductions</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{deductions}</p>
                        <p className="text-rose-600 text-[10px] mt-1">Employee deductions</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Employees</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{employeeCount}</p>
                        <p className="text-primary text-[10px] mt-1">On payroll</p>
                    </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            <Input
                                placeholder="Search components or codes..."
                                className="pl-10 rounded-none border-zinc-200 h-10 text-xs font-medium focus:ring-primary bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Component</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Code</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Type</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Calculation</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Taxable</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <Wallet className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
                                            <p className="text-sm text-zinc-500">No components found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((c) => (
                                        <tr key={c.id} className="hover:bg-primary/5 transition-colors">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2.5 rounded-none border ${c.type === "Earning" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : c.type === "Deduction" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-primary/10 text-primary border-primary/10"}`}>
                                                        <DollarSign size={16} />
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-900">{c.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <span className="bg-zinc-100 text-zinc-600 font-mono text-[10px] px-2 py-0.5 rounded-none border border-zinc-200">{c.code}</span>
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <span className={`text-[10px] rounded-none px-2 py-0.5 font-medium ${c.type === "Earning" ? "bg-emerald-50 text-emerald-600" : c.type === "Deduction" ? "bg-rose-50 text-rose-600" : "bg-primary/10 text-primary"}`}>
                                                    {c.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-center text-xs font-semibold text-gray-900">
                                                {c.calculationType === "Percentage" ? `${c.value}% of ${c.percentageOf}` : `Fixed ₹${c.value}`}
                                            </td>
                                            <td className="px-6 py-3 text-center text-xs text-gray-600">{c.isTaxable ? "Yes" : "No"}</td>
                                            <td className="px-6 py-3 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-none">
                                                            <MoreVertical className="h-4 w-4 text-zinc-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40 rounded-none">
                                                        <DropdownMenuItem onClick={() => { setEditItem({ ...c }); setIsEditOpen(true) }} className="text-xs gap-2">
                                                            <Pencil size={12} /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-rose-600 text-xs gap-2" onClick={() => handleDelete(c.id)}>
                                                            <Trash2 size={12} /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create */}
            <SideFormSheet
                open={isCreateOpen}
                onOpenChange={(o) => { setIsCreateOpen(o); if (!o) setNewItem(DEFAULT_NEW) }}
                title="New Salary Component"
                description="Define a new payroll component for earnings or deductions."
                icon={<DollarSign className="w-5 h-5" />}
                width="md"
                onSubmit={handleCreate}
                submitLabel="Create Component"
                submitDisabled={!newItem.name.trim() || !newItem.code.trim()}
            >
                <div className="space-y-4">
                    <Field label="Name" required>
                        <Input
                            placeholder="e.g. Conveyance Allowance"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>
                    <Field label="Code" required hint="Short uppercase identifier">
                        <Input
                            placeholder="e.g. CA"
                            value={newItem.code}
                            onChange={(e) => setNewItem({ ...newItem, code: e.target.value.toUpperCase() })}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary font-mono uppercase"
                        />
                    </Field>
                    <Field label="Type" required>
                        <Select value={newItem.type} onValueChange={(v: SalaryComponent["type"]) => setNewItem({ ...newItem, type: v })}>
                            <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Earning">Earning</SelectItem>
                                <SelectItem value="Deduction">Deduction</SelectItem>
                                <SelectItem value="Employer Contribution">Employer Contribution</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Calculation">
                        <Select value={newItem.calculationType} onValueChange={(v: "Fixed" | "Percentage") => setNewItem({ ...newItem, calculationType: v })}>
                            <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Fixed">Fixed Amount</SelectItem>
                                <SelectItem value="Percentage">Percentage</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                    {newItem.calculationType === "Percentage" && (
                        <Field label="Percentage Of" hint="e.g. Basic, CTC, Gross">
                            <Input
                                placeholder="e.g. Basic"
                                value={newItem.percentageOf}
                                onChange={(e) => setNewItem({ ...newItem, percentageOf: e.target.value })}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
                        </Field>
                    )}
                    <Field label={newItem.calculationType === "Percentage" ? "Percentage (%)" : "Amount (₹)"}>
                        <Input
                            type="number"
                            value={newItem.value}
                            onChange={(e) => setNewItem({ ...newItem, value: parseFloat(e.target.value) || 0 })}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-[#FAFBFC] border border-[#EEF1F6]">
                        <div>
                            <p className="text-[13px] font-semibold text-[#374151]">Taxable</p>
                            <p className="text-[11.5px] text-[#9CA3AF]">Counts toward taxable income</p>
                        </div>
                        <Switch checked={newItem.isTaxable} onCheckedChange={(v) => setNewItem({ ...newItem, isTaxable: v })} />
                    </div>
                </div>
            </SideFormSheet>

            {/* Edit */}
            <SideFormSheet
                open={isEditOpen}
                onOpenChange={(o) => { setIsEditOpen(o); if (!o) setEditItem(null) }}
                title="Edit Component"
                description="Update this salary component."
                icon={<Pencil className="w-5 h-5" />}
                width="md"
                onSubmit={handleUpdate}
                submitLabel="Save Changes"
                submitDisabled={!editItem || !editItem.name.trim()}
            >
                {editItem && (
                    <div className="space-y-4">
                        <Field label="Name" required>
                            <Input
                                value={editItem.name}
                                onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
                        </Field>
                        <Field label="Type">
                            <Select value={editItem.type} onValueChange={(v: SalaryComponent["type"]) => setEditItem({ ...editItem, type: v })}>
                                <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Earning">Earning</SelectItem>
                                    <SelectItem value="Deduction">Deduction</SelectItem>
                                    <SelectItem value="Employer Contribution">Employer Contribution</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Value">
                            <Input
                                type="number"
                                value={editItem.value}
                                onChange={(e) => setEditItem({ ...editItem, value: parseFloat(e.target.value) || 0 })}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
                        </Field>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-[#FAFBFC] border border-[#EEF1F6]">
                            <p className="text-[13px] font-semibold text-[#374151]">Taxable</p>
                            <Switch checked={editItem.isTaxable} onCheckedChange={(v) => setEditItem({ ...editItem, isTaxable: v })} />
                        </div>
                    </div>
                )}
            </SideFormSheet>
        </div>
    )
}
