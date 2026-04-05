"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
    Clock,
    Save,
    Calendar,
    Sun,
    Globe,
    Timer,
    Plus,
    Pencil,
    Trash2,
    Moon,
    Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { toast } from "sonner"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
    getActiveShifts,
    createShift,
    updateShift,
    disableShift,
} from "@/modules/hrm/hooks/hrmHooks"

interface Shift {
    _id: string
    shiftType: string
    startTime: string
    endTime: string
    breakMinutes: number
    graceInMinutes: number
    graceOutMinutes: number
    halfDayAfterMinutes: number
    overtimeAfterMinutes: number
    isNightShift: boolean
    isActive: boolean
}

export default function WorkingHoursPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [shifts, setShifts] = useState<Shift[]>([])
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingShift, setEditingShift] = useState<Shift | null>(null)
    const [newShift, setNewShift] = useState({
        shiftType: "morning",
        startTime: "09:00",
        endTime: "18:00",
        breakMinutes: 60,
        graceInMinutes: 15,
        graceOutMinutes: 15,
        halfDayAfterMinutes: 240,
        overtimeAfterMinutes: 60,
        isNightShift: false,
    })

    const fetchShifts = async () => {
        try {
            setLoading(true)
            const response = await getActiveShifts()
            setShifts(response.data?.data || [])
        } catch (err) {
            // error already handled in hook
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchShifts()
    }, [])

    const totalShifts = shifts.length
    const nightShiftCount = useMemo(() => shifts.filter(s => s.isNightShift).length, [shifts])
    const avgGrace = useMemo(() => {
        if (shifts.length === 0) return 0
        return Math.round(shifts.reduce((sum, s) => sum + s.graceInMinutes, 0) / shifts.length)
    }, [shifts])

    const getDailyHours = (shift: Shift) => {
        const [sh, sm] = shift.startTime.split(":").map(Number)
        const [eh, em] = shift.endTime.split(":").map(Number)
        let diff = (eh * 60 + em) - (sh * 60 + sm)
        if (diff < 0) diff += 24 * 60 // night shift wraps around
        return Math.round((diff - shift.breakMinutes) / 60 * 10) / 10
    }

    const handleCreate = async () => {
        if (!newShift.shiftType) return toast.error("Please select a shift type")
        try {
            setSaving(true)
            await createShift(newShift)
            toast.success("Shift created successfully")
            setIsCreateOpen(false)
            setNewShift({
                shiftType: "morning",
                startTime: "09:00",
                endTime: "18:00",
                breakMinutes: 60,
                graceInMinutes: 15,
                graceOutMinutes: 15,
                halfDayAfterMinutes: 240,
                overtimeAfterMinutes: 60,
                isNightShift: false,
            })
            await fetchShifts()
        } catch (err) {
            // error already handled in hook
        } finally {
            setSaving(false)
        }
    }

    const openEdit = (shift: Shift) => {
        setEditingShift({ ...shift })
        setIsEditOpen(true)
    }

    const handleSaveEdit = async () => {
        if (!editingShift) return
        try {
            setSaving(true)
            await updateShift(editingShift._id, {
                graceInMinutes: editingShift.graceInMinutes,
                graceOutMinutes: editingShift.graceOutMinutes,
            })
            toast.success("Shift updated successfully")
            setIsEditOpen(false)
            setEditingShift(null)
            await fetchShifts()
        } catch (err) {
            // error already handled in hook
        } finally {
            setSaving(false)
        }
    }

    const handleDisable = async (id: string) => {
        try {
            await disableShift(id)
            toast.success("Shift disabled successfully")
            await fetchShifts()
        } catch (err) {
            // error already handled in hook
        }
    }

    const getShiftIcon = (shiftType: string, isNight: boolean) => {
        if (isNight) return <Moon className="w-4 h-4 text-indigo-500" />
        if (shiftType === "morning") return <Sun className="w-4 h-4 text-amber-500" />
        if (shiftType === "noon") return <Clock className="w-4 h-4 text-orange-500" />
        return <Sun className="w-4 h-4 text-gray-500" />
    }

    if (loading) {
        return (
            <div className="font-outfit flex flex-col items-center justify-center gap-3 p-6 min-h-screen bg-[#fafafa]">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <p className="text-xs text-gray-500 font-medium">Loading shifts...</p>
            </div>
        )
    }

    return (
        <div className="font-outfit flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span>Hr Governance</span>
                    <span>/</span>
                    <span className="text-gray-900 font-semibold">Working Hours</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Shift Configuration</h1>
                        <p className="text-xs text-gray-500 font-medium">Define standard operating hours and work weeks.</p>
                    </div>
                    <Button
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5"
                        onClick={() => setIsCreateOpen(true)}
                    >
                        <Plus className="w-4 h-4" />
                        New Shift
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white/80">Total Shifts</p>
                                <p className="text-xl font-semibold text-white tracking-tight">{totalShifts}</p>
                                <p className="text-[10px] text-white/70">Active configurations</p>
                            </div>
                            <Clock className="w-5 h-5 text-white/80" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Night Shifts</p>
                                <p className="text-xl font-semibold text-gray-900">{nightShiftCount}</p>
                                <p className="text-[10px] text-gray-500">Overnight schedules</p>
                            </div>
                            <Moon className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Avg Grace Period</p>
                                <p className="text-xl font-semibold text-gray-900">{avgGrace} min</p>
                                <p className="text-[10px] text-gray-500">Late tolerance</p>
                            </div>
                            <Timer className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Day Shifts</p>
                                <p className="text-xl font-semibold text-gray-900">{totalShifts - nightShiftCount}</p>
                                <p className="text-[10px] text-gray-500">Standard schedules</p>
                            </div>
                            <Sun className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-sm font-semibold text-gray-900">Active Shifts</h2>
                    <p className="text-xs text-gray-500">Manage shift timings and grace periods.</p>
                </div>

                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 text-xs font-semibold text-gray-500">Shift</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Timing</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Break</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Grace In</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Grace Out</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Daily Hours</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Night</TableHead>
                            <TableHead className="py-3 text-right pr-4 text-xs font-semibold text-gray-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {shifts.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} className="py-8 text-center text-xs text-gray-400">
                                    No shifts configured. Create your first shift above.
                                </TableCell>
                            </TableRow>
                        )}
                        {shifts.map((shift) => (
                            <TableRow key={shift._id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                                            {getShiftIcon(shift.shiftType, shift.isNightShift)}
                                        </div>
                                        <span className="text-xs font-semibold text-gray-900 capitalize">{shift.shiftType} Shift</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <span className="text-xs font-semibold text-gray-900">{shift.startTime} - {shift.endTime}</span>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <span className="text-xs text-gray-600">{shift.breakMinutes} min</span>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <span className="text-xs text-gray-600">{shift.graceInMinutes} min</span>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <span className="text-xs text-gray-600">{shift.graceOutMinutes} min</span>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <span className="text-xs font-semibold text-gray-900">{getDailyHours(shift)}h</span>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <Badge variant="outline" className={`text-[10px] ${shift.isNightShift ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-gray-50 text-gray-400"}`}>
                                        {shift.isNightShift ? "Yes" : "No"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-gray-100 rounded-lg" onClick={() => openEdit(shift)}>
                                            <Pencil className="h-3.5 w-3.5 text-gray-400" />
                                        </Button>
                                        <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-rose-50 rounded-lg" onClick={() => handleDisable(shift._id)}>
                                            <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Create Shift Dialog */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
                    <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                        <DialogTitle className="text-white font-semibold">Create Shift</DialogTitle>
                        <DialogDescription className="text-blue-100 text-xs">
                            Define a new shift schedule.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 px-5 py-4">
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">Shift Type</Label>
                            <Select value={newShift.shiftType} onValueChange={(v) => setNewShift({ ...newShift, shiftType: v })}>
                                <SelectTrigger className="h-9 rounded-lg">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="morning">Morning</SelectItem>
                                    <SelectItem value="noon">Noon</SelectItem>
                                    <SelectItem value="night">Night</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label className="text-xs font-semibold text-gray-700">Start Time</Label>
                                <Input
                                    type="time"
                                    value={newShift.startTime}
                                    onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
                                    className="h-9 rounded-lg"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs font-semibold text-gray-700">End Time</Label>
                                <Input
                                    type="time"
                                    value={newShift.endTime}
                                    onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
                                    className="h-9 rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label className="text-xs font-semibold text-gray-700">Break (mins)</Label>
                                <Input
                                    type="number"
                                    value={newShift.breakMinutes}
                                    onChange={(e) => setNewShift({ ...newShift, breakMinutes: parseInt(e.target.value) || 0 })}
                                    className="h-9 rounded-lg"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs font-semibold text-gray-700">Half Day After (mins)</Label>
                                <Input
                                    type="number"
                                    value={newShift.halfDayAfterMinutes}
                                    onChange={(e) => setNewShift({ ...newShift, halfDayAfterMinutes: parseInt(e.target.value) || 0 })}
                                    className="h-9 rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label className="text-xs font-semibold text-gray-700">Grace In (mins)</Label>
                                <Input
                                    type="number"
                                    value={newShift.graceInMinutes}
                                    onChange={(e) => setNewShift({ ...newShift, graceInMinutes: parseInt(e.target.value) || 0 })}
                                    className="h-9 rounded-lg"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs font-semibold text-gray-700">Grace Out (mins)</Label>
                                <Input
                                    type="number"
                                    value={newShift.graceOutMinutes}
                                    onChange={(e) => setNewShift({ ...newShift, graceOutMinutes: parseInt(e.target.value) || 0 })}
                                    className="h-9 rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">Overtime After (mins)</Label>
                            <Input
                                type="number"
                                value={newShift.overtimeAfterMinutes}
                                onChange={(e) => setNewShift({ ...newShift, overtimeAfterMinutes: parseInt(e.target.value) || 0 })}
                                className="h-9 rounded-lg"
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg bg-gray-50">
                            <Label htmlFor="night-create" className="flex flex-col space-y-1">
                                <span className="text-xs font-semibold text-gray-700">Night Shift</span>
                                <span className="text-[10px] text-gray-500 font-normal">Does this shift span midnight?</span>
                            </Label>
                            <Switch id="night-create" checked={newShift.isNightShift} onCheckedChange={(v) => setNewShift({ ...newShift, isNightShift: v })} />
                        </div>
                    </div>
                    <DialogFooter className="px-5 pb-4">
                        <Button
                            onClick={handleCreate}
                            disabled={saving}
                            className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5"
                        >
                            {saving ? "Creating..." : "Create Shift"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Grace Minutes Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
                    <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                        <DialogTitle className="text-white font-semibold">Edit Grace Period</DialogTitle>
                        <DialogDescription className="text-blue-100 text-xs">
                            Update grace minutes for this shift.
                        </DialogDescription>
                    </DialogHeader>
                    {editingShift && (
                        <>
                            <div className="grid gap-4 px-5 py-4">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                                        {getShiftIcon(editingShift.shiftType, editingShift.isNightShift)}
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-900 capitalize">{editingShift.shiftType} Shift</p>
                                        <p className="text-[10px] text-gray-500">{editingShift.startTime} - {editingShift.endTime}</p>
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold text-gray-700">Grace In (mins)</Label>
                                    <Input
                                        type="number"
                                        value={editingShift.graceInMinutes}
                                        onChange={(e) => setEditingShift({ ...editingShift, graceInMinutes: parseInt(e.target.value) || 0 })}
                                        className="h-9 rounded-lg"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold text-gray-700">Grace Out (mins)</Label>
                                    <Input
                                        type="number"
                                        value={editingShift.graceOutMinutes}
                                        onChange={(e) => setEditingShift({ ...editingShift, graceOutMinutes: parseInt(e.target.value) || 0 })}
                                        className="h-9 rounded-lg"
                                    />
                                </div>
                            </div>
                            <DialogFooter className="px-5 pb-4">
                                <Button
                                    onClick={handleSaveEdit}
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
