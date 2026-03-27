"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
    Search,
    Plus,
    MoreHorizontal,
    Calendar,
    Plane,
    HeartPulse,
    RefreshCw,
    Ban,
    Loader2,
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
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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

export default function LeavePoliciesPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<LeavePolicy | null>(null)
    const [newItem, setNewItem] = useState<{
        name: string
        code: string
        days: number
        carryOver: boolean
        type: "Paid" | "Unpaid"
        allowHalfDay: boolean
        maxCarryForward: number
    }>({
        name: "",
        code: "",
        days: 10,
        carryOver: false,
        type: "Paid",
        allowHalfDay: false,
        maxCarryForward: 0,
    })

    const [leaves, setLeaves] = useState<LeavePolicy[]>([])

    const fetchLeaveTypes = async () => {
        try {
            setLoading(true)
            const response = await getActiveLeaveTypes()
            const data: LeaveType[] = response.data?.data || []
            setLeaves(data.map(mapLeaveTypeToPolicy))
        } catch (err) {
            // error already handled in hook
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLeaveTypes()
    }, [])

    const filteredLeaves = useMemo(() => {
        if (!searchQuery) return leaves
        return leaves.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }, [leaves, searchQuery])

    const totalPaidDays = useMemo(() => leaves.filter(l => l.type === "Paid").reduce((sum, l) => sum + l.days, 0), [leaves])
    const carryOverCount = useMemo(() => leaves.filter(l => l.carryOver).length, [leaves])
    const unpaidCount = useMemo(() => leaves.filter(l => l.type === "Unpaid").length, [leaves])

    const handleCreate = async () => {
        if (!newItem.name) return toast.error("Please enter leave name")
        if (!newItem.code || newItem.code.length < 2 || newItem.code.length > 10) {
            return toast.error("Code must be 2-10 characters, uppercase")
        }
        if (newItem.code !== newItem.code.toUpperCase()) {
            return toast.error("Code must be uppercase")
        }
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
            toast.success("Leave policy created")
            setIsCreateOpen(false)
            setNewItem({ name: "", code: "", days: 10, carryOver: false, type: "Paid", allowHalfDay: false, maxCarryForward: 0 })
            await fetchLeaveTypes()
        } catch (err) {
            // error already handled in hook
        } finally {
            setSaving(false)
        }
    }

    const openEdit = (policy: LeavePolicy) => {
        setEditingItem({ ...policy })
        setIsEditOpen(true)
    }

    const saveEdit = async () => {
        if (!editingItem || !editingItem.name) return toast.error("Please enter leave name")
        try {
            setSaving(true)
            await updateLeaveType(editingItem.id, {
                name: editingItem.name,
                annualAllocation: editingItem.type === "Paid" ? editingItem.days : null,
                allowHalfDay: editingItem.allowHalfDay,
                maxCarryForward: editingItem.carryOver ? editingItem.maxCarryForward : 0,
            })
            toast.success("Leave policy updated")
            setIsEditOpen(false)
            setEditingItem(null)
            await fetchLeaveTypes()
        } catch (err) {
            // error already handled in hook
        } finally {
            setSaving(false)
        }
    }

    const deleteLeave = async (id: string) => {
        try {
            await disableLeaveType(id)
            toast.success("Leave policy disabled")
            await fetchLeaveTypes()
        } catch (err) {
            // error already handled in hook
        }
    }

    if (loading) {
        return (
            <div className="font-outfit flex flex-col items-center justify-center gap-3 p-6 min-h-screen bg-[#fafafa]">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <p className="text-xs text-gray-500 font-medium">Loading leave policies...</p>
            </div>
        )
    }

    return (
        <div className="font-outfit flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span>Hr Governance</span>
                    <span>/</span>
                    <span className="text-gray-900 font-semibold">Leave Policies</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Leave Policies</h1>
                        <p className="text-xs text-gray-500 font-medium">Configure vacation, sick days, and accruals.</p>
                    </div>
                    <Button
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5"
                        onClick={() => setIsCreateOpen(true)}
                    >
                        <Plus className="w-4 h-4" />
                        New Policy
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white/80">Total Policies</p>
                                <p className="text-xl font-semibold">{leaves.length}</p>
                                <p className="text-[10px] text-white/70">Defined categories</p>
                            </div>
                            <Plane className="w-5 h-5 text-white/80" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Total Paid Days</p>
                                <p className="text-xl font-semibold text-gray-900">{totalPaidDays}</p>
                                <p className="text-[10px] text-gray-500">Combined entitlement</p>
                            </div>
                            <Calendar className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Carry Over Enabled</p>
                                <p className="text-xl font-semibold text-gray-900">{carryOverCount}</p>
                                <p className="text-[10px] text-gray-500">Policies with rollover</p>
                            </div>
                            <RefreshCw className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Unpaid Types</p>
                                <p className="text-xl font-semibold text-gray-900">{unpaidCount}</p>
                                <p className="text-[10px] text-gray-500">No salary deduction</p>
                            </div>
                            <Ban className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <Input
                            placeholder="Search policies..."
                            className="pl-9 h-9 rounded-lg text-xs font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 text-xs font-semibold text-gray-500">Leave Name</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Code</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Annual Entitlement</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Carry Over</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Type</TableHead>
                            <TableHead className="py-3 text-right pr-4 text-xs font-semibold text-gray-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredLeaves.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="py-8 text-center text-xs text-gray-400">
                                    {searchQuery ? "No matching policies found." : "No leave policies configured yet."}
                                </TableCell>
                            </TableRow>
                        )}
                        {filteredLeaves.map((l) => (
                            <TableRow key={l.id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                                            {l.name.includes("Sick") ? <HeartPulse className="w-4 h-4 text-rose-500" /> :
                                                l.name.includes("Annual") ? <Plane className="w-4 h-4 text-blue-500" /> :
                                                    <Calendar className="w-4 h-4 text-gray-500" />}
                                        </div>
                                        <span className="text-xs font-semibold text-gray-900">{l.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <Badge variant="outline" className="text-[10px] bg-gray-50 text-gray-600 border-gray-200 font-mono">
                                        {l.code}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <span className="text-xs font-semibold text-gray-900">{l.days} Days</span>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <Badge variant="outline" className={`text-[10px] ${l.carryOver ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-gray-50 text-gray-400"}`}>
                                        {l.carryOver ? "Allowed" : "No"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <span className="text-xs text-gray-600">{l.type}</span>
                                </TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-gray-100 rounded-lg">
                                                <MoreHorizontal className="h-4 w-4 text-gray-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 shadow-xl border-gray-100">
                                            <DropdownMenuItem onClick={() => openEdit(l)}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-rose-600" onClick={() => deleteLeave(l.id)}>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Create Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
                    <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                        <DialogTitle className="text-white font-semibold">Create Leave Policy</DialogTitle>
                        <DialogDescription className="text-blue-100 text-xs">
                            Define a new category of time off.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 px-5 py-4">
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">Policy Name</Label>
                            <Input
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                placeholder="e.g. Paternity Leave"
                                className="h-9 rounded-lg"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">Code</Label>
                            <Input
                                value={newItem.code}
                                onChange={(e) => setNewItem({ ...newItem, code: e.target.value.toUpperCase() })}
                                placeholder="e.g. PL"
                                maxLength={10}
                                className="h-9 rounded-lg font-mono uppercase"
                            />
                            <p className="text-[10px] text-gray-400">2-10 characters, uppercase. Cannot be changed later.</p>
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">Annual Days</Label>
                            <Input
                                type="number"
                                value={newItem.days}
                                onChange={(e) => setNewItem({ ...newItem, days: parseInt(e.target.value) || 0 })}
                                className="h-9 rounded-lg"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">Type</Label>
                            <Select value={newItem.type} onValueChange={(v: "Paid" | "Unpaid") => setNewItem({ ...newItem, type: v })}>
                                <SelectTrigger className="h-9 rounded-lg">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Paid">Paid</SelectItem>
                                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg bg-gray-50">
                            <Label htmlFor="halfday-create" className="flex flex-col space-y-1">
                                <span className="text-xs font-semibold text-gray-700">Allow Half Day</span>
                                <span className="text-[10px] text-gray-500 font-normal">Can employees take half-day leaves?</span>
                            </Label>
                            <Switch id="halfday-create" checked={newItem.allowHalfDay} onCheckedChange={(v) => setNewItem({ ...newItem, allowHalfDay: v })} />
                        </div>
                        <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg bg-gray-50">
                            <Label htmlFor="carry-create" className="flex flex-col space-y-1">
                                <span className="text-xs font-semibold text-gray-700">Allow Carry Over</span>
                                <span className="text-[10px] text-gray-500 font-normal">Unused days move to next year?</span>
                            </Label>
                            <Switch id="carry-create" checked={newItem.carryOver} onCheckedChange={(v) => setNewItem({ ...newItem, carryOver: v })} />
                        </div>
                        {newItem.carryOver && (
                            <div className="grid gap-2">
                                <Label className="text-xs font-semibold text-gray-700">Max Carry Forward (days)</Label>
                                <Input
                                    type="number"
                                    value={newItem.maxCarryForward}
                                    onChange={(e) => setNewItem({ ...newItem, maxCarryForward: parseInt(e.target.value) || 0 })}
                                    className="h-9 rounded-lg"
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter className="px-5 pb-4">
                        <Button
                            onClick={handleCreate}
                            disabled={saving}
                            className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5"
                        >
                            {saving ? "Creating..." : "Create Policy"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
                    <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                        <DialogTitle className="text-white font-semibold">Edit Leave Policy</DialogTitle>
                        <DialogDescription className="text-blue-100 text-xs">
                            Update this leave category.
                        </DialogDescription>
                    </DialogHeader>
                    {editingItem && (
                        <>
                            <div className="grid gap-4 px-5 py-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold text-gray-700">Policy Name</Label>
                                    <Input
                                        value={editingItem.name}
                                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                        className="h-9 rounded-lg"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold text-gray-700">Code</Label>
                                    <Input
                                        value={editingItem.code}
                                        disabled
                                        className="h-9 rounded-lg font-mono bg-gray-50 text-gray-400 cursor-not-allowed"
                                    />
                                    <p className="text-[10px] text-gray-400">Code cannot be changed after creation.</p>
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold text-gray-700">Annual Days</Label>
                                    <Input
                                        type="number"
                                        value={editingItem.days}
                                        onChange={(e) => setEditingItem({ ...editingItem, days: parseInt(e.target.value) || 0 })}
                                        className="h-9 rounded-lg"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold text-gray-700">Type</Label>
                                    <Input
                                        value={editingItem.type}
                                        disabled
                                        className="h-9 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
                                    />
                                    <p className="text-[10px] text-gray-400">Type cannot be changed after creation.</p>
                                </div>
                                <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg bg-gray-50">
                                    <Label htmlFor="halfday-edit" className="flex flex-col space-y-1">
                                        <span className="text-xs font-semibold text-gray-700">Allow Half Day</span>
                                        <span className="text-[10px] text-gray-500 font-normal">Can employees take half-day leaves?</span>
                                    </Label>
                                    <Switch id="halfday-edit" checked={editingItem.allowHalfDay} onCheckedChange={(v) => setEditingItem({ ...editingItem, allowHalfDay: v })} />
                                </div>
                                <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg bg-gray-50">
                                    <Label htmlFor="carry-edit" className="flex flex-col space-y-1">
                                        <span className="text-xs font-semibold text-gray-700">Allow Carry Over</span>
                                        <span className="text-[10px] text-gray-500 font-normal">Unused days move to next year?</span>
                                    </Label>
                                    <Switch id="carry-edit" checked={editingItem.carryOver} onCheckedChange={(v) => setEditingItem({ ...editingItem, carryOver: v })} />
                                </div>
                                {editingItem.carryOver && (
                                    <div className="grid gap-2">
                                        <Label className="text-xs font-semibold text-gray-700">Max Carry Forward (days)</Label>
                                        <Input
                                            type="number"
                                            value={editingItem.maxCarryForward}
                                            onChange={(e) => setEditingItem({ ...editingItem, maxCarryForward: parseInt(e.target.value) || 0 })}
                                            className="h-9 rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>
                            <DialogFooter className="px-5 pb-4">
                                <Button
                                    onClick={saveEdit}
                                    disabled={saving}
                                    className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
