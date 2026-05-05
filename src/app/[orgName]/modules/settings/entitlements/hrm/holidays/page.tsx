"use client"

import { useState, useEffect, useMemo } from "react"
import {
    CalendarDays,
    Search,
    Plus,
    MoreVertical,
    Flag,
    Star,
    Loader2,
    MapPin,
    Pencil,
    Trash2,
} from "lucide-react"
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
import {
    getHolidaysByYear,
    createHoliday,
    updateHoliday,
    deleteHoliday,
} from "@/modules/hrm/hooks/hrmHooks"

interface Holiday {
    _id: string
    name: string
    date: string
    type: "National" | "Optional"
    isPaid: boolean
    isMandatory: boolean
    isActive: boolean
}

const DEFAULT_NEW = {
    name: "",
    date: "",
    type: "National" as "National" | "Optional",
    isPaid: true,
    isMandatory: true,
}

export default function HolidayCalendarPage() {
    const [holidays, setHolidays] = useState<Holiday[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()))
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editItem, setEditItem] = useState<Holiday | null>(null)
    const [newItem, setNewItem] = useState(DEFAULT_NEW)

    const fetchHolidays = async () => {
        setLoading(true)
        try {
            const response = await getHolidaysByYear(selectedYear)
            setHolidays(response?.data?.data || [])
        } catch {
            // handled
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchHolidays()
    }, [selectedYear])

    const nationalCount = holidays.filter((h) => h.type === "National").length
    const optionalCount = holidays.filter((h) => h.type === "Optional").length
    const paidCount = holidays.filter((h) => h.isPaid).length

    const filtered = useMemo(() => {
        if (!searchQuery) return holidays
        return holidays.filter((h) =>
            h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            h.type.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [holidays, searchQuery])

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newItem.name.trim() || !newItem.date) return showWarning("Name and date are required")
        setSaving(true)
        try {
            await createHoliday(newItem)
            showSuccess("Holiday created")
            setIsCreateOpen(false)
            setNewItem(DEFAULT_NEW)
            await fetchHolidays()
        } finally {
            setSaving(false)
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editItem) return
        setSaving(true)
        try {
            await updateHoliday(editItem._id, {
                name: editItem.name,
                type: editItem.type,
                isPaid: editItem.isPaid,
                isMandatory: editItem.isMandatory,
            })
            showSuccess("Holiday updated")
            setIsEditOpen(false)
            setEditItem(null)
            await fetchHolidays()
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm("Delete this holiday?")
        if (!confirmed) return
        try {
            await deleteHoliday(id)
            showSuccess("Holiday deleted")
            await fetchHolidays()
        } catch {}
    }

    const openEdit = (h: Holiday) => {
        setEditItem({ ...h })
        setIsEditOpen(true)
    }

    const currentYear = new Date().getFullYear()
    const years = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2]

    if (loading) {
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
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Holiday Calendar</h1>
                        <p className="text-sm text-zinc-500 mt-1">Manage national and optional holidays for the organization.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="h-8 w-[100px] rounded-none text-xs font-medium border-zinc-200 bg-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((y) => (
                                    <SelectItem key={y} value={String(y)} className="text-xs">{y}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            onClick={() => { setNewItem(DEFAULT_NEW); setIsCreateOpen(true) }}
                            className="rounded-none bg-primary hover:bg-primary/90 font-medium text-xs h-8 gap-2 shadow-md shadow-primary/20 px-5"
                        >
                            <Plus size={14} /> Add Holiday
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-primary/80 to-primary p-6 rounded-none shadow-xl shadow-primary/20 text-white">
                        <p className="text-white text-xs opacity-80">Total Holidays</p>
                        <p className="text-white text-xl font-semibold mt-1">{holidays.length}</p>
                        <p className="text-white text-[10px] mt-1 opacity-70">Year {selectedYear}</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">National</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{nationalCount}</p>
                        <p className="text-primary text-[10px] mt-1">Mandatory holidays</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Optional</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{optionalCount}</p>
                        <p className="text-amber-600 text-[10px] mt-1">Employee choice</p>
                    </div>

                    <div className="bg-white border border-zinc-200 p-6 rounded-none shadow-lg">
                        <p className="text-zinc-500 text-xs">Paid Holidays</p>
                        <p className="text-xl font-semibold text-zinc-900 mt-1">{paidCount}</p>
                        <p className="text-emerald-600 text-[10px] mt-1">With full pay</p>
                    </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded-none shadow-lg overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                            <Input
                                placeholder="Search holidays..."
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
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500">Holiday</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Date</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Type</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Paid</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-center">Mandatory</th>
                                    <th className="px-6 py-3 text-[11px] font-medium text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <CalendarDays className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
                                            <p className="text-sm text-zinc-500">{searchQuery ? "No matching holidays" : `No holidays configured for ${selectedYear}`}</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((h) => (
                                        <tr key={h._id} className="hover:bg-primary/5 transition-colors">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 bg-primary/10 text-primary rounded-none border border-primary/10">
                                                        <CalendarDays size={16} />
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-900">{h.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-center text-xs font-semibold text-gray-900">
                                                {new Date(h.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <span className={`text-[10px] rounded-none px-2 py-0.5 font-medium ${h.type === "National" ? "bg-primary/10 text-primary" : "bg-amber-50 text-amber-600"}`}>
                                                    {h.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <span className={`text-[10px] rounded-none px-2 py-0.5 font-medium ${h.isPaid ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-400"}`}>
                                                    {h.isPaid ? "Paid" : "Unpaid"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-center text-xs text-gray-600">{h.isMandatory ? "Yes" : "No"}</td>
                                            <td className="px-6 py-3 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-zinc-100 rounded-none">
                                                            <MoreVertical className="h-4 w-4 text-zinc-400" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-40 rounded-none">
                                                        <DropdownMenuItem onClick={() => openEdit(h)} className="text-xs gap-2">
                                                            <Pencil size={12} /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-rose-600 text-xs gap-2" onClick={() => handleDelete(h._id)}>
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

            {/* Create sheet */}
            <SideFormSheet
                open={isCreateOpen}
                onOpenChange={(o) => { setIsCreateOpen(o); if (!o) setNewItem(DEFAULT_NEW) }}
                title="Add Holiday"
                description={`Create a new holiday entry for ${selectedYear}.`}
                icon={<CalendarDays className="w-5 h-5" />}
                width="md"
                onSubmit={handleCreate}
                submitLabel={saving ? "Creating..." : "Add Holiday"}
                loading={saving}
                submitDisabled={!newItem.name.trim() || !newItem.date}
            >
                <div className="space-y-4">
                    <Field label="Holiday Name" required>
                        <Input
                            placeholder="e.g. Republic Day"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>

                    <Field label="Date" required>
                        <Input
                            type="date"
                            value={newItem.date}
                            onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                            className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                        />
                    </Field>

                    <Field label="Type" required>
                        <Select value={newItem.type} onValueChange={(v: "National" | "Optional") => setNewItem({ ...newItem, type: v })}>
                            <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="National">National</SelectItem>
                                <SelectItem value="Optional">Optional</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-[#FAFBFC] border border-[#EEF1F6]">
                        <div>
                            <p className="text-[13px] font-semibold text-[#374151]">Paid Holiday</p>
                            <p className="text-[11.5px] text-[#9CA3AF]">Employee receives full pay</p>
                        </div>
                        <Switch checked={newItem.isPaid} onCheckedChange={(v) => setNewItem({ ...newItem, isPaid: v })} />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-[#FAFBFC] border border-[#EEF1F6]">
                        <div>
                            <p className="text-[13px] font-semibold text-[#374151]">Mandatory</p>
                            <p className="text-[11.5px] text-[#9CA3AF]">Applies to all employees</p>
                        </div>
                        <Switch checked={newItem.isMandatory} onCheckedChange={(v) => setNewItem({ ...newItem, isMandatory: v })} />
                    </div>
                </div>
            </SideFormSheet>

            {/* Edit sheet */}
            <SideFormSheet
                open={isEditOpen}
                onOpenChange={(o) => { setIsEditOpen(o); if (!o) setEditItem(null) }}
                title="Edit Holiday"
                description="Update holiday details."
                icon={<Pencil className="w-5 h-5" />}
                width="md"
                onSubmit={handleUpdate}
                submitLabel={saving ? "Saving..." : "Save Changes"}
                loading={saving}
                submitDisabled={!editItem || !editItem.name.trim()}
            >
                {editItem && (
                    <div className="space-y-4">
                        <Field label="Holiday Name" required>
                            <Input
                                value={editItem.name}
                                onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                                className="h-11 rounded-lg border-[#E5E7EB] bg-white focus:border-primary"
                            />
                        </Field>

                        <Field label="Type">
                            <Select value={editItem.type} onValueChange={(v: "National" | "Optional") => setEditItem({ ...editItem, type: v })}>
                                <SelectTrigger className="h-11 rounded-lg border-[#E5E7EB] bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="National">National</SelectItem>
                                    <SelectItem value="Optional">Optional</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-[#FAFBFC] border border-[#EEF1F6]">
                            <div>
                                <p className="text-[13px] font-semibold text-[#374151]">Paid Holiday</p>
                                <p className="text-[11.5px] text-[#9CA3AF]">Employee receives full pay</p>
                            </div>
                            <Switch checked={editItem.isPaid} onCheckedChange={(v) => setEditItem({ ...editItem, isPaid: v })} />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-[#FAFBFC] border border-[#EEF1F6]">
                            <div>
                                <p className="text-[13px] font-semibold text-[#374151]">Mandatory</p>
                                <p className="text-[11.5px] text-[#9CA3AF]">Applies to all employees</p>
                            </div>
                            <Switch checked={editItem.isMandatory} onCheckedChange={(v) => setEditItem({ ...editItem, isMandatory: v })} />
                        </div>
                    </div>
                )}
            </SideFormSheet>
        </div>
    )
}
