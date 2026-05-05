"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
    Search,
    Plus,
    MoreVertical,
    Calendar,
    Plane,
    HeartPulse,
    RefreshCw,
    Ban,
    Loader2,
    Pencil,
    Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Switch } from "@/shared/components/ui/switch"
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
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { showSuccess, showWarning } from "@/utils/toast"
import {
    getActiveLeaveTypes,
    createLeaveType,
    updateLeaveType,
    disableLeaveType,
} from "@/modules/hrm/hooks/hrmHooks"

interface LeaveType {
    _id: string
    name: string
    code: string
    isPaid: boolean
    annualAllocation: number | null
    allowHalfDay: boolean
    isActive: boolean
    accrualType?: string
    monthlyAccrual?: number
    maxCarryForward: number
    allowEncashment?: boolean
    maxEncashable?: number
}

interface LeavePolicy {
    id: string
    name: string
    code: string
    days: number
    carryOver: boolean
    type: "Paid" | "Unpaid"
    allowHalfDay: boolean
    maxCarryForward: number
    _raw: LeaveType
}

function mapLeaveTypeToPolicy(lt: LeaveType): LeavePolicy {
    return {
        id: lt._id,
        name: lt.name,
        code: lt.code,
        days: lt.annualAllocation ?? 0,
        carryOver: (lt.maxCarryForward ?? 0) > 0,
        type: lt.isPaid ? "Paid" : "Unpaid",
        allowHalfDay: lt.allowHalfDay,
        maxCarryForward: lt.maxCarryForward ?? 0,
        _raw: lt,
    }
}

const DEFAULT_NEW = {
    name: "",
    code: "",
    days: 10,
    carryOver: false,
    type: "Paid" as "Paid" | "Unpaid",
    allowHalfDay: false,
    maxCarryForward: 0,
}

