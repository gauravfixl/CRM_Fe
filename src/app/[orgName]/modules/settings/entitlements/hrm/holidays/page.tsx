"use client"

import { useState, useEffect, useMemo } from "react"
import {
    CalendarDays,
    Search,
    Plus,
    MoreHorizontal,
    Flag,
    Star,
    Loader2,
    MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SmallCard, SmallCardContent } from "@/components/custom/SmallCard"
import { toast } from "sonner"
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
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

export default function HolidayCalendarPage() {
    const [holidays, setHolidays] = useState<Holiday[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()))
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editItem, setEditItem] = useState<Holiday | null>(null)
    const [newItem, setNewItem] = useState({
        name: "",
        date: "",
        type: "National" as "National" | "Optional",
        isPaid: true,
        isMandatory: true,
    })

    const fetchHolidays = async () => {
        setLoading(true)
        try {
            const response = await getHolidaysByYear(selectedYear)
            setHolidays(response?.data?.data || [])
        } catch {
            // Error handled in hook
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

    const handleCreate = async () => {
        if (!newItem.name || !newItem.date) return toast.error("Name and date are required")
        setSaving(true)
        try {
            await createHoliday(newItem)
            toast.success("Holiday created")
            setIsCreateOpen(false)
            setNewItem({ name: "", date: "", type: "National", isPaid: true, isMandatory: true })
            await fetchHolidays()
        } catch {
            // Error handled in hook
        } finally {
            setSaving(false)
        }
    }

    const handleUpdate = async () => {
        if (!editItem) return
        setSaving(true)
        try {
            await updateHoliday(editItem._id, {
                name: editItem.name,
                type: editItem.type,
                isPaid: editItem.isPaid,
                isMandatory: editItem.isMandatory,
            })
            toast.success("Holiday updated")
            setIsEditOpen(false)
            setEditItem(null)
            await fetchHolidays()
        } catch {
            // Error handled in hook
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteHoliday(id)
            toast.success("Holiday deleted")
            await fetchHolidays()
        } catch {
            // Error handled in hook
        }
    }

    const openEdit = (h: Holiday) => {
        setEditItem({ ...h })
        setIsEditOpen(true)
    }

    const currentYear = new Date().getFullYear()
    const years = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2]

    if (loading) {
        return (
            <div className="font-outfit flex items-center justify-center min-h-screen bg-[#fafafa]">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="font-outfit flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span>HR Governance</span>
                    <span>/</span>
                    <span className="text-gray-900 font-semibold">Holiday Calendar</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Holiday Calendar</h1>
                        <p className="text-xs text-gray-500 font-medium">Manage national and optional holidays for the organization.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="h-10 w-[100px] rounded-xl text-xs font-semibold border-gray-200">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((y) => (
                                    <SelectItem key={y} value={String(y)} className="text-xs">{y}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5" onClick={() => setIsCreateOpen(true)}>
                            <Plus className="w-4 h-4" />
                            Add Holiday
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="rounded-xl border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white/80">Total Holidays</p>
                                <p className="text-xl font-semibold text-white tracking-tight">{holidays.length}</p>
                                <p className="text-[10px] text-white/70">Year {selectedYear}</p>
                            </div>
                            <CalendarDays className="w-5 h-5 text-white/80" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">National</p>
                                <p className="text-xl font-semibold text-gray-900">{nationalCount}</p>
                                <p className="text-[10px] text-gray-500">Mandatory holidays</p>
                            </div>
                            <Flag className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Optional</p>
                                <p className="text-xl font-semibold text-gray-900">{optionalCount}</p>
                                <p className="text-[10px] text-gray-500">Employee choice</p>
                            </div>
                            <Star className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Paid Holidays</p>
                                <p className="text-xl font-semibold text-gray-900">{paidCount}</p>
                                <p className="text-[10px] text-gray-500">With full pay</p>
                            </div>
                            <MapPin className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b flex items-center justify-between">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <Input placeholder="Search holidays..." className="pl-9 h-9 rounded-lg text-xs font-medium" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                </div>
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 text-xs font-semibold text-gray-500">Holiday</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Date</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Type</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Paid</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500 text-center">Mandatory</TableHead>
                            <TableHead className="py-3 text-right pr-4 text-xs font-semibold text-gray-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="py-8 text-center text-xs text-gray-400">
                                    {searchQuery ? "No matching holidays." : `No holidays configured for ${selectedYear}.`}
                                </TableCell>
                            </TableRow>
                        )}
                        {filtered.map((h) => (
                            <TableRow key={h._id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                            <CalendarDays className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-semibold text-gray-900">{h.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <span className="text-xs font-semibold text-gray-900">
                                        {new Date(h.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                                    </span>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <Badge className={`text-[10px] rounded-full px-2.5 py-0.5 font-semibold border-none ${h.type === "National" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"}`}>
                                        {h.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <Badge className={`text-[10px] rounded-full px-2 py-0.5 font-semibold border-none ${h.isPaid ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                                        {h.isPaid ? "Paid" : "Unpaid"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <span className="text-xs text-gray-600">{h.isMandatory ? "Yes" : "No"}</span>
                                </TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-gray-100 rounded-lg">
                                                <MoreHorizontal className="h-4 w-4 text-gray-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 rounded-lg">
                                            <DropdownMenuItem onClick={() => openEdit(h)}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-rose-600" onClick={() => handleDelete(h._id)}>Delete</DropdownMenuItem>
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
                        <DialogTitle className="text-white font-semibold text-sm">Add Holiday</DialogTitle>
                        <DialogDescription className="text-blue-100 text-xs">Create a new holiday entry for {selectedYear}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 px-5 py-4">
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">Holiday Name</Label>
                            <Input className="h-9 rounded-lg text-xs" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g. Republic Day" />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">Date</Label>
                            <Input type="date" className="h-9 rounded-lg text-xs" value={newItem.date} onChange={(e) => setNewItem({ ...newItem, date: e.target.value })} />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs font-semibold text-gray-700">Type</Label>
                            <Select value={newItem.type} onValueChange={(v: "National" | "Optional") => setNewItem({ ...newItem, type: v })}>
                                <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="National" className="text-xs">National</SelectItem>
                                    <SelectItem value="Optional" className="text-xs">Optional</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg bg-gray-50">
                            <Label htmlFor="paid-new" className="flex flex-col space-y-1">
                                <span className="text-xs font-semibold text-gray-700">Paid Holiday</span>
                                <span className="text-[10px] text-gray-500 font-normal">Employee receives full pay</span>
                            </Label>
                            <Switch id="paid-new" checked={newItem.isPaid} onCheckedChange={(v) => setNewItem({ ...newItem, isPaid: v })} />
                        </div>
                        <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg bg-gray-50">
                            <Label htmlFor="mandatory-new" className="flex flex-col space-y-1">
                                <span className="text-xs font-semibold text-gray-700">Mandatory</span>
                                <span className="text-[10px] text-gray-500 font-normal">Applies to all employees</span>
                            </Label>
                            <Switch id="mandatory-new" checked={newItem.isMandatory} onCheckedChange={(v) => setNewItem({ ...newItem, isMandatory: v })} />
                        </div>
                    </div>
                    <DialogFooter className="px-5 pb-4">
                        <Button onClick={handleCreate} disabled={saving} className="rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-xs">
                            {saving ? "Creating..." : "Add Holiday"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
                    <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                        <DialogTitle className="text-white font-semibold text-sm">Edit Holiday</DialogTitle>
                    </DialogHeader>
                    {editItem && (
                        <>
                            <div className="grid gap-4 px-5 py-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold text-gray-700">Holiday Name</Label>
                                    <Input className="h-9 rounded-lg text-xs" value={editItem.name} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold text-gray-700">Type</Label>
                                    <Select value={editItem.type} onValueChange={(v: "National" | "Optional") => setEditItem({ ...editItem, type: v })}>
                                        <SelectTrigger className="h-9 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="National" className="text-xs">National</SelectItem>
                                            <SelectItem value="Optional" className="text-xs">Optional</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg bg-gray-50">
                                    <Label htmlFor="paid-edit" className="flex flex-col space-y-1">
                                        <span className="text-xs font-semibold text-gray-700">Paid Holiday</span>
                                    </Label>
                                    <Switch id="paid-edit" checked={editItem.isPaid} onCheckedChange={(v) => setEditItem({ ...editItem, isPaid: v })} />
                                </div>
                                <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg bg-gray-50">
                                    <Label htmlFor="mandatory-edit" className="flex flex-col space-y-1">
                                        <span className="text-xs font-semibold text-gray-700">Mandatory</span>
                                    </Label>
                                    <Switch id="mandatory-edit" checked={editItem.isMandatory} onCheckedChange={(v) => setEditItem({ ...editItem, isMandatory: v })} />
                                </div>
                            </div>
                            <DialogFooter className="px-5 pb-4">
                                <Button onClick={handleUpdate} disabled={saving} className="rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-xs">
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
