"use client"

import { useState } from "react"
import {
    Network,
    Plus,
    Search,
    Users,
    Shield,
    Building,
    Pencil,
    Trash2,
    ShieldCheck,
    X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import { toast } from "sonner"

export default function AdministrativeUnitsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [units, setUnits] = useState([
        { id: "au1", name: "Engineering Unit", focus: "Technical Infrastructure", members: 42, admins: 3, status: "Active" },
        { id: "au2", name: "FinOps Global", focus: "Financial Operations", members: 12, admins: 2, status: "Active" },
        { id: "au3", name: "Human Capital", focus: "HR & Recruitment", members: 8, admins: 1, status: "Review Required" },
    ])

    const [createOpen, setCreateOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [selectedUnit, setSelectedUnit] = useState<typeof units[0] | null>(null)
    const [formName, setFormName] = useState("")
    const [formFocus, setFormFocus] = useState("")

    const totalMembers = units.reduce((s, u) => s + u.members, 0)
    const totalAdmins = units.reduce((s, u) => s + u.admins, 0)

    const filteredUnits = units.filter(
        (u) =>
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.focus.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleCreate = () => {
        if (!formName.trim()) {
            toast.error("Unit name is required")
            return
        }

        // Name validation (no numbers)
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(formName.trim())) {
            toast.error("Unit name should not contain numbers or special characters")
            return
        }

        const newUnit = {
            id: `au${Date.now()}`,
            name: formName.trim(),
            focus: formFocus.trim() || "General",
            members: 0,
            admins: 0,
            status: "Active",
        }
        setUnits([...units, newUnit])
        setFormName("")
        setFormFocus("")
        setCreateOpen(false)
        toast.success(`Unit "${newUnit.name}" created successfully`)
    }

    const handleEdit = () => {
        if (!selectedUnit || !formName.trim()) {
            toast.error("Unit name is required")
            return
        }

        // Name validation (no numbers)
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(formName.trim())) {
            toast.error("Unit name should not contain numbers or special characters")
            return
        }

        setUnits(units.map((u) => u.id === selectedUnit.id ? { ...u, name: formName.trim(), focus: formFocus.trim() } : u))
        setEditOpen(false)
        toast.success(`Unit "${formName.trim()}" updated successfully`)
    }

    const handleDelete = () => {
        if (!selectedUnit) return
        setUnits(units.filter((u) => u.id !== selectedUnit.id))
        setDeleteOpen(false)
        toast.success(`Unit "${selectedUnit.name}" deleted`)
    }

    const openEdit = (unit: typeof units[0]) => {
        setSelectedUnit(unit)
        setFormName(unit.name)
        setFormFocus(unit.focus)
        setEditOpen(true)
    }

    const openDelete = (unit: typeof units[0]) => {
        setSelectedUnit(unit)
        setDeleteOpen(true)
    }

    return (
        <div className="font-outfit relative min-h-screen bg-[#F8F9FC]">
            {/* Header */}
            <div className="px-4 md:px-8 pt-6 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs font-medium text-gray-400">Identity & Access</span>
                        <span className="text-xs text-gray-300">/</span>
                        <span className="text-xs font-medium text-gray-400">Governance</span>
                        <span className="text-xs text-gray-300">/</span>
                        <span className="text-xs font-semibold text-gray-900">Units</span>
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Administrative Units</h1>
                </div>
                <Button
                    onClick={() => { setFormName(""); setFormFocus(""); setCreateOpen(true) }}
                    className="rounded-xl font-semibold text-xs h-10 px-6"
                >
                    <Plus className="w-4 h-4 mr-2" /> Create Admin Unit
                </Button>
            </div>

            <div className="p-4 md:px-8 space-y-6">
                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="rounded-xl bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-2">
                                <Network className="w-5 h-5 text-white/80" />
                            </div>
                            <p className="text-xs text-white/80">Total Units</p>
                            <p className="text-xl font-semibold text-white">{units.length}</p>
                            <p className="text-[10px] text-white/60 mt-0.5">Active containers</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-2">
                                <Users className="w-5 h-5 text-blue-500" />
                            </div>
                            <p className="text-xs text-gray-600">Total Members</p>
                            <p className="text-xl font-semibold text-gray-900">{totalMembers}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Across all units</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-2">
                                <Shield className="w-5 h-5 text-indigo-500" />
                            </div>
                            <p className="text-xs text-gray-600">Total Admins</p>
                            <p className="text-xl font-semibold text-gray-900">{totalAdmins}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Delegated administrators</p>
                        </CardContent>
                    </Card>
                    <Card className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            </div>
                            <p className="text-xs text-gray-600">Security Score</p>
                            <p className="text-xl font-semibold text-gray-900">92%</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Above baseline</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-4 bg-white border border-zinc-200 p-2 rounded-xl shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search units by name or focus..."
                            className="pl-11 border-none focus-visible:ring-0 rounded-lg h-10 bg-transparent"
                        />
                    </div>
                </div>

                {/* Unit Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredUnits.map((unit) => (
                        <Card key={unit.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all group overflow-hidden border">
                            <CardContent className="p-6 space-y-5">
                                <div className="flex items-start justify-between">
                                    <div className="h-11 w-11 bg-zinc-50 flex items-center justify-center rounded-lg border border-zinc-100">
                                        <Building className="w-5 h-5 text-zinc-400" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-blue-600" onClick={() => openEdit(unit)}>
                                            <Pencil className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-red-600" onClick={() => openDelete(unit)}>
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-base font-semibold tracking-tight text-gray-900">{unit.name}</h4>
                                    <p className="text-xs font-medium text-gray-400 mt-1">{unit.focus}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                                        <span className="text-[10px] font-medium text-gray-400 block mb-1">Members</span>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-blue-500" />
                                            <span className="text-base font-semibold">{unit.members}</span>
                                        </div>
                                    </div>
                                    <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-100">
                                        <span className="text-[10px] font-medium text-gray-400 block mb-1">Admins</span>
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-indigo-500" />
                                            <span className="text-base font-semibold">{unit.admins}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <Badge className={`rounded-full border-0 text-[10px] font-semibold ${unit.status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"}`}>
                                        {unit.status}
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        className="text-xs font-semibold text-gray-500 hover:text-indigo-600 h-8 px-2"
                                        onClick={() => toast.info(`Managing ${unit.name}`)}
                                    >
                                        Manage Unit
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Add Placeholder */}
                    <div
                        className="border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center p-12 text-center space-y-4 hover:border-indigo-400 transition-colors cursor-pointer group rounded-xl"
                        onClick={() => { setFormName(""); setFormFocus(""); setCreateOpen(true) }}
                    >
                        <div className="h-14 w-14 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                            <Plus className="w-7 h-7 text-zinc-300 group-hover:text-indigo-400" />
                        </div>
                        <div>
                            <h5 className="font-semibold text-zinc-400 group-hover:text-zinc-600 text-sm">Define Scope</h5>
                            <p className="text-xs text-zinc-400">Create a new container for delegated admins</p>
                        </div>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="p-5 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-4">
                    <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                    <p className="text-xs font-medium text-blue-700">
                        Note: Administrative Units do not affect standard user licensing. They are purely for permission scoping.
                    </p>
                </div>
            </div>

            {/* Create Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="rounded-xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">Create Administrative Unit</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-600">Unit Name</Label>
                            <Input
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                placeholder="e.g. Marketing Unit"
                                className="rounded-lg"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-600">Focus Area</Label>
                            <Input
                                value={formFocus}
                                onChange={(e) => setFormFocus(e.target.value)}
                                placeholder="e.g. Digital Marketing"
                                className="rounded-lg"
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="outline" className="rounded-xl font-semibold text-xs h-10">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleCreate} className="rounded-xl font-semibold text-xs h-10">
                            <Plus className="w-4 h-4 mr-2" /> Create Unit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="rounded-xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">Edit Administrative Unit</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-600">Unit Name</Label>
                            <Input
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                className="rounded-lg"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-gray-600">Focus Area</Label>
                            <Input
                                value={formFocus}
                                onChange={(e) => setFormFocus(e.target.value)}
                                className="rounded-lg"
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="outline" className="rounded-xl font-semibold text-xs h-10">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleEdit} className="rounded-xl font-semibold text-xs h-10">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent className="rounded-xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">Delete Unit</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-600 py-2">
                        Are you sure you want to delete <span className="font-semibold">{selectedUnit?.name}</span>? This action cannot be undone.
                    </p>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="outline" className="rounded-xl font-semibold text-xs h-10">Cancel</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDelete} className="rounded-xl font-semibold text-xs h-10">
                            <Trash2 className="w-4 h-4 mr-2" /> Delete Unit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