export default function LeavePoliciesPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<LeavePolicy | null>(null)
    const [newItem, setNewItem] = useState(DEFAULT_NEW)

    const [leaves, setLeaves] = useState<LeavePolicy[]>([])

    const fetchLeaveTypes = async () => {
        try {
            setLoading(true)
            const response = await getActiveLeaveTypes()
            const data: LeaveType[] = response.data?.data || []
            setLeaves(data.map(mapLeaveTypeToPolicy))
        } catch (err) {
            // handled in hook
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLeaveTypes()
    }, [])

    const filteredLeaves = useMemo(() => {
        if (!searchQuery) return leaves
        return leaves.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.code.toLowerCase().includes(searchQuery.toLowerCase()))
    }, [leaves, searchQuery])

    const totalPaidDays = useMemo(() => leaves.filter(l => l.type === "Paid").reduce((sum, l) => sum + l.days, 0), [leaves])
    const carryOverCount = useMemo(() => leaves.filter(l => l.carryOver).length, [leaves])
    const unpaidCount = useMemo(() => leaves.filter(l => l.type === "Unpaid").length, [leaves])

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newItem.name.trim()) return showWarning("Please enter leave name")
        if (!newItem.code || newItem.code.length < 2 || newItem.code.length > 10) return showWarning("Code must be 2-10 characters, uppercase")
        if (newItem.code !== newItem.code.toUpperCase()) return showWarning("Code must be uppercase")
        try {
            setSaving(true)
            await createLeaveType({
                name: newItem.name,
                code: newItem.code,
                isPaid: newItem.type === "Paid",
                annualAllocation: newItem.type === "Paid" ? newItem.days : null,
                allowHalfDay: newItem.allowHalfDay,
                maxCarryForward: newItem.carryOver ? newItem.maxCarryForward : 0,
            })
            showSuccess("Leave policy created")
            setIsCreateOpen(false)
            setNewItem(DEFAULT_NEW)
            await fetchLeaveTypes()
        } finally {
            setSaving(false)
        }
    }

    const openEdit = (policy: LeavePolicy) => {
        setEditingItem({ ...policy })
        setIsEditOpen(true)
    }

    const saveEdit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingItem || !editingItem.name.trim()) return showWarning("Please enter leave name")
        try {
            setSaving(true)
            await updateLeaveType(editingItem.id, {
                name: editingItem.name,
                annualAllocation: editingItem.type === "Paid" ? editingItem.days : null,
                allowHalfDay: editingItem.allowHalfDay,
                maxCarryForward: editingItem.carryOver ? editingItem.maxCarryForward : 0,
            })
            showSuccess("Leave policy updated")
            setIsEditOpen(false)
            setEditingItem(null)
            await fetchLeaveTypes()
        } finally {
            setSaving(false)
        }
    }

    const deleteLeave = async (id: string) => {
        const confirmed = window.confirm("Disable this leave policy? It won't be usable for new requests.")
        if (!confirmed) return
        try {
            await disableLeaveType(id)
            showSuccess("Leave policy disabled")
            await fetchLeaveTypes()
        } catch (err) {
            // handled
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 min-h-screen bg-transparent">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <p className="text-xs text-zinc-500 font-medium">Loading leave policies...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Leave Policies</h1>
                        <p className="text-sm text-zinc-500 mt-1">Configure vacation, sick days, accruals, and encashment rules.</p>
                    </div>
                    <Button
                        onClick={() => { setNewItem(DEFAULT_NEW); setIsCreateOpen(true) }}
                        className="rounded-none bg-primary hover:bg-primary/90 font-medium text-xs h-8 gap-2 shadow-md shadow-primary/20 px-5"
                    >
                        <Plus size={14} /> New Policy
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Total Policies</p>
                        <p className="text-white text-xl font-semibold mt-1">{leaves.length}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Defined categories</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Total Paid Days</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{totalPaidDays}</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Combined entitlement</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Carry-Over Enabled</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{carryOverCount}</p>
                        <p className="text-primary text-[10px] mt-1">Policies with rollover</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Unpaid Types</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{unpaidCount}</p>
                        <p className="text-amber-600 text-[10px] mt-1">No salary deduction</p>
                    </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            <Input
                                placeholder="Search policies or codes..."
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
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Leave Name</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Code</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Annual Days</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Carry Over</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Type</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {filteredLeaves.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <Calendar className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
                                            <p className="text-sm text-zinc-500">{searchQuery ? "No matching policies found" : "No leave policies configured yet"}</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLeaves.map((l) => (
                                        <tr key={l.id} className="hover:bg-primary/5 transition-colors">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 bg-primary/10 text-primary rounded-none border border-primary/10">
                                                        {l.name.toLowerCase().includes("sick") ? <HeartPulse className="w-4 h-4 text-rose-500" /> :
                                                            l.name.toLowerCase().includes("annual") ? <Plane className="w-4 h-4 text-primary" /> :
                                                                <Calendar className="w-4 h-4 text-primary" />}
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-900">{l.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <span className="bg-zinc-100 text-zinc-600 font-mono text-[10px] px-2 py-0.5 rounded-none border border-zinc-200">{l.code}</span>
                                            </td>
                                            <td className="px-6 py-3 text-center text-xs font-semibold text-gray-900">{l.days} Days</td>
                                            <td className="px-6 py-3 text-center">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-none font-medium ${l.carryOver ? "bg-emerald-50 text-emerald-600" : "bg-zinc-50 text-zinc-400"}`}>
                                                    {l.carryOver ? "Allowed" : "No"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-center text-xs text-gray-600">{l.type}</td>
                                            <td className="px-6 py-3 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-none">
                                                            <MoreVertical className="h-4 w-4 text-zinc-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40 rounded-none">
                                                        <DropdownMenuItem onClick={() => openEdit(l)} className="text-xs gap-2">
                                                            <Pencil size={12} /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-rose-600 text-xs gap-2" onClick={() => deleteLeave(l.id)}>
                                                            <Trash2 size={12} /> Disable
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

            {/* Create sheet */}
            <SideFormSheet
                open={isCreateOpen}
                onOpenChange={(o) => { setIsCreateOpen(o); if (!o) setNewItem(DEFAULT_NEW) }}
                title="Create Leave Policy"
                description="Define a new category of time off for employees."
                icon={<Plane className="w-5 h-5" />}
                width="md"
                onSubmit={handleCreate}
                submitLabel={saving ? "Creating..." : "Create Policy"}
                loading={saving}
                submitDisabled={!newItem.name.trim() || newItem.code.length < 2}
            >
                <div className="space-y-4">
                    <Field label="Policy Name" required>
                        <Input
                            placeholder="e.g. Paternity Leave"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>

                    <Field label="Code" required hint="2-10 characters, uppercase. Cannot be changed later.">
                        <Input
                            placeholder="e.g. PL"
                            value={newItem.code}
                            onChange={(e) => setNewItem({ ...newItem, code: e.target.value.toUpperCase() })}
                            maxLength={10}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary font-mono uppercase"
                        />
                    </Field>

                    <Field label="Annual Days">
                        <Input
                            type="number"
                            value={newItem.days}
                            onChange={(e) => setNewItem({ ...newItem, days: parseInt(e.target.value) || 0 })}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>

                    <Field label="Type" required>
                        <Select value={newItem.type} onValueChange={(v: "Paid" | "Unpaid") => setNewItem({ ...newItem, type: v })}>
                            <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Paid">Paid</SelectItem>
                                <SelectItem value="Unpaid">Unpaid</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-[#FAFBFC] border border-[#EEF1F6]">
                        <div>
                            <p className="text-[13px] font-semibold text-[#374151]">Allow Half Day</p>
                            <p className="text-[11.5px] text-[#9CA3AF]">Can employees take half-day leaves?</p>
                        </div>
                        <Switch checked={newItem.allowHalfDay} onCheckedChange={(v) => setNewItem({ ...newItem, allowHalfDay: v })} />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-[#FAFBFC] border border-[#EEF1F6]">
                        <div>
                            <p className="text-[13px] font-semibold text-[#374151]">Allow Carry Over</p>
                            <p className="text-[11.5px] text-[#9CA3AF]">Unused days move to next year?</p>
                        </div>
                        <Switch checked={newItem.carryOver} onCheckedChange={(v) => setNewItem({ ...newItem, carryOver: v })} />
                    </div>

                    {newItem.carryOver && (
                        <Field label="Max Carry Forward (days)">
                            <Input
                                type="number"
                                value={newItem.maxCarryForward}
                                onChange={(e) => setNewItem({ ...newItem, maxCarryForward: parseInt(e.target.value) || 0 })}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
                        </Field>
                    )}
                </div>
            </SideFormSheet>

            {/* Edit sheet */}
            <SideFormSheet
                open={isEditOpen}
                onOpenChange={(o) => { setIsEditOpen(o); if (!o) setEditingItem(null) }}
                title="Edit Leave Policy"
                description="Update this leave category."
                icon={<Pencil className="w-5 h-5" />}
                width="md"
                onSubmit={saveEdit}
                submitLabel={saving ? "Saving..." : "Save Changes"}
                loading={saving}
                submitDisabled={!editingItem || !editingItem.name.trim()}
            >
                {editingItem && (
                    <div className="space-y-4">
                        <Field label="Policy Name" required>
                            <Input
                                value={editingItem.name}
                                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
                        </Field>

                        <Field label="Code" hint="Code cannot be changed after creation">
                            <Input
                                value={editingItem.code}
                                disabled
                                className="h-11 rounded-lg border-[#E5E7EB] bg-[#F8FAFC] text-[#64748B] cursor-not-allowed font-mono"
                            />
                        </Field>

                        <Field label="Annual Days">
                            <Input
                                type="number"
                                value={editingItem.days}
                                onChange={(e) => setEditingItem({ ...editingItem, days: parseInt(e.target.value) || 0 })}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
                        </Field>

                        <Field label="Type" hint="Type cannot be changed after creation">
                            <Input
                                value={editingItem.type}
                                disabled
                                className="h-11 rounded-lg border-[#E5E7EB] bg-[#F8FAFC] text-[#64748B] cursor-not-allowed"
                            />
                        </Field>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-[#FAFBFC] border border-[#EEF1F6]">
                            <div>
                                <p className="text-[13px] font-semibold text-[#374151]">Allow Half Day</p>
                                <p className="text-[11.5px] text-[#9CA3AF]">Can employees take half-day leaves?</p>
                            </div>
                            <Switch checked={editingItem.allowHalfDay} onCheckedChange={(v) => setEditingItem({ ...editingItem, allowHalfDay: v })} />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-[#FAFBFC] border border-[#EEF1F6]">
                            <div>
                                <p className="text-[13px] font-semibold text-[#374151]">Allow Carry Over</p>
                                <p className="text-[11.5px] text-[#9CA3AF]">Unused days move to next year?</p>
                            </div>
                            <Switch checked={editingItem.carryOver} onCheckedChange={(v) => setEditingItem({ ...editingItem, carryOver: v })} />
                        </div>

                        {editingItem.carryOver && (
                            <Field label="Max Carry Forward (days)">
                                <Input
                                    type="number"
                                    value={editingItem.maxCarryForward}
                                    onChange={(e) => setEditingItem({ ...editingItem, maxCarryForward: parseInt(e.target.value) || 0 })}
                                    className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                                />
                            </Field>
                        )}
                    </div>
                )}
            </SideFormSheet>
        </div>
    )
}
