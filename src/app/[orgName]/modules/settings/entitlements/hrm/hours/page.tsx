"use client"

import React, { useState, useEffect, useMemo } from "react"
import {
    Clock,
    Sun,
    Timer,
    Plus,
    Pencil,
    Trash2,
    Moon,
    Loader2,
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
import { SideFormSheet, Field } from "@/shared/components/ui/side-form-sheet"
import { showSuccess, showWarning } from "@/utils/toast"
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

const DEFAULT_NEW_SHIFT = {
    shiftType: "morning",
    startTime: "09:00",
    endTime: "18:00",
    breakMinutes: 60,
    graceInMinutes: 15,
    graceOutMinutes: 15,
    halfDayAfterMinutes: 240,
    overtimeAfterMinutes: 60,
    isNightShift: false,
}

export default function WorkingHoursPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [shifts, setShifts] = useState<Shift[]>([])
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingShift, setEditingShift] = useState<Shift | null>(null)
    const [newShift, setNewShift] = useState(DEFAULT_NEW_SHIFT)

    const fetchShifts = async () => {
        try {
            setLoading(true)
            const response = await getActiveShifts()
            setShifts(response.data?.data || [])
        } catch (err) {
            // handled in hook
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
        if (diff < 0) diff += 24 * 60
        return Math.round((diff - shift.breakMinutes) / 60 * 10) / 10
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newShift.shiftType) return showWarning("Please select a shift type")
        try {
            setSaving(true)
            await createShift(newShift)
            showSuccess("Shift created successfully")
            setIsCreateOpen(false)
            setNewShift(DEFAULT_NEW_SHIFT)
            await fetchShifts()
        } finally {
            setSaving(false)
        }
    }

    const openEdit = (shift: Shift) => {
        setEditingShift({ ...shift })
        setIsEditOpen(true)
    }

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingShift) return
        try {
            setSaving(true)
            await updateShift(editingShift._id, {
                graceInMinutes: editingShift.graceInMinutes,
                graceOutMinutes: editingShift.graceOutMinutes,
            })
            showSuccess("Shift updated successfully")
            setIsEditOpen(false)
            setEditingShift(null)
            await fetchShifts()
        } finally {
            setSaving(false)
        }
    }

    const handleDisable = async (id: string) => {
        const confirmed = window.confirm("Disable this shift? It will be hidden from active lists.")
        if (!confirmed) return
        try {
            await disableShift(id)
            showSuccess("Shift disabled successfully")
            await fetchShifts()
        } catch (err) {
            // handled
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
            <div className="flex flex-col items-center justify-center gap-3 min-h-screen bg-transparent">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <p className="text-xs text-zinc-500 font-medium">Loading shifts...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Working Hours</h1>
                        <p className="text-sm text-zinc-500 mt-1">Define standard operating hours, shifts, and grace periods.</p>
                    </div>
                    <Button
                        onClick={() => { setNewShift(DEFAULT_NEW_SHIFT); setIsCreateOpen(true) }}
                        className="rounded-none bg-primary hover:bg-primary/90 font-medium text-xs h-8 gap-2 shadow-md shadow-primary/20 px-5"
                    >
                        <Plus size={14} /> New Shift
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Total Shifts</p>
                        <p className="text-white text-xl font-semibold mt-1">{totalShifts}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Active configurations</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Night Shifts</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{nightShiftCount}</p>
                        <p className="text-indigo-600 text-[10px] mt-1">Overnight schedules</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Avg Grace Period</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{avgGrace} min</p>
                        <p className="text-amber-600 text-[10px] mt-1">Late tolerance</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Day Shifts</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{totalShifts - nightShiftCount}</p>
                        <p className="text-emerald-600 text-[10px] mt-1">Standard schedules</p>
                    </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                        <h3 className="text-sm font-semibold text-zinc-900">Active Shifts</h3>
                        <p className="text-xs text-zinc-500 mt-0.5">Manage shift timings and grace periods.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-zinc-100/50 border-b border-zinc-100">
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Shift</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Timing</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Break</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Grace In</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Grace Out</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Daily Hrs</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Night</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {shifts.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center">
                                            <Clock className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
                                            <p className="text-sm text-zinc-500">No shifts configured yet</p>
                                        </td>
                                    </tr>
                                ) : (
                                    shifts.map((shift) => (
                                        <tr key={shift._id} className="hover:bg-primary/5 transition-colors">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 bg-primary/10 rounded-none border border-primary/10">
                                                        {getShiftIcon(shift.shiftType, shift.isNightShift)}
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-900 capitalize">{shift.shiftType} Shift</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-center text-xs font-semibold text-gray-900">{shift.startTime} - {shift.endTime}</td>
                                            <td className="px-6 py-3 text-center text-xs text-gray-600">{shift.breakMinutes} min</td>
                                            <td className="px-6 py-3 text-center text-xs text-gray-600">{shift.graceInMinutes} min</td>
                                            <td className="px-6 py-3 text-center text-xs text-gray-600">{shift.graceOutMinutes} min</td>
                                            <td className="px-6 py-3 text-center text-xs font-semibold text-gray-900">{getDailyHours(shift)}h</td>
                                            <td className="px-6 py-3 text-center">
                                                <span className={`text-[10px] px-2 py-0.5 rounded-none font-medium ${shift.isNightShift ? "bg-indigo-50 text-indigo-600" : "bg-zinc-50 text-zinc-400"}`}>
                                                    {shift.isNightShift ? "Yes" : "No"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-none" onClick={() => openEdit(shift)}>
                                                        <Pencil className="h-3.5 w-3.5 text-zinc-400" />
                                                    </Button>
                                                    <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-rose-50 rounded-none" onClick={() => handleDisable(shift._id)}>
                                                        <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create Shift sheet */}
            <SideFormSheet
                open={isCreateOpen}
                onOpenChange={(o) => { setIsCreateOpen(o); if (!o) setNewShift(DEFAULT_NEW_SHIFT) }}
                title="Create Shift"
                description="Define a new shift schedule with grace and overtime rules."
                icon={<Clock className="w-5 h-5" />}
                width="lg"
                onSubmit={handleCreate}
                submitLabel={saving ? "Creating..." : "Create Shift"}
                loading={saving}
            >
                <div className="space-y-4">
                    <Field label="Shift Type" required>
                        <Select value={newShift.shiftType} onValueChange={(v) => setNewShift({ ...newShift, shiftType: v })}>
                            <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="morning">Morning</SelectItem>
                                <SelectItem value="noon">Noon</SelectItem>
                                <SelectItem value="night">Night</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Start Time" required>
                            <Input
                                type="time"
                                value={newShift.startTime}
                                onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
                        </Field>
                        <Field label="End Time" required>
                            <Input
                                type="time"
                                value={newShift.endTime}
                                onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
                        </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Break (mins)">
                            <Input
                                type="number"
                                value={newShift.breakMinutes}
                                onChange={(e) => setNewShift({ ...newShift, breakMinutes: parseInt(e.target.value) || 0 })}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
                        </Field>
                        <Field label="Half Day After (mins)">
                            <Input
                                type="number"
                                value={newShift.halfDayAfterMinutes}
                                onChange={(e) => setNewShift({ ...newShift, halfDayAfterMinutes: parseInt(e.target.value) || 0 })}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
                        </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Grace In (mins)">
                            <Input
                                type="number"
                                value={newShift.graceInMinutes}
                                onChange={(e) => setNewShift({ ...newShift, graceInMinutes: parseInt(e.target.value) || 0 })}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
                        </Field>
                        <Field label="Grace Out (mins)">
                            <Input
                                type="number"
                                value={newShift.graceOutMinutes}
                                onChange={(e) => setNewShift({ ...newShift, graceOutMinutes: parseInt(e.target.value) || 0 })}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
                        </Field>
                    </div>

                    <Field label="Overtime After (mins)" hint="Time past end-of-shift before OT starts counting">
                        <Input
                            type="number"
                            value={newShift.overtimeAfterMinutes}
                            onChange={(e) => setNewShift({ ...newShift, overtimeAfterMinutes: parseInt(e.target.value) || 0 })}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-[#FAFBFC] border border-[#EEF1F6]">
                        <div>
                            <p className="text-[13px] font-semibold text-[#374151]">Night Shift</p>
                            <p className="text-[11.5px] text-[#9CA3AF]">Does this shift span midnight?</p>
                        </div>
                        <Switch checked={newShift.isNightShift} onCheckedChange={(v) => setNewShift({ ...newShift, isNightShift: v })} />
                    </div>
                </div>
            </SideFormSheet>

            {/* Edit Grace sheet */}
            <SideFormSheet
                open={isEditOpen}
                onOpenChange={(o) => { setIsEditOpen(o); if (!o) setEditingShift(null) }}
                title="Edit Grace Period"
                description="Update grace minutes for this shift."
                icon={<Timer className="w-5 h-5" />}
                width="md"
                onSubmit={handleSaveEdit}
                submitLabel={saving ? "Saving..." : "Save Changes"}
                loading={saving}
            >
                {editingShift && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-[#FAFBFC] border border-[#EEF1F6]">
                            <div className="p-2.5 bg-primary/10 rounded-none border border-primary/10">
                                {getShiftIcon(editingShift.shiftType, editingShift.isNightShift)}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900 capitalize">{editingShift.shiftType} Shift</p>
                                <p className="text-xs text-gray-500">{editingShift.startTime} - {editingShift.endTime}</p>
                            </div>
                        </div>

                        <Field label="Grace In (mins)">
                            <Input
                                type="number"
                                value={editingShift.graceInMinutes}
                                onChange={(e) => setEditingShift({ ...editingShift, graceInMinutes: parseInt(e.target.value) || 0 })}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
                        </Field>
                        <Field label="Grace Out (mins)">
                            <Input
                                type="number"
                                value={editingShift.graceOutMinutes}
                                onChange={(e) => setEditingShift({ ...editingShift, graceOutMinutes: parseInt(e.target.value) || 0 })}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
                        </Field>
                    </div>
                )}
            </SideFormSheet>
        </div>
    )
}
