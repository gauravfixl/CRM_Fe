"use client"

import { useState, useEffect } from "react"
import {
    Building2,
    Search,
    Plus,
    MoreHorizontal,
    Users,
    BarChart3,
    UserCheck,
    Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
} from "@/modules/hrm/hooks/hrmHooks"

interface Department {
    _id: string
    name: string
    description: string
    head: string
    headName: string
    headEmail: string
    createdAt: string
}

export default function DepartmentsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)
    const [newItem, setNewItem] = useState({ name: "", description: "" })
    const [editItem, setEditItem] = useState<Department | null>(null)

    const [departments, setDepartments] = useState<Department[]>([])

    const fetchDepartments = async () => {
        try {
            const response = await getAllDepartments()
            setDepartments(response.data?.departments || [])
        } catch (err) {
            toast.error("Failed to fetch departments")
        } finally {
            setPageLoading(false)
        }
    }

    useEffect(() => {
        fetchDepartments()
    }, [])

    const deptsWithHead = departments.filter((d) => d.headName && d.headName !== "").length

    const filtered = departments.filter(
        (d) =>
            d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (d.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (d.headName || "").toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleCreate = async () => {
        if (!newItem.name.trim()) return toast.error("Please fill the department name")
        
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(newItem.name.trim())) {
            toast.error("Department name should not contain numbers or special characters")
            return
        }

        setIsLoading(true)
        try {
            await createDepartment({ name: newItem.name, description: newItem.description })
            setIsCreateOpen(false)
            setNewItem({ name: "", description: "" })
            toast.success("Department created")
            await fetchDepartments()
        } catch (err) {
            // Error already handled by hook
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdate = async () => {
        if (!editItem || !editItem.name.trim()) return toast.error("Please fill the department name")

        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(editItem.name.trim())) {
            toast.error("Department name should not contain numbers or special characters")
            return
        }

        setIsLoading(true)
        try {
            await updateDepartment(editItem._id, {
                name: editItem.name,
                description: editItem.description,
            })
            setIsEditOpen(false)
            setEditItem(null)
            toast.success("Department updated")
            await fetchDepartments()
        } catch (err) {
            // Error already handled by hook
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteDepartment(id)
            toast.success("Department deleted")
            await fetchDepartments()
        } catch (err) {
            // Error already handled by hook
        }
    }

    const openEdit = (d: Department) => {
        setEditItem({ ...d })
        setIsEditOpen(true)
    }

    if (pageLoading) {
        return (
            <div className="font-outfit flex items-center justify-center min-h-screen bg-[#fafafa]">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="font-outfit flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* Breadcrumb */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <span>Hr governance</span>
                    <span>/</span>
                    <span className="text-gray-900 font-semibold">Departments</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Department Templates</h1>
                        <p className="text-xs text-gray-500 font-medium">Structure your company hierarchy.</p>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-xs h-10 gap-2 shadow-lg px-5">
                                <Plus className="w-4 h-4" />
                                New department
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
                            <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                                <DialogTitle className="text-white font-semibold">Create department</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 px-5 py-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold">Department name</Label>
                                    <Input className="h-9 rounded-lg" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g. Operations" />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold">Description (optional)</Label>
                                    <Input className="h-9 rounded-lg" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} placeholder="e.g. Handles daily operations" />
                                </div>
                            </div>
                            <DialogFooter className="px-5 pb-4">
                                <Button onClick={handleCreate} disabled={isLoading} className="rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-xs">
                                    {isLoading ? "Creating..." : "Create department"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="rounded-xl border bg-gradient-to-r from-primary/70 to-primary text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-white/80">Total units</p>
                                <p className="text-xl font-semibold text-white tracking-tight">{departments.length}</p>
                                <p className="text-[10px] text-white/80">Active departments</p>
                            </div>
                            <Building2 className="w-5 h-5 text-white/80" />
                        </div>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="rounded-xl border bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <SmallCardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-600">Departments with head</p>
                                <p className="text-xl font-semibold text-gray-900">{deptsWithHead}</p>
                                <p className="text-[10px] text-gray-500">Head assigned</p>
                            </div>
                            <UserCheck className="w-5 h-5 text-gray-400" />
                        </div>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b flex items-center justify-between">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <Input
                            placeholder="Search departments..."
                            className="pl-9 h-9 rounded-lg text-xs font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="py-3 px-4 text-xs font-semibold text-gray-500">Department</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500">Description</TableHead>
                            <TableHead className="py-3 text-xs font-semibold text-gray-500">Head of dept</TableHead>
                            <TableHead className="py-3 text-right pr-4 text-xs font-semibold text-gray-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map((d) => (
                            <TableRow key={d._id} className="hover:bg-gray-50 transition-colors">
                                <TableCell className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                            <Building2 className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">{d.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-sm text-gray-600">{d.description || "-"}</TableCell>
                                <TableCell className="py-3 text-sm text-gray-600">{d.headName || "Unassigned"}</TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-7 w-7 p-0 hover:bg-gray-100 rounded-lg">
                                                <MoreHorizontal className="h-4 w-4 text-gray-400" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 rounded-lg">
                                            <DropdownMenuItem onClick={() => openEdit(d)}>Edit details</DropdownMenuItem>
                                            <DropdownMenuItem className="text-rose-600" onClick={() => handleDelete(d._id)}>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Edit dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-md rounded-xl p-0 overflow-hidden">
                    <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                        <DialogTitle className="text-white font-semibold">Edit department</DialogTitle>
                    </DialogHeader>
                    {editItem && (
                        <>
                            <div className="grid gap-4 px-5 py-4">
                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold">Department name</Label>
                                    <Input className="h-9 rounded-lg" value={editItem.name} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-xs font-semibold">Description</Label>
                                    <Input className="h-9 rounded-lg" value={editItem.description || ""} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} />
                                </div>
                            </div>
                            <DialogFooter className="px-5 pb-4">
                                <Button onClick={handleUpdate} disabled={isLoading} className="rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-xs">
                                    {isLoading ? "Saving..." : "Save changes"}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
